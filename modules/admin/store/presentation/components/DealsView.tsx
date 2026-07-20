import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { Deal } from "@/modules/admin/store/domain/entities/deal.entity";
import { DealsManager } from "./DealsManager";

async function getDeals(): Promise<Deal[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("cotizaciones")
    .select(
      `
      id,
      numero_orden,
      cliente_id,
      cliente_nombre,
      status,
      subtotal,
      descuento,
      cashback_canjeado,
      cashback_ganado,
      total,
      cupon_global,
      expira_at,
      created_at,
      updated_at,
      clientes (
        id,
        nombre,
        apellido,
        email,
        telefono,
        empresa
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as unknown as Deal[];
}

export default async function DealsView() {
  const deals = await getDeals();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Tratos
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Cotizaciones y órdenes de clientes
        </p>
      </div>

      <DealsManager deals={deals} />
    </main>
  );
}
