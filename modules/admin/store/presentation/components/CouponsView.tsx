import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { CuponesManager } from "./CuponesManager";

async function getCupones() {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("cupones")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
}

export default async function CouponsView() {
  const cupones = await getCupones();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Cupones
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Administra los cupones de descuento
        </p>
      </div>

      <CuponesManager cupones={cupones} />
    </main>
  );
}
