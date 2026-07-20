export type OrdenProducto =
  | "precio_asc" // Precio menor a mayor (default)
  | "precio_desc" // Precio mayor a menor
  | "nombre_asc" // Nombre A-Z
  | "nombre_desc" // Nombre Z-A
  | "marca_asc"; // Marca A-Z

export interface ProductFilter {
  q?: string;
  marca?: string;
  grupo?: string;
  principal?: string;
  moneda?: "Pesos" | "Dolares";
  soloAlmacen?: boolean; // Solo disponibles en almacén
  soloCD?: boolean; // Solo disponibles en CD
  orden?: OrdenProducto;
  page?: number;
  pageSize?: number;
}
