import { IProductRepository } from "../../domain/repositories/product.repository";
import { SupabaseProductDatasource } from "../datasources/supabase/product.datasource";
import { ProductFilter } from "../../domain/entities/product-filter.entity";
import { PaginatedResult } from "../../domain/entities/paginated-result.entity";
import { Product } from "../../domain/entities/product.entity";

export class ProductRepositoryImpl implements IProductRepository {
  constructor(private readonly datasource: SupabaseProductDatasource) {}

  getProducts(filter: ProductFilter): Promise<PaginatedResult<Product>> {
    return this.datasource.getProducts(filter);
  }

  getProductById(id: number): Promise<Product | null> {
    return this.datasource.getProductById(id);
  }

  getMarcas(): Promise<string[]> {
    return this.datasource.getMarcas();
  }

  getGrupos(): Promise<string[]> {
    return this.datasource.getGrupos();
  }

  getGanancias(): Promise<Record<string, number>> {
    return this.datasource.getGanancias();
  }

  getTipoCambio(): Promise<number> {
    return this.datasource.getTipoCambio();
  }

  getProductosDestacados(): Promise<Product[]> {
    return this.datasource.getProductosDestacados();
  }

  getGruposDestacados(): Promise<string[]> {
    return this.datasource.getGruposDestacados();
  }
}
