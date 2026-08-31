import { NextRequest, NextResponse } from "next/server";
import { requireClientAuth } from "@/core/helpers/auth/require-client-auth";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import {
  createClientToken,
  COOKIE_NAME,
  MAX_AGE,
} from "@/core/helpers/auth/client-session";
import { isMissingDebeCambiarPasswordColumnError } from "@/core/helpers/clientes/debe-cambiar-password";
import bcrypt from "bcryptjs";

export async function PATCH(req: NextRequest) {
  const { session, error } = await requireClientAuth(req);
  if (error) return error;

  try {
    const { passwordActual, passwordNuevo } = await req.json();

    if (!passwordActual || !passwordNuevo) {
      return NextResponse.json(
        { error: "Ambas contraseñas son requeridas" },
        { status: 400 },
      );
    }

    if (passwordNuevo.length < 8) {
      return NextResponse.json(
        { error: "La nueva contraseña debe tener al menos 8 caracteres" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();

    // Trae el hash actual
    const { data: cliente, error: fetchError } = await supabase
      .from("clientes")
      .select("password_hash")
      .eq("id", session!.id)
      .single();

    if (fetchError || !cliente) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 },
      );
    }

    // Verifica contraseña actual
    const passwordOk = await bcrypt.compare(
      passwordActual,
      cliente.password_hash,
    );
    if (!passwordOk) {
      return NextResponse.json(
        { error: "La contraseña actual es incorrecta" },
        { status: 401 },
      );
    }

    // Hashea y guarda la nueva
    const nuevoHash = await bcrypt.hash(passwordNuevo, 12);

    let { error: updateError } = await supabase
      .from("clientes")
      .update({
        password_hash: nuevoHash,
        debe_cambiar_password: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session!.id);

    // Si la base de datos todavía no tiene la columna
    // `debe_cambiar_password`, reintentamos sin ella.
    if (updateError && isMissingDebeCambiarPasswordColumnError(updateError)) {
      ({ error: updateError } = await supabase
        .from("clientes")
        .update({
          password_hash: nuevoHash,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session!.id));
    }

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Reemite la cookie ya sin el flag de cambio obligatorio —
    // el JWT anterior seguía marcado como pendiente y bloquearía el dashboard.
    const token = await createClientToken({
      id: session!.id,
      nombre: session!.nombre,
      apellido: session!.apellido,
      email: session!.email,
      debeCambiarPassword: false,
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    });

    return res;
  } catch {
    return NextResponse.json(
      { error: "Error al cambiar contraseña" },
      { status: 500 },
    );
  }
}
