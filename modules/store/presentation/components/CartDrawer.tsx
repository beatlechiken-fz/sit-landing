"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "../store/ui.store";
import { useCarritoStore } from "../store/carrito.store";
import { CuponInput } from "./CuponInput";
import { formatMXN, esProductoGenerico } from "@/core/helpers/precio.utils";
import { CuponValido } from "@/app/api/cupones/validar/route";
import { Direccion } from "@/modules/admin/store/domain/entities/direccion.entity";
import { DatePicker } from "@/core/components/date-picker/DatePicker";
import { descargarOrden } from "@/core/helpers/pdf/cotizacion.pdf";
import { LineaCarrito } from "../store/carrito.store";
import { calcularFechaEntregaCliente } from "@/core/helpers/fecha-entrega.utils";

export function CartDrawer() {
  const { carritoAbierto, cerrarCarrito } = useUIStore();
  const {
    lineas,
    cuponGlobal,
    setCantidad,
    setPrecioEditable,
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

  const router = useRouter();

  // Sesión / beneficios del cliente
  const [sesionActiva, setSesionActiva] = useState<boolean | null>(null);
  const [cashbackDisponible, setCashbackDisponible] = useState(0);
  const [cashbackACanjear, setCashbackACanjear] = useState(0);
  const [canjeandoCashback, setCanjeandoCashback] = useState(false);

  // Direcciones
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
  // El cliente no elige la fecha — se calcula sola (hoy + 3 días hábiles,
  // sin domingos) y el campo queda bloqueado; solo el admin la edita.
  const [fechaEntrega] = useState(() => calcularFechaEntregaCliente());

  const [confirmarVaciar, setConfirmarVaciar] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState<string | null>(null);
  const [pedidoCreado, setPedidoCreado] = useState(false);
  const [pedidoInfo, setPedidoInfo] = useState<{
    numeroOrden: string;
    cliente: string;
    lineas: LineaCarrito[];
    cuponGlobal: CuponValido | null;
    subtotal: number;
    descuentoLineas: number;
    descuentoGlobal: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    if (!carritoAbierto || sesionActiva !== null) return;

    Promise.all([
      fetch("/api/my-sit/cashback").then((r) =>
        r.ok ? r.json() : Promise.reject(),
      ),
      fetch("/api/my-sit/direcciones").then((r) =>
        r.ok ? r.json() : Promise.reject(),
      ),
    ])
      .then(([cashbackData, direccionesData]) => {
        setSesionActiva(true);
        setCashbackDisponible(cashbackData.disponible ?? 0);
        const lista = Array.isArray(direccionesData) ? direccionesData : [];
        setDirecciones(lista);
        const predeterminada = lista.find((d: Direccion) => d.predeterminada);
        setDireccionSeleccionadaId(
          predeterminada?.id ?? lista[0]?.id ?? null,
        );
      })
      .catch(() => setSesionActiva(false));
  }, [carritoAbierto, sesionActiva]);

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

  const subtotal = subtotalCarrito();
  const descLineas = descuentoLineas();
  const descGlobal = descuentoGlobal();
  const totalSinCashback = totalCarrito();
  const cashbackValido = Math.min(cashbackACanjear, cashbackDisponible);
  const total = Math.max(0, totalSinCashback - cashbackValido);
  const ahorro = descLineas + descGlobal + cashbackValido;

  const direccionSeleccionada =
    direcciones.find((d) => d.id === direccionSeleccionadaId) ?? null;

  const handleCrearDireccion = async () => {
    if (!nuevaDireccion.calle.trim()) return;
    setGuardandoDireccion(true);
    try {
      const res = await fetch("/api/my-sit/direcciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaDireccion),
      });
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

  const handleFinalizarPedido = async () => {
    setGuardando(true);
    setErrorGuardar(null);

    const direccionSnapshot = direccionSeleccionada
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
      const res = await fetch("/api/my-sit/store/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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

      if (res.status === 401) {
        router.push("/my-sit?next=/store");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setErrorGuardar(data.error ?? "Error al generar el pedido");
        return;
      }

      setPedidoInfo({
        numeroOrden: data.numero_orden,
        cliente: data.cliente_nombre,
        lineas,
        cuponGlobal,
        subtotal,
        descuentoLineas: descLineas,
        descuentoGlobal: descGlobal,
        total,
      });
      limpiar();
      setPedidoCreado(true);
    } catch {
      setErrorGuardar("Error de conexión");
    } finally {
      setGuardando(false);
    }
  };

  const handleDescargarPDF = () => {
    if (!pedidoInfo) return;
    descargarOrden(
      pedidoInfo.cliente,
      pedidoInfo.lineas,
      pedidoInfo.cuponGlobal,
      pedidoInfo.subtotal,
      pedidoInfo.descuentoLineas,
      pedidoInfo.descuentoGlobal,
      pedidoInfo.total,
      pedidoInfo.numeroOrden,
    );
  };

  const handleBotonPrincipal = () => {
    if (sesionActiva === false) {
      cerrarCarrito();
      router.push("/my-sit?next=/store");
      return;
    }
    handleFinalizarPedido();
  };

  const handleVaciar = () => {
    if (!confirmarVaciar) {
      setConfirmarVaciar(true);
      return;
    }
    limpiar();
    setConfirmarVaciar(false);
    setCashbackACanjear(0);
  };

  return (
    <>
      <div
        onClick={cerrarCarrito}
        className={`
          fixed inset-0 z-40 bg-black/70 backdrop-blur-sm
          transition-opacity duration-300
          ${carritoAbierto ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      />

      <div
        className={`
        fixed right-0 top-0 z-50
        h-full w-full max-w-lg
        border-l border-white/10 bg-[#0B0B0F]
        shadow-2xl
        transition-transform duration-300 ease-in-out
        ${carritoAbierto ? "translate-x-0" : "translate-x-full"}
        flex flex-col
      `}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-white">Tu carrito</h2>
            {lineas.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-teal-400 to-[#02AFFF] text-xs font-bold text-black">
                {lineas.reduce((acc, l) => acc + l.cantidad, 0)}
              </span>
            )}
          </div>
          <button
            onClick={cerrarCarrito}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/50 hover:text-white transition-colors"
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

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {pedidoCreado ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-400/10">
                <svg
                  className="h-8 w-8 text-teal-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-lg font-semibold text-white">
                ¡Pedido generado!
              </p>
              {pedidoInfo?.numeroOrden && (
                <p className="mt-1 text-sm font-medium text-teal-300">
                  {pedidoInfo.numeroOrden}
                </p>
              )}
              <p className="mt-1 text-sm text-white/50 max-w-xs">
                Nuestro equipo lo revisará y te contactará. Puedes darle
                seguimiento en tu portal de cliente.
              </p>
              <div className="mt-6 flex flex-col gap-2 w-full max-w-xs">
                <button
                  onClick={() => {
                    cerrarCarrito();
                    router.push("/my-sit/dashboard/pedidos");
                  }}
                  className="rounded-2xl bg-gradient-to-r from-teal-400 to-[#02AFFF] px-6 py-3 text-sm font-semibold text-black hover:opacity-90 transition-opacity"
                >
                  Ver mis pedidos
                </button>
                <button
                  onClick={handleDescargarPDF}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white/80 hover:bg-white/[0.06] transition-colors"
                >
                  Descargar PDF
                </button>
              </div>
            </div>
          ) : lineas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <svg
                className="h-16 w-16 text-white/10 mb-4"
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
              <p className="text-white/50 text-sm">Tu carrito está vacío</p>
              <p className="text-white/25 text-xs mt-1">
                Agrega productos desde la tienda
              </p>
            </div>
          ) : (
            <>
              {lineas.map((linea) => {
                const esGenerico = esProductoGenerico(linea.product);
                const precioSinIva = esGenerico
                  ? Math.round((linea.precioFinal / 1.16) * 100) / 100
                  : null;

                return (
                  <div
                    key={linea.product.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold uppercase tracking-widest text-teal-300">
                              {linea.product.marca}
                            </p>
                            {esGenerico && (
                              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                                Genérico
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-sm font-medium text-white/90 line-clamp-2">
                            {linea.product.descripcion}
                          </p>
                        </div>
                        <button
                          onClick={() => eliminar(linea.product.id)}
                          className="shrink-0 text-white/20 hover:text-red-400 transition-colors"
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
                        <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.03]">
                          <button
                            onClick={() =>
                              setCantidad(linea.product.id, linea.cantidad - 1)
                            }
                            className="flex h-8 w-8 items-center justify-center text-white/50 hover:text-white transition-colors"
                          >
                            −
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
                            className="w-10 bg-transparent text-center text-sm font-bold text-white outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            onClick={() =>
                              setCantidad(linea.product.id, linea.cantidad + 1)
                            }
                            className="flex h-8 w-8 items-center justify-center text-white/50 hover:text-white transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right flex-1">
                          {esGenerico ? (
                            <div className="flex flex-col items-end gap-0.5">
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-white/40">
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
                                  className="w-24 bg-transparent text-right text-sm font-bold text-white outline-none border-b border-white/20 focus:border-[#02AFFF] pb-0.5 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                              </div>
                            </div>
                          ) : (
                            <>
                              {linea.descuento > 0 && (
                                <p className="text-xs text-white/30 line-through">
                                  {formatMXN(linea.subtotal)}
                                </p>
                              )}
                              <p className="text-sm font-bold text-white">
                                {formatMXN(linea.total)}
                              </p>
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
                          className="mt-2 text-xs text-white/30 hover:text-white/60 transition-colors"
                        >
                          {linea.cupon
                            ? `Cupón: ${linea.cupon.codigo}`
                            : "Agregar cupón"}
                        </button>
                      )}
                    </div>

                    {!esGenerico && expandedId === linea.product.id && (
                      <div className="border-t border-white/10 px-4 pb-4 pt-3">
                        <CuponInput
                          cuponActivo={linea.cupon}
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
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
                  Cupón global
                </p>
                <CuponInput
                  cuponActivo={cuponGlobal}
                  onCuponAplicado={(cupon: CuponValido) =>
                    aplicarCuponGlobal(cupon)
                  }
                  onCuponQuitado={() => quitarCuponGlobal()}
                />
              </div>

              {/* Fecha de entrega — calculada, no editable por el cliente */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-white/40">
                  Fecha de entrega
                </label>
                <DatePicker value={fechaEntrega} onChange={() => {}} disabled />
                <p className="mt-2 text-xs text-white/40">
                  Entrega estimada — 3 días hábiles
                </p>
              </div>

              {/* Dirección + cashback — solo si hay sesión */}
              {sesionActiva && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                    Dirección de entrega
                  </p>

                  {direcciones.length > 0 && (
                    <select
                      value={direccionSeleccionadaId ?? ""}
                      onChange={(e) =>
                        setDireccionSeleccionadaId(e.target.value || null)
                      }
                      className="input-dark w-full !bg-white/[0.03] !border-white/10"
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
                      className="text-xs text-teal-300 hover:text-teal-200 transition-colors"
                    >
                      + Agregar nueva dirección
                    </button>
                  ) : (
                    <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-3">
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          {
                            key: "etiqueta",
                            placeholder: "Etiqueta",
                            span: true,
                          },
                          { key: "calle", placeholder: "Calle *", span: true },
                          { key: "numero_ext", placeholder: "Núm. ext." },
                          { key: "numero_int", placeholder: "Núm. int." },
                          { key: "colonia", placeholder: "Colonia" },
                          { key: "ciudad", placeholder: "Ciudad" },
                          { key: "estado", placeholder: "Estado" },
                          { key: "cp", placeholder: "C.P." },
                        ].map(({ key, placeholder, span }) => (
                          <input
                            key={key}
                            type="text"
                            placeholder={placeholder}
                            value={(nuevaDireccion as any)[key]}
                            onChange={(e) =>
                              setNuevaDireccion({
                                ...nuevaDireccion,
                                [key]: e.target.value,
                              })
                            }
                            className={`input-dark text-sm !bg-white/[0.03] !border-white/10 ${span ? "col-span-2" : ""}`}
                          />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleCrearDireccion}
                          disabled={
                            guardandoDireccion || !nuevaDireccion.calle.trim()
                          }
                          className="flex-1 rounded-lg bg-teal-400/10 py-2 text-xs font-medium text-teal-300 hover:bg-teal-400/20 transition-colors disabled:opacity-40"
                        >
                          {guardandoDireccion
                            ? "Guardando..."
                            : "Guardar dirección"}
                        </button>
                        <button
                          onClick={() => setMostrarNuevaDireccion(false)}
                          className="flex-1 rounded-lg border border-white/10 py-2 text-xs text-white/50 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  {cashbackDisponible > 0 && (
                    <div className="rounded-xl border border-teal-400/20 bg-teal-400/5 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-teal-300">
                          Cashback disponible
                        </p>
                        <p className="text-sm font-bold text-teal-200">
                          {formatMXN(cashbackDisponible)}
                        </p>
                      </div>

                      {canjeandoCashback ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/40">$</span>
                          <input
                            type="number"
                            min={0}
                            max={cashbackDisponible}
                            value={cashbackACanjear || ""}
                            onChange={(e) => {
                              const val = Math.min(
                                Number(e.target.value),
                                cashbackDisponible,
                                totalSinCashback,
                              );
                              setCashbackACanjear(val);
                            }}
                            placeholder="0.00"
                            className="flex-1 input-dark text-sm !bg-white/[0.03] !border-white/10"
                          />
                          <button
                            onClick={() => {
                              setCanjeandoCashback(false);
                              setCashbackACanjear(0);
                            }}
                            className="text-xs text-white/40 hover:text-white/70"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setCanjeandoCashback(true)}
                          className="w-full rounded-lg border border-teal-400/20 py-1.5 text-xs font-medium text-teal-300 hover:bg-teal-400/10 transition-colors"
                        >
                          Canjear cashback
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {sesionActiva === false && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-xs text-white/40">
                  Inicia sesión para elegir dirección de entrega y usar tu
                  cashback. Se te pedirá al finalizar el pedido.
                </div>
              )}

              {/* Resumen */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">
                  Resumen
                </p>
                <div className="flex justify-between text-sm text-white/60">
                  <span>Subtotal</span>
                  <span>{formatMXN(subtotal)}</span>
                </div>
                {descLineas > 0 && (
                  <div className="flex justify-between text-sm text-teal-300">
                    <span>Descuentos por producto</span>
                    <span>- {formatMXN(descLineas)}</span>
                  </div>
                )}
                {descGlobal > 0 && (
                  <div className="flex justify-between text-sm text-teal-300">
                    <span>Cupón global ({cuponGlobal?.codigo})</span>
                    <span>- {formatMXN(descGlobal)}</span>
                  </div>
                )}
                {cashbackValido > 0 && (
                  <div className="flex justify-between text-sm text-teal-300">
                    <span>Cashback canjeado</span>
                    <span>- {formatMXN(cashbackValido)}</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-white">
                  <span>Total</span>
                  <span className="text-lg">{formatMXN(total)}</span>
                </div>
                {ahorro > 0 && (
                  <div className="rounded-lg bg-teal-400/10 px-3 py-2 text-center">
                    <p className="text-xs font-semibold text-teal-300">
                      ¡Ahorraste {formatMXN(ahorro)}!
                    </p>
                  </div>
                )}
              </div>

              {errorGuardar && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {errorGuardar}
                </div>
              )}
            </>
          )}
        </div>

        {lineas.length > 0 && !pedidoCreado && (
          <div className="border-t border-white/10 px-5 py-4 space-y-2 shrink-0">
            <button
              onClick={handleBotonPrincipal}
              disabled={guardando || sesionActiva === null}
              className="
                w-full flex items-center justify-center gap-2
                rounded-2xl bg-gradient-to-r from-teal-400 to-[#02AFFF] py-3.5
                text-sm font-semibold text-black
                transition-opacity hover:opacity-90
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              {sesionActiva === null
                ? "Cargando..."
                : sesionActiva === false
                  ? "Iniciar sesión"
                  : guardando
                    ? "Enviando..."
                    : "Generar orden"}
            </button>

            <button
              onClick={handleVaciar}
              className={`
                w-full rounded-xl py-2.5 text-sm font-medium transition-colors
                ${
                  confirmarVaciar
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "text-white/30 hover:text-white/60"
                }
              `}
            >
              {confirmarVaciar
                ? "¿Confirmar? Toca de nuevo para vaciar"
                : "Vaciar carrito"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
