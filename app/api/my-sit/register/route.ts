import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import {
  createClientToken,
  COOKIE_NAME,
  MAX_AGE,
} from "@/core/helpers/auth/client-session";
import { sendEmail, registroTemplate } from "@/core/helpers/email";
import bcrypt from "bcryptjs";

// POST — registro público de clientes (portal my-sit / tienda en línea)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, apellido, email, telefono, empresa, password } = body;

    if (!nombre?.trim()) {
      return NextResponse.json(
        { error: "El nombre es requerido" },
        { status: 400 },
      );
    }
    if (!apellido?.trim()) {
      return NextResponse.json(
        { error: "El apellido es requerido" },
        { status: 400 },
      );
    }
    if (!email?.trim() || !email.includes("@")) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 8 caracteres" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();
    const hash = await bcrypt.hash(password, 12);

    const { data: cliente, error } = await supabase
      .from("clientes")
      .insert({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim().toLowerCase(),
        telefono: telefono?.trim() || null,
        empresa: empresa?.trim() || null,
        password_hash: hash,
        activo: true,
      })
      .select("id, nombre, apellido, email")
      .single();

    if (error) {
      const msg = error.message.includes("unique")
        ? "Ya existe una cuenta con ese email"
        : error.message;
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const token = await createClientToken({
      id: cliente.id,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      debeCambiarPassword: false,
    });

    const res = NextResponse.json(
      { ok: true, nombre: cliente.nombre, apellido: cliente.apellido },
      { status: 201 },
    );

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    });

    const storeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/store`;
    const { subject, html } = registroTemplate({
      nombre: cliente.nombre,
      storeUrl,
    });
    sendEmail({ to: cliente.email, subject, html }).catch(() => {});

    return res;
  } catch {
    return NextResponse.json(
      { error: "Error al crear la cuenta" },
      { status: 500 },
    );
  }
}
