import { NextResponse } from "next/server";
import { getClientSession } from "@/core/helpers/auth/client-session";

// GET — devuelve la sesión del cliente si existe (para el AppBar público,
// que necesita saber si mostrar "Iniciar sesión" o las iniciales del usuario)
export async function GET() {
  const session = await getClientSession();

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  return NextResponse.json(session);
}
