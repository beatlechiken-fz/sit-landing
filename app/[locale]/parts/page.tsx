"use client";

import AppBar from "@/core/components/app-bar/AppBar";
import FooterBar from "@/core/components/footer-bar/FooterBar";
import PartsHero from "@/modules/store/presentation/components/PartsHero";
import PartsCategories from "@/modules/store/presentation/components/PartsCategories";
import PartsWhy from "@/modules/store/presentation/components/PartsWhy";
import PartsCTA from "@/modules/store/presentation/components/PartsCTA";

export default function RefaccionesPage() {
  return (
    <main className="bg-[#0B0B0F] text-white min-h-screen overflow-x-hidden">
      <AppBar />

      <section className="flex justify-center">
        <PartsHero />
      </section>

      <section className="flex justify-center mt-28">
        <PartsCategories />
      </section>

      <section className="flex justify-center mt-28">
        <PartsWhy />
      </section>

      <section className="flex justify-center mt-28 mb-32">
        <PartsCTA />
      </section>

      <FooterBar />
    </main>
  );
}
