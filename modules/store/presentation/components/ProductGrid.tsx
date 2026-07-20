import { Product } from "@/modules/admin/store/domain/entities/product.entity";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  ganancias: Record<string, number>;
  tipoCambio: number;
}

export function ProductGrid({
  products,
  ganancias,
  tipoCambio,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
          <svg
            className="h-7 w-7 text-white/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
        </div>
        <p className="text-lg font-medium text-white/70">
          No encontramos productos
        </p>
        <p className="mt-1 text-sm text-white/40">
          Intenta con otros términos de búsqueda o ajusta los filtros
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          ganancia={ganancias[product.grupo] ?? 0}
          tipoCambio={tipoCambio}
        />
      ))}
    </div>
  );
}
