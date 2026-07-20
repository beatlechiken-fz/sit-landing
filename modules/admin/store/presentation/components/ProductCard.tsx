"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/modules/admin/store/domain/entities/product.entity";
import { ProductModal } from "./ProductModal";
import { calcularPrecioFinal, formatMXN } from "@/core/helpers/precio.utils";

// ─────────────────────────────────────────────
// Subcomponentes
// ─────────────────────────────────────────────
function StockBadge({
  disponible,
  disponibleCD,
}: {
  disponible: number;
  disponibleCD: number;
}) {
  const total = disponible + disponibleCD;
  if (total === 0)
    return (
      <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400">
        Sin stock
      </span>
    );
  if (total <= 5)
    return (
      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
        Pocas unidades
      </span>
    );
  return (
    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
      Disponible
    </span>
  );
}

function MonedaBadge({ moneda }: { moneda: "Pesos" | "Dolares" | null }) {
  if (!moneda) return null;
  return (
    <span
      className={`
        rounded-full px-2 py-0.5 text-xs font-medium
        ${
          moneda === "Dolares"
            ? "bg-blue-500/10 text-blue-400"
            : "bg-emerald-500/10 text-emerald-400"
        }
      `}
    >
      {moneda === "Dolares" ? "USD" : "MXN"}
    </span>
  );
}

// ─────────────────────────────────────────────
// ProductCard
// ─────────────────────────────────────────────
export function ProductCard({
  product,
  ganancia,
  tipoCambio,
}: {
  product: Product;
  ganancia: number;
  tipoCambio: number;
}) {
  const [modalAbierto, setModalAbierto] = useState(false);

  // Precio calculado — siempre en MXN
  const precioFinal = product.precio
    ? calcularPrecioFinal(product.precio, ganancia, product.moneda, tipoCambio)
    : null;

  return (
    <>
      <div
        onClick={() => setModalAbierto(true)}
        className="
          group flex flex-col cursor-pointer
          rounded-2xl border border-zinc-800
          bg-zinc-900
          overflow-hidden
          transition-all duration-200
          hover:border-[#02AFFF]/40 hover:shadow-lg hover:shadow-[#02AFFF]/5
          hover:-translate-y-0.5
        "
      >
        {/* Área de imagen */}
        <div className="relative flex h-44 items-center justify-center bg-zinc-950 px-6 py-5">
          {/* Glow sutil */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-28 w-28 rounded-full bg-[#02AFFF]/5 blur-xl" />
          </div>

          {/* Logo de marca */}
          {product.brandImage && (
            <div className="absolute top-3 left-3 z-10">
              <Image
                src={product.brandImage}
                alt={product.marca}
                width={40}
                height={20}
                className="object-contain opacity-70"
              />
            </div>
          )}

          {/* Imagen circular */}
          <div
            className="
            relative z-10
            h-28 w-28 rounded-full
            border border-zinc-700/50
            bg-white
            overflow-hidden
            flex items-center justify-center
            group-hover:border-[#02AFFF]/30
            transition-colors duration-200
          "
          >
            {product.imagen ? (
              <Image
                src={product.imagen}
                alt={product.descripcion}
                width={100}
                height={100}
                className="object-contain p-2 transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <svg
                className="h-10 w-10 text-zinc-400"
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
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-2.5 p-4 border-t border-zinc-800">
          {/* Marca + clave */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-[#02AFFF]">
              {product.marca}
            </span>
            <span className="text-xs text-zinc-600">{product.clave}</span>
          </div>

          {/* Descripción */}
          <p className="line-clamp-2 flex-1 text-sm font-medium leading-snug text-zinc-200">
            {product.descripcion}
          </p>

          {/* Precio */}
          {precioFinal ? (
            <p className="text-lg font-bold text-zinc-100">
              {formatMXN(precioFinal)}
            </p>
          ) : (
            <p className="text-sm text-zinc-600">Sin precio</p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            <StockBadge
              disponible={product.disponible}
              disponibleCD={product.disponibleCD}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalAbierto && (
        <ProductModal
          product={product}
          ganancia={ganancia}
          tipoCambio={tipoCambio}
          onClose={() => setModalAbierto(false)}
        />
      )}
    </>
  );
}
