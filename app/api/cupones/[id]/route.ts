import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { requireAuth } from "@/core/helpers/require-auth";

// PATCH — actualiza cupón
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const unauth = await requireAuth(req);
    if (unauth) return unauth;

    const { id } = await params;
    const body = await req.json();
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("cupones")
      .update({
        codigo: body.codigo?.trim().toUpperCase(),
        descuento: Number(body.descuento),
        tipo: body.tipo,
        activo: body.activo,
        expira_at: body.expira_at || null,
        cliente_id: body.cliente_id || null,
        max_usos: body.max_usos ? Number(body.max_usos) : null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar cupón" },
      { status: 500 },
    );
  }
}

// DELETE — elimina cupón
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const unauth = await requireAuth(_req);
    if (unauth) return unauth;

    const { id } = await params;
    const supabase = getSupabaseServerClient();

    const { error } = await supabase.from("cupones").delete().eq("id", id);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Error al eliminar cupón" },
      { status: 500 },
    );
  }
}
