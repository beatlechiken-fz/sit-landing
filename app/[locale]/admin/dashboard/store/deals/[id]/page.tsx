import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { Deal } from "@/modules/admin/store/domain/entities/deal.entity";
import { DealDetail } from "@/modules/admin/store/presentation/components/DealDetail";
import { notFound } from "next/navigation";
import AppBarAdmin from "@/core/components/app-bar-admin/AppBarAdmin";

const BASE_SELECT = `
  *,
  clientes (
    id, nombre, apellido, email, telefono, empresa
  ),
  cotizacion_lineas (*),
  cotizacion_mensajes (
    id, cotizacion_id, origen, contenido, leido, created_at
  )
`;

async function getDeal(id: string): Promise<Deal | null> {
  const supabase = getSupabaseServerClient();

  let { data, error } = await supabase
    .from("cotizaciones")
    .select(
      `
      ${BASE_SELECT},
      cotizacion_eventos (
        id, cotizacion_id, texto, created_at
      )
    `,
    )
    .eq("id", id)
    .order("created_at", {
      ascending: true,
      referencedTable: "cotizacion_mensajes",
    })
    .order("created_at", {
      ascending: true,
      referencedTable: "cotizacion_eventos",
    })
    .single();

  // Si la tabla `cotizacion_eventos` todavía no existe (falta correr la
  // migración), reintenta sin el join en vez de tronar toda la página.
  if (error?.message?.includes("cotizacion_eventos")) {
    ({ data, error } = await supabase
      .from("cotizaciones")
      .select(BASE_SELECT)
      .eq("id", id)
      .order("created_at", {
        ascending: true,
        referencedTable: "cotizacion_mensajes",
      })
      .single());
  }

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
