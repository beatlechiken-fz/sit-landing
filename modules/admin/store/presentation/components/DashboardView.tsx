import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { DEAL_STATUS_LABELS, DealStatus } from "@/modules/admin/store/domain/entities/deal.entity";
import DashboardCharts, {
  DashboardData,
  MonthPoint,
} from "./DashboardCharts";

type CotizacionRow = {
  id: string;
  total: number | null;
  status: DealStatus;
  cliente_id: string | null;
  cliente_nombre: string | null;
  created_at: string;
};

type ClienteRow = {
  id: string;
  created_at: string;
};

type CuponRow = {
  codigo: string;
  usos_actuales: number | null;
  max_usos: number | null;
  activo: boolean;
};

type CashbackRow = {
  monto: number | null;
  tipo: "ganado" | "usado";
};

const ETAPAS_FUNNEL: DealStatus[] = [
  "cotizacion",
  "en_proceso",
  "listo_para_entregar",
  "pendiente_de_pago",
  "pagado",
  "finalizado",
];

const REVENUE_STATUSES: DealStatus[] = ["finalizado", "pagado"];
const ACTIVA_STATUSES: DealStatus[] = [
  "cotizacion",
  "en_proceso",
  "listo_para_entregar",
  "pendiente_de_pago",
  "pagado",
];

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(d: Date) {
  return d.toLocaleDateString("es-MX", { month: "short" });
}

function lastNMonths(n: number): { key: string; label: string; date: Date }[] {
  const out = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({ key: monthKey(d), label: monthLabel(d), date: d });
  }
  return out;
}

function buildMonthSeries(
  months: { key: string; label: string }[],
  totals: Map<string, number>,
): MonthPoint[] {
  const currentKey = monthKey(new Date());
  return months.map((m) => ({
    key: m.key,
    label: m.label,
    value: totals.get(m.key) ?? 0,
    isCurrent: m.key === currentKey,
  }));
}

function pctDelta(current: number, previous: number): number | null {
  if (previous <= 0) return null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

async function getDashboardData(): Promise<DashboardData> {
  const supabase = getSupabaseServerClient();

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 12);

  const [cotizacionesRes, clientesRes, cuponesRes, cashbackRes] =
    await Promise.all([
      supabase
        .from("cotizaciones")
        .select("id,total,status,cliente_id,cliente_nombre,created_at")
        .gte("created_at", cutoff.toISOString()),
      supabase
        .from("clientes")
        .select("id,created_at")
        .gte("created_at", cutoff.toISOString()),
      supabase
        .from("cupones")
        .select("codigo,usos_actuales,max_usos,activo")
        .eq("activo", true)
        .order("usos_actuales", { ascending: false })
        .limit(6),
      supabase.from("cashback").select("monto,tipo"),
    ]);

  const cotizaciones = (cotizacionesRes.data ?? []) as CotizacionRow[];
  const clientes = (clientesRes.data ?? []) as ClienteRow[];
  const cupones = (cuponesRes.data ?? []) as CuponRow[];
  const cashback = (cashbackRes.data ?? []) as CashbackRow[];

  const months6 = lastNMonths(6);
  const currentKey = monthKey(new Date());
  const prevDate = new Date();
  prevDate.setMonth(prevDate.getMonth() - 1);
  const prevKey = monthKey(prevDate);

  // Ingresos por mes (solo estatus que representan ingreso real)
  const ingresosPorMesMap = new Map<string, number>();
  for (const c of cotizaciones) {
    if (!REVENUE_STATUSES.includes(c.status)) continue;
    const key = monthKey(new Date(c.created_at));
    ingresosPorMesMap.set(
      key,
      (ingresosPorMesMap.get(key) ?? 0) + Number(c.total ?? 0),
    );
  }

  // Clientes nuevos por mes
  const clientesPorMesMap = new Map<string, number>();
  for (const cl of clientes) {
    const key = monthKey(new Date(cl.created_at));
    clientesPorMesMap.set(key, (clientesPorMesMap.get(key) ?? 0) + 1);
  }

  const ingresosMes = ingresosPorMesMap.get(currentKey) ?? 0;
  const ingresosMesAnterior = ingresosPorMesMap.get(prevKey) ?? 0;
  const clientesNuevosMes = clientesPorMesMap.get(currentKey) ?? 0;
  const clientesNuevosMesAnterior = clientesPorMesMap.get(prevKey) ?? 0;

  const cotizacionesActivas = cotizaciones.filter((c) =>
    ACTIVA_STATUSES.includes(c.status),
  ).length;

  // Tasa de conversión — cotizaciones con desenlace (finalizado/cancelado) en los últimos 30 días
  const hace30 = new Date();
  hace30.setDate(hace30.getDate() - 30);
  const conDesenlace = cotizaciones.filter(
    (c) =>
      new Date(c.created_at) >= hace30 &&
      (c.status === "finalizado" || c.status === "cancelado"),
  );
  const finalizadas30 = conDesenlace.filter(
    (c) => c.status === "finalizado",
  ).length;
  const tasaConversion =
    conDesenlace.length > 0
      ? Math.round((finalizadas30 / conDesenlace.length) * 1000) / 10
      : null;

  // Etapas del funnel (snapshot de los últimos 12 meses)
  const etapaCounts = new Map<DealStatus, number>();
  let cancelados = 0;
  for (const c of cotizaciones) {
    if (c.status === "cancelado") {
      cancelados++;
      continue;
    }
    etapaCounts.set(c.status, (etapaCounts.get(c.status) ?? 0) + 1);
  }
  const etapas = ETAPAS_FUNNEL.map((status) => ({
    status,
    label: DEAL_STATUS_LABELS[status],
    count: etapaCounts.get(status) ?? 0,
  }));

  // Top clientes por gasto (ingresos reales)
  const gastoPorCliente = new Map<string, number>();
  for (const c of cotizaciones) {
    if (!REVENUE_STATUSES.includes(c.status)) continue;
    const nombre = c.cliente_nombre?.trim();
    if (!nombre) continue;
    gastoPorCliente.set(
      nombre,
      (gastoPorCliente.get(nombre) ?? 0) + Number(c.total ?? 0),
    );
  }
  const topClientes = Array.from(gastoPorCliente.entries())
    .map(([nombre, total]) => ({ nombre, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // Cashback pendiente de canjear (global)
  const cashbackGanado = cashback
    .filter((r) => r.tipo === "ganado")
    .reduce((acc, r) => acc + Number(r.monto ?? 0), 0);
  const cashbackUsado = cashback
    .filter((r) => r.tipo === "usado")
    .reduce((acc, r) => acc + Number(r.monto ?? 0), 0);
  const cashbackPendiente = Math.max(0, cashbackGanado - cashbackUsado);

  return {
    kpis: {
      ingresosMes,
      ingresosMesDeltaPct: pctDelta(ingresosMes, ingresosMesAnterior),
      cotizacionesActivas,
      tasaConversion,
      clientesNuevosMes,
      clientesNuevosMesDeltaPct: pctDelta(
        clientesNuevosMes,
        clientesNuevosMesAnterior,
      ),
      cashbackPendiente,
    },
    ingresosPorMes: buildMonthSeries(months6, ingresosPorMesMap),
    clientesPorMes: buildMonthSeries(months6, clientesPorMesMap),
    etapas,
    cancelados,
    topClientes,
    cupones: cupones.map((c) => ({
      codigo: c.codigo,
      usos: c.usos_actuales ?? 0,
      max: c.max_usos,
    })),
  };
}

export default async function DashboardView() {
  const data = await getDashboardData();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Resumen del negocio en tiempo real
        </p>
      </div>

      <DashboardCharts data={data} />
    </main>
  );
}
