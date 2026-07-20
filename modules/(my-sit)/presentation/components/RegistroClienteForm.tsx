"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export function RegistroClienteForm({ next }: { next?: string }) {
  const router = useRouter();
  const locale = useLocale();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    password: "",
    confirmar: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/my-sit/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
          email: form.email,
          telefono: form.telefono,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al crear la cuenta");
        return;
      }

      router.push(`/${locale}${next ?? "/my-sit/dashboard"}`);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
      <h2 className="mb-6 text-lg font-semibold text-zinc-100">
        Crear cuenta
      </h2>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">
              Nombre
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={set("nombre")}
              autoComplete="off"
              required
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-[#02AFFF] transition-colors"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">
              Apellido
            </label>
            <input
              type="text"
              value={form.apellido}
              onChange={set("apellido")}
              autoComplete="off"
              required
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-[#02AFFF] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-500">
            Correo electrónico
          </label>
          <input
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="tu@email.com"
            autoComplete="off"
            required
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-[#02AFFF] transition-colors"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-500">
            Teléfono (opcional)
          </label>
          <input
            type="tel"
            value={form.telefono}
            onChange={set("telefono")}
            placeholder="443 123 4567"
            autoComplete="off"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-[#02AFFF] transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">
              Contraseña
            </label>
            <input
              type="password"
              value={form.password}
              onChange={set("password")}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-[#02AFFF] transition-colors"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">
              Confirmar
            </label>
            <input
              type="password"
              value={form.confirmar}
              onChange={set("confirmar")}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-[#02AFFF] transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={
            loading ||
            !form.nombre ||
            !form.apellido ||
            !form.email ||
            !form.password
          }
          className="
            w-full rounded-xl bg-[#02AFFF] py-3
            text-sm font-semibold text-white
            transition-all hover:bg-[#1961B0]
            active:scale-95
            disabled:opacity-40 disabled:cursor-not-allowed
            mt-2
          "
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>
    </div>
  );
}
