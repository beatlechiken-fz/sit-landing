import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * Verifica que el request tenga un JWT válido.
 * Retorna null si está autenticado, o un NextResponse 401 si no.
 *
 * Uso:
 *   const unauth = await requireAuth(req)
 *   if (unauth) return unauth
 */
export async function requireAuth(
  req: NextRequest,
): Promise<NextResponse | null> {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  if (!token) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  return null;
}
