"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useUIStore } from "../store/ui.store";
import { useCarritoStore } from "../store/carrito.store";
import { CuponInput } from "./CuponInput";
import {
  descargarCotizacion,
  descargarOrden,
} from "@/core/helpers/pdf/cotizacion.pdf";
import {
  formatMXN,
  esProductoGenerico,
  esServicioSinPrecio,
} from "@/core/helpers/precio.utils";
import { CuponValido } from "@/app/api/cupones/validar/route";
import { Cliente } from "@/modules/admin/store/domain/entities/cliente.entity";
import {
  Direccion,
  DireccionSnapshot,
} from "@/modules/admin/store/domain/entities/direccion.entity";
import { DatePicker } from "@/core/components/date-picker/DatePicker";

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────
interface ClienteSeleccionado {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  cashbackDisponible: number;
}

// ─────────────────────────────────────────────
// Subcomponente: Search de clientes
// ─────────────────────────────────────────────
function ClienteSearch({
  onSelect,
  onOtro,
}: {
  onSelect: (cliente: ClienteSeleccionado) => void;
  onOtro: () => void;
}) {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buscar = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResultados([]);
      setAbierto(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/clientes?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResultados(Array.isArray(data) ? data : []);
      setAbierto(true);
    } catch {
      setResultados([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => buscar(val), 300);
  };

  const handleSelect = async (cliente: Cliente) => {
    setAbierto(false);
    setQuery(`${cliente.nombre} ${cliente.apellido}`);
    setLoading(true);

    try {
      const res = await fetch(`/api/clientes/${cliente.id}/cashback`);
      const data = await res.json();
      onSelect({
        id: cliente.id,
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        email: cliente.email,
        cashbackDisponible: data.disponible ?? 0,
      });
    } catch {
      onSelect({
        id: cliente.id,
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        email: cliente.email,
        cashbackDisponible: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Buscar cliente por nombre o email..."
        className="input-dark w-full"
        onFocus={() => resultados.length > 0 && setAbierto(true)}
      />

      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <svg
            className="h-4 w-4 animate-spin text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        </div>
      )}

      {/* Dropdown resultados */}
      {abierto && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl overflow-hidden">
          {resultados.length === 0 ? (
            <p className="px-4 py-3 text-xs text-zinc-500">Sin resultados</p>
          ) : (
            resultados.slice(0, 5).map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelect(c)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800 transition-colors"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#02AFFF]/20 text-xs font-bold text-[#02AFFF]">
                  {c.nombre[0]}
                  {c.apellido[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">
                    {c.nombre} {c.apellido}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">{c.email}</p>
                </div>
              </button>
            ))
          )}

          {/* Opción Otro */}
          <button
            onClick={() => {
              setAbierto(false);
              onOtro();
            }}
            className="flex w-full items-center gap-3 border-t border-zinc-800 px-4 py-3 text-left hover:bg-zinc-800 transition-colors"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-xs font-bold text-zinc-400">
              ?
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-300">Otro cliente</p>
              <p className="text-xs text-zinc-600">Sin asociar a una cuenta</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// CartModal principal
// ─────────────────────────────────────────────
export function CartModal() {
  const { carritoAbierto, cerrarCarrito } = useUIStore();
  const {
    lineas,
    cuponGlobal,
    setCantidad,
    setPrecioEditable,
    setDescripcionLinea,
    eliminar,
    limpiar,
    aplicarCupon,
    quitarCupon,
    aplicarCuponGlobal,
    quitarCuponGlobal,
    subtotalCarrito,
    descuentoLineas,
    descuentoGlobal,
    totalCarrito,
  } = useCarritoStore();

  // Estado del cliente
  const [modoCliente, setModoCliente] = useState<
    "search" | "otro" | "seleccionado"
  >("search");
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<ClienteSeleccionado | null>(null);
  const [otroNombre, setOtroNombre] = useState("");

  // Cashback
  const [cashbackACanjear, setCashbackACanjear] = useState(0);
  const [canjeandoCashback, setCanjeandoCashback] = useState(false);

  // Entrega — dirección y fecha
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [direccionSeleccionadaId, setDireccionSeleccionadaId] = useState<
    string | null
  >(null);
  const [mostrarNuevaDireccion, setMostrarNuevaDireccion] = useState(false);
  const [nuevaDireccion, setNuevaDireccion] = useState({
    etiqueta: "Principal",
    calle: "",
    numero_ext: "",
    numero_int: "",
    colonia: "",
    ciudad: "",
    estado: "",
    cp: "",
    referencias: "",
  });
  const [guardandoDireccion, setGuardandoDireccion] = useState(false);
  const [fechaEntrega, setFechaEntrega] = useState("");

  // Estado general
  const [confirmarVaciar, setConfirmarVaciar] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState<string | null>(null);

  // Cierra con Escape y bloquea scroll
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrarCarrito();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = carritoAbierto ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [carritoAbierto, cerrarCarrito]);

  // Carga direcciones al seleccionar cliente
  useEffect(() => {
    if (!clienteSeleccionado) {
      setDirecciones([]);
      setDireccionSeleccionadaId(null);
      return;
    }

    fetch(`/api/clientes/${clienteSeleccionado.id}/direcciones`)
      .then((res) => res.json())
      .then((data: Direccion[]) => {
        setDirecciones(Array.isArray(data) ? data : []);
        const predeterminada = data.find((d) => d.predeterminada);
        setDireccionSeleccionadaId(predeterminada?.id ?? data[0]?.id ?? null);
      })
      .catch(() => setDirecciones([]));
  }, [clienteSeleccionado]);

  // ── Crear nueva dirección desde el carrito ─
  const handleCrearDireccion = async () => {
    if (!clienteSeleccionado || !nuevaDireccion.calle.trim()) return;
    setGuardandoDireccion(true);

    try {
      const res = await fetch(
        `/api/clientes/${clienteSeleccionado.id}/direcciones`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevaDireccion),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setErrorGuardar(data.error ?? "Error al crear dirección");
        return;
      }

      setDirecciones((prev) => [data, ...prev]);
      setDireccionSeleccionadaId(data.id);
      setMostrarNuevaDireccion(false);
      setNuevaDireccion({
        etiqueta: "Principal",
        calle: "",
        numero_ext: "",
        numero_int: "",
        colonia: "",
        ciudad: "",
        estado: "",
        cp: "",
        referencias: "",
      });
    } catch {
      setErrorGuardar("Error de conexión al crear la dirección");
    } finally {
      setGuardandoDireccion(false);
    }
  };

  const direccionSeleccionada =
    direcciones.find((d) => d.id === direccionSeleccionadaId) ?? null;

  // Totales
  const subtotal = subtotalCarrito();
  const descLineas = descuentoLineas();
  const descGlobal = descuentoGlobal();
  const totalSinCashback = totalCarrito();
  const cashbackValido = Math.min(
    cashbackACanjear,
    clienteSeleccionado?.cashbackDisponible ?? 0,
  );
  const total = Math.max(0, totalSinCashback - cashbackValido);
  const ahorro = descLineas + descGlobal + cashbackValido;

  // Nombre del cliente para el PDF
  const nombreCliente =
    modoCliente === "seleccionado" && clienteSeleccionado
      ? `${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido}`
      : modoCliente === "otro"
        ? otroNombre
        : "";

  const clienteValido = nombreCliente.trim().length >= 2;

  // ── Guardar cotización ────────────────────
  const guardarCotizacion = async () => {
    if (!clienteSeleccionado) return null;
    setGuardando(true);
    setErrorGuardar(null);

    const direccionSnapshot: DireccionSnapshot | null = direccionSeleccionada
      ? {
          etiqueta: direccionSeleccionada.etiqueta,
          calle: direccionSeleccionada.calle,
          numero_ext: direccionSeleccionada.numero_ext,
          numero_int: direccionSeleccionada.numero_int,
          colonia: direccionSeleccionada.colonia,
          ciudad: direccionSeleccionada.ciudad,
          estado: direccionSeleccionada.estado,
          cp: direccionSeleccionada.cp,
          referencias: direccionSeleccionada.referencias,
        }
      : null;

    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_id: clienteSeleccionado.id,
          cliente_nombre: nombreCliente,
          lineas,
          cupon_global: cuponGlobal,
          subtotal,
          descuento: descLineas + descGlobal,
          cashback_canjeado: cashbackValido,
          total,
          direccion_id: direccionSeleccionadaId,
          direccion_entrega: direccionSnapshot,
          fecha_entrega: fechaEntrega || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorGuardar(data.error ?? "Error al guardar");
        return null;
      }
      return data;
    } catch {
      setErrorGuardar("Error de conexión");
      return null;
    } finally {
      setGuardando(false);
    }
  };

  // ── Generar cotización ────────────────────
  const handleCotizacion = async () => {
    if (!clienteValido) return;

    // Si hay cliente seleccionado, guarda en BD
    if (modoCliente === "seleccionado") await guardarCotizacion();

    descargarCotizacion(
      nombreCliente,
      lineas,
      cuponGlobal,
      subtotal,
      descLineas,
      descGlobal,
      total,
    );
  };

  // ── Generar orden ─────────────────────────
  const handleOrden = async () => {
    if (!clienteValido) return;

    // Si hay cliente seleccionado, guarda y cambia status a en_proceso
    if (modoCliente === "seleccionado") {
      const cotizacion = await guardarCotizacion();
      if (cotizacion) {
        await fetch(`/api/deals/${cotizacion.id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "en_proceso" }),
        });
      }
    }

    descargarOrden(
      nombreCliente,
      lineas,
      cuponGlobal,
      subtotal,
      descLineas,
      descGlobal,
      total,
    );
  };

  // ── Vaciar carrito ────────────────────────
  const handleVaciar = () => {
    if (!confirmarVaciar) {
      setConfirmarVaciar(true);
      return;
    }
    limpiar();
    setConfirmarVaciar(false);
    setModoCliente("search");
    setClienteSeleccionado(null);
    setOtroNombre("");
    setCashbackACanjear(0);
    setFechaEntrega("");
  };

  // ── Reset cliente ─────────────────────────
  const resetCliente = () => {
    setModoCliente("search");
    setClienteSeleccionado(null);
    setOtroNombre("");
    setCashbackACanjear(0);
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={cerrarCarrito}
        className={`
          fixed inset-0 z-40 bg-black/60 backdrop-blur-sm
          transition-opacity duration-300
          ${carritoAbierto ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* Panel */}
      <div
        className={`
        fixed right-0 top-0 z-50
        h-full w-full max-w-lg
        border-l border-zinc-800 bg-zinc-950
        shadow-2xl
        transition-transform duration-300 ease-in-out
        ${carritoAbierto ? "translate-x-0" : "translate-x-full"}
        flex flex-col
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-zinc-100">Carrito</h2>
            {lineas.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#02AFFF] text-xs font-bold text-white">
                {lineas.reduce((acc, l) => acc + l.cantidad, 0)}
              </span>
            )}
          </div>
          <button
            onClick={cerrarCarrito}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {lineas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <svg
                className="h-16 w-16 text-zinc-800 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="text-zinc-500 text-sm">El carrito está vacío</p>
              <p className="text-zinc-700 text-xs mt-1">
                Agrega productos desde el catálogo
              </p>
            </div>
          ) : (
            <>
              {/* Líneas del carrito */}
              {lineas.map((linea) => {
                const esGenerico = esProductoGenerico(linea.product);
                const esServicioLibre = esServicioSinPrecio(linea.product);
                const precioSinIva = esGenerico
                  ? Math.round((linea.precioFinal / 1.16) * 100) / 100
                  : null;

                return (
                  <div
                    key={linea.product.id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold uppercase tracking-widest text-[#02AFFF]">
                              {linea.product.marca}
                            </p>
                            {esGenerico && (
                              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                                Genérico
                              </span>
                            )}
                            {linea.product.clase === "SERVICIO" && (
                              <span className="rounded-full bg-[#02AFFF]/10 px-2 py-0.5 text-[10px] font-medium text-[#02AFFF]">
                                Servicio
                              </span>
                            )}
                          </div>
                          {esServicioLibre ? (
                            <div className="mt-1">
                              <label className="mb-1 block text-[10px] text-zinc-600">
                                Descripción para la nota de venta
                              </label>
                              <input
                                type="text"
                                value={linea.product.descripcion}
                                onChange={(e) =>
                                  setDescripcionLinea(
                                    linea.product.id,
                                    e.target.value,
                                  )
                                }
                                placeholder="Ej. Cambio de bomba de succión"
                                className="input-dark w-full text-sm"
                              />
                            </div>
                          ) : (
                            <p className="mt-0.5 text-sm font-medium text-zinc-200 line-clamp-2">
                              {linea.product.descripcion}
                            </p>
                          )}
                          <p className="mt-0.5 text-xs text-zinc-600">
                            {linea.product.clave}
                          </p>
                        </div>
                        <button
                          onClick={() => eliminar(linea.product.id)}
                          className="shrink-0 text-zinc-700 hover:text-red-400 transition-colors"
                        >
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        {/* Cantidad */}
                        <div className="flex items-center rounded-lg border border-zinc-700 bg-zinc-950">
                          <button
                            onClick={() =>
                              setCantidad(linea.product.id, linea.cantidad - 1)
                            }
                            className="flex h-8 w-8 items-center justify-center text-zinc-400 hover:text-white transition-colors"
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
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <input
                            type="number"
                            value={linea.cantidad}
                            onChange={(e) =>
                              setCantidad(
                                linea.product.id,
                                Number(e.target.value),
                              )
                            }
                            className="w-10 bg-transparent text-center text-sm font-bold text-zinc-100 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            onClick={() =>
                              setCantidad(linea.product.id, linea.cantidad + 1)
                            }
                            className="flex h-8 w-8 items-center justify-center text-zinc-400 hover:text-white transition-colors"
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
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Precio */}
                        <div className="text-right flex-1">
                          {esServicioLibre ? (
                            <div className="flex flex-col items-end gap-0.5">
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-zinc-500">$</span>
                                <input
                                  type="number"
                                  min={0}
                                  value={linea.precioFinal || ""}
                                  onChange={(e) =>
                                    setPrecioEditable(
                                      linea.product.id,
                                      Number(e.target.value),
                                    )
                                  }
                                  placeholder="0.00"
                                  className="w-24 bg-transparent text-right text-sm font-bold text-zinc-100 outline-none border-b border-zinc-700 focus:border-[#02AFFF] pb-0.5 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                              </div>
                              <p className="text-[10px] text-zinc-600">
                                Precio final (con impuestos)
                              </p>
                            </div>
                          ) : esGenerico ? (
                            <div className="flex flex-col items-end gap-0.5">
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-zinc-500">
                                  $ sin IVA
                                </span>
                                <input
                                  type="number"
                                  min={0}
                                  value={precioSinIva || ""}
                                  onChange={(e) =>
                                    setPrecioEditable(
                                      linea.product.id,
                                      Number(e.target.value) * 1.16,
                                    )
                                  }
                                  placeholder="0.00"
                                  className="w-24 bg-transparent text-right text-sm font-bold text-zinc-100 outline-none border-b border-zinc-700 focus:border-[#02AFFF] pb-0.5 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                              </div>
                              {linea.precioFinal > 0 && (
                                <p className="text-xs text-zinc-500">
                                  Con IVA:{" "}
                                  <span className="text-zinc-300 font-medium">
                                    {formatMXN(linea.total)}
                                  </span>
                                </p>
                              )}
                            </div>
                          ) : (
                            <>
                              {linea.descuento > 0 && (
                                <p className="text-xs text-zinc-600 line-through">
                                  {formatMXN(linea.subtotal)}
                                </p>
                              )}
                              <p className="text-sm font-bold text-zinc-100">
                                {formatMXN(linea.total)}
                              </p>
                              {linea.cupon && (
                                <p className="text-xs text-emerald-400">
                                  - {formatMXN(linea.descuento)}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {!esGenerico && (
                        <button
                          onClick={() =>
                            setExpandedId(
                              expandedId === linea.product.id
                                ? null
                                : linea.product.id,
                            )
                          }
                          className="mt-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1"
                        >
                          <svg
                            className={`h-3 w-3 transition-transform ${expandedId === linea.product.id ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                          {linea.cupon
                            ? `Cupón: ${linea.cupon.codigo}`
                            : "Agregar cupón"}
                        </button>
                      )}
                    </div>

                    {!esGenerico && expandedId === linea.product.id && (
                      <div className="border-t border-zinc-800 px-4 pb-4 pt-3">
                        <CuponInput
                          productId={linea.product.id}
                          cuponActivo={linea.cupon}
                          clienteId={clienteSeleccionado?.id ?? null}
                          onCuponAplicado={(cupon) =>
                            aplicarCupon(linea.product.id, cupon)
                          }
                          onCuponQuitado={() => quitarCupon(linea.product.id)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Cupón global */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Cupón global
                </p>
                <CuponInput
                  productId={-1}
                  cuponActivo={cuponGlobal}
                  clienteId={clienteSeleccionado?.id ?? null}
                  onCuponAplicado={(cupon: CuponValido) =>
                    aplicarCuponGlobal(cupon)
                  }
                  onCuponQuitado={() => quitarCuponGlobal()}
                />
              </div>

              {/* Fecha de entrega */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Fecha de entrega
                </label>
                <DatePicker
                  value={fechaEntrega}
                  onChange={setFechaEntrega}
                  placeholder="Selecciona una fecha"
                />
              </div>

              {/* Resumen */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                  Resumen
                </p>
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>Subtotal</span>
                  <span>{formatMXN(subtotal)}</span>
                </div>
                {descLineas > 0 && (
                  <div className="flex justify-between text-sm text-emerald-400">
                    <span>Descuentos por producto</span>
                    <span>- {formatMXN(descLineas)}</span>
                  </div>
                )}
                {descGlobal > 0 && (
                  <div className="flex justify-between text-sm text-emerald-400">
                    <span>Cupón global ({cuponGlobal?.codigo})</span>
                    <span>- {formatMXN(descGlobal)}</span>
                  </div>
                )}
                {cashbackValido > 0 && (
                  <div className="flex justify-between text-sm text-purple-400">
                    <span>Cashback canjeado</span>
                    <span>- {formatMXN(cashbackValido)}</span>
                  </div>
                )}
                <div className="border-t border-zinc-800 pt-2 flex justify-between font-bold text-zinc-100">
                  <span>Total</span>
                  <span className="text-lg">{formatMXN(total)}</span>
                </div>
                {ahorro > 0 && (
                  <div className="rounded-lg bg-emerald-500/10 px-3 py-2 text-center">
                    <p className="text-xs font-semibold text-emerald-400">
                      ¡Ahorraste {formatMXN(ahorro)}!
                    </p>
                  </div>
                )}
              </div>

              {/* ── Sección cliente ── */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Cliente
                </p>

                {/* Cliente seleccionado */}
                {modoCliente === "seleccionado" && clienteSeleccionado && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-zinc-800 px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#02AFFF]/20 text-xs font-bold text-[#02AFFF]">
                          {clienteSeleccionado.nombre[0]}
                          {clienteSeleccionado.apellido[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-200">
                            {clienteSeleccionado.nombre}{" "}
                            {clienteSeleccionado.apellido}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {clienteSeleccionado.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={resetCliente}
                        className="text-zinc-600 hover:text-zinc-400 transition-colors"
                      >
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Cashback */}
                    {clienteSeleccionado.cashbackDisponible > 0 && (
                      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium text-purple-400">
                            Cashback disponible
                          </p>
                          <p className="text-sm font-bold text-purple-300">
                            {formatMXN(clienteSeleccionado.cashbackDisponible)}
                          </p>
                        </div>

                        {canjeandoCashback ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-zinc-500">$</span>
                              <input
                                type="number"
                                min={0}
                                max={clienteSeleccionado.cashbackDisponible}
                                value={cashbackACanjear || ""}
                                onChange={(e) => {
                                  const val = Math.min(
                                    Number(e.target.value),
                                    clienteSeleccionado.cashbackDisponible,
                                    totalSinCashback,
                                  );
                                  setCashbackACanjear(val);
                                }}
                                placeholder="0.00"
                                className="flex-1 input-dark text-sm"
                              />
                              <button
                                onClick={() => {
                                  setCanjeandoCashback(false);
                                  setCashbackACanjear(0);
                                }}
                                className="text-xs text-zinc-600 hover:text-zinc-400"
                              >
                                Cancelar
                              </button>
                            </div>
                            <button
                              onClick={() =>
                                setCashbackACanjear(
                                  Math.min(
                                    clienteSeleccionado.cashbackDisponible,
                                    totalSinCashback,
                                  ),
                                )
                              }
                              className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                            >
                              Usar todo el cashback disponible
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setCanjeandoCashback(true)}
                            className="w-full rounded-lg border border-purple-500/20 py-1.5 text-xs font-medium text-purple-400 hover:bg-purple-500/10 transition-colors"
                          >
                            Canjear cashback
                          </button>
                        )}
                      </div>
                    )}

                    {/* Dirección de entrega */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-zinc-400">
                        Dirección de entrega
                      </p>

                      {direcciones.length > 0 && (
                        <select
                          value={direccionSeleccionadaId ?? ""}
                          onChange={(e) =>
                            setDireccionSeleccionadaId(e.target.value || null)
                          }
                          className="input-dark w-full"
                        >
                          <option value="">Sin dirección</option>
                          {direcciones.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.etiqueta} — {d.calle}
                              {d.numero_ext ? ` ${d.numero_ext}` : ""}
                              {d.colonia ? `, ${d.colonia}` : ""}
                            </option>
                          ))}
                        </select>
                      )}

                      {!mostrarNuevaDireccion ? (
                        <button
                          onClick={() => setMostrarNuevaDireccion(true)}
                          className="text-xs text-[#02AFFF] hover:text-[#1961B0] transition-colors"
                        >
                          + Agregar nueva dirección
                        </button>
                      ) : (
                        <div className="space-y-2 rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Etiqueta"
                              value={nuevaDireccion.etiqueta}
                              onChange={(e) =>
                                setNuevaDireccion({
                                  ...nuevaDireccion,
                                  etiqueta: e.target.value,
                                })
                              }
                              className="input-dark col-span-2 text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Calle *"
                              value={nuevaDireccion.calle}
                              onChange={(e) =>
                                setNuevaDireccion({
                                  ...nuevaDireccion,
                                  calle: e.target.value,
                                })
                              }
                              className="input-dark col-span-2 text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Núm. ext."
                              value={nuevaDireccion.numero_ext}
                              onChange={(e) =>
                                setNuevaDireccion({
                                  ...nuevaDireccion,
                                  numero_ext: e.target.value,
                                })
                              }
                              className="input-dark text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Núm. int."
                              value={nuevaDireccion.numero_int}
                              onChange={(e) =>
                                setNuevaDireccion({
                                  ...nuevaDireccion,
                                  numero_int: e.target.value,
                                })
                              }
                              className="input-dark text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Colonia"
                              value={nuevaDireccion.colonia}
                              onChange={(e) =>
                                setNuevaDireccion({
                                  ...nuevaDireccion,
                                  colonia: e.target.value,
                                })
                              }
                              className="input-dark text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Ciudad"
                              value={nuevaDireccion.ciudad}
                              onChange={(e) =>
                                setNuevaDireccion({
                                  ...nuevaDireccion,
                                  ciudad: e.target.value,
                                })
                              }
                              className="input-dark text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Estado"
                              value={nuevaDireccion.estado}
                              onChange={(e) =>
                                setNuevaDireccion({
                                  ...nuevaDireccion,
                                  estado: e.target.value,
                                })
                              }
                              className="input-dark text-sm"
                            />
                            <input
                              type="text"
                              placeholder="C.P."
                              value={nuevaDireccion.cp}
                              onChange={(e) =>
                                setNuevaDireccion({
                                  ...nuevaDireccion,
                                  cp: e.target.value,
                                })
                              }
                              className="input-dark text-sm"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleCrearDireccion}
                              disabled={
                                guardandoDireccion ||
                                !nuevaDireccion.calle.trim()
                              }
                              className="flex-1 rounded-lg bg-[#02AFFF]/10 py-2 text-xs font-medium text-[#02AFFF] hover:bg-[#02AFFF]/20 transition-colors disabled:opacity-40"
                            >
                              {guardandoDireccion
                                ? "Guardando..."
                                : "Guardar dirección"}
                            </button>
                            <button
                              onClick={() => setMostrarNuevaDireccion(false)}
                              className="flex-1 rounded-lg border border-zinc-700 py-2 text-xs text-zinc-400 transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Modo otro */}
                {modoCliente === "otro" && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={otroNombre}
                      onChange={(e) => setOtroNombre(e.target.value)}
                      placeholder="Nombre completo o empresa..."
                      className="input-dark w-full"
                    />
                    <button
                      onClick={resetCliente}
                      className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                      ← Buscar cliente registrado
                    </button>
                    {modoCliente === "otro" && (
                      <p className="text-xs text-zinc-600">
                        La cotización no se guardará en ninguna cuenta
                      </p>
                    )}
                  </div>
                )}

                {/* Search */}
                {modoCliente === "search" && (
                  <ClienteSearch
                    onSelect={(c) => {
                      setClienteSeleccionado(c);
                      setModoCliente("seleccionado");
                    }}
                    onOtro={() => setModoCliente("otro")}
                  />
                )}
              </div>

              {/* Error guardar */}
              {errorGuardar && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {errorGuardar}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {lineas.length > 0 && (
          <div className="border-t border-zinc-800 px-5 py-4 space-y-2 shrink-0">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCotizacion}
                disabled={!clienteValido || guardando}
                className="
                  flex items-center justify-center gap-2
                  rounded-xl border border-[#02AFFF]/40
                  bg-[#02AFFF]/10 py-3 text-sm font-medium text-[#02AFFF]
                  transition-colors hover:bg-[#02AFFF]/20
                  disabled:opacity-40 disabled:cursor-not-allowed
                "
              >
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {guardando ? "Guardando..." : "Cotización"}
              </button>

              <button
                onClick={handleOrden}
                disabled={!clienteValido || guardando}
                className="
                  flex items-center justify-center gap-2
                  rounded-xl bg-[#02AFFF] py-3 text-sm font-medium text-white
                  transition-colors hover:bg-[#1961B0]
                  disabled:opacity-40 disabled:cursor-not-allowed
                "
              >
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                {guardando ? "Guardando..." : "Generar orden"}
              </button>
            </div>

            <button
              onClick={handleVaciar}
              className={`
                w-full rounded-xl py-2.5 text-sm font-medium transition-colors
                ${
                  confirmarVaciar
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "text-zinc-600 hover:text-zinc-400"
                }
              `}
            >
              {confirmarVaciar
                ? "¿Confirmar? Toca de nuevo para vaciar"
                : "Vaciar carrito"}
            </button>

            {confirmarVaciar && (
              <button
                onClick={() => setConfirmarVaciar(false)}
                className="w-full text-xs text-zinc-700 hover:text-zinc-500 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
