"use client";

import AppBar from "@/core/components/app-bar/AppBar";
import FooterBar from "@/core/components/footer-bar/FooterBar";

import PromotionsHero from "@/modules/promotions/presentation/components/PromotionsHero";
import PromotionsCTA from "@/modules/promotions/presentation/components/PromotionsCTA";
import PromotionsGrid from "@/modules/promotions/presentation/components/PromotionsGrid";

export default function PromotionsPage() {
  return (
    <main className="bg-[#0B0B0F] text-white min-h-screen overflow-x-hidden">
      <AppBar />

      <section className="flex justify-center">
        <PromotionsHero />
      </section>

      <section className="flex justify-center mt-24">
        <PromotionsGrid />
      </section>

      <section className="flex justify-center mt-32 mb-32">
        <PromotionsCTA />
      </section>

      <FooterBar />
    </main>
  );
}
