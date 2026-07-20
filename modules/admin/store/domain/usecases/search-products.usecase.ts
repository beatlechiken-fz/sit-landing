import { IProductRepository } from "../repositories/product.repository";
import { ProductFilter } from "../entities/product-filter.entity";
import { PaginatedResult } from "../entities/paginated-result.entity";
import { Product } from "../entities/product.entity";

export class SearchProductsUseCase {
  constructor(private readonly repo: IProductRepository) {}

  async execute(filter: ProductFilter): Promise<PaginatedResult<Product>> {
    // Si el query tiene menos de 2 caracteres no buscamos
    if (filter.q && filter.q.trim().length < 2) {
      return {
        data: [],
        total: 0,
        page: 1,
        pageSize: 24,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      };
    }

    return this.repo.getProducts({
      ...filter,
      pageSize: filter.pageSize ?? 24,
    });
  }
}
