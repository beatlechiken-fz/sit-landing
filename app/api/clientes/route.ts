import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { requireAuth } from "@/core/helpers/require-auth";
import { generateSecurePassword } from "@/core/helpers/auth/generate-password";
import { sendEmail, bienvenidaTemplate } from "@/core/helpers/email";
import { buildPlaceholderEmail } from "@/core/helpers/clientes/placeholder-email";
import bcrypt from "bcryptjs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET — lista todos los clientes con búsqueda opcional
export async function GET(req: NextRequest) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;

  try {
    const supabase = getSupabaseServerClient();
    const searchParams = req.nextUrl.searchParams;
    const q = searchParams.get("q")?.trim();

    let query = supabase
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
        created_at
        `,
      )
      .order("created_at", { ascending: false });

    // Búsqueda por nombre, apellido, email o empresa
    if (q && q.length >= 2) {
      query = query.or(
        `nombre.ilike.%${q}%,apellido.ilike.%${q}%,email.ilike.%${q}%,empresa.ilike.%${q}%`,
      );
    }

    const { data, error } = await query;

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener clientes" },
      { status: 500 },
    );
  }
}

// POST — crea nuevo cliente
export async function POST(req: NextRequest) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;

  try {
    const body = await req.json();
    const { nombre, apellido, email, telefono, empresa } = body;

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

    // El email es opcional. Si no viene o no tiene formato válido, no
    // bloqueamos la creación: guardamos lo que haya (o un placeholder si
    // viene vacío) y simplemente no enviamos el correo de bienvenida.
    const emailInput = email?.trim().toLowerCase();
    const emailEsValido = !!emailInput && EMAIL_REGEX.test(emailInput);
    const emailParaGuardar = emailInput || buildPlaceholderEmail();

    const supabase = getSupabaseServerClient();
    const password = generateSecurePassword();
    const hash = await bcrypt.hash(password, 12);

    const { data, error } = await supabase
      .from("clientes")
      .insert({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: emailParaGuardar,
        telefono: telefono?.trim() || null,
        empresa: empresa?.trim() || null,
        password_hash: hash,
        debe_cambiar_password: true,
      })
      .select(
        "id, nombre, apellido, email, telefono, empresa, activo, created_at",
      )
      .single();

    if (error) {
      const msg = error.message.includes("unique")
        ? "Ya existe un cliente con ese email"
        : error.message;
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    // Enviar email de bienvenida — best effort. Si el correo no es válido,
    // no existe o el envío falla por cualquier motivo, nunca debe tronar la
    // creación del cliente (que ya quedó guardado arriba).
    let emailEnviado = false;
    if (emailEsValido) {
      try {
        const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/my-sit`;
        const { subject, html } = bienvenidaTemplate({
          nombre: data.nombre,
          email: data.email,
          password,
          loginUrl,
        });
        emailEnviado = await sendEmail({ to: data.email, subject, html });
      } catch (err) {
        console.error("No se pudo enviar el email de bienvenida:", err);
        emailEnviado = false;
      }
    }

    return NextResponse.json({ ...data, emailEnviado }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear cliente" },
      { status: 500 },
    );
  }
}
