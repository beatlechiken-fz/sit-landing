import { DireccionSnapshot } from "./direccion.entity";

export type DealStatus =
  | "cotizacion"
  | "en_proceso"
  | "listo_para_entregar"
  | "pendiente_de_pago"
  | "pagado"
  | "finalizado"
  | "cancelado";

export const DEAL_STATUS_LABELS: Record<DealStatus, string> = {
  cotizacion: "Cotización",
  en_proceso: "En proceso",
  listo_para_entregar: "Listo para entregar",
  pendiente_de_pago: "Pendiente de pago",
  pagado: "Pagado",
  finalizado: "Finalizado",
  cancelado: "Cancelado",
};

export const DEAL_STATUS_COLORS: Record<DealStatus, string> = {
  cotizacion: "bg-zinc-500/10 text-zinc-400",
  en_proceso: "bg-blue-500/10 text-blue-400",
  listo_para_entregar: "bg-emerald-500/10 text-emerald-400",
  pendiente_de_pago: "bg-amber-500/10 text-amber-400",
  pagado: "bg-green-500/10 text-green-400",
  finalizado: "bg-[#02AFFF]/10 text-[#02AFFF]",
  cancelado: "bg-red-500/10 text-red-400",
};

export const DEAL_TRANSICIONES: Record<DealStatus, DealStatus[]> = {
  cotizacion: ["en_proceso", "cancelado"],
  en_proceso: ["listo_para_entregar", "cancelado"],
  listo_para_entregar: ["pendiente_de_pago", "cancelado"],
  pendiente_de_pago: ["pagado", "cancelado"],
  pagado: ["finalizado"],
  finalizado: [],
  cancelado: [],
};

export interface DealLinea {
  id: string;
  cotizacion_id: string;
  producto_id: number;
  clave: string;
  descripcion: string;
  marca: string;
  cantidad: number;
  precio_unitario: number;
  descuento: number;
  total: number;
  cupon: { codigo: string; descuento: number; tipo: string } | null;
}

export interface DealMensaje {
  id: string;
  cotizacion_id: string;
  origen: "admin" | "cliente";
  contenido: string;
  leido: boolean;
  created_at: string;
}

export interface Deal {
  id: string;
  numero_orden: string | null;
  cliente_id: string | null;
  cliente_nombre: string;
  status: DealStatus;
  subtotal: number;
  descuento: number;
  cashback_canjeado: number;
  cashback_ganado: number;
  total: number;
  cupon_global: { codigo: string; descuento: number; tipo: string } | null;
  direccion_id: string | null;
  direccion_entrega: DireccionSnapshot | null;
  fecha_entrega: string | null;
  expira_at: string;
  created_at: string;
  updated_at: string;
  clientes?: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string | null;
    empresa: string | null;
  } | null;
  cotizacion_lineas?: DealLinea[];
  cotizacion_mensajes?: DealMensaje[];
}
