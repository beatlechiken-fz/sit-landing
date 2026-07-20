import { IProductRepository } from "../repositories/product.repository";
import { ProductFilter } from "../entities/product-filter.entity";
import { PaginatedResult } from "../entities/paginated-result.entity";
import { Product } from "../entities/product.entity";

export class GetProductsUseCase {
  constructor(private readonly repo: IProductRepository) {}

  async execute(filter: ProductFilter): Promise<PaginatedResult<Product>> {
    const pageSize = filter.pageSize ?? 24;
    const page = filter.page ?? 1;

    return this.repo.getProducts({ ...filter, pageSize, page });
  }
}
