"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Deal,
  DealStatus,
  DealMensaje,
  DealEvento,
  DealPago,
  DealLinea,
  DEAL_STATUS_LABELS,
  DEAL_STATUS_COLORS,
  ALL_DEAL_STATUSES,
  esStatusTerminal,
  puedeVolverADiagnostico,
  puedeEditarTotal,
} from "@/modules/admin/store/domain/entities/deal.entity";
import { formatMXN } from "@/core/helpers/precio.utils";
import {
  descargarCotizacion,
  descargarOrden,
} from "@/core/helpers/pdf/cotizacion.pdf";
import { LineaCarrito } from "@/modules/admin/store/presentation/store/carrito.store";
import { CuponValido } from "@/app/api/cupones/validar/route";
import { Product } from "@/modules/admin/store/domain/entities/product.entity";

// Adapta una partida ya guardada (DealLinea) a la forma que usa el
// generador de PDF (LineaCarrito), para reutilizar el mismo PDF que se
// genera desde el carrito.
function dealLineaToLineaCarrito(linea: DealLinea): LineaCarrito {
  const product: Product = {
    id: linea.producto_id,
    clave: linea.clave,
    codigoFabricante: null,
    descripcion: linea.descripcion,
    marca: linea.marca,
    principal: "",
    grupo: "",
    garantia: "N/A",
    clase: "",
    requiereSerie: false,
    imagen: null,
    brandImage: null,
    precio: linea.precio_unitario,
    moneda: "Pesos",
    disponible: 0,
    disponibleCD: 0,
    fechaSync: null,
  };

  return {
    product,
    precioFinal: linea.precio_unitario,
    precioEditable: false,
    cantidad: linea.cantidad,
    subtotal: Math.round(linea.precio_unitario * linea.cantidad * 100) / 100,
    descuento: linea.descuento,
    total: linea.total,
    cupon: linea.cupon as CuponValido | null,
    detalleServicio: linea.detalle,
  };
}

function StatusBadge({ status }: { status: DealStatus }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${DEAL_STATUS_COLORS[status]}`}
    >
      {DEAL_STATUS_LABELS[status]}
    </span>
  );
}

export function DealDetail({ deal: initial }: { deal: Deal }) {
  const router = useRouter();
  const [deal, setDeal] = useState<Deal>(initial);
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [nuevoEvento, setNuevoEvento] = useState("");
  const [agregandoEvento, setAgregandoEvento] = useState(false);
  const [nuevoConcepto, setNuevoConcepto] = useState("");
  const [nuevoMonto, setNuevoMonto] = useState("");
  const [registrandoPago, setRegistrandoPago] = useState(false);
  const [cambiando, setCambiando] = useState(false);
  const [nota, setNota] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNota, setShowNota] = useState(false);
  const [statusTarget, setStatusTarget] = useState<DealStatus | null>(null);
  const [editandoTotal, setEditandoTotal] = useState(false);
  const [nuevoTotal, setNuevoTotal] = useState("");
  const [guardandoTotal, setGuardandoTotal] = useState(false);
  const [editandoLineaId, setEditandoLineaId] = useState<string | null>(null);
  const [nuevoTotalLinea, setNuevoTotalLinea] = useState("");
  const [guardandoLinea, setGuardandoLinea] = useState(false);

  // Entre los status "activos" ya no es un flujo lineal: se puede cambiar
  // a cualquier otro. Pero "finalizado" y "cancelado" son de cierre —
  // una vez ahí, no hay más botones. Y "en_diagnostico" es de un solo
  // sentido: no se ofrece una vez que la orden ya generó número de orden.
  const esTerminal = esStatusTerminal(deal.status);
  const otrosStatus = esTerminal
    ? []
    : ALL_DEAL_STATUSES.filter(
        (s) =>
          s !== deal.status &&
          (s !== "en_diagnostico" || puedeVolverADiagnostico(deal.numero_orden)),
      );

  const totalEditable = puedeEditarTotal(deal.status);

  // ── Parte de pagos ──────────────────────────
  const pagos = deal.cotizacion_pagos ?? [];
  const totalPagado = pagos.reduce((acc, p) => acc + p.monto, 0);
  const restante = Math.max(0, Math.round((deal.total - totalPagado) * 100) / 100);

  const showFeedback = (msg: string, isError = false) => {
    if (isError) setError(msg);
    else setSuccess(msg);
    setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 3000);
  };

  // ── Cambiar status ────────────────────────
  const handleCambiarStatus = async (nuevoStatus: DealStatus) => {
    setCambiando(true);
    setError(null);

    try {
      const res = await fetch(`/api/deals/${deal.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nuevoStatus, nota: nota || undefined }),
      });
      const { evento, ...data } = await res.json();

      if (!res.ok) {
        showFeedback(data.error ?? "Error al cambiar status", true);
        return;
      }

      setDeal((prev) => ({
        ...prev,
        ...data,
        // Aparece de inmediato en la línea de tiempo, sin recargar.
        cotizacion_eventos: evento
          ? [...(prev.cotizacion_eventos ?? []), evento as DealEvento]
          : prev.cotizacion_eventos,
      }));
      setStatusTarget(null);
      setNota("");
      setShowNota(false);
      showFeedback(`Status actualizado a "${DEAL_STATUS_LABELS[nuevoStatus]}"`);
    } catch {
      showFeedback("Error de conexión", true);
    } finally {
      setCambiando(false);
    }
  };

  // ── Enviar mensaje ────────────────────────
  const handleEnviarMensaje = async () => {
    if (!mensaje.trim()) return;
    setEnviando(true);

    try {
      const res = await fetch(`/api/deals/${deal.id}/mensajes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenido: mensaje, origen: "admin" }),
      });
      const data = await res.json();

      if (!res.ok) {
        showFeedback(data.error ?? "Error al enviar", true);
        return;
      }

      setDeal((prev) => ({
        ...prev,
        cotizacion_mensajes: [
          ...(prev.cotizacion_mensajes ?? []),
          data as DealMensaje,
        ],
      }));
      setMensaje("");
      showFeedback("Mensaje enviado");
    } catch {
      showFeedback("Error de conexión", true);
    } finally {
      setEnviando(false);
    }
  };

  // ── Agregar evento a la línea de tiempo ───
  const handleAgregarEvento = async () => {
    if (!nuevoEvento.trim()) return;
    setAgregandoEvento(true);

    try {
      const res = await fetch(`/api/deals/${deal.id}/eventos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: nuevoEvento }),
      });
      const data = await res.json();

      if (!res.ok) {
        showFeedback(data.error ?? "Error al agregar el evento", true);
        return;
      }

      setDeal((prev) => ({
        ...prev,
        cotizacion_eventos: [
          ...(prev.cotizacion_eventos ?? []),
          data as DealEvento,
        ],
      }));
      setNuevoEvento("");
      showFeedback("Evento agregado");
    } catch {
      showFeedback("Error de conexión", true);
    } finally {
      setAgregandoEvento(false);
    }
  };

  // ── Registrar pago ─────────────────────────
  const handleRegistrarPago = async () => {
    if (!nuevoConcepto.trim() || !nuevoMonto) return;
    setRegistrandoPago(true);

    try {
      const res = await fetch(`/api/deals/${deal.id}/pagos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concepto: nuevoConcepto, monto: nuevoMonto }),
      });
      const data = await res.json();

      if (!res.ok) {
        showFeedback(data.error ?? "Error al registrar el pago", true);
        return;
      }

      setDeal((prev) => ({
        ...prev,
        cotizacion_pagos: [...(prev.cotizacion_pagos ?? []), data as DealPago],
      }));
      setNuevoConcepto("");
      setNuevoMonto("");
      showFeedback("Pago registrado");
    } catch {
      showFeedback("Error de conexión", true);
    } finally {
      setRegistrandoPago(false);
    }
  };

  // ── Modificar total (solo en diagnóstico) ──
  const handleActualizarTotal = async () => {
    if (nuevoTotal === "") return;
    setGuardandoTotal(true);
    setError(null);

    try {
      const res = await fetch(`/api/deals/${deal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total: nuevoTotal }),
      });
      const data = await res.json();

      if (!res.ok) {
        showFeedback(data.error ?? "Error al actualizar el total", true);
        return;
      }

      setDeal((prev) => ({ ...prev, ...data }));
      setEditandoTotal(false);
      setNuevoTotal("");
      showFeedback("Total actualizado");
    } catch {
      showFeedback("Error de conexión", true);
    } finally {
      setGuardandoTotal(false);
    }
  };

  // ── Editar precio de una partida (producto o servicio) ──
  const handleGuardarLinea = async (lineaId: string) => {
    if (nuevoTotalLinea === "") return;
    setGuardandoLinea(true);
    setError(null);

    try {
      const res = await fetch(`/api/deals/${deal.id}/lineas/${lineaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total: nuevoTotalLinea }),
      });
      const data = await res.json();

      if (!res.ok) {
        showFeedback(data.error ?? "Error al actualizar la partida", true);
        return;
      }

      setDeal((prev) => ({
        ...prev,
        ...data.cotizacion,
        cotizacion_lineas: (prev.cotizacion_lineas ?? []).map((l) =>
          l.id === lineaId ? { ...l, ...data.linea } : l,
        ),
      }));
      setEditandoLineaId(null);
      setNuevoTotalLinea("");
      showFeedback("Precio actualizado");
    } catch {
      showFeedback("Error de conexión", true);
    } finally {
      setGuardandoLinea(false);
    }
  };

  // ── Generar PDF (mismo formato que desde el carrito) ──
  const handleGenerarPDF = (tipo: "cotizacion" | "orden") => {
    const lineasPdf = (deal.cotizacion_lineas ?? []).map(
      dealLineaToLineaCarrito,
    );
    // `deal.descuento` combina el descuento de líneas + el cupón global;
    // separamos restando lo que ya sabemos que corresponde a las líneas.
    const descLineas = lineasPdf.reduce((acc, l) => acc + l.descuento, 0);
    const descGlobal = Math.max(
      0,
      Math.round((deal.descuento - descLineas) * 100) / 100,
    );
    const cuponGlobal = deal.cupon_global as CuponValido | null;

    if (tipo === "cotizacion") {
      descargarCotizacion(
        deal.cliente_nombre,
        lineasPdf,
        cuponGlobal,
        deal.subtotal,
        descLineas,
        descGlobal,
        deal.total,
      );
    } else {
      descargarOrden(
        deal.cliente_nombre,
        lineasPdf,
        cuponGlobal,
        deal.subtotal,
        descLineas,
        descGlobal,
        deal.total,
        deal.numero_orden ?? undefined,
      );
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 w-full">
      {/* Feedback */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          {success}
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <button
            onClick={() => router.push("/admin/dashboard/store/deals")}
            className="mb-2 flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
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
            Tratos
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            {deal.numero_orden ?? "Cotización"}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {new Date(deal.created_at).toLocaleDateString("es-MX", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <StatusBadge status={deal.status} />
          <div className="flex gap-2">
            <button
              onClick={() => handleGenerarPDF("cotizacion")}
              className="rounded-xl border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors"
            >
              PDF cotización
            </button>
            <button
              onClick={() => handleGenerarPDF("orden")}
              className="rounded-xl bg-[#02AFFF]/10 border border-[#02AFFF]/30 px-3 py-1.5 text-xs text-[#02AFFF] hover:bg-[#02AFFF]/20 transition-colors"
            >
              PDF orden
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Columna izquierda — info + líneas */}
        <div className="lg:col-span-2 space-y-4">
          {/* Info cliente */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Cliente
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#02AFFF]/20 text-sm font-bold text-[#02AFFF]">
                {deal.cliente_nombre[0]}
              </div>
              <div>
                <p className="font-medium text-zinc-200">
                  {deal.cliente_nombre}
                </p>
                {deal.clientes && (
                  <>
                    <p className="text-xs text-zinc-500">
                      {deal.clientes.email}
                    </p>
                    {deal.clientes.empresa && (
                      <p className="text-xs text-zinc-600">
                        {deal.clientes.empresa}
                      </p>
                    )}
                    {deal.clientes.telefono && (
                      <p className="text-xs text-zinc-600">
                        {deal.clientes.telefono}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Líneas de productos */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className="border-b border-zinc-800 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Productos
              </p>
            </div>

            {/* Desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950">
                    {["Descripción", "Cant.", "P. Unit.", "Desc.", "Total"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs text-zinc-600"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {(deal.cotizacion_lineas ?? []).map((linea) => (
                    <tr key={linea.id} className="hover:bg-zinc-800/30">
                      <td className="px-4 py-3">
                        <p className="font-medium text-zinc-200 text-xs">
                          {linea.descripcion}
                        </p>
                        {linea.detalle && (
                          <p className="mt-0.5 text-zinc-500 text-xs italic">
                            {linea.detalle}
                          </p>
                        )}
                        <p className="text-zinc-600 text-xs">
                          {linea.clave} · {linea.marca}
                        </p>
                        {linea.cupon && (
                          <span className="mt-0.5 inline-block rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-400">
                            Cupón: {linea.cupon.codigo}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-zinc-400 text-xs">
                        {linea.cantidad}
                      </td>
                      <td className="px-4 py-3 text-zinc-400 text-xs">
                        {formatMXN(linea.precio_unitario)}
                      </td>
                      <td className="px-4 py-3 text-emerald-400 text-xs">
                        {linea.descuento > 0
                          ? `- ${formatMXN(linea.descuento)}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3 font-bold text-zinc-100 text-xs">
                        {editandoLineaId === linea.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min={0}
                              value={nuevoTotalLinea}
                              onChange={(e) =>
                                setNuevoTotalLinea(e.target.value)
                              }
                              autoFocus
                              className="w-20 input-dark text-xs font-normal"
                            />
                            <button
                              onClick={() => handleGuardarLinea(linea.id)}
                              disabled={guardandoLinea || nuevoTotalLinea === ""}
                              className="text-emerald-400 hover:text-emerald-300 disabled:opacity-40"
                              title="Guardar"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setEditandoLineaId(null)}
                              className="text-zinc-500 hover:text-zinc-300"
                              title="Cancelar"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {formatMXN(linea.total)}
                            {!esTerminal && (
                              <button
                                onClick={() => {
                                  setEditandoLineaId(linea.id);
                                  setNuevoTotalLinea(String(linea.total));
                                }}
                                className="font-normal text-[10px] text-zinc-600 hover:text-zinc-300 transition-colors"
                                title="Cambiar precio"
                              >
                                Editar
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="sm:hidden divide-y divide-zinc-800">
              {(deal.cotizacion_lineas ?? []).map((linea) => (
                <div key={linea.id} className="p-4">
                  <p className="text-sm font-medium text-zinc-200">
                    {linea.descripcion}
                  </p>
                  {linea.detalle && (
                    <p className="text-xs text-zinc-500 italic mt-0.5">
                      {linea.detalle}
                    </p>
                  )}
                  <p className="text-xs text-zinc-600 mt-0.5">
                    {linea.clave} · {linea.marca}
                  </p>
                  <div className="mt-2 flex justify-between items-center text-xs">
                    <span className="text-zinc-500">
                      {linea.cantidad} × {formatMXN(linea.precio_unitario)}
                    </span>
                    {editandoLineaId === linea.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={0}
                          value={nuevoTotalLinea}
                          onChange={(e) => setNuevoTotalLinea(e.target.value)}
                          autoFocus
                          className="w-20 input-dark text-xs font-normal"
                        />
                        <button
                          onClick={() => handleGuardarLinea(linea.id)}
                          disabled={guardandoLinea || nuevoTotalLinea === ""}
                          className="text-emerald-400 hover:text-emerald-300 disabled:opacity-40"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setEditandoLineaId(null)}
                          className="text-zinc-500 hover:text-zinc-300"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span className="font-bold text-zinc-100">
                          {formatMXN(linea.total)}
                        </span>
                        {!esTerminal && (
                          <button
                            onClick={() => {
                              setEditandoLineaId(linea.id);
                              setNuevoTotalLinea(String(linea.total));
                            }}
                            className="text-[10px] text-zinc-600 hover:text-zinc-300 transition-colors"
                          >
                            Editar
                          </button>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Línea de tiempo */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className="border-b border-zinc-800 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Línea de tiempo
              </p>
            </div>

            <div className="p-5">
              <ol className="space-y-5">
                {/* Ancla: creación de la orden */}
                <li className="relative pl-6">
                  <span className="absolute left-0 top-1 h-2.5 w-2.5 rounded-full bg-zinc-600" />
                  {(deal.cotizacion_eventos ?? []).length > 0 && (
                    <span className="absolute left-[4.5px] top-4 bottom-[-20px] w-px bg-zinc-800" />
                  )}
                  <p className="text-sm text-zinc-300">Orden creada</p>
                  <p className="text-xs text-zinc-600">
                    {new Date(deal.created_at).toLocaleString("es-MX", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </li>

                {/* Eventos manuales */}
                {(deal.cotizacion_eventos ?? []).map((evento, i, arr) => (
                  <li key={evento.id} className="relative pl-6">
                    <span className="absolute left-0 top-1 h-2.5 w-2.5 rounded-full bg-[#02AFFF]" />
                    {i < arr.length - 1 && (
                      <span className="absolute left-[4.5px] top-4 bottom-[-20px] w-px bg-zinc-800" />
                    )}
                    <p className="text-sm text-zinc-200">{evento.texto}</p>
                    <p className="text-xs text-zinc-600">
                      {new Date(evento.created_at).toLocaleString("es-MX", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Input nuevo evento */}
            <div className="border-t border-zinc-800 p-4 flex gap-2">
              <input
                type="text"
                value={nuevoEvento}
                onChange={(e) => setNuevoEvento(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAgregarEvento()}
                placeholder="Ej: En espera de piezas, piezas instaladas..."
                className="flex-1 input-dark text-sm"
              />
              <button
                onClick={handleAgregarEvento}
                disabled={agregandoEvento || !nuevoEvento.trim()}
                className="
                  rounded-xl bg-[#02AFFF] px-4 py-2 text-sm font-medium text-white
                  hover:bg-[#1961B0] transition-colors
                  disabled:opacity-40 disabled:cursor-not-allowed
                "
              >
                {agregandoEvento ? "..." : "Agregar"}
              </button>
            </div>
          </div>

          {/* Pagos */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className="border-b border-zinc-800 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Pagos
              </p>
            </div>

            {/* Resumen: total / pagado / restante */}
            <div className="grid grid-cols-3 divide-x divide-zinc-800 border-b border-zinc-800">
              <div className="px-4 py-3 text-center">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600">
                  Total
                </p>
                <p className="mt-0.5 text-sm font-bold text-zinc-200">
                  {formatMXN(deal.total)}
                </p>
              </div>
              <div className="px-4 py-3 text-center">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600">
                  Pagado
                </p>
                <p className="mt-0.5 text-sm font-bold text-emerald-400">
                  {formatMXN(totalPagado)}
                </p>
              </div>
              <div className="px-4 py-3 text-center">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600">
                  Restante
                </p>
                <p
                  className={`mt-0.5 text-sm font-bold ${restante > 0 ? "text-amber-400" : "text-zinc-500"}`}
                >
                  {formatMXN(restante)}
                </p>
              </div>
            </div>

            {/* Línea de tiempo de pagos */}
            <div className="p-5">
              {pagos.length === 0 ? (
                <p className="text-center text-xs text-zinc-600 py-2">
                  Sin pagos registrados
                </p>
              ) : (
                <ol className="space-y-5">
                  {pagos.map((pago, i) => {
                    const restanteEnEsePago = Math.max(
                      0,
                      Math.round(
                        (deal.total -
                          pagos
                            .slice(0, i + 1)
                            .reduce((acc, p) => acc + p.monto, 0)) *
                          100,
                      ) / 100,
                    );
                    return (
                      <li key={pago.id} className="relative pl-6">
                        <span className="absolute left-0 top-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        {i < pagos.length - 1 && (
                          <span className="absolute left-[4.5px] top-4 bottom-[-20px] w-px bg-zinc-800" />
                        )}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm text-zinc-200">
                              {pago.concepto}
                            </p>
                            <p className="text-xs text-zinc-600">
                              {new Date(pago.created_at).toLocaleString(
                                "es-MX",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-emerald-400">
                              + {formatMXN(pago.monto)}
                            </p>
                            <p className="text-[10px] text-zinc-600">
                              Restante: {formatMXN(restanteEnEsePago)}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>

            {/* Registrar nuevo pago */}
            <div className="border-t border-zinc-800 p-4 space-y-2">
              {restante <= 0 ? (
                <p className="text-center text-xs text-zinc-600">
                  Ya no hay saldo pendiente
                </p>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={nuevoConcepto}
                      onChange={(e) => setNuevoConcepto(e.target.value)}
                      placeholder="Concepto (ej. Anticipo)"
                      className="flex-1 input-dark text-sm"
                    />
                    <input
                      type="number"
                      min={0}
                      max={restante}
                      value={nuevoMonto}
                      onChange={(e) => setNuevoMonto(e.target.value)}
                      placeholder={`$ (máx. ${restante.toFixed(2)})`}
                      className="w-36 input-dark text-sm"
                    />
                  </div>
                  <button
                    onClick={handleRegistrarPago}
                    disabled={
                      registrandoPago || !nuevoConcepto.trim() || !nuevoMonto
                    }
                    className="
                      w-full rounded-xl bg-[#02AFFF] py-2 text-sm font-medium text-white
                      hover:bg-[#1961B0] transition-colors
                      disabled:opacity-40 disabled:cursor-not-allowed
                    "
                  >
                    {registrandoPago ? "Registrando..." : "Registrar pago"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mensajes */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className="border-b border-zinc-800 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Mensajes
              </p>
            </div>

            <div className="p-4 space-y-3 max-h-72 overflow-y-auto [&::-webkit-scrollbar]:hidden">
              {(deal.cotizacion_mensajes ?? []).length === 0 ? (
                <p className="text-center text-xs text-zinc-600 py-4">
                  Sin mensajes
                </p>
              ) : (
                (deal.cotizacion_mensajes ?? []).map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.origen === "admin" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`
                      max-w-[80%] rounded-2xl px-4 py-2.5 text-sm
                      ${
                        msg.origen === "admin"
                          ? "bg-[#02AFFF]/10 text-zinc-200 rounded-tr-sm"
                          : "bg-zinc-800 text-zinc-300 rounded-tl-sm"
                      }
                    `}
                    >
                      <p>{msg.contenido}</p>
                      <p className="mt-1 text-[10px] text-zinc-600">
                        {msg.origen === "admin" ? "Tú" : deal.cliente_nombre} ·{" "}
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

            {/* Input mensaje */}
            <div className="border-t border-zinc-800 p-4 flex gap-2">
              <input
                type="text"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEnviarMensaje()}
                placeholder="Escribe un mensaje al cliente..."
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

        {/* Columna derecha — resumen + acciones */}
        <div className="space-y-4">
          {/* Resumen financiero */}
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
            <div className="border-t border-zinc-800 pt-2 flex justify-between items-center font-bold text-zinc-100">
              <span>Total</span>
              {!editandoTotal && (
                <span className="flex items-center gap-2">
                  <span className="text-lg">{formatMXN(deal.total)}</span>
                  {totalEditable && (
                    <button
                      onClick={() => {
                        setEditandoTotal(true);
                        setNuevoTotal(String(deal.total));
                      }}
                      className="rounded-lg border border-zinc-700 px-2 py-1 text-[10px] font-normal text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      Editar
                    </button>
                  )}
                </span>
              )}
            </div>

            {/* Edición de total — solo mientras está en diagnóstico */}
            {totalEditable && editandoTotal && (
              <div className="space-y-2 pt-1">
                <p className="text-xs font-normal text-zinc-500">
                  Aún se está diagnosticando el equipo — puedes ajustar el
                  total las veces que haga falta.
                </p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    value={nuevoTotal}
                    onChange={(e) => setNuevoTotal(e.target.value)}
                    placeholder="0.00"
                    className="flex-1 input-dark text-sm font-normal"
                  />
                  <button
                    onClick={handleActualizarTotal}
                    disabled={guardandoTotal || nuevoTotal === ""}
                    className="rounded-lg bg-[#02AFFF] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1961B0] transition-colors disabled:opacity-40"
                  >
                    {guardandoTotal ? "..." : "Guardar"}
                  </button>
                  <button
                    onClick={() => {
                      setEditandoTotal(false);
                      setNuevoTotal("");
                    }}
                    className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-normal text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {totalEditable && !editandoTotal && (
              <p className="text-[10px] font-normal text-zinc-600">
                En diagnóstico: el total se puede ajustar hasta que se
                conozca el costo final.
              </p>
            )}

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
            {deal.cupon_global && (
              <div className="rounded-lg bg-emerald-500/10 px-3 py-2 mt-1">
                <p className="text-xs text-emerald-400">
                  Cupón:{" "}
                  <span className="font-bold">{deal.cupon_global.codigo}</span>
                </p>
              </div>
            )}
          </div>

          {/* Entrega */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Entrega
            </p>
            {deal.direccion_entrega ? (
              <p className="text-sm text-zinc-300">
                {deal.direccion_entrega.etiqueta} —{" "}
                {deal.direccion_entrega.calle}
                {deal.direccion_entrega.numero_ext
                  ? ` ${deal.direccion_entrega.numero_ext}`
                  : ""}
                {deal.direccion_entrega.colonia
                  ? `, ${deal.direccion_entrega.colonia}`
                  : ""}
                {deal.direccion_entrega.ciudad
                  ? `, ${deal.direccion_entrega.ciudad}`
                  : ""}
              </p>
            ) : (
              <p className="text-sm text-zinc-600">Sin dirección asignada</p>
            )}
            <p className="text-xs text-zinc-600">
              Fecha de entrega:{" "}
              <span className="text-zinc-300">
                {deal.fecha_entrega
                  ? new Date(deal.fecha_entrega).toLocaleDateString("es-MX", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "Sin fecha definida"}
              </span>
            </p>
          </div>

          {/* Expiración */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-xs text-zinc-600">Válida hasta</p>
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

          {/* Cambiar status — entre los "activos" se puede pasar a
              cualquier otro; finalizado/cancelado son de cierre */}
          {esTerminal ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-center">
              <p className="text-xs text-zinc-600">
                {deal.status === "finalizado"
                  ? "Este trato ha sido finalizado y ya no puede cambiar de status"
                  : "Este trato fue cancelado y ya no puede cambiar de status"}
              </p>
            </div>
          ) : (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Cambiar status
            </p>

            {otrosStatus.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusTarget(s);
                  setShowNota(true);
                }}
                className={`
                  w-full rounded-xl border px-4 py-2.5 text-sm font-medium
                  transition-colors text-left
                  ${DEAL_STATUS_COLORS[s].replace("bg-", "border-").replace("/10", "/30")}
                  ${DEAL_STATUS_COLORS[s]}
                  hover:opacity-80
                `}
              >
                → {DEAL_STATUS_LABELS[s]}
              </button>
            ))}

            {/* Nota opcional */}
            {showNota && statusTarget && (
              <div className="space-y-2 pt-1">
                <p className="text-xs text-zinc-500">
                  Nota para el cliente (opcional)
                </p>
                <textarea
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  placeholder="Ej: Tu pedido está listo para recoger..."
                  rows={3}
                  className="input-dark w-full text-sm resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCambiarStatus(statusTarget)}
                    disabled={cambiando}
                    className="flex-1 rounded-xl bg-[#02AFFF] py-2.5 text-sm font-medium text-white hover:bg-[#1961B0] transition-colors disabled:opacity-40"
                  >
                    {cambiando ? "Actualizando..." : "Confirmar"}
                  </button>
                  <button
                    onClick={() => {
                      setShowNota(false);
                      setStatusTarget(null);
                      setNota("");
                    }}
                    className="rounded-xl border border-zinc-700 px-4 py-2.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
          )}
        </div>
      </div>
    </main>
  );
}
