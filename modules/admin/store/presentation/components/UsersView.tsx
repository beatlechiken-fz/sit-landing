import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { Cliente } from "@/modules/admin/store/domain/entities/cliente.entity";
import { ClientesManager } from "./ClientesManager";

async function getClientes(): Promise<Cliente[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("clientes")
    .select(
      "id, nombre, apellido, email, telefono, empresa, activo, created_at",
    )
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as Cliente[];
}

export default async function UsersView() {
  const clientes = await getClientes();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Clientes
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Administra los clientes y sus accesos al portal
        </p>
      </div>

      <ClientesManager clientes={clientes} />
    </main>
  );
}
