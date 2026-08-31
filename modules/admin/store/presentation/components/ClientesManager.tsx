"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cliente } from "@/modules/admin/store/domain/entities/cliente.entity";
import { isPlaceholderEmail } from "@/core/helpers/clientes/placeholder-email";

// Email real o "Sin correo" si es el placeholder interno que se genera
// cuando el cliente se crea sin un email válido.
function EmailCell({ email }: { email: string }) {
  if (isPlaceholderEmail(email)) {
    return <span className="italic text-zinc-600">Sin correo</span>;
  }
  return <>{email}</>;
}

// ─────────────────────────────────────────────
// Formulario vacío
// ─────────────────────────────────────────────
const EMPTY_FORM = {
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  empresa: "",
};

// ─────────────────────────────────────────────
// Badge de estado
// ─────────────────────────────────────────────
function EstadoBadge({ activo }: { activo: boolean }) {
  return (
    <span
      className={`
      rounded-full px-2 py-0.5 text-xs font-medium
      ${
        activo
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-zinc-500/10 text-zinc-500"
      }
    `}
    >
      {activo ? "Activo" : "Inactivo"}
    </span>
  );
}

// ─────────────────────────────────────────────
// Iniciales del avatar
// ─────────────────────────────────────────────
function Avatar({ nombre, apellido }: { nombre: string; apellido: string }) {
  const initials = `${nombre[0] ?? ""}${apellido[0] ?? ""}`.toUpperCase();
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#02AFFF]/20 text-sm font-bold text-[#02AFFF]">
      {initials}
    </div>
  );
}

// ─────────────────────────────────────────────
// Manager principal
// ─────────────────────────────────────────────
export function ClientesManager({
  clientes: initial,
}: {
  clientes: Cliente[];
}) {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [buscar, setBuscar] = useState("");

  const clientesFiltrados = buscar.trim()
    ? clientes.filter((c) =>
        `${c.nombre} ${c.apellido} ${c.email} ${c.empresa ?? ""}`
          .toLowerCase()
          .includes(buscar.toLowerCase()),
      )
    : clientes;

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const verDetalle = (id: string) => {
    router.push(`/admin/dashboard/store/users/${id}`);
  };

  // ── Crear ──────────────────────────────────
  const handleCreate = async () => {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al crear");
        return;
      }

      setClientes((prev) => [data, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
      showSuccess(
        data.emailEnviado
          ? `Cliente creado — se envió email a ${data.email}`
          : "Cliente creado — no se envió email (sin correo válido)",
      );
    } catch {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle activo ──────────────────────────
  const handleToggleActivo = async (cliente: Cliente) => {
    try {
      const res = await fetch(`/api/clientes/${cliente.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activo: !cliente.activo }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }

      setClientes((prev) => prev.map((c) => (c.id === cliente.id ? data : c)));
    } catch {
      setError("Error de conexión");
    }
  };

  return (
    <div className="space-y-4">
      {/* Feedback */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          {success}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        {/* Buscador */}
        <div className="relative flex-1">
          <input
            type="text"
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            placeholder="Buscar por nombre, email o empresa..."
            className="
              w-full rounded-xl border border-zinc-800 bg-zinc-900
              py-2.5 pl-4 pr-4 text-sm text-zinc-300
              placeholder:text-zinc-600
              outline-none focus:border-zinc-600
              transition-colors
            "
          />
        </div>

        {/* Botón nuevo */}
        <button
          onClick={() => {
            setShowForm(!showForm);
            setError(null);
          }}
          className="
            flex shrink-0 items-center gap-2 rounded-xl
            bg-[#02AFFF] px-4 py-2.5 text-sm font-medium text-white
            transition-colors hover:bg-[#1961B0]
          "
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="hidden md:inline">Nuevo cliente</span>
        </button>
      </div>

      {/* Formulario nuevo cliente */}
      {showForm && (
        <div className="rounded-2xl border border-[#02AFFF]/20 bg-zinc-900 p-5 space-y-4">
          <p className="text-sm font-semibold text-zinc-200">Nuevo cliente</p>
          <p className="text-xs text-zinc-500">
            Se generará una contraseña automáticamente. Si agregas un email
            válido se le enviará por correo; si no, el cliente se crea igual.
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { label: "Nombre *", key: "nombre", placeholder: "Juan" },
              {
                label: "Apellido",
                key: "apellido",
                placeholder: "García (opcional)",
              },
              {
                label: "Email",
                key: "email",
                placeholder: "juan@empresa.com (opcional)",
              },
              {
                label: "Teléfono",
                key: "telefono",
                placeholder: "443 123 4567",
              },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="mb-1 block text-xs text-zinc-500">
                  {label}
                </label>
                <input
                  type={key === "email" ? "email" : "text"}
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="input-dark w-full"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-zinc-500">
                Empresa
              </label>
              <input
                type="text"
                value={form.empresa}
                onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                placeholder="Nombre de la empresa (opcional)"
                className="input-dark w-full"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowForm(false);
                setForm(EMPTY_FORM);
              }}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreate}
              disabled={saving || !form.nombre}
              className="
                rounded-lg bg-[#02AFFF] px-4 py-2 text-sm font-medium text-white
                hover:bg-[#1961B0] transition-colors
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              {saving ? "Creando..." : "Crear y enviar acceso"}
            </button>
          </div>
        </div>
      )}

      {/* Contador */}
      <p className="text-xs text-zinc-600">
        {clientesFiltrados.length}{" "}
        {clientesFiltrados.length === 1 ? "cliente" : "clientes"}
      </p>

      {/* Desktop — tabla */}
      <div className="hidden md:block rounded-2xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900">
              {["Cliente", "Email", "Empresa", "Estado", "Acciones"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {clientesFiltrados.map((cliente) => (
              <tr
                key={cliente.id}
                className="bg-zinc-950 hover:bg-zinc-900/40 transition-colors cursor-pointer"
                onClick={() => verDetalle(cliente.id)}
              >
                {/* Cliente */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      nombre={cliente.nombre}
                      apellido={cliente.apellido}
                    />
                    <div>
                      <p className="font-medium text-zinc-100">
                        {cliente.nombre} {cliente.apellido}
                      </p>
                      <p className="text-xs text-zinc-600">
                        {new Date(cliente.created_at).toLocaleDateString(
                          "es-MX",
                        )}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-5 py-4 text-zinc-400">
                  <EmailCell email={cliente.email} />
                </td>

                {/* Empresa */}
                <td className="px-5 py-4 text-zinc-500">
                  {cliente.empresa ?? "—"}
                </td>

                {/* Estado */}
                <td className="px-5 py-4">
                  <EstadoBadge activo={cliente.activo} />
                </td>

                {/* Acciones */}
                <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleToggleActivo(cliente)}
                    className={`
                      rounded-lg border px-3 py-1.5 text-xs transition-colors
                      ${
                        cliente.activo
                          ? "border-red-500/20 text-red-400 hover:bg-red-500/10"
                          : "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                      }
                    `}
                  >
                    {cliente.activo ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile — tarjetas */}
      <div className="grid gap-3 md:hidden">
        {clientesFiltrados.map((cliente) => (
          <div
            key={cliente.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden"
          >
            <div
              className="flex items-center gap-3 p-4 cursor-pointer"
              onClick={() => verDetalle(cliente.id)}
            >
              <Avatar nombre={cliente.nombre} apellido={cliente.apellido} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-100 truncate">
                  {cliente.nombre} {cliente.apellido}
                </p>
                <p className="text-xs text-zinc-500 truncate">
                  <EmailCell email={cliente.email} />
                </p>
              </div>
              <EstadoBadge activo={cliente.activo} />
            </div>

            <div
              className="border-t border-zinc-800 px-4 py-3"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => handleToggleActivo(cliente)}
                className={`
                  w-full rounded-lg border py-2 text-xs transition-colors
                  ${
                    cliente.activo
                      ? "border-red-500/20 text-red-400 hover:bg-red-500/10"
                      : "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                  }
                `}
              >
                {cliente.activo ? "Desactivar" : "Activar"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {clientesFiltrados.length === 0 && (
        <div className="py-16 text-center text-zinc-600 text-sm">
          {buscar
            ? "Sin resultados para esa búsqueda"
            : "No hay clientes registrados"}
        </div>
      )}
    </div>
  );
}
