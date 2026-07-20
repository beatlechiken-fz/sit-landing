"use client";

import { useState } from "react";
import { Direccion } from "@/modules/admin/store/domain/entities/direccion.entity";

const EMPTY_FORM = {
  etiqueta: "Principal",
  calle: "",
  numero_ext: "",
  numero_int: "",
  colonia: "",
  ciudad: "",
  estado: "",
  cp: "",
  referencias: "",
  predeterminada: false,
};

const FIELDS: { label: string; key: keyof typeof EMPTY_FORM }[] = [
  { label: "Etiqueta", key: "etiqueta" },
  { label: "Calle *", key: "calle" },
  { label: "Número ext.", key: "numero_ext" },
  { label: "Número int.", key: "numero_int" },
  { label: "Colonia", key: "colonia" },
  { label: "Ciudad", key: "ciudad" },
  { label: "Estado", key: "estado" },
  { label: "C.P.", key: "cp" },
];

function direccionLinea(d: Direccion) {
  const partes = [
    `${d.calle}${d.numero_ext ? ` ${d.numero_ext}` : ""}${d.numero_int ? ` Int. ${d.numero_int}` : ""}`,
    d.colonia,
    d.ciudad,
    d.estado,
    d.cp,
  ].filter(Boolean);
  return partes.join(", ");
}

export function DireccionesManager({
  clienteId,
  direcciones: initial,
}: {
  clienteId: string;
  direcciones: Direccion[];
}) {
  const [direcciones, setDirecciones] = useState<Direccion[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Direccion>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 2500);
  };

  const handleCreate = async () => {
    if (!form.calle.trim()) {
      setError("La calle es requerida");
      return;
    }
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/clientes/${clienteId}/direcciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al crear dirección");
        return;
      }

      setDirecciones((prev) =>
        form.predeterminada
          ? [data, ...prev.map((d) => ({ ...d, predeterminada: false }))]
          : [data, ...prev],
      );
      setForm(EMPTY_FORM);
      setShowForm(false);
      showSuccess("Dirección agregada");
    } catch {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (d: Direccion) => {
    setEditingId(d.id);
    setEditData({ ...d });
    setError(null);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/clientes/${clienteId}/direcciones/${editingId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editData),
        },
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al guardar");
        return;
      }

      setDirecciones((prev) =>
        prev.map((d) =>
          d.id === editingId
            ? data
            : data.predeterminada
              ? { ...d, predeterminada: false }
              : d,
        ),
      );
      setEditingId(null);
      showSuccess("Dirección actualizada");
    } catch {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);

    try {
      const res = await fetch(
        `/api/clientes/${clienteId}/direcciones/${id}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        setError("Error al eliminar");
        return;
      }
      setDirecciones((prev) => prev.filter((d) => d.id !== id));
      showSuccess("Dirección eliminada");
    } catch {
      setError("Error de conexión");
    } finally {
      setDeletingId(null);
    }
  };

  const handleMarcarPredeterminada = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(
        `/api/clientes/${clienteId}/direcciones/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ predeterminada: true }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al actualizar");
        return;
      }
      setDirecciones((prev) =>
        prev.map((d) => ({ ...d, predeterminada: d.id === id })),
      );
    } catch {
      setError("Error de conexión");
    }
  };

  return (
    <div className="space-y-4">
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

      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-600">
          {direcciones.length}{" "}
          {direcciones.length === 1 ? "dirección" : "direcciones"}
        </p>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setError(null);
          }}
          className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors"
        >
          + Agregar dirección
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-[#02AFFF]/20 bg-zinc-900 p-5 space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {FIELDS.map(({ label, key }) => (
              <div key={key}>
                <label className="mb-1 block text-xs text-zinc-500">
                  {label}
                </label>
                <input
                  type="text"
                  value={form[key] as string}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="input-dark w-full"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-zinc-500">
                Referencias
              </label>
              <input
                type="text"
                value={form.referencias}
                onChange={(e) =>
                  setForm({ ...form, referencias: e.target.value })
                }
                placeholder="Entre calles, color de fachada, etc."
                className="input-dark w-full"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-zinc-400">
            <input
              type="checkbox"
              checked={form.predeterminada}
              onChange={(e) =>
                setForm({ ...form, predeterminada: e.target.checked })
              }
            />
            Marcar como predeterminada
          </label>

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
              disabled={saving || !form.calle.trim()}
              className="rounded-lg bg-[#02AFFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#1961B0] transition-colors disabled:opacity-40"
            >
              {saving ? "Guardando..." : "Guardar dirección"}
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {direcciones.map((d) => (
          <div
            key={d.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 space-y-2"
          >
            {editingId === d.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {FIELDS.map(({ label, key }) => (
                    <div key={key}>
                      <label className="mb-1 block text-xs text-zinc-500">
                        {label}
                      </label>
                      <input
                        type="text"
                        value={(editData[key] as string) ?? ""}
                        onChange={(e) =>
                          setEditData({ ...editData, [key]: e.target.value })
                        }
                        className="input-dark w-full"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-500">
                    Referencias
                  </label>
                  <input
                    type="text"
                    value={editData.referencias ?? ""}
                    onChange={(e) =>
                      setEditData({ ...editData, referencias: e.target.value })
                    }
                    className="input-dark w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    disabled={saving}
                    className="flex-1 rounded-lg bg-[#02AFFF]/10 py-2 text-xs font-medium text-[#02AFFF] hover:bg-[#02AFFF]/20 transition-colors disabled:opacity-40"
                  >
                    {saving ? "Guardando..." : "Guardar"}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 rounded-lg border border-zinc-700 py-2 text-xs text-zinc-400 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-zinc-200">
                      {d.etiqueta}
                    </p>
                    {d.predeterminada && (
                      <span className="rounded-full bg-[#02AFFF]/10 px-2 py-0.5 text-[10px] font-medium text-[#02AFFF]">
                        Predeterminada
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-zinc-500">{direccionLinea(d)}</p>
                {d.referencias && (
                  <p className="text-xs text-zinc-600">{d.referencias}</p>
                )}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={() => startEdit(d)}
                    className="rounded-lg border border-zinc-700 px-3 py-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    Editar
                  </button>
                  {!d.predeterminada && (
                    <button
                      onClick={() => handleMarcarPredeterminada(d.id)}
                      className="rounded-lg border border-zinc-700 px-3 py-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      Hacer predeterminada
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(d.id)}
                    disabled={deletingId === d.id}
                    className="rounded-lg border border-red-500/20 px-3 py-1 text-xs text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                  >
                    {deletingId === d.id ? "..." : "Eliminar"}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {direcciones.length === 0 && !showForm && (
        <div className="py-8 text-center text-zinc-600 text-sm">
          Este cliente no tiene direcciones registradas
        </div>
      )}
    </div>
  );
}
