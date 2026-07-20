import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { requireAuth } from "@/core/helpers/require-auth";

type Params = { params: Promise<{ id: string; direccionId: string }> };

// PATCH — actualiza una dirección del cliente
export async function PATCH(req: NextRequest, { params }: Params) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;

  try {
    const { id, direccionId } = await params;
    const body = await req.json();
    const supabase = getSupabaseServerClient();

    if (body.predeterminada) {
      await supabase
        .from("direcciones")
        .update({ predeterminada: false })
        .eq("cliente_id", id);
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.etiqueta !== undefined)
      updates.etiqueta = body.etiqueta?.trim() || "Principal";
    if (body.calle !== undefined) updates.calle = body.calle?.trim();
    if (body.numero_ext !== undefined)
      updates.numero_ext = body.numero_ext?.trim() || null;
    if (body.numero_int !== undefined)
      updates.numero_int = body.numero_int?.trim() || null;
    if (body.colonia !== undefined)
      updates.colonia = body.colonia?.trim() || null;
    if (body.ciudad !== undefined) updates.ciudad = body.ciudad?.trim() || null;
    if (body.estado !== undefined) updates.estado = body.estado?.trim() || null;
    if (body.cp !== undefined) updates.cp = body.cp?.trim() || null;
    if (body.referencias !== undefined)
      updates.referencias = body.referencias?.trim() || null;
    if (body.predeterminada !== undefined)
      updates.predeterminada = !!body.predeterminada;

    const { data, error } = await supabase
      .from("direcciones")
      .update(updates)
      .eq("id", direccionId)
      .eq("cliente_id", id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message ?? "Dirección no encontrada" },
        { status: error ? 500 : 404 },
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar dirección" },
      { status: 500 },
    );
  }
}

// DELETE — elimina una dirección del cliente
export async function DELETE(_req: NextRequest, { params }: Params) {
  const unauth = await requireAuth(_req);
  if (unauth) return unauth;

  try {
    const { id, direccionId } = await params;
    const supabase = getSupabaseServerClient();

    const { error } = await supabase
      .from("direcciones")
      .delete()
      .eq("id", direccionId)
      .eq("cliente_id", id);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Error al eliminar dirección" },
      { status: 500 },
    );
  }
}
