import AppBar from "@/core/components/app-bar/AppBar";
import FooterBar from "@/core/components/footer-bar/FooterBar";

import HomeHero from "@/modules/home/presentation/components/HomeHero";
import AboutStats from "@/modules/about/presentation/components/AboutStats";
import HomeIASection from "@/modules/home/presentation/components/HomeIASection";
import HomeTechService from "@/modules/home/presentation/components/HomeTechService";
import HomeLandingPackages from "@/modules/home/presentation/components/HomeLandingPackages";
import HomeFinalCTA from "@/modules/home/presentation/components/HomeFinalCTA";

export default function Home() {
  return (
    <main className="bg-[#0B0B0F] text-white min-h-screen overflow-x-hidden">
      <AppBar />

      <section className="flex justify-center mt-16">
        <HomeHero />
      </section>

      <section className="flex justify-center py-28">
        <HomeIASection />
      </section>

      <section className="flex justify-center pb-28">
        <AboutStats />
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
