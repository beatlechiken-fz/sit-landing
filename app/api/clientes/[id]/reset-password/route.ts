import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { requireAuth } from "@/core/helpers/require-auth";
import { generateSecurePassword } from "@/core/helpers/auth/generate-password";
import { sendEmail, bienvenidaTemplate } from "@/core/helpers/email";
import { isPlaceholderEmail } from "@/core/helpers/clientes/placeholder-email";
import { isMissingDebeCambiarPasswordColumnError } from "@/core/helpers/clientes/debe-cambiar-password";
import bcrypt from "bcryptjs";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;

  try {
    const { id } = await params;
    const supabase = getSupabaseServerClient();

    const { data: cliente, error: fetchError } = await supabase
      .from("clientes")
      .select("nombre, email")
      .eq("id", id)
      .single();

    if (fetchError || !cliente) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 },
      );
    }

    const password = generateSecurePassword();
    const hash = await bcrypt.hash(password, 12);

    let { error } = await supabase
      .from("clientes")
      .update({
        password_hash: hash,
        debe_cambiar_password: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    // Si la base de datos todavía no tiene la columna
    // `debe_cambiar_password`, reintentamos sin ella.
    if (error && isMissingDebeCambiarPasswordColumnError(error)) {
      ({ error } = await supabase
        .from("clientes")
        .update({
          password_hash: hash,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id));
    }

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    // Reenvía email con nueva contraseña — best effort, nunca debe tronar
    // el reseteo (que ya se guardó arriba). Si el cliente no tiene un
    // email real (placeholder), ni siquiera lo intentamos.
    let emailEnviado = false;
    if (!isPlaceholderEmail(cliente.email)) {
      try {
        const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/my-sit`;
        const { subject, html } = bienvenidaTemplate({
          nombre: cliente.nombre,
          email: cliente.email,
          password,
          loginUrl,
        });
        emailEnviado = await sendEmail({ to: cliente.email, subject, html });
      } catch (err) {
        console.error("No se pudo reenviar el email de contraseña:", err);
        emailEnviado = false;
      }
    }

    return NextResponse.json({ ok: true, emailEnviado });
  } catch {
    return NextResponse.json(
      { error: "Error al resetear contraseña" },
      { status: 500 },
    );
  }
}
