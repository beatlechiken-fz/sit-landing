"use client";

import { useState } from "react";
import { CuponValido } from "@/app/api/cupones/validar/route";

interface CuponInputProps {
  cuponActivo: CuponValido | null;
  onCuponAplicado: (cupon: CuponValido) => void;
  onCuponQuitado: () => void;
}

export function CuponInput({
  cuponActivo,
  onCuponAplicado,
  onCuponQuitado,
}: CuponInputProps) {
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAplicar = async () => {
    if (!codigo.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/my-sit/store/cupones/validar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo: codigo.trim() }),
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

  if (cuponActivo) {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-teal-400/30 bg-teal-400/5 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <svg
            className="h-4 w-4 text-teal-300"
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
            <p className="text-sm font-medium text-teal-300">
              {cuponActivo.codigo}
            </p>
            <p className="text-xs text-teal-300/60">
              {cuponActivo.tipo === "porcentaje"
                ? `${cuponActivo.descuento}% de descuento`
                : `$${cuponActivo.descuento.toLocaleString("es-MX")} de descuento`}
            </p>
          </div>
        </div>
        <button
          onClick={onCuponQuitado}
          className="text-xs text-white/40 underline hover:text-white/70 transition-colors"
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
          placeholder="¿Tienes un código de descuento?"
          className="
            flex-1 rounded-2xl border border-white/10 bg-white/[0.03]
            px-4 py-2.5 text-sm text-white
            placeholder:text-white/30
            outline-none focus:border-[#02AFFF]/50
            transition-colors
          "
        />
        <button
          onClick={handleAplicar}
          disabled={loading || !codigo.trim()}
          className="
            rounded-2xl border border-white/10 bg-white/5
            px-4 py-2.5 text-sm font-medium text-white/80
            transition-colors hover:bg-white/10
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          {loading ? "..." : "Aplicar"}
        </button>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
