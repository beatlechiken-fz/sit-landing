import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { requireAuth } from "@/core/helpers/require-auth";
import { sendEmail, nuevoMensajeTemplate } from "@/core/helpers/email";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;

  try {
    const { id } = await params;
    const { contenido, origen = "admin" } = await req.json();
    const supabase = getSupabaseServerClient();

    if (!contenido?.trim()) {
      return NextResponse.json(
        { error: "El mensaje no puede estar vacío" },
        { status: 400 },
      );
    }

    // Trae datos de la cotización para el email
    const { data: cotizacion } = await supabase
      .from("cotizaciones")
      .select("numero_orden, cliente_nombre, clientes(nombre, email)")
      .eq("id", id)
      .single();

    const { data: mensaje, error } = await supabase
      .from("cotizacion_mensajes")
      .insert({
        cotizacion_id: id,
        origen,
        contenido: contenido.trim(),
      })
      .select()
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    // Notifica por email
    const numeroOrden =
      cotizacion?.numero_orden ?? id.slice(0, 8).toUpperCase();

    if (origen === "admin" && (cotizacion?.clientes as any)?.email) {
      const cliente = cotizacion?.clientes as any;
      const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/my-sit`;
      const { subject, html } = nuevoMensajeTemplate({
        destinatario: "cliente",
        nombre: cliente.nombre,
        numeroOrden,
        mensaje: contenido.trim(),
        portalUrl,
      });
      await sendEmail({ to: cliente.email, subject, html });
    }

    if (origen === "cliente") {
      const adminEmail = process.env.ADMIN_EMAIL ?? "hola@sitmorelia.com.mx";
      const panelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/dashboard/store/cotizaciones/${id}`;
      const { subject, html } = nuevoMensajeTemplate({
        destinatario: "admin",
        nombre: cotizacion?.cliente_nombre ?? "Cliente",
        numeroOrden,
        mensaje: contenido.trim(),
        portalUrl: panelUrl,
      });
      await sendEmail({ to: adminEmail, subject, html });
    }

    return NextResponse.json(mensaje, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al enviar mensaje" },
      { status: 500 },
    );
  }
}
