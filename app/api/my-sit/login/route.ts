import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import {
  createClientToken,
  COOKIE_NAME,
  MAX_AGE,
} from "@/core/helpers/auth/client-session";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();

    const { data: cliente, error } = await supabase
      .from("clientes")
      .select(
        "id, nombre, apellido, email, password_hash, activo, debe_cambiar_password",
      )
      .eq("email", email.trim().toLowerCase())
      .single();

    if (error || !cliente) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 },
      );
    }

    if (!cliente.activo) {
      return NextResponse.json(
        { error: "Tu cuenta está desactivada. Contacta a Sit+." },
        { status: 403 },
      );
    }

    const passwordOk = await bcrypt.compare(password, cliente.password_hash);
    if (!passwordOk) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 },
      );
    }

    const token = await createClientToken({
      id: cliente.id,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      debeCambiarPassword: !!cliente.debe_cambiar_password,
    });

    const res = NextResponse.json({
      ok: true,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      debeCambiarPassword: !!cliente.debe_cambiar_password,
    });

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
      { error: "Error al iniciar sesión" },
      { status: 500 },
    );
  }
}
