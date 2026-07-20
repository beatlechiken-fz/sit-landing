import { GetProductsUseCase } from "@/modules/admin/store/domain/usecases/get-products.usecase";
import { SearchProductsUseCase } from "@/modules/admin/store/domain/usecases/search-products.usecase";
import { ProductRepositoryImpl } from "@/modules/admin/store/data/repositories/product.repository.impl";
import { SupabaseProductDatasource } from "@/modules/admin/store/data/datasources/supabase/product.datasource";

// Instancias singleton — se crean una vez por proceso
const datasource = new SupabaseProductDatasource();
const repository = new ProductRepositoryImpl(datasource);
const getProducts = new GetProductsUseCase(repository);
const searchProducts = new SearchProductsUseCase(repository);

export const resolvers = {
  Query: {
    products: async (_: unknown, { filter }: { filter?: any }) => {
      const hasSearch = filter?.q?.trim()?.length >= 2;
      const useCase = hasSearch ? searchProducts : getProducts;
      return useCase.execute(filter ?? {});
    },

    product: async (_: unknown, { id }: { id: number }) => {
      return repository.getProductById(id);
    },

    marcas: async () => repository.getMarcas(),
    grupos: async () => repository.getGrupos(),
  },
};
