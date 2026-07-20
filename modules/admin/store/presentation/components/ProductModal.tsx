"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Product } from "@/modules/admin/store/domain/entities/product.entity";
import { useCarritoStore } from "../store/carrito.store";
import { CuponInput } from "./CuponInput";
import { CuponValido } from "@/app/api/cupones/validar/route";
import {
  calcularPrecioFinal,
  formatMXN,
  esProductoGenerico,
} from "@/core/helpers/precio.utils";

// ─────────────────────────────────────────────
// Productos sugeridos para DISCOS DUROS
// ─────────────────────────────────────────────
const SUGERENCIAS_DISCOS: {
  id: number;
  clave: string;
  descripcion: string;
  precio: number;
}[] = [
  {
    id: 9000009,
    clave: "SIT-SRV-SAT",
    descripcion: "Adaptador SATA",
    precio: 280,
  },
  {
    id: 9000001,
    clave: "SIT-MAN-ESE",
    descripcion: "Mantenimiento Esencial",
    precio: 650,
  },
  {
    id: 9000002,
    clave: "SIT-MAN-PRO",
    descripcion: "Mantenimiento Pro Gamer",
    precio: 990,
  },
  {
    id: 9000003,
    clave: "SIT-MAN-APL",
    descripcion: "Mantenimiento Apple Care+",
    precio: 1490,
  },
  {
    id: 9000004,
    clave: "SIT-SRV-INS",
    descripcion: "Servicio de Instalación",
    precio: 450,
  },
];

interface ProductModalProps {
  product: Product;
  ganancia: number;
  tipoCambio: number;
  onClose: () => void;
}

export function ProductModal({
  product,
  ganancia,
  tipoCambio,
  onClose,
}: ProductModalProps) {
  const { agregar, aplicarCupon, quitarCupon, lineas } = useCarritoStore();
  const [cantidad, setCantidad] = useState(1);
  const overlayRef = useRef<HTMLDivElement>(null);

  const lineaActual = lineas.find((l) => l.product.id === product.id);
  const [cuponLocal, setCuponLocal] = useState<CuponValido | null>(null);
  const cuponActivo = lineaActual?.cupon ?? cuponLocal;

  const esGenerico = esProductoGenerico(product);
  const [precioCustom, setPrecioCustom] = useState<number>(0);

  // Sugerencias — solo para DISCOS DUROS
  const esDisco = product.grupo === "DISCOS DUROS";
  const [agregados, setAgregados] = useState<number[]>([]);

  // Destacado — se muestra en el home público
  const [destacado, setDestacado] = useState(false);
  const [cargandoDestacado, setCargandoDestacado] = useState(false);

  useEffect(() => {
    if (lineaActual?.cupon) setCuponLocal(lineaActual.cupon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetch("/api/productos-destacados")
      .then((r) => r.json())
      .then((data: { producto_id: number }[]) => {
        if (Array.isArray(data)) {
          setDestacado(data.some((d) => d.producto_id === product.id));
        }
      })
      .catch(() => {});
  }, [product.id]);

  const handleToggleDestacado = async () => {
    setCargandoDestacado(true);
    try {
      if (destacado) {
        await fetch(`/api/productos-destacados/${product.id}`, {
          method: "DELETE",
        });
        setDestacado(false);
      } else {
        await fetch("/api/productos-destacados", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ producto_id: product.id }),
        });
        setDestacado(true);
      }
    } finally {
      setCargandoDestacado(false);
    }
  };

  const precioFinal = calcularPrecioFinal(
    product.precio ?? 0,
    ganancia,
    product.moneda,
    tipoCambio,
  );

  const subtotalPreview = precioFinal * cantidad;
  const descuentoPreview = cuponActivo
    ? cuponActivo.tipo === "porcentaje"
      ? Math.round(((subtotalPreview * cuponActivo.descuento) / 100) * 100) /
        100
      : Math.min(cuponActivo.descuento, subtotalPreview)
    : 0;
  const totalPreview = subtotalPreview - descuentoPreview;
  const stockTotal = product.disponible + product.disponibleCD;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleCuponAplicado = (cupon: CuponValido) => {
    setCuponLocal(cupon);
    if (lineaActual) aplicarCupon(product.id, cupon);
  };

  const handleCuponQuitado = () => {
    setCuponLocal(null);
    if (lineaActual) quitarCupon(product.id);
  };

  const handleAgregar = () => {
    const precioParaCarrito = esGenerico ? precioCustom * 1.16 : precioFinal;
    if (esGenerico && precioCustom <= 0) return;
    agregar(product, cantidad, precioParaCarrito);
    if (cuponLocal) setTimeout(() => aplicarCupon(product.id, cuponLocal), 0);
    onClose();
  };

  const handleAgregarSugerido = (sugerido: (typeof SUGERENCIAS_DISCOS)[0]) => {
    // Construye un Product mínimo para el store
    const productSugerido: Product = {
      id: sugerido.id,
      clave: sugerido.clave,
      descripcion: sugerido.descripcion,
      marca: "SIT+",
      grupo: "SERVICIOS SIT",
      principal: "SERVICIOS SIT",
      garantia: "N/A",
      clase: "SERVICIO",
      requiereSerie: false,
      imagen: null,
      brandImage: null,
      codigoFabricante: null,
      precio: sugerido.precio,
      moneda: "Pesos",
      disponible: 9999,
      disponibleCD: 9999,
      fechaSync: null,
    };

    agregar(productSugerido, 1, sugerido.precio * 1.16);
    setAgregados((prev) => [...prev, sugerido.id]);
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/70 backdrop-blur-sm
        p-4
      "
    >
      <div
        className="
        relative w-full max-w-2xl
        rounded-2xl border border-zinc-800
        bg-zinc-950 shadow-2xl
        max-h-[90vh] overflow-y-auto
        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
      "
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="
            absolute right-4 top-4 z-10
            flex h-8 w-8 items-center justify-center
            rounded-full bg-zinc-800
            text-zinc-400 hover:text-white transition-colors
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col sm:flex-row">
          {/* Imagen */}
          <div
            className="
            flex h-64 sm:h-auto sm:w-64 shrink-0
            items-center justify-center
            rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none
            bg-zinc-900 p-8
          "
          >
            {product.imagen ? (
              <Image
                src={product.imagen}
                alt={product.descripcion}
                width={180}
                height={180}
                className="object-contain"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-zinc-800">
                <svg
                  className="h-10 w-10 text-zinc-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col gap-4 p-6">
            {/* Marca + clave */}
            <div className="flex items-center justify-between pr-8">
              <span className="text-xs font-bold uppercase tracking-widest text-[#02AFFF]">
                {product.marca}
              </span>
              <span className="rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-400">
                {product.clave}
              </span>
            </div>

            {/* Destacado — visible en el home público */}
            <button
              onClick={handleToggleDestacado}
              disabled={cargandoDestacado}
              className={`
                flex items-center gap-2 self-start rounded-lg border px-3 py-1.5 text-xs font-medium
                transition-colors disabled:opacity-40
                ${
                  destacado
                    ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
                    : "border-zinc-700 text-zinc-400 hover:text-zinc-200"
                }
              `}
            >
              <span>{destacado ? "★" : "☆"}</span>
              {destacado ? "Destacado en el home" : "Marcar como destacado"}
            </button>

            {/* Descripción */}
            <h2 className="text-base font-semibold leading-snug text-zinc-100">
              {product.descripcion}
            </h2>

            {/* Detalles */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: "Grupo", value: product.grupo },
                { label: "Clase", value: product.clase },
                { label: "Garantía", value: product.garantia },
                { label: "Cod. Fab", value: product.codigoFabricante ?? "—" },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg bg-zinc-900 px-3 py-2">
                  <p className="text-zinc-500">{label}</p>
                  <p className="mt-0.5 font-medium text-zinc-300 truncate">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Disponibilidad */}
            <div className="flex gap-2 text-xs">
              {[
                {
                  label: "Almacén",
                  value: product.disponible,
                  ok: product.disponible > 0,
                },
                {
                  label: "CD",
                  value: product.disponibleCD,
                  ok: product.disponibleCD > 0,
                },
                { label: "Total", value: stockTotal, ok: stockTotal > 0 },
              ].map(({ label, value, ok }) => (
                <div
                  key={label}
                  className="flex-1 rounded-lg bg-zinc-900 px-3 py-2"
                >
                  <p className="text-zinc-500">{label}</p>
                  <p
                    className={`mt-0.5 font-bold ${ok ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {value} uds.
                  </p>
                </div>
              ))}
            </div>

            {/* Precio */}
            <div className="rounded-xl bg-zinc-900 px-4 py-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-zinc-500">Precio unitario</span>
                <span className="text-xs text-zinc-500">MXN</span>
              </div>
              <p className="mt-1 text-2xl font-bold text-zinc-100">
                {formatMXN(precioFinal)}
              </p>
              {product.moneda === "Dolares" && (
                <p className="mt-0.5 text-xs text-zinc-600">
                  Precio original{" "}
                  <span className="text-zinc-500 font-medium">
                    {new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "USD",
                    }).format(product.precio ?? 0)}
                  </span>{" "}
                  · convertido a MXN
                </p>
              )}
            </div>

            {/* Precio editable para genéricos */}
            {esGenerico && (
              <div className="rounded-xl bg-zinc-900 px-4 py-3">
                <label className="mb-2 block text-xs text-zinc-500">
                  Precio del producto (sin IVA)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 text-sm">$</span>
                  <input
                    type="number"
                    min={0}
                    value={precioCustom || ""}
                    onChange={(e) => setPrecioCustom(Number(e.target.value))}
                    placeholder="0.00"
                    className="
                      flex-1 bg-transparent text-lg font-bold text-zinc-100
                      outline-none border-b border-zinc-700 focus:border-[#02AFFF]
                      pb-1 transition-colors
                      [appearance:textfield]
                      [&::-webkit-outer-spin-button]:appearance-none
                      [&::-webkit-inner-spin-button]:appearance-none
                    "
                  />
                  <span className="text-xs text-zinc-500">MXN</span>
                </div>
                {precioCustom > 0 && (
                  <p className="mt-2 text-xs text-zinc-500">
                    Con IVA:{" "}
                    <span className="text-zinc-300 font-medium">
                      {formatMXN(precioCustom * 1.16)}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Cupón */}
            {!esGenerico && (
              <CuponInput
                productId={product.id}
                cuponActivo={cuponActivo}
                onCuponAplicado={handleCuponAplicado}
                onCuponQuitado={handleCuponQuitado}
              />
            )}

            {/* Resumen con descuento */}
            {cuponActivo && !esGenerico && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal ({cantidad} uds.)</span>
                  <span>{formatMXN(subtotalPreview)}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Descuento</span>
                  <span>− {formatMXN(descuentoPreview)}</span>
                </div>
                <div className="mt-2 flex justify-between border-t border-zinc-800 pt-2 font-bold text-zinc-100">
                  <span>Total</span>
                  <span>{formatMXN(totalPreview)}</span>
                </div>
              </div>
            )}

            {/* Cantidad + Agregar */}
            <div className="flex gap-3">
              <div className="flex items-center rounded-xl border border-zinc-700 bg-zinc-900">
                <button
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  className="flex h-11 w-11 items-center justify-center text-zinc-400 hover:text-white transition-colors"
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
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <span className="w-8 text-center text-sm font-bold text-zinc-100">
                  {cantidad}
                </span>
                <button
                  onClick={() => setCantidad((c) => c + 1)}
                  className="flex h-11 w-11 items-center justify-center text-zinc-400 hover:text-white transition-colors"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>

              <button
                onClick={handleAgregar}
                disabled={stockTotal === 0 || (esGenerico && precioCustom <= 0)}
                className="
                  flex-1 rounded-xl
                  bg-[#02AFFF] font-semibold text-white
                  transition-all hover:bg-[#1961B0]
                  active:scale-95
                  disabled:opacity-40 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2
                "
              >
                {stockTotal > 0 && (
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
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                )}
                {stockTotal === 0
                  ? "Sin stock"
                  : lineaActual
                    ? "Agregar más"
                    : "Agregar al carrito"}
              </button>
            </div>

            {/* ── Sugerencias para DISCOS DUROS ── */}
            {esDisco && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  ¿También necesitas?
                </p>
                <div className="space-y-2">
                  {SUGERENCIAS_DISCOS.map((sugerido) => {
                    const yaAgregado = agregados.includes(sugerido.id);
                    return (
                      <div
                        key={sugerido.id}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-300 truncate">
                            {sugerido.descripcion}
                          </p>
                          <p className="text-xs text-zinc-600">
                            {formatMXN(sugerido.precio * 1.16)} c/IVA
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            !yaAgregado && handleAgregarSugerido(sugerido)
                          }
                          disabled={yaAgregado}
                          className={`
                            shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium
                            transition-all
                            ${
                              yaAgregado
                                ? "bg-emerald-500/10 text-emerald-400 cursor-default"
                                : "border border-zinc-700 text-zinc-400 hover:border-[#02AFFF]/40 hover:text-[#02AFFF] hover:bg-[#02AFFF]/5"
                            }
                          `}
                        >
                          {yaAgregado ? (
                            <span className="flex items-center gap-1">
                              <svg
                                className="h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2.5}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Agregado
                            </span>
                          ) : (
                            "+ Agregar"
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
