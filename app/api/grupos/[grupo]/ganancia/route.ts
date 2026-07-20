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
    const ganancia = Number(body?.ganancia);

    if (isNaN(ganancia) || ganancia < 0 || ganancia > 100) {
      return NextResponse.json(
        { error: "La ganancia debe ser un número entre 0 y 100" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();

    const { error } = await supabase.from("grupos_ganancia").upsert(
      {
        grupo: decodeURIComponent(grupo),
        ganancia,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "grupo" },
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidateTag("ganancias", "");

    return NextResponse.json({ ok: true, grupo, ganancia });
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar ganancia" },
      { status: 500 },
    );
  }
}
