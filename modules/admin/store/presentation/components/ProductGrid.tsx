import { Product } from "../../domain/entities/product.entity";
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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-zinc-400">
          No se encontraron productos
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          Intenta con otros términos de búsqueda o filtros
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
