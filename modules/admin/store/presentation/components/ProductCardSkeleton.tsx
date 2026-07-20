export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white overflow-hidden">
      {/* Imagen */}
      <div className="h-44 bg-zinc-100 animate-pulse" />

      <div className="flex flex-col gap-3 p-4">
        {/* Marca + clave */}
        <div className="flex items-center justify-between">
          <div className="h-3 w-16 rounded-full bg-zinc-200 animate-pulse" />
          <div className="h-3 w-12 rounded-full bg-zinc-200 animate-pulse" />
        </div>

        {/* Descripción — 2 líneas */}
        <div className="flex flex-col gap-2">
          <div className="h-3 w-full rounded-full bg-zinc-200 animate-pulse" />
          <div className="h-3 w-3/4 rounded-full bg-zinc-200 animate-pulse" />
        </div>

        {/* Precio */}
        <div className="h-6 w-24 rounded-full bg-zinc-200 animate-pulse" />

        {/* Badges */}
        <div className="flex gap-2">
          <div className="h-5 w-20 rounded-full bg-zinc-200 animate-pulse" />
          <div className="h-5 w-12 rounded-full bg-zinc-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
