import { NextRequest, NextResponse } from "next/server";
import { requireClientAuth } from "@/core/helpers/auth/require-client-auth";
import { getCashbackDisponible } from "@/core/helpers/cashback/calcular-cashback";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";

export async function GET(req: NextRequest) {
  const { session, error } = await requireClientAuth(req);
  if (error) return error;

  try {
    const supabase = getSupabaseServerClient();
    const disponible = await getCashbackDisponible(session!.id);

    // Historial de cashback
    const { data: historial } = await supabase
      .from("cashback")
      .select("monto, tipo, created_at, cotizacion_id")
      .eq("cliente_id", session!.id)
      .order("created_at", { ascending: false });

    const ganado = (historial ?? [])
      .filter((r) => r.tipo === "ganado")
      .reduce((acc, r) => acc + Number(r.monto), 0);

    const usado = (historial ?? [])
      .filter((r) => r.tipo === "usado")
      .reduce((acc, r) => acc + Number(r.monto), 0);

    return NextResponse.json({
      disponible,
      ganado,
      usado,
      historial: historial ?? [],
    });
  } catch {
    return NextResponse.json(
      { error: "Error al obtener cashback" },
      { status: 500 },
    );
  }
}
