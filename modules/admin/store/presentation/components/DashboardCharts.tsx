"use client";

import { motion } from "framer-motion";
import { DealStatus } from "@/modules/admin/store/domain/entities/deal.entity";

export type MonthPoint = {
  key: string;
  label: string;
  value: number;
  isCurrent: boolean;
};

export type DashboardData = {
  kpis: {
    ingresosMes: number;
    ingresosMesDeltaPct: number | null;
    cotizacionesActivas: number;
    tasaConversion: number | null;
    clientesNuevosMes: number;
    clientesNuevosMesDeltaPct: number | null;
    cashbackPendiente: number;
  };
  ingresosPorMes: MonthPoint[];
  clientesPorMes: MonthPoint[];
  etapas: { status: DealStatus; label: string; count: number }[];
  cancelados: number;
  topClientes: { nombre: string; total: number }[];
  cupones: { codigo: string; usos: number; max: number | null }[];
};

const ETAPA_COLORS = [
  "bg-teal-200",
  "bg-teal-300",
  "bg-teal-400",
  "bg-teal-500",
  "bg-teal-600",
  "bg-teal-700",
];

function formatCompactMXN(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function DeltaBadge({ pct }: { pct: number | null }) {
  if (pct === null) return null;
  const good = pct >= 0;
  return (
    <span
      className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${
        good ? "text-emerald-400" : "text-red-400"
      }`}
    >
      <svg
        className={`h-3 w-3 ${good ? "" : "rotate-180"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
      {Math.abs(pct)}% vs mes anterior
    </span>
  );
}

function StatTile({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta?: number | null;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      {delta !== undefined && <DeltaBadge pct={delta} />}
    </div>
  );
}

function MonthlyBarChart({
  title,
  points,
  formatValue,
}: {
  title: string;
  points: MonthPoint[];
  formatValue: (v: number) => string;
}) {
  const max = Math.max(...points.map((p) => p.value), 1);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <p className="mb-6 text-sm font-semibold text-zinc-200">{title}</p>

      <div className="flex h-40 items-end justify-between gap-2">
        {points.map((p, i) => {
          const pct = Math.max((p.value / max) * 100, p.value > 0 ? 3 : 0);
          return (
            <div
              key={p.key}
              className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
            >
              {p.isCurrent && p.value > 0 && (
                <span className="text-[10px] font-medium text-teal-300">
                  {formatValue(p.value)}
                </span>
              )}
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className={`w-6 rounded-t-[4px] ${
                  p.isCurrent
                    ? "bg-gradient-to-t from-teal-500 to-sky-400"
                    : "bg-white/15"
                }`}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 border-t border-white/10 pt-2">
        {points.map((p) => (
          <span
            key={p.key}
            className="flex-1 text-center text-[10px] text-zinc-500"
          >
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function HorizontalBars({
  items,
  emptyLabel,
}: {
  items: { label: string; value: number; colorClass: string }[];
  emptyLabel: string;
}) {
  if (items.length === 0 || items.every((i) => i.value === 0)) {
    return <p className="text-sm text-zinc-500">{emptyLabel}</p>;
  }

  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="flex flex-col gap-3">
      {items.map((it, i) => (
        <div key={it.label} className="flex items-center gap-3">
          <span className="w-36 shrink-0 truncate text-xs text-zinc-400">
            {it.label}
          </span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/5">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(it.value / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className={`h-full rounded-full ${it.colorClass}`}
            />
          </div>
          <span className="w-10 shrink-0 text-right text-xs font-medium text-zinc-300">
            {it.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function CouponMeter({
  codigo,
  usos,
  max,
}: {
  codigo: string;
  usos: number;
  max: number | null;
}) {
  const pct = max ? Math.min(100, (usos / max) * 100) : 0;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-300">{codigo}</span>
        <span className="text-xs text-zinc-500">
          {max ? `${usos}/${max} usos` : `${usos} usos · ilimitado`}
        </span>
      </div>
      {max ? (
        <div className="h-2 overflow-hidden rounded-full bg-teal-500/10">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="h-full rounded-full bg-teal-400"
          />
        </div>
      ) : null}
    </div>
  );
}

export default function DashboardCharts({ data }: { data: DashboardData }) {
  const { kpis } = data;

  const etapaBars = data.etapas.map((e, i) => ({
    label: e.label,
    value: e.count,
    colorClass: ETAPA_COLORS[i] ?? "bg-teal-500",
  }));
  if (data.cancelados > 0) {
    etapaBars.push({
      label: "Cancelado",
      value: data.cancelados,
      colorClass: "bg-red-400",
    });
  }

  const topClientesBars = data.topClientes.map((c) => ({
    label: c.nombre,
    value: c.total,
    colorClass: "bg-teal-400",
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatTile
          label="Ingresos del mes"
          value={formatCompactMXN(kpis.ingresosMes)}
          delta={kpis.ingresosMesDeltaPct}
        />
        <StatTile
          label="Cotizaciones activas"
          value={String(kpis.cotizacionesActivas)}
        />
        <StatTile
          label="Conversión (30 días)"
          value={kpis.tasaConversion === null ? "—" : `${kpis.tasaConversion}%`}
        />
        <StatTile
          label="Clientes nuevos"
          value={String(kpis.clientesNuevosMes)}
          delta={kpis.clientesNuevosMesDeltaPct}
        />
        <StatTile
          label="Cashback pendiente"
          value={formatCompactMXN(kpis.cashbackPendiente)}
        />
      </div>

      {/* Tendencias mensuales */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MonthlyBarChart
          title="Ingresos por mes"
          points={data.ingresosPorMes}
          formatValue={formatCompactMXN}
        />
        <MonthlyBarChart
          title="Clientes nuevos por mes"
          points={data.clientesPorMes}
          formatValue={(v) => String(v)}
        />
      </div>

      {/* Pipeline + top clientes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="mb-6 text-sm font-semibold text-zinc-200">
            Cotizaciones por etapa
          </p>
          <HorizontalBars
            items={etapaBars}
            emptyLabel="Aún no hay cotizaciones registradas."
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="mb-6 text-sm font-semibold text-zinc-200">
            Top 5 clientes por gasto
          </p>
          <HorizontalBars
            items={topClientesBars}
            emptyLabel="Aún no hay historial de ventas finalizadas."
          />
        </div>
      </div>

      {/* Cupones */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="mb-6 text-sm font-semibold text-zinc-200">
          Cupones activos
        </p>
        {data.cupones.length === 0 ? (
          <p className="text-sm text-zinc-500">No hay cupones activos.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.cupones.map((c) => (
              <CouponMeter
                key={c.codigo}
                codigo={c.codigo}
                usos={c.usos}
                max={c.max}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
