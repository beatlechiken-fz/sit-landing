"use client";

import { useEffect, useState } from "react";
import { formatMXN } from "@/core/helpers/precio.utils";

interface CashbackItem {
  id: string;
  monto: number;
  tipo: "ganado" | "usado";
  created_at: string;
  cotizaciones?: { numero_orden: string | null };
}

interface CuponItem {
  id: string;
  usado: boolean;
  usado_at: string | null;
  created_at: string;
  cupones: {
    codigo: string;
    descuento: number;
    tipo: "porcentaje" | "fijo";
    expira_at: string | null;
    activo: boolean;
  };
}

interface Beneficios {
  cashback: {
    disponible: number;
    ganado: number;
    usado: number;
    historial: CashbackItem[];
  };
  cupones: CuponItem[];
}

export default function BeneficiosView() {
  const [data, setData] = useState<Beneficios | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"cashback" | "cupones">("cashback");

  useEffect(() => {
    fetch("/api/my-sit/dashboard/beneficios")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 space-y-4 w-full">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-zinc-900 animate-pulse" />
        ))}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Mis beneficios
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Tu cashback acumulado y cupones disponibles
        </p>
      </div>

      {/* Stats cashback */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        {[
          {
            label: "Disponible",
            value: formatMXN(data?.cashback.disponible ?? 0),
            color: "text-purple-400",
            bg: "border-purple-500/20 bg-purple-500/5",
          },
          {
            label: "Total ganado",
            value: formatMXN(data?.cashback.ganado ?? 0),
            color: "text-emerald-400",
            bg: "border-emerald-500/20 bg-emerald-500/5",
          },
          {
            label: "Total usado",
            value: formatMXN(data?.cashback.usado ?? 0),
            color: "text-zinc-400",
            bg: "border-zinc-700 bg-zinc-900",
          },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`rounded-2xl border p-5 ${bg}`}>
            <p className="text-xs text-zinc-500 uppercase tracking-widest">
              {label}
            </p>
            <p className={`mt-2 text-xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-xl border border-zinc-800 bg-zinc-900 p-1 w-fit">
        {[
          { key: "cashback", label: "Cashback" },
          { key: "cupones", label: "Cupones" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key as "cashback" | "cupones")}
            className={`
              rounded-lg px-4 py-2 text-sm font-medium transition-colors
              ${
                tab === key
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300"
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab cashback */}
      {tab === "cashback" && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
          {(data?.cashback.historial ?? []).length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-zinc-600 text-sm">
                Sin movimientos de cashback
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {data?.cashback.historial.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-200">
                      {item.tipo === "ganado"
                        ? "Cashback ganado"
                        : "Cashback canjeado"}
                    </p>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      {item.cotizaciones?.numero_orden ?? "Sin orden"} ·{" "}
                      {new Date(item.created_at).toLocaleDateString("es-MX", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      item.tipo === "ganado"
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {item.tipo === "ganado" ? "+" : "-"}
                    {formatMXN(item.monto)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab cupones */}
      {tab === "cupones" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(data?.cupones ?? []).length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 py-12 text-center sm:col-span-2 lg:col-span-3">
              <p className="text-zinc-600 text-sm">
                No tienes cupones asignados
              </p>
            </div>
          ) : (
            data?.cupones.map((item) => {
              const expirado = item.cupones.expira_at
                ? new Date(item.cupones.expira_at) < new Date()
                : false;
              const valido = !item.usado && !expirado && item.cupones.activo;

              return (
                <div
                  key={item.id}
                  className={`
                    rounded-2xl border p-5
                    ${
                      valido
                        ? "border-emerald-500/20 bg-emerald-500/5"
                        : "border-zinc-800 bg-zinc-900 opacity-60"
                    }
                  `}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-mono font-bold text-zinc-100">
                          {item.cupones.codigo}
                        </p>
                        {valido ? (
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                            Disponible
                          </span>
                        ) : item.usado ? (
                          <span className="rounded-full bg-zinc-700 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                            Usado
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-400">
                            Expirado
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-zinc-400">
                        {item.cupones.tipo === "porcentaje"
                          ? `${item.cupones.descuento}% de descuento`
                          : `${formatMXN(item.cupones.descuento)} de descuento`}
                      </p>
                      {item.cupones.expira_at && (
                        <p className="mt-1 text-xs text-zinc-600">
                          Expira:{" "}
                          {new Date(item.cupones.expira_at).toLocaleDateString(
                            "es-MX",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      )}
                      {item.usado && item.usado_at && (
                        <p className="mt-1 text-xs text-zinc-600">
                          Usado el{" "}
                          {new Date(item.usado_at).toLocaleDateString("es-MX", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      )}
                    </div>

                    {/* Descuento destacado */}
                    <div
                      className={`
                      shrink-0 flex flex-col items-center justify-center
                      rounded-xl px-4 py-3
                      ${valido ? "bg-emerald-500/10" : "bg-zinc-800"}
                    `}
                    >
                      <p
                        className={`text-xl font-bold ${valido ? "text-emerald-400" : "text-zinc-600"}`}
                      >
                        {item.cupones.tipo === "porcentaje"
                          ? `${item.cupones.descuento}%`
                          : formatMXN(item.cupones.descuento)}
                      </p>
                      <p className="text-[10px] text-zinc-600 uppercase tracking-wide">
                        {item.cupones.tipo === "porcentaje"
                          ? "descuento"
                          : "de descuento"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </main>
  );
}
