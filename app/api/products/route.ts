import { NextRequest, NextResponse } from "next/server";

import { SupabaseProductDatasource } from "@/modules/admin/store/data/datasources/supabase/product.datasource";
import { ProductRepositoryImpl } from "@/modules/admin/store/data/repositories/product.repository.impl";
import { GetProductsUseCase } from "@/modules/admin/store/domain/usecases/get-products.usecase";
import { ProductFilter } from "@/modules/admin/store/domain/entities/product-filter.entity";
import { requireAuth } from "@/core/helpers/require-auth";

// ─────────────────────────────────────────────
// Composición de dependencias
// ─────────────────────────────────────────────
const datasource = new SupabaseProductDatasource();
const repository = new ProductRepositoryImpl(datasource);
const getProducts = new GetProductsUseCase(repository);

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
// Route Handler
// ─────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const unauth = await requireAuth(req);
    if (unauth) return unauth;

    const params = req.nextUrl.searchParams;
    const filter = parseFilter(params);

    const result = await getProducts.execute(filter);

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
