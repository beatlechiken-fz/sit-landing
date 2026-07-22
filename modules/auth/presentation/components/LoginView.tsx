"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/core/components/password-input/PasswordInput";

export default function LoginView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Correo o contraseña incorrectos");
        setLoading(false);
      } else {
        router.push("/admin/dashboard");
      }
    } catch (err) {
      console.error("signIn failed", err);
      setError("No se pudo conectar. Intenta de nuevo.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0B0F] px-6 py-20 text-white">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
        <h1 className="mb-6 text-lg font-semibold text-zinc-100">
          Acceso admin
        </h1>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">
              Correo
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
                outline-none focus:border-teal-400
                transition-colors
              "
            />
          </div>

          <PasswordInput
            label="Contraseña"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full rounded-xl py-3 mt-2
              bg-gradient-to-r from-teal-400 to-sky-400
              text-sm font-semibold text-black
              transition hover:opacity-90
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
