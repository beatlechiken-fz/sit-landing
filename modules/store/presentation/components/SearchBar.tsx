"use client";

import { useCallback, useRef, useState } from "react";
import { useUIStore } from "../store/ui.store";

export function SearchBar({
  value,
  onChange,
  filtrosActivos,
}: {
  value: string;
  onChange: (v: string) => void;
  filtrosActivos: number;
}) {
  const toggleFiltros = useUIStore((s) => s.toggleFiltros);
  const [search, setSearch] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const emit = useCallback(
    (v: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onChange(v), 300);
    },
    [onChange],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setSearch(v);
    emit(v);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      onChange(search);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggleFiltros}
        className="
          relative flex h-14 w-14 shrink-0 items-center justify-center
          rounded-2xl border border-white/10 bg-white/[0.03]
          transition-colors hover:bg-white/[0.06]
        "
        aria-label="Filtros"
      >
        <svg
          className="h-5 w-5 text-white/70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.6}
            d="M3 4h18M6 12h12M10 20h4"
          />
        </svg>
        {filtrosActivos > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-teal-400 to-[#02AFFF] text-[10px] font-bold text-black">
            {filtrosActivos}
          </span>
        )}
      </button>

      <div className="relative flex-1">
        <input
          type="text"
          value={search}
          placeholder="Busca por nombre, marca o clave..."
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="
            h-14 w-full
            rounded-2xl border border-white/10 bg-white/[0.03]
            pl-5 pr-14
            text-white placeholder:text-white/30
            outline-none focus:border-white/25
            transition-colors
          "
        />
        <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2">
          <svg
            className="h-5 w-5 text-white/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
