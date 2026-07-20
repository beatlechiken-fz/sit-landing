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

interface ProductDetailModalProps {
  product: Product;
  ganancia: number;
  tipoCambio: number;
  onClose: () => void;
}

export function ProductDetailModal({
  product,
  ganancia,
  tipoCambio,
  onClose,
}: ProductDetailModalProps) {
  const { agregar, aplicarCupon, quitarCupon, lineas } = useCarritoStore();
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const lineaActual = lineas.find((l) => l.product.id === product.id);
  const [cuponLocal, setCuponLocal] = useState<CuponValido | null>(null);
  const cuponActivo = lineaActual?.cupon ?? cuponLocal;

  const esGenerico = esProductoGenerico(product);
  const [precioCustom, setPrecioCustom] = useState<number>(0);

  const esDisco = product.grupo === "DISCOS DUROS";
  const [agregados, setAgregados] = useState<number[]>([]);

  useEffect(() => {
    if (lineaActual?.cupon) setCuponLocal(lineaActual.cupon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setAgregado(true);
    setTimeout(onClose, 600);
  };

  const handleAgregarSugerido = (sugerido: (typeof SUGERENCIAS_DISCOS)[0]) => {
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
        fixed inset-0 z-[60]
        flex items-center justify-center
        bg-black/80 backdrop-blur-md
        p-4
      "
    >
      <div
        className="
        relative w-full max-w-3xl
        rounded-3xl border border-white/10
        bg-[#0B0B0F] shadow-2xl
        max-h-[90vh] overflow-y-auto
        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
      "
      >
        <button
          onClick={onClose}
          className="
            absolute right-4 top-4 z-10
            flex h-9 w-9 items-center justify-center
            rounded-full bg-white/5 border border-white/10
            text-white/60 hover:text-white hover:bg-white/10 transition-colors
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
            relative flex h-72 sm:h-auto sm:w-80 shrink-0
            items-center justify-center overflow-hidden
            bg-gradient-to-br from-white/[0.04] to-transparent p-10
          "
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-52 w-52 rounded-full bg-gradient-to-br from-teal-400/10 to-[#02AFFF]/10 blur-3xl" />
            </div>
            {product.imagen ? (
              <Image
                src={product.imagen}
                alt={product.descripcion}
                width={200}
                height={200}
                className="relative z-10 object-contain"
              />
            ) : (
              <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-2xl bg-white/5">
                <svg
                  className="h-10 w-10 text-white/30"
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
          <div className="flex flex-1 flex-col gap-4 p-6 sm:p-8">
            <div className="flex items-center justify-between pr-8">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
                {product.marca}
              </span>
              <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-white/50">
                {product.clave}
              </span>
            </div>

            <h2 className="text-lg font-semibold leading-snug text-white">
              {product.descripcion}
            </h2>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: "Grupo", value: product.grupo },
                { label: "Clase", value: product.clase },
                { label: "Garantía", value: product.garantia },
                { label: "Cod. Fab", value: product.codigoFabricante ?? "—" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl bg-white/[0.03] px-3 py-2.5"
                >
                  <p className="text-white/40">{label}</p>
                  <p className="mt-0.5 font-medium text-white/80 truncate">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Precio */}
            <div className="rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/10 px-5 py-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-white/40">Precio unitario</span>
                <StockTag stockTotal={stockTotal} />
              </div>
              <p className="mt-1 text-3xl font-bold text-white">
                {formatMXN(precioFinal)}
              </p>
            </div>

            {/* Precio editable para genéricos */}
            {esGenerico && (
              <div className="rounded-2xl bg-white/[0.03] px-5 py-4">
                <label className="mb-2 block text-xs text-white/40">
                  Precio del producto (sin IVA)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-white/50 text-sm">$</span>
                  <input
                    type="number"
                    min={0}
                    value={precioCustom || ""}
                    onChange={(e) => setPrecioCustom(Number(e.target.value))}
                    placeholder="0.00"
                    className="
                      flex-1 bg-transparent text-lg font-bold text-white
                      outline-none border-b border-white/20 focus:border-[#02AFFF]
                      pb-1 transition-colors
                      [appearance:textfield]
                      [&::-webkit-outer-spin-button]:appearance-none
                      [&::-webkit-inner-spin-button]:appearance-none
                    "
                  />
                </div>
                {precioCustom > 0 && (
                  <p className="mt-2 text-xs text-white/40">
                    Con IVA:{" "}
                    <span className="text-white/70 font-medium">
                      {formatMXN(precioCustom * 1.16)}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Cupón */}
            {!esGenerico && (
              <CuponInput
                cuponActivo={cuponActivo}
                onCuponAplicado={handleCuponAplicado}
                onCuponQuitado={handleCuponQuitado}
              />
            )}

            {cuponActivo && !esGenerico && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm">
                <div className="flex justify-between text-white/50">
                  <span>Subtotal ({cantidad} uds.)</span>
                  <span>{formatMXN(subtotalPreview)}</span>
                </div>
                <div className="flex justify-between text-teal-300">
                  <span>Descuento</span>
                  <span>− {formatMXN(descuentoPreview)}</span>
                </div>
                <div className="mt-2 flex justify-between border-t border-white/10 pt-2 font-bold text-white">
                  <span>Total</span>
                  <span>{formatMXN(totalPreview)}</span>
                </div>
              </div>
            )}

            {/* Cantidad + Agregar */}
            <div className="flex gap-3">
              <div className="flex items-center rounded-2xl border border-white/10 bg-white/[0.03]">
                <button
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  className="flex h-12 w-12 items-center justify-center text-white/50 hover:text-white transition-colors"
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
                <span className="w-8 text-center text-sm font-bold text-white">
                  {cantidad}
                </span>
                <button
                  onClick={() => setCantidad((c) => c + 1)}
                  className="flex h-12 w-12 items-center justify-center text-white/50 hover:text-white transition-colors"
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
                disabled={
                  stockTotal === 0 || (esGenerico && precioCustom <= 0)
                }
                className="
                  flex-1 rounded-2xl
                  bg-gradient-to-r from-teal-400 to-[#02AFFF]
                  font-semibold text-black
                  transition-all hover:opacity-90
                  active:scale-[0.98]
                  disabled:opacity-30 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2
                "
              >
                {agregado ? (
                  <>
                    <svg
                      className="h-4 w-4"
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
                  </>
                ) : stockTotal === 0 ? (
                  "Sin stock"
                ) : lineaActual ? (
                  "Agregar más"
                ) : (
                  "Agregar al carrito"
                )}
              </button>
            </div>

            {/* Sugerencias */}
            {esDisco && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
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
                          <p className="text-sm font-medium text-white/80 truncate">
                            {sugerido.descripcion}
                          </p>
                          <p className="text-xs text-white/40">
                            {formatMXN(sugerido.precio * 1.16)} c/IVA
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            !yaAgregado && handleAgregarSugerido(sugerido)
                          }
                          disabled={yaAgregado}
                          className={`
                            shrink-0 rounded-xl px-3 py-1.5 text-xs font-medium
                            transition-all
                            ${
                              yaAgregado
                                ? "bg-teal-400/10 text-teal-300 cursor-default"
                                : "border border-white/10 text-white/60 hover:border-teal-400/30 hover:text-teal-300"
                            }
                          `}
                        >
                          {yaAgregado ? "Agregado" : "+ Agregar"}
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

function StockTag({ stockTotal }: { stockTotal: number }) {
  return (
    <span
      className={`text-xs font-medium ${stockTotal > 0 ? "text-teal-300" : "text-red-400"}`}
    >
      {stockTotal > 0 ? `${stockTotal} disponibles` : "Sin stock"}
    </span>
  );
}
