"use client";

import { useState } from "react";
import { Servicio, servicioToProduct } from "@/modules/admin/store/domain/entities/servicio.entity";
import { formatMXN } from "@/core/helpers/precio.utils";
import { useCarritoStore } from "../store/carrito.store";
import { useUIStore } from "../store/ui.store";

interface ServiciosManagerProps {
  servicios: Servicio[];
}

const EMPTY_FORM = {
  nombre: "",
  descripcion: "",
  precio: "",
};

type EditForm = {
  nombre: string;
  descripcion: string;
  precio: string; // "" = sin precio fijo
  activo: boolean;
};

export function ServiciosManager({ servicios: initial }: ServiciosManagerProps) {
  const [servicios, setServicios] = useState<Servicio[]>(initial);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<EditForm>({
    nombre: "",
    descripcion: "",
    precio: "",
    activo: true,
  });
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const agregarCarrito = useCarritoStore((s) => s.agregar);
  const abrirCarrito = useUIStore((s) => s.abrirCarrito);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 2500);
  };

  // ── Agregar al carrito ─────────────────────
  const handleAgregarCarrito = (servicio: Servicio) => {
    agregarCarrito(servicioToProduct(servicio));
    abrirCarrito();
  };

  // ── Editar ──────────────────────────────────
  const startEdit = (servicio: Servicio) => {
    setEditingId(servicio.id);
    setEditData({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      precio: servicio.precio === null ? "" : String(servicio.precio),
      activo: servicio.activo,
    });
    setError(null);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/servicios/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: editData.nombre,
          descripcion: editData.descripcion,
          precio: editData.precio === "" ? null : editData.precio,
          activo: editData.activo,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al guardar");
        return;
      }

      setServicios((prev) =>
        prev.map((s) => (s.id === editingId ? data : s)),
      );
      setEditingId(null);
      showSuccess("Servicio actualizado");
    } catch {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  // ── Dar de baja / reactivar ─────────────────
  const handleToggleActivo = async (servicio: Servicio) => {
    setTogglingId(servicio.id);
    setError(null);

    try {
      const res = await fetch(`/api/servicios/${servicio.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activo: !servicio.activo }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al actualizar");
        return;
      }

      setServicios((prev) =>
        prev.map((s) => (s.id === servicio.id ? data : s)),
      );
    } catch {
      setError("Error de conexión");
    } finally {
      setTogglingId(null);
    }
  };

  // ── Crear ───────────────────────────────────
  const handleCreate = async () => {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/servicios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al crear");
        return;
      }

      setServicios((prev) => [data, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
      showSuccess("Servicio creado");
    } catch {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  const formatPrecio = (precio: number | null) =>
    precio === null ? "Sin precio fijo" : formatMXN(precio);

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

      {/* Header con botón agregar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          {servicios.length} {servicios.length === 1 ? "servicio" : "servicios"}
        </p>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setError(null);
          }}
          className="
            flex items-center gap-2 rounded-xl
            bg-[#02AFFF] px-4 py-2 text-sm font-medium text-white
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
          Nuevo servicio
        </button>
      </div>

      {/* Formulario nuevo servicio */}
      {showForm && (
        <div className="rounded-2xl border border-[#02AFFF]/20 bg-zinc-900 p-5 space-y-4">
          <p className="text-sm font-semibold text-zinc-200">Nuevo servicio</p>
          <p className="text-xs text-zinc-500">
            Deja el precio en blanco si no tiene un precio fijo (ej.
            reparaciones) — lo definirás cada vez que lo agregues al carrito.
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">
                Nombre
              </label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Reparación de impresora"
                className="input-dark w-full"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">
                Precio (opcional)
              </label>
              <input
                type="number"
                min={0}
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
                placeholder="Sin precio fijo"
                className="input-dark w-full"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-zinc-500">
                Descripción (opcional)
              </label>
              <input
                type="text"
                value={form.descripcion}
                onChange={(e) =>
                  setForm({ ...form, descripcion: e.target.value })
                }
                placeholder="Se usa el nombre si se deja en blanco"
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
              disabled={saving || !form.nombre.trim()}
              className="
                rounded-lg bg-[#02AFFF] px-4 py-2 text-sm font-medium text-white
                hover:bg-[#1961B0] transition-colors
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              {saving ? "Creando..." : "Crear servicio"}
            </button>
          </div>
        </div>
      )}

      {/* Desktop — tabla */}
      <div className="hidden md:block rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900">
                {["Nombre", "Descripción", "Precio", "Estado", "Acciones"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {servicios.map((servicio) => {
                const isEditing = editingId === servicio.id;
                const isToggling = togglingId === servicio.id;

                return (
                  <tr
                    key={servicio.id}
                    className="bg-zinc-950 hover:bg-zinc-900/40 transition-colors"
                  >
                    {/* Nombre */}
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.nombre}
                          onChange={(e) =>
                            setEditData({ ...editData, nombre: e.target.value })
                          }
                          className="input-dark w-48"
                        />
                      ) : (
                        <span className="font-medium text-zinc-100">
                          {servicio.nombre}
                        </span>
                      )}
                    </td>

                    {/* Descripción */}
                    <td className="px-5 py-3 min-w-[220px]">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.descripcion}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              descripcion: e.target.value,
                            })
                          }
                          className="input-dark w-full"
                        />
                      ) : (
                        <span className="text-zinc-400 line-clamp-2">
                          {servicio.descripcion}
                        </span>
                      )}
                    </td>

                    {/* Precio */}
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <input
                          type="number"
                          min={0}
                          value={editData.precio}
                          onChange={(e) =>
                            setEditData({ ...editData, precio: e.target.value })
                          }
                          placeholder="Sin precio fijo"
                          className="input-dark w-28"
                        />
                      ) : (
                        <span
                          className={
                            servicio.precio === null
                              ? "text-xs text-zinc-500 italic"
                              : "text-zinc-200"
                          }
                        >
                          {formatPrecio(servicio.precio)}
                        </span>
                      )}
                    </td>

                    {/* Estado */}
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <select
                          value={editData.activo ? "true" : "false"}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              activo: e.target.value === "true",
                            })
                          }
                          className="input-dark"
                        >
                          <option value="true">Activo</option>
                          <option value="false">Dado de baja</option>
                        </select>
                      ) : (
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium
                          ${
                            servicio.activo
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-zinc-500/10 text-zinc-500"
                          }`}
                        >
                          {servicio.activo ? "Activo" : "Dado de baja"}
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={handleSaveEdit}
                              disabled={saving}
                              className="rounded-lg bg-[#02AFFF]/10 px-3 py-1.5 text-xs font-medium text-[#02AFFF] hover:bg-[#02AFFF]/20 transition-colors disabled:opacity-40"
                            >
                              {saving ? "Guardando..." : "Guardar"}
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            {servicio.activo && (
                              <button
                                onClick={() => handleAgregarCarrito(servicio)}
                                className="rounded-lg bg-[#02AFFF]/10 px-3 py-1.5 text-xs font-medium text-[#02AFFF] hover:bg-[#02AFFF]/20 transition-colors"
                              >
                                Agregar al carrito
                              </button>
                            )}
                            <button
                              onClick={() => startEdit(servicio)}
                              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleToggleActivo(servicio)}
                              disabled={isToggling}
                              className={`rounded-lg border px-3 py-1.5 text-xs transition-colors disabled:opacity-40 ${
                                servicio.activo
                                  ? "border-red-500/20 text-red-400 hover:bg-red-500/10"
                                  : "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                              }`}
                            >
                              {isToggling
                                ? "..."
                                : servicio.activo
                                  ? "Dar de baja"
                                  : "Reactivar"}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile — tarjetas */}
      <div className="grid gap-3 md:hidden">
        {servicios.map((servicio) => {
          const isEditing = editingId === servicio.id;
          const isToggling = togglingId === servicio.id;

          return (
            <div
              key={servicio.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-zinc-100 truncate">
                    {servicio.nombre}
                  </p>
                  <p
                    className={
                      servicio.precio === null
                        ? "text-xs italic text-zinc-500"
                        : "text-xs text-zinc-400"
                    }
                  >
                    {formatPrecio(servicio.precio)}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium
                  ${
                    servicio.activo
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-zinc-500/10 text-zinc-500"
                  }`}
                >
                  {servicio.activo ? "Activo" : "Dado de baja"}
                </span>
              </div>

              {!isEditing && (
                <p className="text-sm text-zinc-400 line-clamp-2">
                  {servicio.descripcion}
                </p>
              )}

              {isEditing && (
                <div className="space-y-2">
                  <div>
                    <label className="mb-1 block text-xs text-zinc-500">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={editData.nombre}
                      onChange={(e) =>
                        setEditData({ ...editData, nombre: e.target.value })
                      }
                      className="input-dark w-full"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-zinc-500">
                      Descripción
                    </label>
                    <input
                      type="text"
                      value={editData.descripcion}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          descripcion: e.target.value,
                        })
                      }
                      className="input-dark w-full"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-zinc-500">
                      Precio
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editData.precio}
                      onChange={(e) =>
                        setEditData({ ...editData, precio: e.target.value })
                      }
                      placeholder="Sin precio fijo"
                      className="input-dark w-full"
                    />
                  </div>
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
                      <option value="false">Dado de baja</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-1">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      disabled={saving}
                      className="flex-1 rounded-lg bg-[#02AFFF]/10 py-2 text-xs font-medium text-[#02AFFF] hover:bg-[#02AFFF]/20 transition-colors disabled:opacity-40"
                    >
                      {saving ? "Guardando..." : "Guardar"}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 rounded-lg border border-zinc-700 py-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    {servicio.activo && (
                      <button
                        onClick={() => handleAgregarCarrito(servicio)}
                        className="flex-1 rounded-lg bg-[#02AFFF]/10 py-2 text-xs font-medium text-[#02AFFF] hover:bg-[#02AFFF]/20 transition-colors"
                      >
                        Agregar al carrito
                      </button>
                    )}
                    <button
                      onClick={() => startEdit(servicio)}
                      className="flex-1 rounded-lg border border-zinc-700 py-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleActivo(servicio)}
                      disabled={isToggling}
                      className={`flex-1 rounded-lg border py-2 text-xs transition-colors disabled:opacity-40 ${
                        servicio.activo
                          ? "border-red-500/20 text-red-400 hover:bg-red-500/10"
                          : "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                      }`}
                    >
                      {isToggling
                        ? "..."
                        : servicio.activo
                          ? "Dar de baja"
                          : "Reactivar"}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
