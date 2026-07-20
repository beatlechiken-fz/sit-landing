import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { Deal } from "@/modules/admin/store/domain/entities/deal.entity";
import { DealDetail } from "@/modules/admin/store/presentation/components/DealDetail";
import { notFound } from "next/navigation";
import AppBarAdmin from "@/core/components/app-bar-admin/AppBarAdmin";

async function getDeal(id: string): Promise<Deal | null> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("cotizaciones")
    .select(
      `
      *,
      clientes (
        id, nombre, apellido, email, telefono, empresa
      ),
      cotizacion_lineas (*),
      cotizacion_mensajes (
        id, cotizacion_id, origen, contenido, leido, created_at
      )
    `,
    )
    .eq("id", id)
    .order("created_at", {
      ascending: true,
      referencedTable: "cotizacion_mensajes",
    })
    .single();

  if (error || !data) return null;
  return data as unknown as Deal;
}

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deal = await getDeal(id);

  if (!deal) notFound();
  return (
    <main className="bg-[#0B0B0F] text-white min-h-screen overflow-x-hidden">
      <AppBarAdmin />
      <section className="flex justify-center pt-8 lg:pt-18 w-full">
        <DealDetail deal={deal} />
      </section>
    </main>
  );
}
