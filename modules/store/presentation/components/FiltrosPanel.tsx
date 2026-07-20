"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "../store/ui.store";
import { ProductFilter } from "@/modules/admin/store/domain/entities/product-filter.entity";

interface FiltrosPanelProps {
  marcas: string[];
  grupos: string[];
  filtro: ProductFilter;
  onChange: (patch: Partial<ProductFilter>) => void;
  onClear: () => void;
}

const ORDENES: { value: NonNullable<ProductFilter["orden"]>; label: string }[] =
  [
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
  filtro,
  onChange,
  onClear,
}: FiltrosPanelProps) {
  const { filtrosPanelAbierto, cerrarFiltros } = useUIStore();

  const [buscarMarca, setBuscarMarca] = useState("");
  const [buscarGrupo, setBuscarGrupo] = useState("");

  const marcasFiltradas = buscarMarca.trim()
    ? marcas.filter((m) => m.toLowerCase().includes(buscarMarca.toLowerCase()))
    : marcas;

  const gruposFiltrados = buscarGrupo.trim()
    ? grupos.filter((g) => g.toLowerCase().includes(buscarGrupo.toLowerCase()))
    : grupos;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrarFiltros();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [cerrarFiltros]);

  useEffect(() => {
    document.body.style.overflow = filtrosPanelAbierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filtrosPanelAbierto]);

  const limpiarFiltros = () => {
    onClear();
    setBuscarMarca("");
    setBuscarGrupo("");
    cerrarFiltros();
  };

  const filtrosActivos = !!(
    filtro.marca ||
    filtro.grupo ||
    filtro.moneda ||
    filtro.soloAlmacen ||
    filtro.soloCD
  );

  const contadorFiltros = [
    filtro.marca,
    filtro.grupo,
    filtro.moneda,
    filtro.soloAlmacen,
    filtro.soloCD,
  ].filter(Boolean).length;

  return (
    <>
      <div
        onClick={cerrarFiltros}
        className={`
          fixed inset-0 z-40 bg-black/70 backdrop-blur-sm
          transition-opacity duration-300
          ${filtrosPanelAbierto ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      />

      <div
        className={`
        fixed left-0 top-0 z-50
        h-full w-80
        border-r border-white/10 bg-[#0B0B0F]
        shadow-2xl
        transition-transform duration-300 ease-in-out
        ${filtrosPanelAbierto ? "translate-x-0" : "-translate-x-full"}
        flex flex-col
      `}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-white">Filtros</h2>
            {filtrosActivos && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-teal-400 to-[#02AFFF] text-xs font-bold text-black">
                {contadorFiltros}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {filtrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="text-xs text-white/40 underline hover:text-white/70 transition-colors"
              >
                Limpiar todo
              </button>
            )}
            <button
              onClick={cerrarFiltros}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/50 hover:text-white transition-colors"
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

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Section title="Ordenar por">
            <div className="space-y-0.5">
              {ORDENES.map((o) => (
                <RadioItem
                  key={o.value}
                  label={o.label}
                  checked={(filtro.orden ?? "precio_asc") === o.value}
                  onChange={() => onChange({ orden: o.value })}
                />
              ))}
            </div>
          </Section>

          <Section title="Disponibilidad">
            <div className="space-y-0.5">
              <CheckboxItem
                label="Solo en almacén"
                checked={!!filtro.soloAlmacen}
                onChange={(v) => onChange({ soloAlmacen: v })}
              />
              <CheckboxItem
                label="Solo en centro de distribución"
                checked={!!filtro.soloCD}
                onChange={(v) => onChange({ soloCD: v })}
              />
            </div>
          </Section>

          <Section title="Moneda">
            <div className="space-y-0.5">
              <RadioItem
                label="Todas"
                checked={!filtro.moneda}
                onChange={() => onChange({ moneda: undefined })}
              />
              {MONEDAS.map((m) => (
                <RadioItem
                  key={m.value}
                  label={m.label}
                  checked={filtro.moneda === m.value}
                  onChange={() =>
                    onChange({ moneda: m.value as ProductFilter["moneda"] })
                  }
                />
              ))}
            </div>
          </Section>

          <Section title="Categoría">
            <SearchInput
              value={buscarGrupo}
              onChange={setBuscarGrupo}
              placeholder="Buscar categoría..."
            />
            <div className="mt-2 space-y-0.5 overflow-y-auto max-h-52 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <RadioItem
                label="Todas las categorías"
                checked={!filtro.grupo}
                onChange={() => {
                  onChange({ grupo: undefined });
                  setBuscarGrupo("");
                }}
              />
              {gruposFiltrados.length === 0 ? (
                <p className="px-3 py-2 text-xs text-white/30">
                  Sin resultados
                </p>
              ) : (
                gruposFiltrados.map((g) => (
                  <RadioItem
                    key={g}
                    label={g}
                    checked={filtro.grupo === g}
                    onChange={() => onChange({ grupo: g })}
                  />
                ))
              )}
            </div>
          </Section>

          <Section title="Marca">
            <SearchInput
              value={buscarMarca}
              onChange={setBuscarMarca}
              placeholder="Buscar marca..."
            />
            <div className="mt-2 space-y-0.5 overflow-y-auto max-h-52 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <RadioItem
                label="Todas las marcas"
                checked={!filtro.marca}
                onChange={() => {
                  onChange({ marca: undefined });
                  setBuscarMarca("");
                }}
              />
              {marcasFiltradas.length === 0 ? (
                <p className="px-3 py-2 text-xs text-white/30">
                  Sin resultados
                </p>
              ) : (
                marcasFiltradas.map((m) => (
                  <RadioItem
                    key={m}
                    label={m}
                    checked={filtro.marca === m}
                    onChange={() => onChange({ marca: m })}
                  />
                ))
              )}
            </div>
          </Section>
        </div>

        <div className="border-t border-white/10 px-5 py-4 shrink-0">
          <button
            onClick={cerrarFiltros}
            className="w-full rounded-2xl bg-gradient-to-r from-teal-400 to-[#02AFFF] py-3 font-semibold text-black transition-opacity hover:opacity-90 active:scale-[0.98]"
          >
            Ver resultados
          </button>
        </div>
      </div>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">
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
        className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30"
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
          w-full rounded-xl border border-white/10 bg-white/[0.03]
          py-2 pl-8 pr-3 text-xs text-white/80
          placeholder:text-white/30
          outline-none focus:border-white/30
          transition-colors
        "
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
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
        flex w-full items-center gap-3 rounded-xl px-3 py-2
        text-left text-sm transition-colors
        ${checked ? "bg-teal-400/10 text-teal-300" : "text-white/60 hover:bg-white/5 hover:text-white/90"}
      `}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border
        ${checked ? "border-teal-300" : "border-white/20"}`}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-teal-300" />}
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
        flex w-full items-center gap-3 rounded-xl px-3 py-2
        text-left text-sm transition-colors
        ${checked ? "bg-teal-400/10 text-teal-300" : "text-white/60 hover:bg-white/5 hover:text-white/90"}
      `}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border
        ${checked ? "border-teal-300 bg-teal-300" : "border-white/20"}`}
      >
        {checked && (
          <svg
            className="h-3 w-3 text-black"
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
