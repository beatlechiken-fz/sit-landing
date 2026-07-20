"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/modules/admin/store/domain/entities/product.entity";
import { ProductDetailModal } from "./ProductDetailModal";
import { calcularPrecioFinal, formatMXN } from "@/core/helpers/precio.utils";

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
      <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[11px] font-medium text-red-400">
        Sin stock
      </span>
    );
  if (total <= 5)
    return (
      <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-400">
        Últimas piezas
      </span>
    );
  return (
    <span className="rounded-full bg-teal-400/10 px-2.5 py-1 text-[11px] font-medium text-teal-300">
      Disponible
    </span>
  );
}

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

  const precioFinal = product.precio
    ? calcularPrecioFinal(product.precio, ganancia, product.moneda, tipoCambio)
    : null;

  return (
    <>
      <div
        onClick={() => setModalAbierto(true)}
        className="
          group flex flex-col cursor-pointer
          rounded-3xl border border-white/10
          bg-white/[0.02]
          overflow-hidden
          transition-all duration-300
          hover:border-teal-400/30 hover:bg-white/[0.04]
          hover:-translate-y-1
        "
      >
        {/* Imagen */}
        <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-b from-white/[0.03] to-transparent px-6 py-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-40 w-40 rounded-full bg-gradient-to-br from-teal-400/10 to-[#02AFFF]/10 blur-2xl transition-opacity duration-300 group-hover:opacity-80" />
          </div>

          {product.brandImage && (
            <div className="absolute top-4 left-4 z-10">
              <Image
                src={product.brandImage}
                alt={product.marca}
                width={44}
                height={22}
                className="object-contain opacity-80"
              />
            </div>
          )}

          <div
            className="
            relative z-10
            h-32 w-32 rounded-2xl
            bg-white
            overflow-hidden
            flex items-center justify-center
            shadow-xl shadow-black/30
            transition-transform duration-300 group-hover:scale-105
          "
          >
            {product.imagen ? (
              <Image
                src={product.imagen}
                alt={product.descripcion}
                width={112}
                height={112}
                className="object-contain p-3"
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
        <div className="flex flex-1 flex-col gap-2.5 p-5 border-t border-white/5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-teal-300">
            {product.marca}
          </span>

          <p className="line-clamp-2 flex-1 text-[15px] font-medium leading-snug text-white/90">
            {product.descripcion}
          </p>

          <div className="flex items-end justify-between pt-1">
            {precioFinal ? (
              <p className="text-xl font-bold text-white">
                {formatMXN(precioFinal)}
              </p>
            ) : (
              <p className="text-sm text-white/40">Sin precio</p>
            )}
            <StockBadge
              disponible={product.disponible}
              disponibleCD={product.disponibleCD}
            />
          </div>
        </div>
      </div>

      {modalAbierto && (
        <ProductDetailModal
          product={product}
          ganancia={ganancia}
          tipoCambio={tipoCambio}
          onClose={() => setModalAbierto(false)}
        />
      )}
    </>
  );
}
