"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUIStore } from "../store/ui.store";
import { OrdenProducto } from "@/modules/admin/store/domain/entities/product-filter.entity";

interface FiltrosPanelProps {
  marcas: string[];
  grupos: string[];
  paramsActivos: {
    q?: string;
    marca?: string;
    grupo?: string;
    moneda?: string;
    soloAlmacen?: string;
    soloCD?: string;
    orden?: string;
    page?: string;
  };
}

const ORDENES: { value: OrdenProducto; label: string }[] = [
  { value: "precio_asc", label: "Precio: menor a mayor" },
  { value: "precio_desc", label: "Precio: mayor a menor" },
  { value: "nombre_asc", label: "Nombre: A → Z" },
  { value: "nombre_desc", label: "Nombre: Z → A" },
  { value: "marca_asc", label: "Marca: A → Z" },
];

const MONEDAS = [
  { value: "Pesos", label: "Pesos (MXN)" },
  { value: "Dolares", label: "Dólares (USD)" },
];

export function FiltrosPanel({
  marcas,
  grupos,
  paramsActivos,
}: FiltrosPanelProps) {
  const { filtrosPanelAbierto, cerrarFiltros } = useUIStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [buscarMarca, setBuscarMarca] = useState("");
  const [buscarGrupo, setBuscarGrupo] = useState("");

  const marcasFiltradas = buscarMarca.trim()
    ? marcas.filter((m) => m.toLowerCase().includes(buscarMarca.toLowerCase()))
    : marcas;

  const gruposFiltrados = buscarGrupo.trim()
    ? grupos.filter((g) => g.toLowerCase().includes(buscarGrupo.toLowerCase()))
    : grupos;

  // Cierra con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrarFiltros();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [cerrarFiltros]);

  // Bloquea scroll cuando está abierto
  useEffect(() => {
    document.body.style.overflow = filtrosPanelAbierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filtrosPanelAbierto]);

  const aplicarFiltro = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/admin/dashboard/store?${params.toString()}`);
  };

  const limpiarFiltros = () => {
    const params = new URLSearchParams();
    if (paramsActivos.q) params.set("q", paramsActivos.q);
    router.push(`/admin/dashboard/store?${params.toString()}`);
    setBuscarMarca("");
    setBuscarGrupo("");
    cerrarFiltros();
  };

  const filtrosActivos = !!(
    paramsActivos.marca ||
    paramsActivos.grupo ||
    paramsActivos.moneda ||
    paramsActivos.soloAlmacen ||
    paramsActivos.soloCD
  );

  const contadorFiltros = [
    paramsActivos.marca,
    paramsActivos.grupo,
    paramsActivos.moneda,
    paramsActivos.soloAlmacen,
    paramsActivos.soloCD,
  ].filter(Boolean).length;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={cerrarFiltros}
        className={`
          fixed inset-0 z-40 bg-black/60 backdrop-blur-sm
          transition-opacity duration-300
          ${filtrosPanelAbierto ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* Panel */}
      <div
        className={`
        fixed left-0 top-0 z-50
        h-full w-80
        border-r border-zinc-800 bg-zinc-950
        shadow-2xl
        transition-transform duration-300 ease-in-out
        ${filtrosPanelAbierto ? "translate-x-0" : "-translate-x-full"}
        flex flex-col
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-zinc-100">Filtros</h2>
            {filtrosActivos && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#02AFFF] text-xs font-bold text-white">
                {contadorFiltros}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {filtrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="text-xs text-zinc-500 underline hover:text-zinc-300 transition-colors"
              >
                Limpiar todo
              </button>
            )}
            <button
              onClick={cerrarFiltros}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenido scrolleable sin scrollbar visible */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Ordenar */}
          <Section title="Ordenar por">
            <div className="space-y-0.5">
              {ORDENES.map((o) => (
                <RadioItem
                  key={o.value}
                  label={o.label}
                  checked={(paramsActivos.orden ?? "precio_asc") === o.value}
                  onChange={() => aplicarFiltro("orden", o.value)}
                />
              ))}
            </div>
          </Section>

          {/* Disponibilidad */}
          <Section title="Disponibilidad">
            <div className="space-y-0.5">
              <CheckboxItem
                label="Solo en almacén"
                checked={paramsActivos.soloAlmacen === "true"}
                onChange={(v) =>
                  aplicarFiltro("soloAlmacen", v ? "true" : null)
                }
              />
              <CheckboxItem
                label="Solo en CD"
                checked={paramsActivos.soloCD === "true"}
                onChange={(v) => aplicarFiltro("soloCD", v ? "true" : null)}
              />
            </div>
          </Section>

          {/* Moneda */}
          <Section title="Moneda">
            <div className="space-y-0.5">
              <RadioItem
                label="Todas"
                checked={!paramsActivos.moneda}
                onChange={() => aplicarFiltro("moneda", null)}
              />
              {MONEDAS.map((m) => (
                <RadioItem
                  key={m.value}
                  label={m.label}
                  checked={paramsActivos.moneda === m.value}
                  onChange={() => aplicarFiltro("moneda", m.value)}
                />
              ))}
            </div>
          </Section>

          {/* Categoría con buscador */}
          <Section title="Categoría">
            <SearchInput
              value={buscarGrupo}
              onChange={setBuscarGrupo}
              placeholder="Buscar categoría..."
            />
            <div className="mt-2 space-y-0.5 overflow-y-auto max-h-52 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <RadioItem
                label="Todas las categorías"
                checked={!paramsActivos.grupo}
                onChange={() => {
                  aplicarFiltro("grupo", null);
                  setBuscarGrupo("");
                }}
              />
              {gruposFiltrados.length === 0 ? (
                <p className="px-3 py-2 text-xs text-zinc-600">
                  Sin resultados
                </p>
              ) : (
                gruposFiltrados.map((g) => (
                  <RadioItem
                    key={g}
                    label={g}
                    checked={paramsActivos.grupo === g}
                    onChange={() => aplicarFiltro("grupo", g)}
                  />
                ))
              )}
            </div>
          </Section>

          {/* Marca con buscador */}
          <Section title="Marca">
            <SearchInput
              value={buscarMarca}
              onChange={setBuscarMarca}
              placeholder="Buscar marca..."
            />
            <div className="mt-2 space-y-0.5 overflow-y-auto max-h-52 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <RadioItem
                label="Todas las marcas"
                checked={!paramsActivos.marca}
                onChange={() => {
                  aplicarFiltro("marca", null);
                  setBuscarMarca("");
                }}
              />
              {marcasFiltradas.length === 0 ? (
                <p className="px-3 py-2 text-xs text-zinc-600">
                  Sin resultados
                </p>
              ) : (
                marcasFiltradas.map((m) => (
                  <RadioItem
                    key={m}
                    label={m}
                    checked={paramsActivos.marca === m}
                    onChange={() => aplicarFiltro("marca", m)}
                  />
                ))
              )}
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 px-5 py-4 shrink-0">
          <button
            onClick={cerrarFiltros}
            className="w-full rounded-xl bg-[#02AFFF] py-3 font-semibold text-white transition-colors hover:bg-[#1961B0] active:scale-95"
          >
            Ver resultados
          </button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// Subcomponentes
// ─────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
        {title}
      </p>
      {children}
    </div>
  );
}

function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full rounded-lg border border-zinc-800 bg-zinc-900
          py-2 pl-8 pr-3 text-xs text-zinc-300
          placeholder:text-zinc-600
          outline-none focus:border-zinc-600
          transition-colors
        "
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
        >
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

function RadioItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`
        flex w-full items-center gap-3 rounded-lg px-3 py-2
        text-left text-sm transition-colors
        ${checked ? "bg-[#02AFFF]/10 text-[#02AFFF]" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"}
      `}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border
        ${checked ? "border-[#02AFFF]" : "border-zinc-600"}`}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-[#02AFFF]" />}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
}

function CheckboxItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`
        flex w-full items-center gap-3 rounded-lg px-3 py-2
        text-left text-sm transition-colors
        ${checked ? "bg-[#02AFFF]/10 text-[#02AFFF]" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"}
      `}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border
        ${checked ? "border-[#02AFFF] bg-[#02AFFF]" : "border-zinc-600"}`}
      >
        {checked && (
          <svg
            className="h-3 w-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </span>
      <span>{label}</span>
    </button>
  );
}
