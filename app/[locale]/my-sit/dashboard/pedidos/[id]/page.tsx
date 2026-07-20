"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { formatMXN } from "@/core/helpers/precio.utils";
import {
  DealStatus,
  DEAL_STATUS_LABELS,
  DEAL_STATUS_COLORS,
  DealLinea,
  DealMensaje,
} from "@/modules/admin/store/domain/entities/deal.entity";

interface DealDetalle {
  id: string;
  numero_orden: string | null;
  status: DealStatus;
  subtotal: number;
  descuento: number;
  cashback_canjeado: number;
  cashback_ganado: number;
  total: number;
  expira_at: string;
  created_at: string;
  cotizacion_lineas: DealLinea[];
  cotizacion_mensajes: DealMensaje[];
}

export default function PedidoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [deal, setDeal] = useState<DealDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/my-sit/deals`)
      .then((r) => r.json())
      .then((data: DealDetalle[]) => {
        const found = data.find((d) => d.id === id);
        setDeal(found ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleEnviarMensaje = async () => {
    if (!mensaje.trim()) return;
    setEnviando(true);
    setError(null);

    try {
      const res = await fetch(`/api/my-sit/deals/${id}/mensajes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenido: mensaje }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al enviar");
        return;
      }

      setDeal((prev) =>
        prev
          ? {
              ...prev,
              cotizacion_mensajes: [
                ...prev.cotizacion_mensajes,
                data as DealMensaje,
              ],
            }
          : prev,
      );
      setMensaje("");
    } catch {
      setError("Error de conexión");
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="h-96 rounded-2xl bg-zinc-900 animate-pulse" />
      </main>
    );
  }

  if (!deal) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <p className="text-zinc-600">Pedido no encontrado</p>
        <Link
          href="/my-sit/dashboard/pedidos"
          className="text-[#02AFFF] text-sm hover:underline mt-2 block"
        >
          ← Volver a mis pedidos
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/my-sit/dashboard/pedidos"
          className="mb-2 flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 transition-colors w-fit"
        >
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Mis pedidos
        </Link>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-zinc-100">
              {deal.numero_orden ?? "Cotización"}
            </h1>
            <p className="text-xs text-zinc-600 mt-0.5">
              {new Date(deal.created_at).toLocaleDateString("es-MX", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium shrink-0 ${DEAL_STATUS_COLORS[deal.status]}`}
          >
            {DEAL_STATUS_LABELS[deal.status]}
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Productos + mensajes */}
        <div className="lg:col-span-2 space-y-4">
          {/* Productos */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className="border-b border-zinc-800 px-5 py-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Productos
              </p>
            </div>
            <div className="divide-y divide-zinc-800">
              {deal.cotizacion_lineas.map((linea) => (
                <div
                  key={linea.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-200 truncate">
                      {linea.descripcion}
                    </p>
                    <p className="text-xs text-zinc-600">
                      {linea.marca} · {linea.cantidad} uds.
                    </p>
                  </div>
                  <p className="text-sm font-bold text-zinc-100 shrink-0 ml-3">
                    {formatMXN(linea.total)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mensajes */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className="border-b border-zinc-800 px-5 py-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Mensajes
              </p>
            </div>

            <div className="p-4 space-y-3 max-h-64 overflow-y-auto [&::-webkit-scrollbar]:hidden">
              {deal.cotizacion_mensajes.length === 0 ? (
                <p className="text-center text-xs text-zinc-600 py-4">
                  Sin mensajes
                </p>
              ) : (
                deal.cotizacion_mensajes.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.origen === "cliente" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`
                      max-w-[80%] rounded-2xl px-4 py-2.5 text-sm
                      ${
                        msg.origen === "cliente"
                          ? "bg-[#02AFFF]/10 text-zinc-200 rounded-tr-sm"
                          : "bg-zinc-800 text-zinc-300 rounded-tl-sm"
                      }
                    `}
                    >
                      <p>{msg.contenido}</p>
                      <p className="mt-1 text-[10px] text-zinc-600">
                        {msg.origen === "cliente" ? "Tú" : "Sit+"} ·{" "}
                        {new Date(msg.created_at).toLocaleTimeString("es-MX", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {error && <p className="px-4 pb-2 text-xs text-red-400">{error}</p>}

            <div className="border-t border-zinc-800 p-4 flex gap-2">
              <input
                type="text"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEnviarMensaje()}
                placeholder="Escribe un mensaje a Sit+..."
                className="flex-1 input-dark text-sm"
              />
              <button
                onClick={handleEnviarMensaje}
                disabled={enviando || !mensaje.trim()}
                className="
                  rounded-xl bg-[#02AFFF] px-4 py-2 text-sm font-medium text-white
                  hover:bg-[#1961B0] transition-colors
                  disabled:opacity-40 disabled:cursor-not-allowed
                "
              >
                {enviando ? "..." : "Enviar"}
              </button>
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 space-y-2">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Resumen
            </p>
            <div className="flex justify-between text-sm text-zinc-400">
              <span>Subtotal</span>
              <span>{formatMXN(deal.subtotal)}</span>
            </div>
            {deal.descuento > 0 && (
              <div className="flex justify-between text-sm text-emerald-400">
                <span>Descuento</span>
                <span>- {formatMXN(deal.descuento)}</span>
              </div>
            )}
            {deal.cashback_canjeado > 0 && (
              <div className="flex justify-between text-sm text-purple-400">
                <span>Cashback canjeado</span>
                <span>- {formatMXN(deal.cashback_canjeado)}</span>
              </div>
            )}
            <div className="border-t border-zinc-800 pt-2 flex justify-between font-bold text-zinc-100">
              <span>Total</span>
              <span className="text-lg">{formatMXN(deal.total)}</span>
            </div>
            {deal.cashback_ganado > 0 && (
              <div className="rounded-lg bg-purple-500/10 px-3 py-2 text-center mt-2">
                <p className="text-xs text-purple-400">
                  Cashback ganado:{" "}
                  <span className="font-bold">
                    {formatMXN(deal.cashback_ganado)}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Válido hasta */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-xs text-zinc-600">Válido hasta</p>
            <p
              className={`mt-1 text-sm font-medium ${
                new Date(deal.expira_at) < new Date()
                  ? "text-red-400"
                  : "text-zinc-300"
              }`}
            >
              {new Date(deal.expira_at).toLocaleDateString("es-MX", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
