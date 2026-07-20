"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatMXN } from "@/core/helpers/precio.utils";
import {
  DealStatus,
  DEAL_STATUS_LABELS,
  DEAL_STATUS_COLORS,
} from "@/modules/admin/store/domain/entities/deal.entity";

interface Deal {
  id: string;
  numero_orden: string | null;
  status: DealStatus;
  total: number;
  created_at: string;
  expira_at: string;
  cotizacion_mensajes?: { leido: boolean; origen: string }[];
}

export default function PedidosView() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/my-sit/deals")
      .then((r) => r.json())
      .then((data) => {
        setDeals(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 w-full">
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-zinc-900 animate-pulse"
            />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Mis pedidos
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          {deals.length} pedidos en total
        </p>
      </div>

      {deals.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 py-16 text-center">
          <p className="text-zinc-600">Aún no tienes pedidos</p>
        </div>
      ) : (
        <div className="space-y-3">
          {deals.map((deal) => {
            const mensajesNoLeidos = (deal.cotizacion_mensajes ?? []).filter(
              (m) => !m.leido && m.origen === "admin",
            ).length;

            return (
              <Link
                key={deal.id}
                href={`/my-sit/dashboard/pedidos/${deal.id}`}
                className="
                  flex items-center justify-between
                  rounded-2xl border border-zinc-800 bg-zinc-900 p-4
                  hover:border-zinc-700 transition-colors
                "
              >
                <div className="flex items-center gap-3">
                  {/* Badge mensajes no leídos */}
                  {mensajesNoLeidos > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#02AFFF] text-[10px] font-bold text-white">
                      {mensajesNoLeidos}
                    </span>
                  )}
                  <div>
                    <p className="font-medium text-zinc-200">
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
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`hidden sm:inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${DEAL_STATUS_COLORS[deal.status]}`}
                  >
                    {DEAL_STATUS_LABELS[deal.status]}
                  </span>
                  <p className="font-bold text-zinc-100">
                    {formatMXN(deal.total)}
                  </p>
                  <svg
                    className="h-4 w-4 text-zinc-700"
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
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
