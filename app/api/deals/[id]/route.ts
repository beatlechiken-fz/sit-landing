import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { requireAuth } from "@/core/helpers/require-auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;

  try {
    const { id } = await params;
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("cotizaciones")
      .select(
        `
        *,
        clientes (
          id,
          nombre,
          apellido,
          email,
          telefono,
          empresa
        ),
        cotizacion_lineas (*),
        cotizacion_mensajes (
          id,
          origen,
          contenido,
          leido,
          created_at
        )
      `,
      )
      .eq("id", id)
      .order("created_at", {
        ascending: true,
        referencedTable: "cotizacion_mensajes",
      })
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Cotización no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener cotización" },
      { status: 500 },
    );
  }
}
