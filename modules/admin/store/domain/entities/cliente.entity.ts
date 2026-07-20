export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  empresa: string | null;
  activo: boolean;
  created_at: string;
  updated_at?: string;
}
