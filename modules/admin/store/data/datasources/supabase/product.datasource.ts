import { unstable_cache } from "next/cache";

import { getSupabaseServerClient } from "./supabase-server.client";
import { ProductModel, toProductEntity } from "../../models/product.model";
import { ProductFilter } from "../../../domain/entities/product-filter.entity";
import { PaginatedResult } from "../../../domain/entities/paginated-result.entity";
import { Product } from "../../../domain/entities/product.entity";

// ─────────────────────────────────────────────
// Constantes de cache
// ─────────────────────────────────────────────
const REVALIDATE = 86_400; // 24 horas — el cron corre diario

// ─────────────────────────────────────────────
// Funciones puras que hacen la query a Supabase
// (definidas fuera de la clase para que unstable_cache
//  pueda serializarlas correctamente)
// ─────────────────────────────────────────────

async function fetchProducts(
  filter: ProductFilter,
): Promise<PaginatedResult<Product>> {
  const supabase = getSupabaseServerClient();
  const pageSize = filter.pageSize ?? 24;
  const page = filter.page ?? 1;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("catalogo")
    .select("*", { count: "exact" })
    // Excluir productos sin precio
    .not("precio", "is", null);

  // Full-text search
  if (filter.q?.trim()) {
    query = query.textSearch("fts", filter.q.trim(), {
      type: "websearch",
      config: "spanish",
    });
  }

  // Filtros exactos
  if (filter.marca) query = query.ilike("marca", `%${filter.marca}%`);
  if (filter.grupo) query = query.eq("grupo", filter.grupo);
  if (filter.principal) query = query.eq("principal", filter.principal);
  if (filter.moneda) query = query.eq("moneda", filter.moneda);

  // Disponibilidad — almacén y CD son independientes
  if (filter.soloAlmacen && filter.soloCD) {
    // Si ambos están activos, productos con stock en cualquiera de los dos
    query = query.or("disponible.gt.0,disponible_cd.gt.0");
  } else if (filter.soloAlmacen) {
    query = query.gt("disponible", 0);
  } else if (filter.soloCD) {
    query = query.gt("disponible_cd", 0);
  }

  // Ordenamiento
  const orden = filter.orden ?? "precio_asc";

  switch (orden) {
    case "precio_asc":
      query = query.order("precio", { ascending: true, nullsFirst: false });
      break;
    case "precio_desc":
      query = query.order("precio", { ascending: false, nullsFirst: false });
      break;
    case "nombre_asc":
      query = query.order("descripcion", { ascending: true });
      break;
    case "nombre_desc":
      query = query.order("descripcion", { ascending: false });
      break;
    case "marca_asc":
      query = query.order("marca", { ascending: true });
      query = query.order("descripcion", { ascending: true });
      break;
  }

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw new Error(`Supabase error: ${error.message}`);

  const total = count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    data: (data as ProductModel[]).map(toProductEntity),
    total,
    page,
    pageSize,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

async function fetchProductById(id: number): Promise<Product | null> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("catalogo")
    .select("*")
    .eq("id_proveedor", id)
    .single();

  if (error || !data) return null;
  return toProductEntity(data as ProductModel);
}

async function fetchGrupos(): Promise<string[]> {
  const supabase = getSupabaseServerClient();

  // Usamos la tabla productos directamente con join a precios
  // para obtener grupos distintos sin límite de paginación
  const { data, error } = await supabase.rpc("get_grupos_disponibles");

  if (error || !data) return [];
  return data.map((r: { grupo: string }) => r.grupo).filter(Boolean);
}

async function fetchMarcas(): Promise<string[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase.rpc("get_marcas_disponibles");

  if (error || !data) return [];
  return data.map((r: { marca: string }) => r.marca).filter(Boolean);
}

// ─────────────────────────────────────────────
// Versiones cacheadas
// (se crean una sola vez al importar el módulo)
// ─────────────────────────────────────────────

const getCachedProducts = unstable_cache(
  fetchProducts,
  ["products-list"], // cache key base
  {
    tags: ["productos"],
    revalidate: REVALIDATE,
  },
);

const getCachedProductById = unstable_cache(
  fetchProductById,
  ["product-by-id"],
  {
    tags: ["productos"], // se invalida junto con el catálogo
    revalidate: REVALIDATE,
  },
);

const getCachedMarcas = unstable_cache(fetchMarcas, ["marcas-v2"], {
  tags: ["marcas"],
  revalidate: REVALIDATE,
});

const getCachedGrupos = unstable_cache(fetchGrupos, ["grupos-v2"], {
  tags: ["grupos"],
  revalidate: REVALIDATE,
});

async function fetchGanancias(): Promise<Record<string, number>> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase.rpc("get_ganancias_por_grupo");

  if (error || !data) return {};

  return Object.fromEntries(
    data.map((r: { grupo: string; ganancia: number }) => [
      r.grupo,
      Number(r.ganancia),
    ]),
  );
}

const getCachedGanancias = unstable_cache(fetchGanancias, ["ganancias-v1"], {
  tags: ["ganancias"],
  revalidate: REVALIDATE,
});

async function fetchProductosDestacados(): Promise<Product[]> {
  const supabase = getSupabaseServerClient();

  const { data: destacados } = await supabase
    .from("productos_destacados")
    .select("producto_id, orden")
    .order("orden", { ascending: true });

  // Fallback — sin destacados marcados, muestra los 4 más baratos
  if (!destacados || destacados.length === 0) {
    const { data } = await supabase
      .from("catalogo")
      .select("*")
      .not("precio", "is", null)
      .order("precio", { ascending: true })
      .limit(4);

    return ((data as ProductModel[]) ?? []).map(toProductEntity);
  }

  const ids = destacados.map((d) => d.producto_id);
  const { data } = await supabase
    .from("catalogo")
    .select("*")
    .in("id_proveedor", ids)
    .not("precio", "is", null);

  const productos = ((data as ProductModel[]) ?? []).map(toProductEntity);
  const ordenMap = new Map(destacados.map((d) => [d.producto_id, d.orden]));
  return productos.sort(
    (a, b) => (ordenMap.get(a.id) ?? 0) - (ordenMap.get(b.id) ?? 0),
  );
}

async function fetchGruposDestacados(): Promise<string[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("grupos_ganancia")
    .select("grupo")
    .eq("destacado", true);

  if (error || !data) return [];
  return data.map((r: { grupo: string }) => r.grupo).filter(Boolean);
}

const getCachedProductosDestacados = unstable_cache(
  fetchProductosDestacados,
  ["productos-destacados-v1"],
  { tags: ["productos-destacados"], revalidate: REVALIDATE },
);

const getCachedGruposDestacados = unstable_cache(
  fetchGruposDestacados,
  ["grupos-destacados-v1"],
  { tags: ["grupos-destacados"], revalidate: REVALIDATE },
);

async function fetchTipoCambio(): Promise<number> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("configuracion")
    .select("valor")
    .eq("clave", "tipo_cambio")
    .single();

  if (error || !data) return 17.5; // fallback seguro
  return Number(data.valor);
}

const getCachedTipoCambio = unstable_cache(
  fetchTipoCambio,
  ["tipo-cambio-v1"],
  { tags: ["tipo_cambio"], revalidate: REVALIDATE },
);

// ─────────────────────────────────────────────
// Datasource — ahora solo orquesta, no hace IO
// ─────────────────────────────────────────────

export class SupabaseProductDatasource {
  getProducts(filter: ProductFilter): Promise<PaginatedResult<Product>> {
    return getCachedProducts(filter);
  }

  getProductById(id: number): Promise<Product | null> {
    return getCachedProductById(id);
  }

  getMarcas(): Promise<string[]> {
    return getCachedMarcas();
  }

  getGrupos(): Promise<string[]> {
    return getCachedGrupos();
  }

  getGanancias(): Promise<Record<string, number>> {
    return getCachedGanancias();
  }

  getTipoCambio(): Promise<number> {
    return getCachedTipoCambio();
  }

  getProductosDestacados(): Promise<Product[]> {
    return getCachedProductosDestacados();
  }

  getGruposDestacados(): Promise<string[]> {
    return getCachedGruposDestacados();
  }
}
