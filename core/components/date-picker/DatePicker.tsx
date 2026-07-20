"use client";

import { useEffect, useRef, useState } from "react";

interface DatePickerProps {
  value: string; // "yyyy-mm-dd" o ""
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minDate?: string;
  disabled?: boolean;
}

const DIAS = ["L", "M", "M", "J", "V", "S", "D"];
const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function parseValue(value: string | null | undefined): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function formatValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplay(value: string): string {
  const date = parseValue(value);
  if (!date) return "";
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Seleccionar fecha",
  className,
  minDate,
  disabled = false,
}: DatePickerProps) {
  const [abierto, setAbierto] = useState(false);
  const selected = parseValue(value);
  const [cursor, setCursor] = useState<Date>(selected ?? new Date());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) setCursor(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (!abierto) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [abierto]);

  const minD = parseValue(minDate);
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // lunes = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const celdas: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const hoy = new Date();
  const esHoy = (d: number) =>
    d === hoy.getDate() && month === hoy.getMonth() && year === hoy.getFullYear();

  const esSeleccionado = (d: number) =>
    !!selected &&
    d === selected.getDate() &&
    month === selected.getMonth() &&
    year === selected.getFullYear();

  const esDeshabilitado = (d: number) => {
    if (!minD) return false;
    const date = new Date(year, month, d);
    const min = new Date(minD.getFullYear(), minD.getMonth(), minD.getDate());
    return date < min;
  };

  return (
    <div className={`relative ${className ?? ""}`} ref={ref}>
      <button
        type="button"
        onClick={() => !disabled && setAbierto((v) => !v)}
        disabled={disabled}
        className={`input-dark w-full flex items-center justify-between gap-2 text-left ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        <span className={value ? "text-zinc-100" : "text-zinc-500"}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-zinc-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>

      {abierto && (
        <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-xl border border-zinc-700 bg-zinc-900 p-3 shadow-2xl">
          {/* Header mes/año */}
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCursor(new Date(year, month - 1, 1))}
              className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              ‹
            </button>
            <p className="text-xs font-medium text-zinc-200">
              {MESES[month]} {year}
            </p>
            <button
              type="button"
              onClick={() => setCursor(new Date(year, month + 1, 1))}
              className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              ›
            </button>
          </div>

          {/* Días de la semana */}
          <div className="mb-1 grid grid-cols-7">
            {DIAS.map((d, i) => (
              <span
                key={i}
                className="text-center text-[10px] font-medium text-zinc-600"
              >
                {d}
              </span>
            ))}
          </div>

          {/* Celdas de días */}
          <div className="grid grid-cols-7 gap-y-1">
            {celdas.map((d, i) =>
              d === null ? (
                <span key={i} />
              ) : (
                <button
                  key={i}
                  type="button"
                  disabled={esDeshabilitado(d)}
                  onClick={() => {
                    onChange(formatValue(new Date(year, month, d)));
                    setAbierto(false);
                  }}
                  className={`
                    mx-auto flex h-7 w-7 items-center justify-center rounded-lg text-xs transition-colors
                    ${
                      esSeleccionado(d)
                        ? "bg-[#02AFFF] font-semibold text-white"
                        : esHoy(d)
                          ? "border border-[#02AFFF]/40 text-[#02AFFF]"
                          : "text-zinc-300 hover:bg-zinc-800"
                    }
                    ${esDeshabilitado(d) ? "cursor-not-allowed opacity-30 hover:bg-transparent" : ""}
                  `}
                >
                  {d}
                </button>
              ),
            )}
          </div>

          {/* Acciones */}
          <div className="mt-2 flex items-center justify-between border-t border-zinc-800 pt-2">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setAbierto(false);
              }}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(formatValue(new Date()));
                setAbierto(false);
              }}
              className="text-xs text-[#02AFFF] hover:text-[#1961B0] transition-colors"
            >
              Hoy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
