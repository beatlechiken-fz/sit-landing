import { Product } from "../entities/product.entity";
import { ProductFilter } from "../entities/product-filter.entity";
import { PaginatedResult } from "../entities/paginated-result.entity";

export interface IProductRepository {
  getProducts(filter: ProductFilter): Promise<PaginatedResult<Product>>;
  getProductById(id: number): Promise<Product | null>;
  getMarcas(): Promise<string[]>;
  getGrupos(): Promise<string[]>;
  getGanancias(): Promise<Record<string, number>>;
  getTipoCambio(): Promise<number>;
  getProductosDestacados(): Promise<Product[]>;
  getGruposDestacados(): Promise<string[]>;
}
