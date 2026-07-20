import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { requireClientAuth } from "@/core/helpers/auth/require-client-auth";
import { sendEmail, cambioStatusTemplate } from "@/core/helpers/email";
import { sendTelegramMessage } from "@/core/helpers/telegram/send";
import { formatMXN } from "@/core/helpers/precio.utils";

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

// ─────────────────────────────────────────────
// POST /api/my-sit/store/checkout
// Requiere sesión my-sit. El cliente_id/nombre salen de la sesión
// verificada, nunca del body — el cliente solo puede pedir para sí mismo.
// El pedido nace directo en "en_proceso" (con número de orden), igual que
// cuando el admin da clic en "Generar orden" en el carrito interno.
// ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const { session, error: authError } = await requireClientAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const {
      lineas,
      cupon_global,
      subtotal,
      descuento,
      cashback_canjeado = 0,
      total,
      direccion_id,
      direccion_entrega,
      fecha_entrega,
    } = body;

    if (!lineas?.length) {
      return NextResponse.json(
        { error: "El pedido debe tener al menos un producto" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();
    const expira_at = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const numero_orden = generarNumeroOrden();

    // Crea la cotización ya en "en_proceso" con número de orden — el cliente
    // está confirmando un pedido real, no pidiendo una cotización.
    const { data: cotizacion, error: cotError } = await supabase
      .from("cotizaciones")
      .insert({
        cliente_id: session!.id,
        cliente_nombre: `${session!.nombre} ${session!.apellido}`,
        status: "en_proceso",
        numero_orden,
        subtotal,
        descuento,
        cashback_canjeado,
        total,
        cupon_global: cupon_global || null,
        direccion_id: direccion_id || null,
        direccion_entrega: direccion_entrega || null,
        fecha_entrega: fecha_entrega || null,
        expira_at,
      })
      .select()
      .single();

    if (cotError) {
      return NextResponse.json({ error: cotError.message }, { status: 500 });
    }

    // Inserta líneas
    const lineasData = lineas.map((l: any) => ({
      cotizacion_id: cotizacion.id,
      producto_id: l.product.id,
      clave: l.product.clave,
      descripcion: l.product.descripcion,
      marca: l.product.marca,
      cantidad: l.cantidad,
      precio_unitario: l.precioFinal,
      descuento: l.descuento,
      total: l.total,
      cupon: l.cupon || null,
    }));

    const { error: lineasError } = await supabase
      .from("cotizacion_lineas")
      .insert(lineasData);

    if (lineasError) {
      return NextResponse.json({ error: lineasError.message }, { status: 500 });
    }

    // Cashback canjeado
    if (cashback_canjeado > 0) {
      await supabase.from("cashback").insert({
        cliente_id: session!.id,
        cotizacion_id: cotizacion.id,
        monto: cashback_canjeado,
        tipo: "usado",
      });
    }

    // Incrementa el contador de usos de cada cupón usado
    const codigosUsados = new Set<string>();
    if (cupon_global?.codigo) codigosUsados.add(cupon_global.codigo);
    for (const l of lineas) {
      if (l.cupon?.codigo) codigosUsados.add(l.cupon.codigo);
    }

    for (const codigo of codigosUsados) {
      const { data: cupon } = await supabase
        .from("cupones")
        .select("id, usos_actuales")
        .eq("codigo", codigo)
        .single();

      if (cupon) {
        await supabase
          .from("cupones")
          .update({ usos_actuales: (cupon.usos_actuales ?? 0) + 1 })
          .eq("id", cupon.id);
      }
    }

    // Notificaciones — no deben tumbar la respuesta si fallan
    const resumenProductos = lineas
      .map((l: any) => `• ${l.cantidad}x ${l.product.descripcion}`)
      .join("\n");

    sendTelegramMessage({
      text:
        `🛒 <b>Nuevo pedido — ${numero_orden}</b>\n\n` +
        `Cliente: ${session!.nombre} ${session!.apellido}\n` +
        `Email: ${session!.email}\n\n` +
        `${resumenProductos}\n\n` +
        `Total: ${formatMXN(total)}`,
    }).catch(() => {});

    if (session!.email) {
      const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/my-sit/dashboard/pedidos/${cotizacion.id}`;
      const { subject, html } = cambioStatusTemplate({
        nombre: session!.nombre,
        numeroOrden: numero_orden,
        status: "en_proceso",
        mensaje:
          "Recibimos tu pedido y lo estamos preparando. Te contactaremos para confirmar los detalles.",
        portalUrl,
      });
      sendEmail({ to: session!.email, subject, html }).catch(() => {});
    }

    return NextResponse.json(cotizacion, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al generar el pedido" },
      { status: 500 },
    );
  }
}
