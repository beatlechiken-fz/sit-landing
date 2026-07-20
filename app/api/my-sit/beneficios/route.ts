import { NextRequest, NextResponse } from "next/server";
import { requireClientAuth } from "@/core/helpers/auth/require-client-auth";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { getCashbackDisponible } from "@/core/helpers/cashback/calcular-cashback";

export async function GET(req: NextRequest) {
  const { session, error } = await requireClientAuth(req);
  if (error) return error;

  try {
    const supabase = getSupabaseServerClient();
    const disponible = await getCashbackDisponible(session!.id);

    // Historial cashback con info de la cotización
    const { data: cashbackHistorial } = await supabase
      .from("cashback")
      .select(
        `
        id,
        monto,
        tipo,
        created_at,
        cotizaciones (
          numero_orden,
          cliente_nombre
        )
      `,
      )
      .eq("cliente_id", session!.id)
      .order("created_at", { ascending: false });

    // Cupones asignados al cliente
    const { data: cupones } = await supabase
      .from("cliente_cupones")
      .select(
        `
        id,
        usado,
        usado_at,
        created_at,
        cupones (
          codigo,
          descuento,
          tipo,
          expira_at,
          activo
        )
      `,
      )
      .eq("cliente_id", session!.id)
      .order("created_at", { ascending: false });

    const ganado = (cashbackHistorial ?? [])
      .filter((r) => r.tipo === "ganado")
      .reduce((acc, r) => acc + Number(r.monto), 0);

    const usado = (cashbackHistorial ?? [])
      .filter((r) => r.tipo === "usado")
      .reduce((acc, r) => acc + Number(r.monto), 0);

    return NextResponse.json({
      cashback: {
        disponible,
        ganado,
        usado,
        historial: cashbackHistorial ?? [],
      },
      cupones: cupones ?? [],
    });
  } catch {
    return NextResponse.json(
      { error: "Error al obtener beneficios" },
      { status: 500 },
    );
  }
}
