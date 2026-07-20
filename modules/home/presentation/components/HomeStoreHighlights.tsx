"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Product } from "@/modules/admin/store/domain/entities/product.entity";
import { calcularPrecioFinal, formatMXN } from "@/core/helpers/precio.utils";
import { HomeCTAButton } from "./HomeCTAButton";

interface HomeStoreHighlightsProps {
  productos: Product[];
  grupos: string[];
  ganancias: Record<string, number>;
  tipoCambio: number;
}

export default function HomeStoreHighlights({
  productos,
  grupos,
  ganancias,
  tipoCambio,
}: HomeStoreHighlightsProps) {
  const t = useTranslations("homeV2.store");

  return (
    <section className="w-[85%] max-w-7xl flex flex-col items-center gap-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center gap-4"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
          {t("eyebrow")}
        </span>
        <h2 className="text-[clamp(2rem,4.5vw,3.4rem)] font-bold leading-tight font-title">
          {t("title1")}{" "}
          <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
            {t("title2")}
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl">{t("desc")}</p>
      </motion.div>

      {/* Productos destacados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {productos.map((product, i) => {
          const precioFinal = product.precio
            ? calcularPrecioFinal(
                product.precio,
                ganancias[product.grupo] ?? 0,
                product.moneda,
                tipoCambio,
              )
            : null;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-teal-400/40 transition-colors"
            >
              <div className="relative flex h-40 items-center justify-center bg-black/30 p-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-teal-400/10 to-sky-400/10 blur-xl" />
                </div>
                {product.imagen ? (
                  <Image
                    src={product.imagen}
                    alt={product.descripcion}
                    width={96}
                    height={96}
                    className="relative z-10 object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <svg
                    className="relative z-10 h-10 w-10 text-white/20"
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

              <div className="flex flex-1 flex-col gap-1.5 p-4 border-t border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-widest text-teal-300">
                  {product.marca}
                </span>
                <p className="line-clamp-2 flex-1 text-sm font-medium text-white/90">
                  {product.descripcion}
                </p>
                <p className="mt-1 text-lg font-bold text-white">
                  {precioFinal ? formatMXN(precioFinal) : t("noPrice")}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Categorías destacadas */}
      {grupos.length > 0 && (
        <div className="flex flex-col items-center gap-4 w-full">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            {t("categoriesLabel")}
          </span>
          <div className="flex flex-wrap justify-center gap-3">
            {grupos.map((grupo) => (
              <Link
                key={grupo}
                href={`/store?grupo=${encodeURIComponent(grupo)}`}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-gray-300 hover:border-teal-400/40 hover:text-white transition-colors"
              >
                {grupo}
              </Link>
            ))}
          </div>
        </div>
      )}

      <HomeCTAButton href="/store">
        {t("cta")}
        <span aria-hidden>→</span>
      </HomeCTAButton>
    </section>
  );
}
