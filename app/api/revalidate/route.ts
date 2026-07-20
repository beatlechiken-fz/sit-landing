import { requireAuth } from "@/core/helpers/require-auth";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;

  // Protege el endpoint con un secret compartido
  const secret = req.headers.get("x-revalidate-secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag("productos", "");
  revalidateTag("marcas", "");
  revalidateTag("grupos", "");
  revalidateTag("ganancias", "");
  revalidateTag("tipo_cambio", "");

  return NextResponse.json({
    revalidated: true,
    timestamp: new Date().toISOString(),
  });
}
