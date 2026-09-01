import { create } from "zustand";
import { CuponValido } from "@/app/api/cupones/validar/route";
import { Product } from "@/modules/admin/store/domain/entities/product.entity";

export interface LineaCarrito {
  product: Product;
  precioFinal: number;
  precioEditable: boolean; // ← true si es genérico
  cantidad: number;
  subtotal: number;
  descuento: number;
  total: number;
  cupon: CuponValido | null;
  // Nota libre para servicios (ej. "Cambio de bomba de succión"). Se
  // muestra debajo del nombre del servicio, sin reemplazarlo, y se
  // guarda aparte en la BD (cotizacion_lineas.detalle). Opcional para
  // que el carrito de la tienda pública (que no la usa) siga siendo
  // asignable al mismo `LineaCarrito[]` que consume el generador de PDF.
  detalleServicio?: string | null;
}

interface CarritoState {
  lineas: LineaCarrito[];
  cuponGlobal: CuponValido | null;

  agregar: (product: Product, cantidad?: number, precioFinal?: number) => void;
  quitarUno: (productId: number) => void;
  setCantidad: (productId: number, cantidad: number) => void;
  eliminar: (productId: number) => void;
  limpiar: () => void;

  aplicarCupon: (productId: number, cupon: CuponValido) => void;
  quitarCupon: (productId: number) => void;

  aplicarCuponGlobal: (cupon: CuponValido) => void;
  quitarCuponGlobal: () => void;

  totalLineas: () => number;
  subtotalCarrito: () => number;
  descuentoLineas: () => number;
  descuentoGlobal: () => number;
  descuentoTotal: () => number;
  totalCarrito: () => number;

  setPrecioEditable: (productId: number, precio: number) => void;
  setDetalleServicio: (productId: number, detalle: string) => void;
}

function calcularDescuento(
  precio: number,
  cantidad: number,
  cupon: CuponValido | null,
): number {
  if (!cupon) return 0;
  const subtotal = precio * cantidad;
  if (cupon.tipo === "porcentaje") {
    return Math.round(((subtotal * cupon.descuento) / 100) * 100) / 100;
  }
  return Math.min(cupon.descuento, subtotal);
}

function buildLinea(
  product: Product,
  precioFinal: number,
  cantidad: number,
  cupon: CuponValido | null,
  precioEditable: boolean = false,
  detalleServicio: string | null = null,
): LineaCarrito {
  const subtotal = Math.round(precioFinal * cantidad * 100) / 100;
  const descuento = calcularDescuento(precioFinal, cantidad, cupon);
  const total = Math.round((subtotal - descuento) * 100) / 100;
  return {
    product,
    precioFinal,
    precioEditable,
    cantidad,
    subtotal,
    descuento,
    total,
    cupon,
    detalleServicio,
  };
}

export const useCarritoStore = create<CarritoState>((set, get) => ({
  lineas: [],
  cuponGlobal: null,

  agregar: (product, cantidad = 1, precioFinal?: number) => {
    set((state) => {
      const esGenerico = product.clase === "GENERICO";
      // Servicio sin precio fijo (ej. reparaciones): también editable,
      // pero el precio que se escriba es final, sin sumarle IVA.
      const esServicioSinPrecioFijo =
        product.clase === "SERVICIO" && product.precio === null;
      const precioEsEditable = esGenerico || esServicioSinPrecioFijo;
      const precio = precioFinal ?? product.precio ?? 0;
      const existe = state.lineas.find((l) => l.product.id === product.id);

      if (existe) {
        return {
          lineas: state.lineas.map((l) =>
            l.product.id === product.id
              ? buildLinea(
                  l.product,
                  l.precioFinal,
                  l.cantidad + cantidad,
                  l.cupon,
                  l.precioEditable,
                  l.detalleServicio,
                )
              : l,
          ),
        };
      }

      return {
        lineas: [
          ...state.lineas,
          buildLinea(product, precio, cantidad, null, precioEsEditable),
        ],
      };
    });
  },

  quitarUno: (productId) => {
    set((state) => {
      const linea = state.lineas.find((l) => l.product.id === productId);
      if (!linea) return state;
      if (linea.cantidad === 1) {
        return {
          lineas: state.lineas.filter((l) => l.product.id !== productId),
        };
      }
      return {
        lineas: state.lineas.map((l) =>
          l.product.id === productId
            ? buildLinea(
                l.product,
                l.precioFinal,
                l.cantidad - 1,
                l.cupon,
                l.precioEditable,
                l.detalleServicio,
              )
            : l,
        ),
      };
    });
  },

  setCantidad: (productId, cantidad) => {
    if (cantidad < 1) return;
    set((state) => ({
      lineas: state.lineas.map((l) =>
        l.product.id === productId
          ? buildLinea(
              l.product,
              l.precioFinal,
              cantidad,
              l.cupon,
              l.precioEditable,
              l.detalleServicio,
            )
          : l,
      ),
    }));
  },

  eliminar: (productId) => {
    set((state) => ({
      lineas: state.lineas.filter((l) => l.product.id !== productId),
    }));
  },

  limpiar: () => set({ lineas: [], cuponGlobal: null }),

  aplicarCupon: (productId, cupon) => {
    set((state) => ({
      lineas: state.lineas.map((l) =>
        l.product.id === productId
          ? buildLinea(
              l.product,
              l.precioFinal,
              l.cantidad,
              cupon,
              l.precioEditable,
              l.detalleServicio,
            )
          : l,
      ),
    }));
  },

  quitarCupon: (productId) => {
    set((state) => ({
      lineas: state.lineas.map((l) =>
        l.product.id === productId
          ? buildLinea(
              l.product,
              l.precioFinal,
              l.cantidad,
              null,
              l.precioEditable,
              l.detalleServicio,
            )
          : l,
      ),
    }));
  },

  aplicarCuponGlobal: (cupon) => set({ cuponGlobal: cupon }),
  quitarCuponGlobal: () => set({ cuponGlobal: null }),

  totalLineas: () => get().lineas.reduce((acc, l) => acc + l.cantidad, 0),
  subtotalCarrito: () => get().lineas.reduce((acc, l) => acc + l.subtotal, 0),
  descuentoLineas: () => get().lineas.reduce((acc, l) => acc + l.descuento, 0),

  descuentoGlobal: () => {
    const { cuponGlobal, lineas } = get();
    if (!cuponGlobal) return 0;
    const totalSinGlobal = lineas.reduce((acc, l) => acc + l.total, 0);
    if (cuponGlobal.tipo === "porcentaje") {
      return (
        Math.round(((totalSinGlobal * cuponGlobal.descuento) / 100) * 100) / 100
      );
    }
    return Math.min(cuponGlobal.descuento, totalSinGlobal);
  },

  descuentoTotal: () => {
    const { descuentoLineas, descuentoGlobal } = get();
    return descuentoLineas() + descuentoGlobal();
  },

  totalCarrito: () => {
    const { lineas, descuentoGlobal } = get();
    const totalLineas = lineas.reduce((acc, l) => acc + l.total, 0);
    return Math.round((totalLineas - descuentoGlobal()) * 100) / 100;
  },

  setPrecioEditable: (productId, precio) => {
    if (precio < 0) return;
    set((state) => ({
      lineas: state.lineas.map((l) =>
        l.product.id === productId && l.precioEditable
          ? buildLinea(l.product, precio, l.cantidad, l.cupon, true, l.detalleServicio)
          : l,
      ),
    }));
  },

  setDetalleServicio: (productId, detalle) => {
    set((state) => ({
      lineas: state.lineas.map((l) =>
        l.product.id === productId ? { ...l, detalleServicio: detalle } : l,
      ),
    }));
  },
}));
