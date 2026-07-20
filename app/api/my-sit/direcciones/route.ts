import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { requireClientAuth } from "@/core/helpers/auth/require-client-auth";

// GET — lista las direcciones del cliente autenticado
export async function GET(req: NextRequest) {
  const { session, error: authError } = await requireClientAuth(req);
  if (authError) return authError;

  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("direcciones")
      .select("*")
      .eq("cliente_id", session!.id)
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

// POST — crea una nueva dirección para el cliente autenticado
export async function POST(req: NextRequest) {
  const { session, error: authError } = await requireClientAuth(req);
  if (authError) return authError;

  try {
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
        .eq("cliente_id", session!.id);
    }

    const { data, error } = await supabase
      .from("direcciones")
      .insert({
        cliente_id: session!.id,
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
