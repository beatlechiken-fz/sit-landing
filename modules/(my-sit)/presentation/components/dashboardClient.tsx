import { getClientSession } from "@/core/helpers/auth/client-session";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { getCashbackDisponible } from "@/core/helpers/cashback/calcular-cashback";
import {
  DealStatus,
  DEAL_STATUS_LABELS,
  DEAL_STATUS_COLORS,
} from "@/modules/admin/store/domain/entities/deal.entity";
import { formatMXN } from "@/core/helpers/precio.utils";
import { Link } from "@/i18n/navigation";

async function getStats(clienteId: string) {
  const supabase = getSupabaseServerClient();

  const { data: deals } = await supabase
    .from("cotizaciones")
    .select("id, status, total, created_at, numero_orden")
    .eq("cliente_id", clienteId)
    .order("created_at", { ascending: false });

  const cashback = await getCashbackDisponible(clienteId);

  const { data: cuponesData } = await supabase
    .from("cliente_cupones")
    .select("usado, cupones (activo, expira_at)")
    .eq("cliente_id", clienteId);

  const cuponesDisponibles = (cuponesData ?? []).filter((c) => {
    const cupon = c.cupones as unknown as {
      activo: boolean;
      expira_at: string | null;
    } | null;
    if (!cupon || c.usado || !cupon.activo) return false;
    if (cupon.expira_at && new Date(cupon.expira_at) < new Date()) {
      return false;
    }
    return true;
  }).length;

  return {
    deals: deals ?? [],
    cashback,
    cuponesDisponibles,
    total: (deals ?? []).length,
    activos: (deals ?? []).filter(
      (d) => !["finalizado", "cancelado"].includes(d.status),
    ).length,
    finalizados: (deals ?? []).filter((d) => d.status === "finalizado").length,
  };
}

const ACCESOS = [
  {
    href: "/my-sit/dashboard/pedidos",
    label: "Pedidos",
    desc: "Rastrea tus órdenes",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    ),
  },
  {
    href: "/my-sit/dashboard/beneficios",
    label: "Mis beneficios",
    desc: "Cashback y cupones",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 2v8m0 0v2m0-2c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
];

export default async function MySitPage() {
  const session = await getClientSession();
  const stats = await getStats(session!.id);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 w-full">
      {/* Saludo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Hola, {session?.nombre} 👋
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Aquí puedes ver el estado de tus pedidos y tus beneficios.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {[
          {
            label: "Pedidos activos",
            value: stats.activos,
            color: "text-[#02AFFF]",
            bg: "bg-[#02AFFF]/10",
          },
          {
            label: "Cashback disponible",
            value: formatMXN(stats.cashback),
            color: "text-purple-400",
            bg: "bg-purple-500/10",
          },
          {
            label: "Cupones disponibles",
            value: stats.cuponesDisponibles,
            color: "text-teal-400",
            bg: "bg-teal-500/10",
          },
          {
            label: "Pedidos finalizados",
            value: stats.finalizados,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            className={`rounded-2xl border border-zinc-800 ${bg} p-6`}
          >
            <p className="text-xs text-zinc-500 uppercase tracking-widest">
              {label}
            </p>
            <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Accesos rápidos */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {ACCESOS.map(({ href, label, desc, icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-[#02AFFF]/40 hover:bg-zinc-900/70"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#02AFFF]/10 text-[#02AFFF]">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {icon}
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-zinc-100">{label}</p>
              <p className="text-xs text-zinc-500">{desc}</p>
            </div>
            <svg
              className="h-4 w-4 shrink-0 text-zinc-600 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        ))}

        {/* Mi perfil — con vista previa de datos */}
        <Link
          href="/my-sit/dashboard/perfil"
          className="group flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-[#02AFFF]/40 hover:bg-zinc-900/70"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#02AFFF]/20 text-sm font-bold text-[#02AFFF]">
            {session?.nombre[0]}
            {session?.apellido[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-zinc-100">Mi perfil</p>
            <p className="truncate text-xs text-zinc-500">{session?.email}</p>
          </div>
          <svg
            className="h-4 w-4 shrink-0 text-zinc-600 transition-transform group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>

      {/* Pedidos recientes */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Mis pedidos
          </p>
          <Link
            href="/my-sit/dashboard/pedidos"
            className="text-xs text-[#02AFFF] hover:underline"
          >
            Ver todos →
          </Link>
        </div>

        {stats.deals.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-zinc-600 text-sm">Aún no tienes pedidos</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {stats.deals.slice(0, 5).map((deal) => (
              <Link
                key={deal.id}
                href={`/my-sit/dashboard/pedidos/${deal.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-zinc-800/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-200">
                    {deal.numero_orden ?? "Cotización"}
                  </p>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    {new Date(deal.created_at).toLocaleDateString("es-MX", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${DEAL_STATUS_COLORS[deal.status as DealStatus]}`}
                  >
                    {DEAL_STATUS_LABELS[deal.status as DealStatus]}
                  </span>
                  <p className="text-sm font-bold text-zinc-100">
                    {formatMXN(deal.total)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
