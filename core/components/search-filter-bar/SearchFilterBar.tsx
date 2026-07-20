"use client";

import Icons from "@/core/assets/Icons";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUIStore } from "@/modules/admin/store/presentation/store/ui.store";

export function SearchFilterBar({ defaultValue }: { defaultValue?: string }) {
  const toggleFiltros = useUIStore((s) => s.toggleFiltros);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(defaultValue ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearch(searchParams.get("q") ?? "");
  }, [searchParams]);

  const navigate = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim().length >= 2) {
        params.set("q", value.trim());
      } else {
        params.delete("q");
      }
      params.delete("page");
      router.push(`/admin/dashboard/store?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSearch(newValue);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => navigate(newValue), 300);
    },
    [navigate],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        navigate(search);
      }
    },
    [navigate, search],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="w-full bg-black p-4 rounded-2xl">
      <div className="flex items-center gap-3">
        {/* Botón filtros */}
        <button
          onClick={toggleFiltros}
          className="
            flex h-12 w-12 shrink-0 items-center justify-center
            rounded-xl border border-zinc-700 bg-zinc-900
            transition-colors hover:bg-zinc-800
          "
          aria-label="Filtros"
        >
          <Image src={Icons.filter} alt="Filter" width={22} height={22} />
        </button>

        {/* Input con lupa decorativa a la derecha */}
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            placeholder="Buscar..."
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="
              h-12 w-full
              rounded-xl border border-zinc-700 bg-zinc-900
              pl-4 pr-12
              text-white placeholder:text-zinc-500
              outline-none focus:border-zinc-500
              transition-colors
            "
          />
          {/* Lupa decorativa — no es botón */}
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
            <Image
              src={Icons.search}
              alt=""
              width={20}
              height={20}
              style={{ opacity: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
