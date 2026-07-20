"use client";

import { useCallback, useRef, useState } from "react";
import { Cupon } from "@/modules/admin/store/domain/entities/cupon.entity";
import { Cliente } from "@/modules/admin/store/domain/entities/cliente.entity";
import { DatePicker } from "@/core/components/date-picker/DatePicker";

interface CuponesManagerProps {
  cupones: Cupon[];
}

const EMPTY_FORM = {
  codigo: "",
  descuento: "",
  tipo: "porcentaje" as "porcentaje" | "fijo",
  expira_at: "",
  cliente_id: null as string | null,
  clienteNombre: "",
  max_usos: "",
};

// ─────────────────────────────────────────────
// Mini buscador de cliente para exclusividad de cupón
// ─────────────────────────────────────────────
function ClientePicker({
  clienteId,
  clienteNombre,
  onChange,
}: {
  clienteId: string | null;
  clienteNombre: string;
  onChange: (id: string | null, nombre: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<Cliente[]>([]);
  const [abierto, setAbierto] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buscar = useCallback((q: string) => {
    if (q.trim().length < 2) {
      setResultados([]);
      setAbierto(false);
      return;
    }
    fetch(`/api/clientes?q=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((data) => {
        setResultados(Array.isArray(data) ? data : []);
        setAbierto(true);
      })
      .catch(() => setResultados([]));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => buscar(val), 300);
  };

  if (clienteId) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-purple-500/20 bg-purple-500/5 px-3 py-1.5">
        <span className="text-xs text-purple-300 truncate">
          {clienteNombre}
        </span>
        <button
          onClick={() => onChange(null, "")}
          className="text-purple-400 hover:text-purple-200"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => resultados.length > 0 && setAbierto(true)}
        placeholder="Global (cualquier cliente)"
        className="input-dark w-full"
      />
      {abierto && resultados.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl">
          {resultados.slice(0, 6).map((c) => (
            <button
              key={c.id}
              onClick={() => {
                onChange(c.id, `${c.nombre} ${c.apellido}`);
                setQuery("");
                setAbierto(false);
              }}
              className="block w-full px-3 py-2 text-left text-xs text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              {c.nombre} {c.apellido} — {c.email}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function CuponesManager({ cupones: initial }: CuponesManagerProps) {
  const [cupones, setCupones] = useState<Cupon[]>(initial);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<
    Partial<Cupon> & { clienteNombre?: string }
  >({});
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 2500);
  };

  // ── Editar ──────────────────────────────────
  const startEdit = (cupon: Cupon) => {
    setEditingId(cupon.id);
    setEditData({
      codigo: cupon.codigo,
      descuento: cupon.descuento,
      tipo: cupon.tipo,
      activo: cupon.activo,
      expira_at: cupon.expira_at ?? "",
      cliente_id: cupon.cliente_id,
      clienteNombre: "",
      max_usos: cupon.max_usos,
    });
    setError(null);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/cupones/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al guardar");
        return;
      }

      setCupones((prev) => prev.map((c) => (c.id === editingId ? data : c)));
      setEditingId(null);
      showSuccess("Cupón actualizado");
    } catch {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  // ── Eliminar ────────────────────────────────
  const handleDelete = async (id: number) => {
    setDeletingId(id);
    setError(null);

    try {
      const res = await fetch(`/api/cupones/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Error al eliminar");
        return;
      }

      setCupones((prev) => prev.filter((c) => c.id !== id));
      showSuccess("Cupón eliminado");
    } catch {
      setError("Error de conexión");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Crear ───────────────────────────────────
  const handleCreate = async () => {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/cupones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al crear");
        return;
      }

      setCupones((prev) => [data, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
      showSuccess("Cupón creado");
    } catch {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  const formatExpira = (date: string | null) => {
    if (!date) return "Sin expiración";
    return new Date(date).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatUsos = (cupon: Cupon) =>
    cupon.max_usos ? `${cupon.usos_actuales}/${cupon.max_usos}` : "Ilimitado";

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
          {cupones.length} {cupones.length === 1 ? "cupón" : "cupones"}
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
          Nuevo cupón
        </button>
      </div>

      {/* Formulario nuevo cupón */}
      {showForm && (
        <div className="rounded-2xl border border-[#02AFFF]/20 bg-zinc-900 p-5 space-y-4">
          <p className="text-sm font-semibold text-zinc-200">Nuevo cupón</p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Código</label>
              <input
                type="text"
                value={form.codigo}
                onChange={(e) =>
                  setForm({ ...form, codigo: e.target.value.toUpperCase() })
                }
                placeholder="DESCUENTO10"
                className="input-dark w-full"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">
                Descuento
              </label>
              <input
                type="number"
                value={form.descuento}
                onChange={(e) =>
                  setForm({ ...form, descuento: e.target.value })
                }
                placeholder="10"
                className="input-dark w-full"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Tipo</label>
              <select
                value={form.tipo}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tipo: e.target.value as "porcentaje" | "fijo",
                  })
                }
                className="input-dark w-full"
              >
                <option value="porcentaje">Porcentaje (%)</option>
                <option value="fijo">Monto fijo ($)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">
                Expira el
              </label>
              <DatePicker
                value={form.expira_at}
                onChange={(v) => setForm({ ...form, expira_at: v })}
                placeholder="Sin expiración"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">
                Cliente exclusivo
              </label>
              <ClientePicker
                clienteId={form.cliente_id}
                clienteNombre={form.clienteNombre}
                onChange={(id, nombre) =>
                  setForm({ ...form, cliente_id: id, clienteNombre: nombre })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">
                Máximo de usos
              </label>
              <input
                type="number"
                min={1}
                value={form.max_usos}
                onChange={(e) =>
                  setForm({ ...form, max_usos: e.target.value })
                }
                placeholder="Ilimitado"
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
              disabled={saving || !form.codigo || !form.descuento}
              className="
                rounded-lg bg-[#02AFFF] px-4 py-2 text-sm font-medium text-white
                hover:bg-[#1961B0] transition-colors
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              {saving ? "Creando..." : "Crear cupón"}
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
                {[
                  "Código",
                  "Descuento",
                  "Tipo",
                  "Cliente",
                  "Usos",
                  "Expira",
                  "Estado",
                  "Acciones",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {cupones.map((cupon) => {
                const isEditing = editingId === cupon.id;
                const isDeleting = deletingId === cupon.id;

                return (
                  <tr
                    key={cupon.id}
                    className="bg-zinc-950 hover:bg-zinc-900/40 transition-colors"
                  >
                    {/* Código */}
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.codigo ?? ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              codigo: e.target.value.toUpperCase(),
                            })
                          }
                          className="input-dark w-36"
                        />
                      ) : (
                        <span className="font-mono font-bold text-zinc-100">
                          {cupon.codigo}
                        </span>
                      )}
                    </td>

                    {/* Descuento */}
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editData.descuento ?? ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              descuento: Number(e.target.value),
                            })
                          }
                          className="input-dark w-24"
                        />
                      ) : (
                        <span className="text-zinc-200">
                          {cupon.tipo === "porcentaje"
                            ? `${cupon.descuento}%`
                            : `$${cupon.descuento.toLocaleString("es-MX")}`}
                        </span>
                      )}
                    </td>

                    {/* Tipo */}
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <select
                          value={editData.tipo}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              tipo: e.target.value as "porcentaje" | "fijo",
                            })
                          }
                          className="input-dark"
                        >
                          <option value="porcentaje">Porcentaje</option>
                          <option value="fijo">Fijo</option>
                        </select>
                      ) : (
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium
                          ${
                            cupon.tipo === "porcentaje"
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-purple-500/10 text-purple-400"
                          }`}
                        >
                          {cupon.tipo === "porcentaje" ? "%" : "$"}
                        </span>
                      )}
                    </td>

                    {/* Cliente */}
                    <td className="px-5 py-3 min-w-[180px]">
                      {isEditing ? (
                        <ClientePicker
                          clienteId={editData.cliente_id ?? null}
                          clienteNombre={editData.clienteNombre ?? ""}
                          onChange={(id, nombre) =>
                            setEditData({
                              ...editData,
                              cliente_id: id,
                              clienteNombre: nombre,
                            })
                          }
                        />
                      ) : (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            cupon.cliente_id
                              ? "bg-purple-500/10 text-purple-400"
                              : "bg-zinc-500/10 text-zinc-500"
                          }`}
                        >
                          {cupon.cliente_id ? "Exclusivo" : "Global"}
                        </span>
                      )}
                    </td>

                    {/* Usos */}
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <input
                          type="number"
                          min={1}
                          value={editData.max_usos ?? ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              max_usos: e.target.value
                                ? Number(e.target.value)
                                : null,
                            })
                          }
                          placeholder="Ilimitado"
                          className="input-dark w-24"
                        />
                      ) : (
                        <span className="text-zinc-400 text-xs">
                          {formatUsos(cupon)}
                        </span>
                      )}
                    </td>

                    {/* Expira */}
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <DatePicker
                          value={editData.expira_at ?? ""}
                          onChange={(v) =>
                            setEditData({ ...editData, expira_at: v })
                          }
                          placeholder="Sin expiración"
                          className="w-40"
                        />
                      ) : (
                        <span className="text-zinc-400 text-xs">
                          {formatExpira(cupon.expira_at)}
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
                          <option value="false">Inactivo</option>
                        </select>
                      ) : (
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium
                          ${
                            cupon.activo
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-zinc-500/10 text-zinc-500"
                          }`}
                        >
                          {cupon.activo ? "Activo" : "Inactivo"}
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
                            <button
                              onClick={() => startEdit(cupon)}
                              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(cupon.id)}
                              disabled={isDeleting}
                              className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                            >
                              {isDeleting ? "..." : "Eliminar"}
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
        {cupones.map((cupon) => {
          const isEditing = editingId === cupon.id;
          const isDeleting = deletingId === cupon.id;

          return (
            <div
              key={cupon.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 space-y-3"
            >
              {/* Header tarjeta */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono font-bold text-zinc-100">
                    {cupon.codigo}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {formatExpira(cupon.expira_at)} · {formatUsos(cupon)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium
                    ${
                      cupon.activo
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-zinc-500/10 text-zinc-500"
                    }`}
                  >
                    {cupon.activo ? "Activo" : "Inactivo"}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      cupon.cliente_id
                        ? "bg-purple-500/10 text-purple-400"
                        : "bg-zinc-500/10 text-zinc-500"
                    }`}
                  >
                    {cupon.cliente_id ? "Exclusivo" : "Global"}
                  </span>
                </div>
              </div>

              {/* Descuento */}
              {!isEditing && (
                <p className="text-sm text-zinc-300">
                  {cupon.tipo === "porcentaje"
                    ? `${cupon.descuento}% de descuento`
                    : `$${cupon.descuento.toLocaleString("es-MX")} de descuento`}
                </p>
              )}

              {/* Formulario edición mobile */}
              {isEditing && (
                <div className="space-y-2">
                  {[
                    { label: "Código", key: "codigo", type: "text" },
                    { label: "Descuento", key: "descuento", type: "number" },
                  ].map(({ label, key, type }) => (
                    <div key={key}>
                      <label className="mb-1 block text-xs text-zinc-500">
                        {label}
                      </label>
                      <input
                        type={type}
                        value={(editData as any)[key] ?? ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            [key]:
                              type === "number"
                                ? Number(e.target.value)
                                : e.target.value.toUpperCase(),
                          })
                        }
                        className="input-dark w-full"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="mb-1 block text-xs text-zinc-500">
                      Tipo
                    </label>
                    <select
                      value={editData.tipo}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          tipo: e.target.value as "porcentaje" | "fijo",
                        })
                      }
                      className="input-dark w-full"
                    >
                      <option value="porcentaje">Porcentaje (%)</option>
                      <option value="fijo">Monto fijo ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-zinc-500">
                      Expira el
                    </label>
                    <DatePicker
                      value={editData.expira_at ?? ""}
                      onChange={(v) =>
                        setEditData({ ...editData, expira_at: v })
                      }
                      placeholder="Sin expiración"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-zinc-500">
                      Cliente exclusivo
                    </label>
                    <ClientePicker
                      clienteId={editData.cliente_id ?? null}
                      clienteNombre={editData.clienteNombre ?? ""}
                      onChange={(id, nombre) =>
                        setEditData({
                          ...editData,
                          cliente_id: id,
                          clienteNombre: nombre,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-zinc-500">
                      Máximo de usos
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={editData.max_usos ?? ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          max_usos: e.target.value
                            ? Number(e.target.value)
                            : null,
                        })
                      }
                      placeholder="Ilimitado"
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
                      <option value="false">Inactivo</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div className="flex gap-2 pt-1">
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
                    <button
                      onClick={() => startEdit(cupon)}
                      className="flex-1 rounded-lg border border-zinc-700 py-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(cupon.id)}
                      disabled={isDeleting}
                      className="flex-1 rounded-lg border border-red-500/20 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                    >
                      {isDeleting ? "..." : "Eliminar"}
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
