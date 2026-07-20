export interface Direccion {
  id: string;
  cliente_id: string;
  etiqueta: string;
  calle: string;
  numero_ext: string | null;
  numero_int: string | null;
  colonia: string | null;
  ciudad: string | null;
  estado: string | null;
  cp: string | null;
  referencias: string | null;
  predeterminada: boolean;
  created_at: string;
  updated_at: string;
}

export type DireccionSnapshot = Omit<
  Direccion,
  "id" | "cliente_id" | "predeterminada" | "created_at" | "updated_at"
>;
