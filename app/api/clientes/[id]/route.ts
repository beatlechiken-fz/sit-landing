import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { requireAuth } from "@/core/helpers/require-auth";
import bcrypt from "bcryptjs";

type Params = { params: Promise<{ id: string }> };

// GET — detalle de un cliente
export async function GET(req: NextRequest, { params }: Params) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;

  try {
    const { id } = await params;
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("clientes")
      .select(
        `
        id,
        nombre,
        apellido,
        email,
        telefono,
        empresa,
        activo,
        created_at,
        updated_at
      `,
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener cliente" },
      { status: 500 },
    );
  }
}

// PATCH — actualiza cliente
export async function PATCH(req: NextRequest, { params }: Params) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;

  try {
    const { id } = await params;
    const body = await req.json();
    const supabase = getSupabaseServerClient();

    // Si viene nueva contraseña la hasheamos
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.nombre) updates.nombre = body.nombre.trim();
    if (body.apellido) updates.apellido = body.apellido.trim();
    if (body.email) updates.email = body.email.trim().toLowerCase();
    if (body.telefono !== undefined)
      updates.telefono = body.telefono?.trim() || null;
    if (body.empresa !== undefined)
      updates.empresa = body.empresa?.trim() || null;
    if (body.activo !== undefined) updates.activo = body.activo;

    if (body.password) {
      if (body.password.length < 8) {
        return NextResponse.json(
          { error: "La contraseña debe tener al menos 8 caracteres" },
          { status: 400 },
        );
      }
      updates.password_hash = await bcrypt.hash(body.password, 12);
    }

    const { data, error } = await supabase
      .from("clientes")
      .update(updates)
      .eq("id", id)
      .select(
        "id, nombre, apellido, email, telefono, empresa, activo, created_at, updated_at",
      )
      .single();

    if (error) {
      const msg = error.message.includes("unique")
        ? "Ya existe un cliente con ese email"
        : error.message;
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar cliente" },
      { status: 500 },
    );
  }
}

// DELETE — desactiva cliente (soft delete)
export async function DELETE(req: NextRequest, { params }: Params) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;

  try {
    const { id } = await params;
    const supabase = getSupabaseServerClient();

    const { error } = await supabase
      .from("clientes")
      .update({ activo: false, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Error al eliminar cliente" },
      { status: 500 },
    );
  }
}
