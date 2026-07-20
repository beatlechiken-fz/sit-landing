import { NextRequest, NextResponse } from "next/server";
import { requireClientAuth } from "@/core/helpers/auth/require-client-auth";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";

export async function GET(req: NextRequest) {
  const { session, error } = await requireClientAuth(req);
  if (error) return error;

  try {
    const supabase = getSupabaseServerClient();

    const { data, error: dbError } = await supabase
      .from("cotizaciones")
      .select(
        `
        id,
        numero_orden,
        cliente_nombre,
        status,
        subtotal,
        descuento,
        cashback_canjeado,
        cashback_ganado,
        total,
        expira_at,
        created_at,
        updated_at,
        cotizacion_lineas (
          id,
          descripcion,
          marca,
          cantidad,
          precio_unitario,
          descuento,
          total
        ),
        cotizacion_mensajes (
          id,
          origen,
          contenido,
          leido,
          created_at
        )
      `,
      )
      .eq("cliente_id", session!.id)
      .order("created_at", { ascending: false });

    if (dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener pedidos" },
      { status: 500 },
    );
  }
}
