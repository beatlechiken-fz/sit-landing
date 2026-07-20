export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      {/* Ícono */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100">
        <svg
          className="h-12 w-12 text-zinc-300"
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

      {/* Copy */}
      <h2 className="text-xl font-bold text-zinc-800">
        Encuentra lo que necesitas
      </h2>
      <p className="mt-2 max-w-sm text-sm text-zinc-500">
        Escribe el nombre de un producto, marca o clave en el buscador, o
        selecciona una categoría para explorar el catálogo.
      </p>

      {/* Sugerencias de búsqueda */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
          Búsquedas populares
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {["Laptop", "Monitor", "SSD", "Switch", "Teclado", "Webcam"].map(
            (term) => (
              <a
                key={term}
                href={`?q=${term}`}
                className="
                rounded-full border border-zinc-200 bg-white
                px-4 py-1.5 text-sm text-zinc-600
                transition-colors
                hover:border-[#02AFFF] hover:text-[#02AFFF]
              "
              >
                {term}
              </a>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
