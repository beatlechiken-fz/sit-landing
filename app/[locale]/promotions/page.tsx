"use client";

import AppBar from "@/core/components/app-bar/AppBar";
import FooterBar from "@/core/components/footer-bar/FooterBar";
import { useTranslations } from "next-intl";

import PromotionsHero from "@/modules/promotions/presentation/components/PromotionsHero";
import PromotionsCTA from "@/modules/promotions/presentation/components/PromotionsCTA";
import PromotionsGrid from "@/modules/promotions/presentation/components/PromotionsGrid";
import { currentPromotions } from "@/core/mocked-data/promotions-current";

export default function PromotionsPage() {
  const t = useTranslations("promotions");
  const hasCampaign = currentPromotions.length > 0;

  return (
    <main className="bg-[#0B0B0F] text-white min-h-screen overflow-x-hidden flex flex-col">
      <AppBar />

      {hasCampaign ? (
        <>
          <section className="flex justify-center mt-24">
            <PromotionsHero />
          </section>

          <section className="flex justify-center mt-28">
            <PromotionsGrid />
          </section>

          <section className="flex justify-center mt-28 mb-32">
            <PromotionsCTA />
          </section>
        </>
      ) : (
        <section className="flex justify-center items-center flex-1">
          <h1 className="text-[clamp(2.6rem,6vw,4.8rem)] font-extrabold leading-tight text-center w-[90%] max-w-6xl py-32">
            {t("noPromotions")}
          </h1>
        </section>
      )}

      <FooterBar />
    </main>
  );
}
