import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { requireAuth } from "@/core/helpers/require-auth";

// DELETE — quita a un producto de destacados
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ productoId: string }> },
) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;

  try {
    const { productoId } = await params;
    const supabase = getSupabaseServerClient();

    const { error } = await supabase
      .from("productos_destacados")
      .delete()
      .eq("producto_id", Number(productoId));

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    revalidateTag("productos-destacados", "");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Error al quitar destacado" },
      { status: 500 },
    );
  }
}
