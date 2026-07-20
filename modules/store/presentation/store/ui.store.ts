import { create } from "zustand";

interface UIState {
  filtrosPanelAbierto: boolean;
  carritoAbierto: boolean;

  abrirFiltros: () => void;
  cerrarFiltros: () => void;
  toggleFiltros: () => void;

  abrirCarrito: () => void;
  cerrarCarrito: () => void;
  toggleCarrito: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  filtrosPanelAbierto: false,
  carritoAbierto: false,

  abrirFiltros: () => set({ filtrosPanelAbierto: true }),
  cerrarFiltros: () => set({ filtrosPanelAbierto: false }),
  toggleFiltros: () =>
    set((s) => ({ filtrosPanelAbierto: !s.filtrosPanelAbierto })),

  abrirCarrito: () => set({ carritoAbierto: true }),
  cerrarCarrito: () => set({ carritoAbierto: false }),
  toggleCarrito: () => set((s) => ({ carritoAbierto: !s.carritoAbierto })),
}));
