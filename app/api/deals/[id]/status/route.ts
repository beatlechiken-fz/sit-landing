import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { requireAuth } from "@/core/helpers/require-auth";
import { calcularCashbackGanado } from "@/core/helpers/cashback/calcular-cashback";
import { sendEmail, cambioStatusTemplate } from "@/core/helpers/email";

type Params = { params: Promise<{ id: string }> };

// Status válidos y sus transiciones permitidas
const TRANSICIONES: Record<string, string[]> = {
  cotizacion: ["en_proceso", "cancelado"],
  en_proceso: ["listo_para_entregar", "cancelado"],
  listo_para_entregar: ["pendiente_de_pago", "cancelado"],
  pendiente_de_pago: ["pagado", "cancelado"],
  pagado: ["finalizado"],
  finalizado: [],
  cancelado: [],
};

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

    // Valida transición
    const permitidos = TRANSICIONES[actual.status] ?? [];
    if (!permitidos.includes(status)) {
      return NextResponse.json(
        { error: `No se puede pasar de "${actual.status}" a "${status}"` },
        { status: 400 },
      );
    }

    const updates: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Si pasa a en_proceso genera número de orden
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

    // Si se finaliza, registra cashback ganado
    if (status === "finalizado" && actual.cliente_id) {
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
      }
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

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar status" },
      { status: 500 },
    );
  }
}
