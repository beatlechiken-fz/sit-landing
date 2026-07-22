"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { PasswordInput } from "@/core/components/password-input/PasswordInput";

export function CambiarPasswordForm({ forced = false }: { forced?: boolean }) {
  const router = useRouter();
  const locale = useLocale();
  const [actual, setActual] = useState("");
  const [nuevo, setNuevo] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Validaciones en tiempo real
  const nuevoDiferente = nuevo.length > 0 && nuevo === actual;
  const noCoinciden = confirmar.length > 0 && nuevo !== confirmar;
  const muyCortа = nuevo.length > 0 && nuevo.length < 8;
  const formularioValido =
    actual &&
    nuevo &&
    confirmar &&
    nuevo === confirmar &&
    nuevo.length >= 8 &&
    nuevo !== actual;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formularioValido) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/my-sit/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passwordActual: actual,
          passwordNuevo: nuevo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al cambiar contraseña");
        return;
      }

      setSuccess(true);
      setActual("");
      setNuevo("");
      setConfirmar("");

      if (forced) {
        setTimeout(() => {
          router.push(`/${locale}/my-sit/dashboard`);
          router.refresh();
        }, 1200);
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">
        Cambiar contraseña
      </p>

      {success && (
        <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          ✓ Contraseña actualizada correctamente
          {forced && " — entrando a tu portal..."}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordInput
          label="Contraseña actual"
          value={actual}
          onChange={setActual}
          placeholder="••••••••"
        />

        <PasswordInput
          label="Nueva contraseña"
          value={nuevo}
          onChange={setNuevo}
          placeholder="Mínimo 8 caracteres"
        />

        {/* Validaciones visuales */}
        {nuevo.length > 0 && (
          <div className="space-y-1">
            <Regla ok={nuevo.length >= 8} texto="Mínimo 8 caracteres" />
            <Regla
              ok={nuevo !== actual}
              texto="Diferente a la contraseña actual"
            />
            <Regla ok={/[A-Z]/.test(nuevo)} texto="Al menos una mayúscula" />
            <Regla ok={/[0-9]/.test(nuevo)} texto="Al menos un número" />
          </div>
        )}

        <PasswordInput
          label="Confirmar nueva contraseña"
          value={confirmar}
          onChange={setConfirmar}
          placeholder="••••••••"
        />

        {noCoinciden && (
          <p className="text-xs text-red-400">Las contraseñas no coinciden</p>
        )}

        <button
          type="submit"
          disabled={!formularioValido || loading}
          className="
            w-full rounded-xl bg-[#02AFFF] py-3
            text-sm font-semibold text-white
            transition-all hover:bg-[#1961B0]
            active:scale-95
            disabled:opacity-40 disabled:cursor-not-allowed
            mt-2
          "
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
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
              Actualizando...
            </span>
          ) : (
            "Cambiar contraseña"
          )}
        </button>
      </form>
    </div>
  );
}

// Subcomponente de regla de validación
function Regla({ ok, texto }: { ok: boolean; texto: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px]
        ${ok ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-600"}`}
      >
        {ok ? "✓" : "·"}
      </span>
      <span className={`text-xs ${ok ? "text-emerald-400" : "text-zinc-600"}`}>
        {texto}
      </span>
    </div>
  );
}
