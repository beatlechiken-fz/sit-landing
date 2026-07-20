import { NextRequest, NextResponse } from "next/server";
import { verifyClientToken } from "./client-session";

export async function requireClientAuth(req: NextRequest) {
  const token = req.cookies.get("sit_client_session")?.value;
  const session = token ? await verifyClientToken(token) : null;

  if (!session) {
    return {
      session: null,
      error: NextResponse.json({ error: "No autorizado" }, { status: 401 }),
    };
  }

  return { session, error: null };
}
