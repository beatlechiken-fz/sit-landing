export interface Product {
  id: number;
  clave: string;
  codigoFabricante: string | null;
  descripcion: string;
  marca: string;
  principal: string;
  grupo: string;
  garantia: string;
  clase: string;
  requiereSerie: boolean;
  imagen: string | null;
  brandImage: string | null;
  // De la tabla precios (join)
  precio: number | null;
  moneda: "Pesos" | "Dolares" | null;
  disponible: number;
  disponibleCD: number;
  fechaSync: string | null;
}
