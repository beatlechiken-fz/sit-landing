import { Product } from "./product.entity";

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  /** null = sin precio fijo; se define en el carrito al agregarlo. */
  precio: number | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

// Los servicios no viven en el catálogo sincronizado (`catalogo`), así que
// para poder agregarlos al mismo carrito que los productos los adaptamos a
// la forma de `Product`. El offset evita chocar con IDs reales del catálogo
// y con los IDs de sugerencias ya hardcodeados en ProductModal (9000001-9000009).
const SERVICIO_ID_OFFSET = 9_100_000;

export function servicioToProductId(servicioId: number): number {
  return SERVICIO_ID_OFFSET + servicioId;
}

export function servicioToProduct(servicio: Servicio): Product {
  return {
    id: servicioToProductId(servicio.id),
    clave: `SERV-${String(servicio.id).padStart(3, "0")}`,
    codigoFabricante: null,
    descripcion: servicio.descripcion?.trim() || servicio.nombre,
    marca: "Sit+",
    principal: "SERVICIOS SIT",
    grupo: "SERVICIOS SIT",
    garantia: "N/A",
    // Mismo `clase` para ambos casos: fijo o editable se distingue por
    // `precio === null` (ver esServicioSinPrecio en precio.utils.ts).
    clase: "SERVICIO",
    requiereSerie: false,
    imagen: null,
    brandImage: null,
    precio: servicio.precio,
    moneda: "Pesos",
    disponible: 9999,
    disponibleCD: 9999,
    fechaSync: null,
  };
}
