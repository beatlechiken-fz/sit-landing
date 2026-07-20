import { Suspense } from "react";

import { SupabaseProductDatasource } from "../../data/datasources/supabase/product.datasource";
import { ProductRepositoryImpl } from "../../data/repositories/product.repository.impl";
import { GetProductsUseCase } from "../../domain/usecases/get-products.usecase";
import { ProductFilter } from "../../domain/entities/product-filter.entity";
import { SearchFilterBar } from "@/core/components/search-filter-bar/SearchFilterBar";
import { ProductGrid } from "./ProductGrid";
import { ProductGridSkeleton } from "./ProductGridSkeleton";
import { EmptyState } from "./EmptyState";
import { FiltrosPanel } from "./FiltrosPanel";

// ─────────────────────────────────────────────
// Composición de dependencias
// ─────────────────────────────────────────────
const datasource = new SupabaseProductDatasource();
const repository = new ProductRepositoryImpl(datasource);
const getProducts = new GetProductsUseCase(repository);
const getMarcas = () => repository.getMarcas();
const getGrupos = () => repository.getGrupos();
const getGanancias = () => repository.getGanancias();
const getTipoCambio = () => repository.getTipoCambio();

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────
interface StorePageProps {
  searchParams: Promise<{
    q?: string;
    marca?: string;
    grupo?: string;
    moneda?: string;
    soloAlmacen?: string;
    soloCD?: string;
    orden?: string;
    page?: string;
  }>;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function toFilter(
  params: Awaited<StorePageProps["searchParams"]>,
): ProductFilter {
  return {
    q: params.q ?? undefined,
    marca: params.marca ?? undefined,
    grupo: params.grupo ?? undefined,
    moneda: (params.moneda as ProductFilter["moneda"]) ?? undefined,
    soloAlmacen: params.soloAlmacen === "true",
    soloCD: params.soloCD === "true",
    orden: (params.orden as ProductFilter["orden"]) ?? "precio_asc",
    page: params.page ? Number(params.page) : 1,
    pageSize: 24,
  };
}

function hasActiveFilters(
  params: Awaited<StorePageProps["searchParams"]>,
): boolean {
  return !!(
    params.q ||
    params.marca ||
    params.grupo ||
    params.moneda ||
    params.soloAlmacen ||
    params.soloCD
  );
}

function buildQuery(
  base: Record<string, string | undefined>,
  overrides: Record<string, string>,
): string {
  const merged: Record<string, string> = {};
  for (const [key, value] of Object.entries(base)) {
    if (value !== undefined) merged[key] = value;
  }
  return new URLSearchParams({ ...merged, ...overrides }).toString();
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default async function StoreView({ searchParams }: StorePageProps) {
  const params = await searchParams;
  const active = hasActiveFilters(params);
  const filter = toFilter(params);

  // Llamadas paralelas — marcas y grupos siempre, productos solo si hay filtros
  const [marcas, grupos, ganancias, tipoCambio, result] = await Promise.all([
    getMarcas(),
    getGrupos(),
    getGanancias(),
    getTipoCambio(),
    active ? getProducts.execute(filter) : Promise.resolve(null),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-4 w-full">
      {/* Encabezado dark */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Catálogo
          </h1>
          <span className="text-2xl font-light text-zinc-500">
            de productos
          </span>
        </div>

        <div className="mt-1 flex items-center gap-2">
          {result ? (
            <>
              <span className="inline-flex items-center gap-1.5 text-sm text-zinc-400">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {result.total.toLocaleString("es-MX")} productos encontrados
              </span>
              {params.q && (
                <span className="text-sm text-zinc-600">
                  para{" "}
                  <span className="font-medium text-zinc-300">
                    &ldquo;{params.q}&rdquo;
                  </span>
                </span>
              )}
            </>
          ) : (
            <span className="text-sm text-zinc-600">
              Busca o filtra para explorar el catálogo
            </span>
          )}
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <SearchFilterBar defaultValue={params.q} />
      </div>

      <FiltrosPanel marcas={marcas} grupos={grupos} paramsActivos={params} />

      {/* Contenido principal */}
      {!active ? (
        <EmptyState />
      ) : (
        <>
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid
              products={result!.data}
              ganancias={ganancias}
              tipoCambio={tipoCambio}
            />
          </Suspense>

          {/* Paginación */}
          {result!.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2 text-sm">
              {result!.hasPrev && (
                <a
                  href={`/admin/dashboard/store?${buildQuery(params, {
                    page: String((filter.page ?? 1) - 1),
                  })}`}
                  className="
                    rounded-lg border border-zinc-700 bg-zinc-800
                    px-4 py-2 text-zinc-300
                    transition-colors hover:bg-zinc-700
                  "
                >
                  ← Anterior
                </a>
              )}

              <span className="text-zinc-500">
                Página{" "}
                <span className="font-medium text-zinc-300">
                  {result!.page}
                </span>{" "}
                de{" "}
                <span className="font-medium text-zinc-300">
                  {result!.totalPages}
                </span>
              </span>

              {result!.hasNext && (
                <a
                  href={`/admin/dashboard/store?${buildQuery(params, {
                    page: String((filter.page ?? 1) + 1),
                  })}`}
                  className="
                    rounded-lg border border-[#02AFFF]/40 bg-[#02AFFF]/10
                    px-4 py-2 text-[#02AFFF]
                    transition-colors hover:bg-[#02AFFF]/20
                  "
                >
                  Siguiente →
                </a>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}
