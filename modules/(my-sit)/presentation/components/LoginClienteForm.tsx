"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { PasswordInput } from "@/core/components/password-input/PasswordInput";

export function LoginClienteForm({ next }: { next?: string }) {
  const router = useRouter();
  const locale = useLocale();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/my-sit/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al iniciar sesión");
        return;
      }

      if (data.debeCambiarPassword) {
        router.push(`/${locale}/my-sit/dashboard/cambiar-password`);
      } else {
        router.push(`/${locale}${next ?? "/my-sit/dashboard"}`);
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
      <h2 className="mb-6 text-lg font-semibold text-zinc-100">
        Iniciar sesión
      </h2>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-500">
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className="
              w-full rounded-xl border border-zinc-700 bg-zinc-950
              px-4 py-3 text-sm text-zinc-100
              placeholder:text-zinc-600
              outline-none focus:border-[#02AFFF]
              transition-colors
            "
          />
        </div>

        {/* Password */}
        <PasswordInput
          label="Contraseña"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          required
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !email || !password}
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
              Iniciando sesión...
            </span>
          ) : (
            "Iniciar sesión"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-zinc-600">
        ¿Olvidaste tu contraseña? Contacta a{" "}
        <a
          href="mailto:hola@sitmorelia.com.mx"
          className="text-[#02AFFF] hover:underline"
        >
          Sit+
        </a>
      </p>
    </div>
  );
}
