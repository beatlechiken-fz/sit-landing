import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { requireAuth } from "@/core/helpers/require-auth";

// GET — lista los ids de productos marcados como destacados
export async function GET(req: NextRequest) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("productos_destacados")
      .select("producto_id, orden")
      .order("orden", { ascending: true });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener destacados" },
      { status: 500 },
    );
  }
}

// POST — marca un producto como destacado
export async function POST(req: NextRequest) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;

  try {
    const body = await req.json();
    const producto_id = Number(body?.producto_id);

    if (!producto_id || isNaN(producto_id)) {
      return NextResponse.json(
        { error: "producto_id es requerido" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from("productos_destacados")
      .upsert({ producto_id }, { onConflict: "producto_id" });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    revalidateTag("productos-destacados", "");

    return NextResponse.json({ ok: true, producto_id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al marcar como destacado" },
      { status: 500 },
    );
  }
}
