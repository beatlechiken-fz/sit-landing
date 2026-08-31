import { Product } from "@/modules/admin/store/domain/entities/product.entity";

/**
 * Calcula el precio final a mostrar al cliente.
 *
 * Fórmula: precio_bd * 1.16 * (1 + ganancia / 100)
 *
 * @param precio   Precio en BD (pesos o dólares)
 * @param ganancia Porcentaje de ganancia (0-100)
 * @param moneda   'Pesos' | 'Dolares'
 * @param tipoCambio Tipo de cambio MXN/USD (default 17.5)
 */
export function calcularPrecioFinal(
  precio: number,
  ganancia: number,
  moneda: "Pesos" | "Dolares" | null,
  tipoCambio: number = 17.5,
): number {
  // Convertir a pesos si es dólares
  const enPesos = moneda === "Dolares" ? precio * tipoCambio : precio;

  // Aplicar IVA y ganancia
  const conIva = enPesos * 1.16;
  const conGanancia = conIva * (1 + ganancia / 100);

  return Math.round(conGanancia * 100) / 100;
}

export function formatMXN(precio: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(precio);
}

export function esProductoGenerico(product: Product): boolean {
  return product.clase === "GENERICO";
}

export function esServicioSIT(product: Product): boolean {
  return product.clase === "SERVICIO";
}

/**
 * Servicio sin precio fijo (ej. reparaciones): el precio y la descripción
 * se definen manualmente al agregarlo al carrito, y el precio que se
 * ingresa es final (ya incluye impuestos, no se le suma IVA).
 */
export function esServicioSinPrecio(product: Product): boolean {
  return product.clase === "SERVICIO" && product.precio === null;
}
