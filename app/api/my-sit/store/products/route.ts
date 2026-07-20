import { NextRequest, NextResponse } from "next/server";

import { SupabaseProductDatasource } from "@/modules/admin/store/data/datasources/supabase/product.datasource";
import { ProductRepositoryImpl } from "@/modules/admin/store/data/repositories/product.repository.impl";
import { GetProductsUseCase } from "@/modules/admin/store/domain/usecases/get-products.usecase";
import { SearchProductsUseCase } from "@/modules/admin/store/domain/usecases/search-products.usecase";
import { ProductFilter } from "@/modules/admin/store/domain/entities/product-filter.entity";

// ─────────────────────────────────────────────
// Composición de dependencias
// ─────────────────────────────────────────────
const datasource = new SupabaseProductDatasource();
const repository = new ProductRepositoryImpl(datasource);
const getProducts = new GetProductsUseCase(repository);
const searchProducts = new SearchProductsUseCase(repository);

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function parseFilter(params: URLSearchParams): ProductFilter {
  return {
    q: params.get("q") ?? undefined,
    marca: params.get("marca") ?? undefined,
    grupo: params.get("grupo") ?? undefined,
    principal: params.get("principal") ?? undefined,
    moneda: (params.get("moneda") as ProductFilter["moneda"]) ?? undefined,
    soloAlmacen: params.get("soloAlmacen") === "true",
    soloCD: params.get("soloCD") === "true",
    orden: (params.get("orden") as ProductFilter["orden"]) ?? "precio_asc",
    page: params.get("page") ? Number(params.get("page")) : 1,
    pageSize: params.get("pageSize") ? Number(params.get("pageSize")) : 24,
  };
}

// ─────────────────────────────────────────────
// GET público — catálogo de la tienda en línea
// ─────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const filter = parseFilter(params);
    const hasSearch = (filter.q?.trim()?.length ?? 0) >= 2;

    const result = hasSearch
      ? await searchProducts.execute(filter)
      : await getProducts.execute(filter);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
