"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Deal,
  DealStatus,
  DEAL_STATUS_LABELS,
  DEAL_STATUS_COLORS,
} from "@/modules/admin/store/domain/entities/deal.entity";
import { formatMXN } from "@/core/helpers/precio.utils";

const FILTROS_STATUS: { value: DealStatus | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "cotizacion", label: "Cotización" },
  { value: "en_proceso", label: "En proceso" },
  { value: "listo_para_entregar", label: "Listo para entregar" },
  { value: "pendiente_de_pago", label: "Pendiente de pago" },
  { value: "pagado", label: "Pagado" },
  { value: "finalizado", label: "Finalizado" },
  { value: "cancelado", label: "Cancelado" },
];

function StatusBadge({ status }: { status: DealStatus }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${DEAL_STATUS_COLORS[status]}`}
    >
      {DEAL_STATUS_LABELS[status]}
    </span>
  );
}

export function DealsManager({ deals: initial }: { deals: Deal[] }) {
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>(initial);
  const [filtroStatus, setFiltroStatus] = useState<DealStatus | "todos">(
    "todos",
  );
  const [buscar, setBuscar] = useState("");

  const dealsFiltrados = deals.filter((d) => {
    const matchStatus = filtroStatus === "todos" || d.status === filtroStatus;
    const matchBuscar =
      !buscar.trim() ||
      [
        d.cliente_nombre,
        d.numero_orden ?? "",
        d.clientes?.email ?? "",
        d.clientes?.empresa ?? "",
      ].some((f) => f.toLowerCase().includes(buscar.toLowerCase()));
    return matchStatus && matchBuscar;
  });

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Búsqueda */}
        <input
          type="text"
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          placeholder="Buscar por cliente, orden o empresa..."
          className="
            flex-1 rounded-xl border border-zinc-800 bg-zinc-900
            px-4 py-2.5 text-sm text-zinc-300
            placeholder:text-zinc-600
            outline-none focus:border-zinc-600 transition-colors
          "
        />

        {/* Selector de status */}
        <select
          value={filtroStatus}
          onChange={(e) =>
            setFiltroStatus(e.target.value as DealStatus | "todos")
          }
          className="input-dark shrink-0"
        >
          {FILTROS_STATUS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* Contador */}
      <p className="text-xs text-zinc-600">
        {dealsFiltrados.length}{" "}
        {dealsFiltrados.length === 1 ? "trato" : "tratos"}
      </p>

      {/* Desktop — tabla */}
      <div className="hidden md:block rounded-2xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900">
              {["Orden", "Cliente", "Total", "Status", "Fecha", ""].map((h) => (
                <th
                  key={h}
                  className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {dealsFiltrados.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-16 text-center text-zinc-600 text-sm"
                >
                  No hay tratos con esos filtros
                </td>
              </tr>
            ) : (
              dealsFiltrados.map((deal) => (
                <tr
                  key={deal.id}
                  onClick={() =>
                    router.push(`/admin/dashboard/store/deals/${deal.id}`)
                  }
                  className="bg-zinc-950 hover:bg-zinc-900/50 transition-colors cursor-pointer"
                >
                  {/* Orden */}
                  <td className="px-5 py-4">
                    {deal.numero_orden ? (
                      <span className="font-mono text-xs font-bold text-zinc-200">
                        {deal.numero_orden}
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-600">Sin orden</span>
                    )}
                  </td>

                  {/* Cliente */}
                  <td className="px-5 py-4">
                    <p className="font-medium text-zinc-200">
                      {deal.cliente_nombre}
                    </p>
                    {deal.clientes?.email && (
                      <p className="text-xs text-zinc-600">
                        {deal.clientes.email}
                      </p>
                    )}
                  </td>

                  {/* Total */}
                  <td className="px-5 py-4 font-bold text-zinc-100">
                    {formatMXN(deal.total)}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge status={deal.status} />
                  </td>

                  {/* Fecha */}
                  <td className="px-5 py-4 text-xs text-zinc-500">
                    {new Date(deal.created_at).toLocaleDateString("es-MX", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* Arrow */}
                  <td className="px-5 py-4 text-zinc-700">
                    <svg
                      className="h-4 w-4"
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile — tarjetas */}
      <div className="grid gap-3 md:hidden">
        {dealsFiltrados.length === 0 ? (
          <p className="py-12 text-center text-zinc-600 text-sm">
            No hay tratos con esos filtros
          </p>
        ) : (
          dealsFiltrados.map((deal) => (
            <div
              key={deal.id}
              onClick={() =>
                router.push(`/admin/dashboard/store/deals/${deal.id}`)
              }
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 cursor-pointer hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <p className="font-medium text-zinc-200 truncate">
                    {deal.cliente_nombre}
                  </p>
                  {deal.numero_orden && (
                    <p className="font-mono text-xs text-zinc-500 mt-0.5">
                      {deal.numero_orden}
                    </p>
                  )}
                </div>
                <StatusBadge status={deal.status} />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-600">
                  {new Date(deal.created_at).toLocaleDateString("es-MX", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="font-bold text-zinc-100">
                  {formatMXN(deal.total)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
