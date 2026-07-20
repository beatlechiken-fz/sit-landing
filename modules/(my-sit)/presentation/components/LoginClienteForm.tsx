"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export function LoginClienteForm({ next }: { next?: string }) {
  const router = useRouter();
  const locale = useLocale();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

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
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-500">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="
                w-full rounded-xl border border-zinc-700 bg-zinc-950
                px-4 py-3 pr-12 text-sm text-zinc-100
                placeholder:text-zinc-600
                outline-none focus:border-[#02AFFF]
                transition-colors
              "
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              {showPass ? (
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
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"
                  />
                </svg>
              ) : (
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

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
