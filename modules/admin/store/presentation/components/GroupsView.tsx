import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { GruposTable } from "./Grupostable";

async function getGruposConGanancia() {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase.rpc("get_grupos_disponibles");

  if (error || !data) return [];

  // Traer ganancias y destacados actuales
  const { data: config } = await supabase
    .from("grupos_ganancia")
    .select("grupo, ganancia, destacado");

  const configMap = Object.fromEntries(
    (config ?? []).map(
      (g: { grupo: string; ganancia: number; destacado: boolean }) => [
        g.grupo,
        g,
      ],
    ),
  );

  return (data as { grupo: string }[]).map((r) => ({
    grupo: r.grupo,
    ganancia: configMap[r.grupo]?.ganancia ?? 0,
    destacado: configMap[r.grupo]?.destacado ?? false,
  }));
}

export default async function GroupsView() {
  const grupos = await getGruposConGanancia();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Grupos
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Configura el porcentaje de ganancia por categoría
        </p>
      </div>

      <GruposTable grupos={grupos} />
    </main>
  );
}
