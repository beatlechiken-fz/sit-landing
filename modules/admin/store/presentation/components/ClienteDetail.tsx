"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Cliente } from "@/modules/admin/store/domain/entities/cliente.entity";
import { Direccion } from "@/modules/admin/store/domain/entities/direccion.entity";
import { Cupon } from "@/modules/admin/store/domain/entities/cupon.entity";
import {
  DEAL_STATUS_LABELS,
  DEAL_STATUS_COLORS,
} from "@/modules/admin/store/domain/entities/deal.entity";
import { formatMXN } from "@/core/helpers/precio.utils";
import { isPlaceholderEmail } from "@/core/helpers/clientes/placeholder-email";
import { DireccionesManager } from "./DireccionesManager";
import type { OrdenResumen } from "@/app/[locale]/admin/dashboard/store/users/[id]/page";

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

function Avatar({ nombre, apellido }: { nombre: string; apellido: string }) {
  const initials = `${nombre[0] ?? ""}${apellido[0] ?? ""}`.toUpperCase();
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#02AFFF]/20 text-base font-bold text-[#02AFFF]">
      {initials}
    </div>
  );
}

export function ClienteDetail({
  cliente: initial,
  direcciones,
  cupones,
  ordenes,
}: {
  cliente: Cliente;
  direcciones: Direccion[];
  cupones: Cupon[];
  ordenes: OrdenResumen[];
}) {
  const router = useRouter();
  const [cliente, setCliente] = useState<Cliente>(initial);
  const [editData, setEditData] = useState<Partial<Cliente>>({});
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cashback, setCashback] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/clientes/${cliente.id}/cashback`)
      .then((r) => r.json())
      .then((d) => setCashback(d.disponible ?? 0))
      .catch(() => setCashback(0));
  }, [cliente.id]);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const startEdit = () => {
    setEditData({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      telefono: cliente.telefono ?? "",
      empresa: cliente.empresa ?? "",
      activo: cliente.activo,
    });
    setEditing(true);
    setError(null);
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/clientes/${cliente.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al guardar");
        return;
      }

      setCliente(data);
      setEditing(false);
      showSuccess("Cliente actualizado");
    } catch {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    setResetting(true);
    setError(null);

    try {
      const res = await fetch(`/api/clientes/${cliente.id}/reset-password`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al resetear contraseña");
        return;
      }
      showSuccess(
        data.emailEnviado
          ? `Nueva contraseña enviada a ${cliente.email}`
          : "Contraseña reseteada — el cliente no tiene un email válido para enviarla",
      );
    } catch {
      setError("Error de conexión");
    } finally {
      setResetting(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 w-full">
      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          {success}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/admin/dashboard/store/users")}
          className="mb-3 flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Clientes
        </button>
        <div className="flex items-center gap-4">
          <Avatar nombre={cliente.nombre} apellido={cliente.apellido} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
                {cliente.nombre} {cliente.apellido}
              </h1>
              <EstadoBadge activo={cliente.activo} />
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              {isPlaceholderEmail(cliente.email) ? (
                <span className="italic">Sin correo</span>
              ) : (
                cliente.email
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Columna izquierda */}
        <div className="lg:col-span-2 space-y-4">
          {/* Perfil */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Perfil
              </p>
              {!editing && (
                <button
                  onClick={startEdit}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Editar
                </button>
              )}
            </div>

            {editing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    { label: "Nombre", key: "nombre" },
                    { label: "Apellido", key: "apellido" },
                    { label: "Email", key: "email" },
                    { label: "Teléfono", key: "telefono" },
                    { label: "Empresa", key: "empresa" },
                  ].map(({ label, key }) => (
                    <div key={key}>
                      <label className="mb-1 block text-xs text-zinc-500">
                        {label}
                      </label>
                      <input
                        type={key === "email" ? "email" : "text"}
                        value={(editData as any)[key] ?? ""}
                        onChange={(e) =>
                          setEditData({ ...editData, [key]: e.target.value })
                        }
                        className="input-dark w-full"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="mb-1 block text-xs text-zinc-500">
                      Estado
                    </label>
                    <select
                      value={editData.activo ? "true" : "false"}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          activo: e.target.value === "true",
                        })
                      }
                      className="input-dark w-full"
                    >
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleSaveEdit}
                    disabled={saving}
                    className="rounded-lg bg-[#02AFFF]/10 px-4 py-2 text-xs font-medium text-[#02AFFF] hover:bg-[#02AFFF]/20 transition-colors disabled:opacity-40"
                  >
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="rounded-lg border border-zinc-700 px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <div className="flex-1" />
                  <button
                    onClick={handleResetPassword}
                    disabled={resetting}
                    className="rounded-lg border border-amber-500/20 px-4 py-2 text-xs text-amber-400 hover:bg-amber-500/10 transition-colors disabled:opacity-40"
                  >
                    {resetting ? "Enviando..." : "🔑 Resetear contraseña"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-3">
                {[
                  { label: "Teléfono", value: cliente.telefono ?? "—" },
                  { label: "Empresa", value: cliente.empresa ?? "—" },
                  {
                    label: "Registro",
                    value: new Date(cliente.created_at).toLocaleDateString(
                      "es-MX",
                      { day: "2-digit", month: "long", year: "numeric" },
                    ),
                  },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-zinc-600">{label}</p>
                    <p className="mt-0.5 font-medium text-zinc-300">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Direcciones */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Direcciones
            </p>
            <DireccionesManager
              clienteId={cliente.id}
              direcciones={direcciones}
            />
          </div>

          {/* Órdenes */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className="border-b border-zinc-800 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Órdenes ({ordenes.length})
              </p>
            </div>
            {ordenes.length === 0 ? (
              <p className="px-5 py-6 text-center text-xs text-zinc-600">
                Este cliente no tiene cotizaciones ni órdenes
              </p>
            ) : (
              <div className="divide-y divide-zinc-800/50">
                {ordenes.map((o) => (
                  <button
                    key={o.id}
                    onClick={() =>
                      router.push(`/admin/dashboard/store/deals/${o.id}`)
                    }
                    className="flex w-full items-center justify-between px-5 py-3 text-left hover:bg-zinc-800/30 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-200">
                        {o.numero_orden ?? "Cotización"}
                      </p>
                      <p className="text-xs text-zinc-600">
                        {new Date(o.created_at).toLocaleDateString("es-MX", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${DEAL_STATUS_COLORS[o.status]}`}
                      >
                        {DEAL_STATUS_LABELS[o.status]}
                      </span>
                      <span className="text-sm font-bold text-zinc-100">
                        {formatMXN(o.total)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Columna derecha */}
        <div className="space-y-4">
          {/* Cashback */}
          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
            <p className="text-xs font-medium text-purple-400">
              Cashback disponible
            </p>
            <p className="mt-1 text-2xl font-bold text-purple-300">
              {cashback === null ? "…" : formatMXN(cashback)}
            </p>
          </div>

          {/* Cupones */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Cupones disponibles
              </p>
              <button
                onClick={() =>
                  router.push("/admin/dashboard/store/coupons")
                }
                className="text-xs text-[#02AFFF] hover:text-[#1961B0] transition-colors"
              >
                Ver todos →
              </button>
            </div>

            {cupones.length === 0 ? (
              <p className="text-xs text-zinc-600">Sin cupones disponibles</p>
            ) : (
              <div className="space-y-2">
                {cupones.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-zinc-200">
                        {c.codigo}
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          c.cliente_id
                            ? "bg-purple-500/10 text-purple-400"
                            : "bg-zinc-500/10 text-zinc-500"
                        }`}
                      >
                        {c.cliente_id ? "Exclusivo" : "Global"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {c.tipo === "porcentaje"
                        ? `${c.descuento}% de descuento`
                        : `${formatMXN(c.descuento)} de descuento`}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-600">
                      {c.max_usos
                        ? `${c.usos_actuales}/${c.max_usos} usos`
                        : "Usos ilimitados"}
                      {c.expira_at &&
                        ` · Expira ${new Date(c.expira_at).toLocaleDateString("es-MX")}`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
