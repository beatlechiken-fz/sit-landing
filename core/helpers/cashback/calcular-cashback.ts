import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";

interface CashbackConfig {
  nivel1Porcentaje: number;
  nivel1MaxOrdenes: number;
  nivel2Porcentaje: number;
  promoActiva: boolean;
  promoPorcentaje: number;
}

async function getCashbackConfig(): Promise<CashbackConfig> {
  const supabase = getSupabaseServerClient();

  const { data } = await supabase
    .from("configuracion")
    .select("clave, valor")
    .in("clave", [
      "cashback_nivel_1_porcentaje",
      "cashback_nivel_1_max_ordenes",
      "cashback_nivel_2_porcentaje",
      "cashback_promo_activa",
      "cashback_promo_porcentaje",
    ]);

  const map = Object.fromEntries((data ?? []).map((r) => [r.clave, r.valor]));

  return {
    nivel1Porcentaje: Number(map["cashback_nivel_1_porcentaje"] ?? 3),
    nivel1MaxOrdenes: Number(map["cashback_nivel_1_max_ordenes"] ?? 10),
    nivel2Porcentaje: Number(map["cashback_nivel_2_porcentaje"] ?? 5),
    promoActiva: map["cashback_promo_activa"] === "true",
    promoPorcentaje: Number(map["cashback_promo_porcentaje"] ?? 0),
  };
}

export async function calcularCashbackGanado(
  clienteId: string,
  total: number,
): Promise<number> {
  const supabase = getSupabaseServerClient();
  const config = await getCashbackConfig();

  // Cuenta órdenes finalizadas del cliente
  const { count } = await supabase
    .from("cotizaciones")
    .select("*", { count: "exact", head: true })
    .eq("cliente_id", clienteId)
    .eq("status", "finalizado");

  const totalOrdenes = count ?? 0;

  // Determina porcentaje
  let porcentaje =
    totalOrdenes <= config.nivel1MaxOrdenes
      ? config.nivel1Porcentaje
      : config.nivel2Porcentaje;

  // Promo sobreescribe si está activa
  if (config.promoActiva && config.promoPorcentaje > 0) {
    porcentaje = config.promoPorcentaje;
  }

  return Math.round(((total * porcentaje) / 100) * 100) / 100;
}

export async function getCashbackDisponible(
  clienteId: string,
): Promise<number> {
  const supabase = getSupabaseServerClient();

  const { data } = await supabase
    .from("cashback")
    .select("monto, tipo")
    .eq("cliente_id", clienteId);

  if (!data) return 0;

  const ganado = data
    .filter((r) => r.tipo === "ganado")
    .reduce((acc, r) => acc + Number(r.monto), 0);

  const usado = data
    .filter((r) => r.tipo === "usado")
    .reduce((acc, r) => acc + Number(r.monto), 0);

  return Math.max(0, Math.round((ganado - usado) * 100) / 100);
}
