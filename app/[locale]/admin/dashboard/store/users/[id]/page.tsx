import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { Cliente } from "@/modules/admin/store/domain/entities/cliente.entity";
import { Direccion } from "@/modules/admin/store/domain/entities/direccion.entity";
import { Cupon } from "@/modules/admin/store/domain/entities/cupon.entity";
import { Deal } from "@/modules/admin/store/domain/entities/deal.entity";
import { ClienteDetail } from "@/modules/admin/store/presentation/components/ClienteDetail";
import AppBarAdmin from "@/core/components/app-bar-admin/AppBarAdmin";

export type OrdenResumen = Pick<
  Deal,
  "id" | "numero_orden" | "status" | "total" | "created_at"
>;

async function getCliente(id: string): Promise<Cliente | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("clientes")
    .select(
      "id, nombre, apellido, email, telefono, empresa, activo, created_at, updated_at",
    )
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Cliente;
}

async function getDirecciones(id: string): Promise<Direccion[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("direcciones")
    .select("*")
    .eq("cliente_id", id)
    .order("predeterminada", { ascending: false })
    .order("created_at", { ascending: false });

  return (data as Direccion[]) ?? [];
}

async function getCupones(id: string): Promise<Cupon[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("cupones")
    .select("*")
    .or(`cliente_id.eq.${id},cliente_id.is.null`)
    .eq("activo", true)
    .order("created_at", { ascending: false });

  return (data as Cupon[]) ?? [];
}

async function getOrdenes(id: string): Promise<OrdenResumen[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("cotizaciones")
    .select("id, numero_orden, status, total, created_at")
    .eq("cliente_id", id)
    .order("created_at", { ascending: false });

  return (data as OrdenResumen[]) ?? [];
}

export default async function ClienteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cliente = await getCliente(id);

  if (!cliente) notFound();

  const [direcciones, cupones, ordenes] = await Promise.all([
    getDirecciones(id),
    getCupones(id),
    getOrdenes(id),
  ]);

  return (
    <main className="bg-[#0B0B0F] text-white min-h-screen overflow-x-hidden">
      <AppBarAdmin />
      <section className="flex justify-center pt-8 lg:pt-18 w-full">
        <ClienteDetail
          cliente={cliente}
          direcciones={direcciones}
          cupones={cupones}
          ordenes={ordenes}
        />
      </section>
    </main>
  );
}
