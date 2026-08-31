import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { requireAuth } from "@/core/helpers/require-auth";
import { calcularCashbackGanado } from "@/core/helpers/cashback/calcular-cashback";
import { sendEmail, cambioStatusTemplate } from "@/core/helpers/email";
import {
  DealStatus,
  DEAL_STATUS_LABELS,
  esStatusTerminal,
  puedeVolverADiagnostico,
} from "@/modules/admin/store/domain/entities/deal.entity";

type Params = { params: Promise<{ id: string }> };

const STATUS_VALIDOS = Object.keys(DEAL_STATUS_LABELS) as DealStatus[];

function generarNumeroOrden(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const mins = String(now.getMinutes()).padStart(2, "0");
  const secs = String(now.getSeconds()).padStart(2, "0");
  return `ORD-${year}${month}${day}-${hours}${mins}${secs}`;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;

  try {
    const { id } = await params;
    const { status, nota } = await req.json();
    const supabase = getSupabaseServerClient();

    if (!STATUS_VALIDOS.includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    // Trae la cotización actual
    const { data: actual, error: fetchError } = await supabase
      .from("cotizaciones")
      .select("*, clientes(nombre, email)")
      .eq("id", id)
      .single();

    if (fetchError || !actual) {
      return NextResponse.json(
        { error: "Cotización no encontrada" },
        { status: 404 },
      );
    }

    if (actual.status === status) {
      return NextResponse.json(
        { error: `La orden ya tiene el status "${DEAL_STATUS_LABELS[status as DealStatus]}"` },
        { status: 400 },
      );
    }

    // "finalizado" y "cancelado" son estados de cierre definitivos: una
    // vez ahí, la orden ya no puede cambiar de status.
    if (esStatusTerminal(actual.status as DealStatus)) {
      return NextResponse.json(
        {
          error: `Esta orden ya está "${DEAL_STATUS_LABELS[actual.status as DealStatus]}" y no puede cambiar de status`,
        },
        { status: 400 },
      );
    }

    // "en_diagnostico" es de un solo sentido: en cuanto la orden generó su
    // número de orden (pasó por "en_proceso" alguna vez), ya no puede
    // regresar a diagnóstico.
    if (status === "en_diagnostico" && !puedeVolverADiagnostico(actual.numero_orden)) {
      return NextResponse.json(
        {
          error:
            'No se puede regresar a "En diagnóstico" una vez que la orden pasó a "En proceso"',
        },
        { status: 400 },
      );
    }

    // Entre el resto de los status el flujo ya no es lineal: se permite
    // cambiar a cualquiera de ellos desde cualquier otro.

    const updates: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Si pasa a en_proceso genera número de orden (solo la primera vez)
    if (status === "en_proceso" && !actual.numero_orden) {
      updates.numero_orden = generarNumeroOrden();
    }

    const { data: updated, error: updateError } = await supabase
      .from("cotizaciones")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // "finalizado" es el único status que genera cashback, y solo una vez
    // (es terminal, así que en teoría no se puede volver a finalizar, pero
    // el guard se deja como respaldo por si se llama la API directamente).
    if (
      status === "finalizado" &&
      actual.cliente_id &&
      !actual.cashback_ganado
    ) {
      const cashbackGanado = await calcularCashbackGanado(
        actual.cliente_id,
        actual.total,
      );

      if (cashbackGanado > 0) {
        await supabase.from("cashback").insert({
          cliente_id: actual.cliente_id,
          cotizacion_id: id,
          monto: cashbackGanado,
          tipo: "ganado",
        });

        await supabase
          .from("cotizaciones")
          .update({ cashback_ganado: cashbackGanado })
          .eq("id", id);

        updated.cashback_ganado = cashbackGanado;
      }
    }

    // Registra el cambio en la línea de tiempo — best effort, nunca debe
    // tronar el cambio de status (que ya se guardó arriba). Si la tabla
    // todavía no existe, simplemente no hay evento.
    let evento = null;
    try {
      const textoEvento = nota?.trim()
        ? `Estatus actualizado: "${DEAL_STATUS_LABELS[actual.status as DealStatus]}" → "${DEAL_STATUS_LABELS[status as DealStatus]}" — ${nota.trim()}`
        : `Estatus actualizado: "${DEAL_STATUS_LABELS[actual.status as DealStatus]}" → "${DEAL_STATUS_LABELS[status as DealStatus]}"`;

      const { data: eventoData, error: eventoError } = await supabase
        .from("cotizacion_eventos")
        .insert({ cotizacion_id: id, texto: textoEvento })
        .select()
        .single();

      if (!eventoError) evento = eventoData;
    } catch (err) {
      console.error("No se pudo registrar el evento de status:", err);
    }

    // Envía email al cliente si existe
    if (actual.clientes?.email) {
      const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/my-sit`;
      const { subject, html } = cambioStatusTemplate({
        nombre: actual.clientes.nombre,
        numeroOrden: updated.numero_orden ?? id.slice(0, 8).toUpperCase(),
        status,
        mensaje: nota,
        portalUrl,
      });
      await sendEmail({ to: actual.clientes.email, subject, html });
    }

    return NextResponse.json({ ...updated, evento });
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar status" },
      { status: 500 },
    );
  }
}
