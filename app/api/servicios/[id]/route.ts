import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { requireAuth } from "@/core/helpers/require-auth";

// PATCH — actualiza servicio (editar datos o dar de baja/reactivar)
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

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.nombre !== undefined) {
      if (!body.nombre?.trim()) {
        return NextResponse.json(
          { error: "El nombre es requerido" },
          { status: 400 },
        );
      }
      updates.nombre = body.nombre.trim();
    }
    if (body.descripcion !== undefined) {
      updates.descripcion = body.descripcion?.trim() || body.nombre?.trim();
    }
    if (body.precio !== undefined) {
      if (body.precio === null || body.precio === "") {
        updates.precio = null;
      } else {
        const precioNum = Number(body.precio);
        if (isNaN(precioNum) || precioNum < 0) {
          return NextResponse.json(
            { error: "El precio debe ser un número mayor o igual a 0" },
            { status: 400 },
          );
        }
        updates.precio = precioNum;
      }
    }
    if (body.activo !== undefined) updates.activo = body.activo;

    const { data, error } = await supabase
      .from("servicios")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar servicio" },
      { status: 500 },
    );
  }
}
