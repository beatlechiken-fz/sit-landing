"use client";

import { useState } from "react";

interface GrupoRow {
  grupo: string;
  ganancia: number;
  destacado: boolean;
}

export function GruposTable({ grupos }: { grupos: GrupoRow[] }) {
  const [rows, setRows] = useState<GrupoRow[]>(grupos);
  const [saving, setSaving] = useState<string | null>(null);
  const [edited, setEdited] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [savingDestacado, setSavingDestacado] = useState<string | null>(null);

  const handleToggleDestacado = async (row: GrupoRow) => {
    setSavingDestacado(row.grupo);
    try {
      const res = await fetch(
        `/api/grupos/${encodeURIComponent(row.grupo)}/destacado`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ destacado: !row.destacado }),
        },
      );
      if (!res.ok) return;
      setRows((prev) =>
        prev.map((r) =>
          r.grupo === row.grupo ? { ...r, destacado: !r.destacado } : r,
        ),
      );
    } finally {
      setSavingDestacado(null);
    }
  };

  const DestacadoToggle = ({ row }: { row: GrupoRow }) => (
    <button
      onClick={() => handleToggleDestacado(row)}
      disabled={savingDestacado === row.grupo}
      className={`
        rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors
        disabled:opacity-40
        ${
          row.destacado
            ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
            : "border-zinc-700 text-zinc-400 hover:text-zinc-200"
        }
      `}
    >
      {row.destacado ? "★ Destacada" : "☆ Destacar"}
    </button>
  );

  const handleChange = (grupo: string, value: string) => {
    const num = Number(value);
    if (isNaN(num)) return;
    setEdited((prev) => ({ ...prev, [grupo]: num }));
  };

  const handleSave = async (grupo: string) => {
    const ganancia = edited[grupo];
    if (ganancia === undefined) return;
    setSaving(grupo);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(
        `/api/grupos/${encodeURIComponent(grupo)}/ganancia`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ganancia }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al guardar");
        return;
      }

      setRows((prev) =>
        prev.map((r) => (r.grupo === grupo ? { ...r, ganancia } : r)),
      );
      setEdited((prev) => {
        const next = { ...prev };
        delete next[grupo];
        return next;
      });
      setSuccess(grupo);
      setTimeout(() => setSuccess(null), 2000);
    } catch {
      setError("Error de conexión");
    } finally {
      setSaving(null);
    }
  };

  // Subcomponente compartido para el input
  const GananciaInput = ({ row }: { row: GrupoRow }) => {
    const currentValue = edited[row.grupo] ?? row.ganancia;
    const isDirty = edited[row.grupo] !== undefined;
    const isSaving = saving === row.grupo;
    const isSuccess = success === row.grupo;

    return (
      <div className="flex items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <input
            type="number"
            min={0}
            max={100}
            value={currentValue}
            onChange={(e) => handleChange(row.grupo, e.target.value)}
            className="
              w-full min-w-[60px] rounded-lg border border-zinc-700 bg-zinc-950
              px-3 py-2 text-sm text-zinc-100 text-center
              outline-none focus:border-[#02AFFF]
              transition-colors
              [appearance:textfield]
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none
            "
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
            %
          </span>
        </div>

        {isSuccess ? (
          <span className="flex items-center gap-1 text-xs text-emerald-400 shrink-0">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Guardado
          </span>
        ) : (
          <button
            onClick={() => handleSave(row.grupo)}
            disabled={!isDirty || isSaving}
            className="
              shrink-0 rounded-lg border border-zinc-700 bg-zinc-800
              px-4 py-2 text-xs font-medium text-zinc-300
              transition-colors hover:bg-zinc-700
              disabled:opacity-30 disabled:cursor-not-allowed
            "
          >
            {isSaving ? "Guardando..." : "Guardar"}
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Desktop — tabla */}
      <div className="hidden md:block rounded-2xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Categoría
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest text-zinc-500 w-48">
                Ganancia %
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest text-zinc-500 w-40">
                Home
              </th>
              <th className="px-6 py-4 w-32" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {rows.map((row) => {
              const currentValue = edited[row.grupo] ?? row.ganancia;
              const isDirty = edited[row.grupo] !== undefined;
              const isSaving = saving === row.grupo;
              const isSuccess = success === row.grupo;

              return (
                <tr
                  key={row.grupo}
                  className="bg-zinc-950 hover:bg-zinc-900/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-zinc-200">
                    {row.grupo}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative mx-auto w-28">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={currentValue}
                        onChange={(e) =>
                          handleChange(row.grupo, e.target.value)
                        }
                        className="
                          w-full rounded-lg border border-zinc-700 bg-zinc-900
                          px-3 py-1.5 text-center text-sm text-zinc-100
                          outline-none focus:border-[#02AFFF]
                          transition-colors
                          [appearance:textfield]
                          [&::-webkit-outer-spin-button]:appearance-none
                          [&::-webkit-inner-spin-button]:appearance-none
                        "
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
                        %
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <DestacadoToggle row={row} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {isSuccess ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Guardado
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSave(row.grupo)}
                        disabled={!isDirty || isSaving}
                        className="
                          rounded-lg border border-zinc-700 bg-zinc-800
                          px-4 py-1.5 text-xs font-medium text-zinc-300
                          transition-colors hover:bg-zinc-700
                          disabled:opacity-30 disabled:cursor-not-allowed
                        "
                      >
                        {isSaving ? "Guardando..." : "Guardar"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile — tarjetas */}
      <div className="grid gap-3 md:hidden">
        {rows.map((row) => (
          <div
            key={row.grupo}
            className="w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-zinc-200 break-words">
                {row.grupo}
              </p>
              <DestacadoToggle row={row} />
            </div>
            <GananciaInput row={row} />
          </div>
        ))}
      </div>
    </>
  );
}
