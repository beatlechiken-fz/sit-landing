import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { requireAuth } from "@/core/helpers/require-auth";

type Params = { params: Promise<{ id: string }> };

// POST — agrega un evento de texto libre a la línea de tiempo de la orden
export async function POST(req: NextRequest, { params }: Params) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;

  try {
    const { id } = await params;
    const { texto } = await req.json();

    if (!texto?.trim()) {
      return NextResponse.json(
        { error: "El evento no puede estar vacío" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();

    const { data: evento, error } = await supabase
      .from("cotizacion_eventos")
      .insert({
        cotizacion_id: id,
        texto: texto.trim(),
      })
      .select()
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(evento, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al agregar el evento" },
      { status: 500 },
    );
  }
}
