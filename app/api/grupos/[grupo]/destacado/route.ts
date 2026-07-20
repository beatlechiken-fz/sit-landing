import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { requireAuth } from "@/core/helpers/require-auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ grupo: string }> },
) {
  try {
    const unauth = await requireAuth(req);
    if (unauth) return unauth;

    const { grupo } = await params;
    const body = await req.json();
    const destacado = !!body?.destacado;

    const supabase = getSupabaseServerClient();

    const { error } = await supabase.from("grupos_ganancia").upsert(
      {
        grupo: decodeURIComponent(grupo),
        destacado,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "grupo" },
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidateTag("grupos-destacados", "");

    return NextResponse.json({ ok: true, grupo, destacado });
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar destacado" },
      { status: 500 },
    );
  }
}
