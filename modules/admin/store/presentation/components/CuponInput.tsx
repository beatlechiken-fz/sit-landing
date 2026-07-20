"use client";

import { useState } from "react";
import { CuponValido } from "@/app/api/cupones/validar/route";

interface CuponInputProps {
  productId: number;
  onCuponAplicado: (cupon: CuponValido) => void;
  onCuponQuitado: () => void;
  cuponActivo: CuponValido | null;
  clienteId?: string | null;
}

export function CuponInput({
  productId,
  onCuponAplicado,
  onCuponQuitado,
  cuponActivo,
  clienteId,
}: CuponInputProps) {
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAplicar = async () => {
    if (!codigo.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/cupones/validar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo: codigo.trim(),
          cliente_id: clienteId ?? null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Cupón inválido");
        return;
      }

      onCuponAplicado(data as CuponValido);
      setCodigo("");
    } catch {
      setError("Error al validar el cupón");
    } finally {
      setLoading(false);
    }
  };

  // Cupón ya aplicado
  if (cuponActivo) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-emerald-400">
              {cuponActivo.codigo}
            </p>
            <p className="text-xs text-emerald-500/70">
              {cuponActivo.tipo === "porcentaje"
                ? `${cuponActivo.descuento}% de descuento`
                : `$${cuponActivo.descuento.toLocaleString("es-MX")} de descuento`}
            </p>
          </div>
        </div>
        <button
          onClick={onCuponQuitado}
          className="text-xs text-zinc-500 underline hover:text-zinc-300 transition-colors"
        >
          Quitar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={codigo}
          onChange={(e) => {
            setCodigo(e.target.value.toUpperCase());
            setError(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleAplicar()}
          placeholder="Código de cupón"
          className="
            flex-1 rounded-xl border border-zinc-700 bg-zinc-900
            px-4 py-2.5 text-sm text-white
            placeholder:text-zinc-500
            outline-none focus:border-[#02AFFF]
            transition-colors
          "
        />
        <button
          onClick={handleAplicar}
          disabled={loading || !codigo.trim()}
          className="
            rounded-xl border border-zinc-700 bg-zinc-800
            px-4 py-2.5 text-sm font-medium text-zinc-300
            transition-colors hover:bg-zinc-700
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          {loading ? (
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          ) : (
            "Aplicar"
          )}
        </button>
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-400">
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
