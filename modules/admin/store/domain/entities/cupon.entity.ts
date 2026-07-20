export interface Cupon {
  id: number;
  codigo: string;
  descuento: number;
  tipo: "porcentaje" | "fijo";
  activo: boolean;
  expira_at: string | null;
  cliente_id: string | null;
  max_usos: number | null;
  usos_actuales: number;
  created_at?: string;
}
