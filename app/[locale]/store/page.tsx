import AppBar from "@/core/components/app-bar/AppBar";
import FooterBar from "@/core/components/footer-bar/FooterBar";
import { StoreCatalogView } from "@/modules/store/presentation/components/StoreCatalogView";
import { SupabaseProductDatasource } from "@/modules/admin/store/data/datasources/supabase/product.datasource";
import { ProductRepositoryImpl } from "@/modules/admin/store/data/repositories/product.repository.impl";
import { GetProductsUseCase } from "@/modules/admin/store/domain/usecases/get-products.usecase";

const datasource = new SupabaseProductDatasource();
const repository = new ProductRepositoryImpl(datasource);
const getProducts = new GetProductsUseCase(repository);

export default async function StorePage() {
  const [marcas, grupos, ganancias, tipoCambio, resultadoInicial] =
    await Promise.all([
      repository.getMarcas(),
      repository.getGrupos(),
      repository.getGanancias(),
      repository.getTipoCambio(),
      getProducts.execute({ orden: "precio_asc", page: 1, pageSize: 24 }),
    ]);

  return (
    <main className="bg-[#0B0B0F] text-white min-h-screen overflow-x-hidden">
      <AppBar />

      <section className="pt-28">
        <StoreCatalogView
          marcas={marcas}
          grupos={grupos}
          ganancias={ganancias}
          tipoCambio={tipoCambio}
          resultadoInicial={resultadoInicial}
        />
      </section>

      <FooterBar />
    </main>
  );
}
