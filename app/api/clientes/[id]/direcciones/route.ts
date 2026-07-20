import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { requireAuth } from "@/core/helpers/require-auth";

type Params = { params: Promise<{ id: string }> };

// GET — lista direcciones de un cliente
export async function GET(req: NextRequest, { params }: Params) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;

  try {
    const { id } = await params;
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("direcciones")
      .select("*")
      .eq("cliente_id", id)
      .order("predeterminada", { ascending: false })
      .order("created_at", { ascending: false });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener direcciones" },
      { status: 500 },
    );
  }
}

// POST — crea una nueva dirección para el cliente
export async function POST(req: NextRequest, { params }: Params) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;

  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.calle?.trim()) {
      return NextResponse.json(
        { error: "La calle es requerida" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();

    if (body.predeterminada) {
      await supabase
        .from("direcciones")
        .update({ predeterminada: false })
        .eq("cliente_id", id);
    }

    const { data, error } = await supabase
      .from("direcciones")
      .insert({
        cliente_id: id,
        etiqueta: body.etiqueta?.trim() || "Principal",
        calle: body.calle.trim(),
        numero_ext: body.numero_ext?.trim() || null,
        numero_int: body.numero_int?.trim() || null,
        colonia: body.colonia?.trim() || null,
        ciudad: body.ciudad?.trim() || null,
        estado: body.estado?.trim() || null,
        cp: body.cp?.trim() || null,
        referencias: body.referencias?.trim() || null,
        predeterminada: !!body.predeterminada,
      })
      .select()
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear dirección" },
      { status: 500 },
    );
  }
}
