import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { Deal } from "@/modules/admin/store/domain/entities/deal.entity";
import { DealDetail } from "@/modules/admin/store/presentation/components/DealDetail";
import { notFound } from "next/navigation";
import AppBarAdmin from "@/core/components/app-bar-admin/AppBarAdmin";
import { SupabaseClient } from "@supabase/supabase-js";

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

  // Línea de tiempo de eventos y parte de pagos son tablas nuevas y por
  // separado: si alguna todavía no existe (falta correr su migración),
  // no debe tronar el resto del detalle de la orden — solo esa sección
  // se queda vacía hasta que se cree la tabla.
  const [eventos, pagos] = await Promise.all([
    getEventos(supabase, id),
    getPagos(supabase, id),
  ]);

  return {
    ...(data as unknown as Deal),
    cotizacion_eventos: eventos,
    cotizacion_pagos: pagos,
  };
}

async function getEventos(supabase: SupabaseClient, cotizacionId: string) {
  const { data, error } = await supabase
    .from("cotizacion_eventos")
    .select("id, cotizacion_id, texto, created_at")
    .eq("cotizacion_id", cotizacionId)
    .order("created_at", { ascending: true });

  return error || !data ? [] : data;
}

async function getPagos(supabase: SupabaseClient, cotizacionId: string) {
  const { data, error } = await supabase
    .from("cotizacion_pagos")
    .select("id, cotizacion_id, concepto, monto, created_at")
    .eq("cotizacion_id", cotizacionId)
    .order("created_at", { ascending: true });

  return error || !data ? [] : data;
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
