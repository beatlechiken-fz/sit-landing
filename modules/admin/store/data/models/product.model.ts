// Shape de la vista `catalogo` en Supabase
export interface ProductModel {
  id_proveedor: number;
  clave: string;
  codigo_fabricante: string | null;
  descripcion: string;
  marca: string;
  grupo: string;
  principal: string;
  garantia: string;
  clase: string;
  requiere_serie: boolean;
  imagen: string | null;
  brand_image: string | null;
  precio: number | null;
  moneda: string | null;
  disponible: number;
  disponible_cd: number;
  fecha_sync: string | null;
}

// Mapper: Model → Entity
export function toProductEntity(
  m: ProductModel,
): import("../../domain/entities/product.entity").Product {
  return {
    id: m.id_proveedor,
    clave: m.clave,
    codigoFabricante: m.codigo_fabricante,
    descripcion: m.descripcion,
    marca: m.marca,
    principal: m.principal,
    grupo: m.grupo,
    garantia: m.garantia,
    clase: m.clase,
    requiereSerie: m.requiere_serie,
    imagen: m.imagen,
    brandImage: m.brand_image,
    precio: m.precio,
    moneda: m.moneda as "Pesos" | "Dolares" | null,
    disponible: m.disponible,
    disponibleCD: m.disponible_cd,
    fechaSync: m.fecha_sync,
  };
}
