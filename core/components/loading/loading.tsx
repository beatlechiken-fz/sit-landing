import { ProductGridSkeleton } from "@/modules/admin/store/presentation/components/ProductGridSkeleton";

export default function StoreLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      {/* SearchBar skeleton */}
      <div className="mb-6 h-16 w-full rounded-2xl bg-zinc-900 animate-pulse" />

      {/* Grid skeleton */}
      <ProductGridSkeleton />
    </main>
  );
}
