import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/core/helpers/require-auth";
import { getCashbackDisponible } from "@/core/helpers/cashback/calcular-cashback";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;

  const { id } = await params;
  const disponible = await getCashbackDisponible(id);
  return NextResponse.json({ disponible });
}
