import { NextRequest, NextResponse } from "next/server";
import { requireClientAuth } from "@/core/helpers/auth/require-client-auth";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { sendEmail, nuevoMensajeTemplate } from "@/core/helpers/email";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { session, error } = await requireClientAuth(req);
  if (error) return error;

  try {
    const { id } = await params;
    const { contenido } = await req.json();
    const supabase = getSupabaseServerClient();

    if (!contenido?.trim()) {
      return NextResponse.json(
        { error: "El mensaje no puede estar vacío" },
        { status: 400 },
      );
    }

    // Verifica que el trato pertenece al cliente
    const { data: deal, error: dealError } = await supabase
      .from("cotizaciones")
      .select("id, numero_orden, cliente_nombre, cliente_id")
      .eq("id", id)
      .eq("cliente_id", session!.id)
      .single();

    if (dealError || !deal) {
      return NextResponse.json(
        { error: "Pedido no encontrado" },
        { status: 404 },
      );
    }

    const { data: mensaje, error: msgError } = await supabase
      .from("cotizacion_mensajes")
      .insert({
        cotizacion_id: id,
        origen: "cliente",
        contenido: contenido.trim(),
      })
      .select()
      .single();

    if (msgError)
      return NextResponse.json({ error: msgError.message }, { status: 500 });

    // Notifica al admin
    const adminEmail = process.env.ADMIN_EMAIL ?? "hola@sitmorelia.com.mx";
    const panelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/dashboard/store/deals/${id}`;
    const numeroOrden = deal.numero_orden ?? id.slice(0, 8).toUpperCase();

    const { subject, html } = nuevoMensajeTemplate({
      destinatario: "admin",
      nombre: `${session!.nombre} ${session!.apellido}`,
      numeroOrden,
      mensaje: contenido.trim(),
      portalUrl: panelUrl,
    });
    await sendEmail({ to: adminEmail, subject, html });

    return NextResponse.json(mensaje, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al enviar mensaje" },
      { status: 500 },
    );
  }
}
