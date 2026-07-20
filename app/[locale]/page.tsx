import AppBar from "@/core/components/app-bar/AppBar";
import FooterBar from "@/core/components/footer-bar/FooterBar";

import HomeHero from "@/modules/home/presentation/components/HomeHero";
import HomeStoreHighlights from "@/modules/home/presentation/components/HomeStoreHighlights";
import HomeTechService from "@/modules/home/presentation/components/HomeTechService";
import HomeLandingPackages from "@/modules/home/presentation/components/HomeLandingPackages";
import HomeFinalCTA from "@/modules/home/presentation/components/HomeFinalCTA";

import { SupabaseProductDatasource } from "@/modules/admin/store/data/datasources/supabase/product.datasource";
import { ProductRepositoryImpl } from "@/modules/admin/store/data/repositories/product.repository.impl";

const datasource = new SupabaseProductDatasource();
const repository = new ProductRepositoryImpl(datasource);

export default async function Home() {
  const [productosDestacados, gruposDestacados, ganancias, tipoCambio] =
    await Promise.all([
      repository.getProductosDestacados(),
      repository.getGruposDestacados(),
      repository.getGanancias(),
      repository.getTipoCambio(),
    ]);

  return (
    <main className="bg-[#0B0B0F] text-white min-h-screen overflow-x-hidden">
      <AppBar />

      <section className="flex justify-center mt-16">
        <HomeHero />
      </section>

      <section className="flex justify-center py-28">
        <HomeStoreHighlights
          productos={productosDestacados}
          grupos={gruposDestacados}
          ganancias={ganancias}
          tipoCambio={tipoCambio}
        />
      </section>

      <section className="flex justify-center py-28">
        <HomeTechService />
      </section>

      <section className="flex justify-center py-28">
        <HomeLandingPackages />
      </section>

      <section className="flex justify-center py-28">
        <HomeFinalCTA />
      </section>

      <FooterBar />
    </main>
  );
}
