import { ProductCardSkeleton } from "./ProductCardSkeleton";

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 24 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
