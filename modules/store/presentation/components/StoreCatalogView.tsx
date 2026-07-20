"use client";

import { useEffect, useState } from "react";
import { SearchBar } from "./SearchBar";
import { FiltrosPanel } from "./FiltrosPanel";
import { ProductGrid } from "./ProductGrid";
import { PaginatedResult } from "@/modules/admin/store/domain/entities/paginated-result.entity";
import { Product } from "@/modules/admin/store/domain/entities/product.entity";
import { ProductFilter } from "@/modules/admin/store/domain/entities/product-filter.entity";

interface StoreCatalogViewProps {
  marcas: string[];
  grupos: string[];
  ganancias: Record<string, number>;
  tipoCambio: number;
  resultadoInicial: PaginatedResult<Product>;
}

const FILTRO_INICIAL: ProductFilter = {
  orden: "precio_asc",
  page: 1,
  pageSize: 24,
};

function buildQuery(filtro: ProductFilter): string {
  const params = new URLSearchParams();
  if (filtro.q) params.set("q", filtro.q);
  if (filtro.marca) params.set("marca", filtro.marca);
  if (filtro.grupo) params.set("grupo", filtro.grupo);
  if (filtro.moneda) params.set("moneda", filtro.moneda);
  if (filtro.soloAlmacen) params.set("soloAlmacen", "true");
  if (filtro.soloCD) params.set("soloCD", "true");
  if (filtro.orden) params.set("orden", filtro.orden);
  params.set("page", String(filtro.page ?? 1));
  params.set("pageSize", String(filtro.pageSize ?? 24));
  return params.toString();
}

export function StoreCatalogView({
  marcas,
  grupos,
  ganancias,
  tipoCambio,
  resultadoInicial,
}: StoreCatalogViewProps) {
  const [filtro, setFiltro] = useState<ProductFilter>(FILTRO_INICIAL);
  const [resultado, setResultado] =
    useState<PaginatedResult<Product>>(resultadoInicial);
  const [loading, setLoading] = useState(false);
  const [huboFetch, setHuboFetch] = useState(false);

  useEffect(() => {
    if (!huboFetch) {
      setHuboFetch(true);
      return;
    }

    let cancelado = false;
    setLoading(true);

    fetch(`/api/my-sit/store/products?${buildQuery(filtro)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelado) setResultado(data);
      })
      .finally(() => {
        if (!cancelado) setLoading(false);
      });

    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro]);

  const patchFiltro = (patch: Partial<ProductFilter>) => {
    setFiltro((prev) => ({ ...prev, ...patch, page: 1 }));
  };

  const limpiarFiltro = () => {
    setFiltro((prev) => ({
      ...FILTRO_INICIAL,
      q: prev.q,
    }));
  };

  const filtrosActivos = [
    filtro.marca,
    filtro.grupo,
    filtro.moneda,
    filtro.soloAlmacen,
    filtro.soloCD,
  ].filter(Boolean).length;

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-10 w-full">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-[clamp(2rem,4vw,3.25rem)] font-bold leading-tight font-title">
          <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
            Store
          </span>
        </h1>
        <p className="mt-2 text-white/50 max-w-xl">
          Equipo, componentes y servicios listos para tu negocio — con precio
          claro y disponibilidad real.
        </p>
      </div>

      {/* Búsqueda */}
      <div className="mb-6">
        <SearchBar
          value={filtro.q ?? ""}
          onChange={(v) => patchFiltro({ q: v || undefined })}
          filtrosActivos={filtrosActivos}
        />
      </div>

      <FiltrosPanel
        marcas={marcas}
        grupos={grupos}
        filtro={filtro}
        onChange={patchFiltro}
        onClear={limpiarFiltro}
      />

      {/* Contador */}
      <p className="mb-5 text-sm text-white/40">
        {loading
          ? "Buscando..."
          : `${resultado.total.toLocaleString("es-MX")} productos`}
      </p>

      <ProductGrid
        products={resultado.data}
        ganancias={ganancias}
        tipoCambio={tipoCambio}
      />

      {/* Paginación */}
      {resultado.totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3 text-sm">
          <button
            disabled={!resultado.hasPrev}
            onClick={() =>
              setFiltro((prev) => ({ ...prev, page: (prev.page ?? 1) - 1 }))
            }
            className="
              rounded-xl border border-white/10 bg-white/[0.03]
              px-4 py-2 text-white/70
              transition-colors hover:bg-white/[0.06]
              disabled:opacity-30 disabled:cursor-not-allowed
            "
          >
            ← Anterior
          </button>

          <span className="text-white/40">
            Página{" "}
            <span className="font-medium text-white/80">
              {resultado.page}
            </span>{" "}
            de{" "}
            <span className="font-medium text-white/80">
              {resultado.totalPages}
            </span>
          </span>

          <button
            disabled={!resultado.hasNext}
            onClick={() =>
              setFiltro((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))
            }
            className="
              rounded-xl border border-teal-400/30 bg-teal-400/10
              px-4 py-2 text-teal-300
              transition-colors hover:bg-teal-400/20
              disabled:opacity-30 disabled:cursor-not-allowed
            "
          >
            Siguiente →
          </button>
        </div>
      )}
    </main>
  );
}
