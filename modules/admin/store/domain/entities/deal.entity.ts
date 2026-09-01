import { DireccionSnapshot } from "./direccion.entity";

export type DealStatus =
  | "en_diagnostico"
  | "cotizacion"
  | "en_proceso"
  | "listo_para_entregar"
  | "pendiente_de_pago"
  | "pagado"
  | "finalizado"
  | "cancelado";

export const DEAL_STATUS_LABELS: Record<DealStatus, string> = {
  en_diagnostico: "En diagnóstico",
  cotizacion: "Cotización",
  en_proceso: "En proceso",
  listo_para_entregar: "Listo para entregar",
  pendiente_de_pago: "Pendiente de pago",
  pagado: "Pagado",
  finalizado: "Finalizado",
  cancelado: "Cancelado",
};

export const DEAL_STATUS_COLORS: Record<DealStatus, string> = {
  en_diagnostico: "bg-purple-500/10 text-purple-400",
  cotizacion: "bg-zinc-500/10 text-zinc-400",
  en_proceso: "bg-blue-500/10 text-blue-400",
  listo_para_entregar: "bg-emerald-500/10 text-emerald-400",
  pendiente_de_pago: "bg-amber-500/10 text-amber-400",
  pagado: "bg-green-500/10 text-green-400",
  finalizado: "bg-[#02AFFF]/10 text-[#02AFFF]",
  cancelado: "bg-red-500/10 text-red-400",
};

// El flujo entre estos status ya no es lineal: desde cualquier status
// "activo" se puede cambiar a cualquier otro (ej. regresar de "pagado" a
// "en proceso"). Este arreglo solo define el orden en que se muestran los
// botones de "Cambiar status". La única excepción es "en_diagnostico":
// ver `puedeVolverADiagnostico`.
export const ALL_DEAL_STATUSES: DealStatus[] = [
  "en_diagnostico",
  "cotizacion",
  "en_proceso",
  "listo_para_entregar",
  "pendiente_de_pago",
  "pagado",
  "finalizado",
  "cancelado",
];

// "En diagnóstico" es de un solo sentido: en cuanto la orden pasa por
// "en_proceso" (lo que genera el número de orden), ya no se puede regresar
// a diagnóstico, sin importar a qué otro status se mueva después.
export function puedeVolverADiagnostico(numeroOrden: string | null): boolean {
  return !numeroOrden;
}

// El total solo se puede editar mientras la orden está en diagnóstico —
// es cuando todavía no se sabe el costo final del servicio.
export function puedeEditarTotal(status: DealStatus): boolean {
  return status === "en_diagnostico";
}

// "finalizado" y "cancelado" son estados de cierre: una vez ahí, la orden
// ya no puede cambiar a ningún otro status. "finalizado" es siempre el
// cierre exitoso y es lo único que genera cashback.
export const ESTADOS_TERMINALES: DealStatus[] = ["finalizado", "cancelado"];

export function esStatusTerminal(status: DealStatus): boolean {
  return ESTADOS_TERMINALES.includes(status);
}

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
  // Nota libre para servicios (ej. "Cambio de bomba de succión"). Se
  // muestra debajo del nombre del servicio, nunca lo reemplaza.
  detalle: string | null;
}

export interface DealMensaje {
  id: string;
  cotizacion_id: string;
  origen: "admin" | "cliente";
  contenido: string;
  leido: boolean;
  created_at: string;
}

// Eventos de la línea de tiempo: texto libre que el admin va agregando
// para llevar el historial de una orden (ej. "En espera de piezas",
// "Piezas instaladas"). No existen aún automáticos, todos son manuales.
export interface DealEvento {
  id: string;
  cotizacion_id: string;
  texto: string;
  created_at: string;
}

// Pagos registrados por el admin contra el total de la orden (parte de
// pagos). El restante se calcula en el cliente restando al total la suma
// de los pagos, nunca se guarda — así nunca queda desincronizado.
export interface DealPago {
  id: string;
  cotizacion_id: string;
  concepto: string;
  monto: number;
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
  cotizacion_eventos?: DealEvento[];
  cotizacion_pagos?: DealPago[];
}
