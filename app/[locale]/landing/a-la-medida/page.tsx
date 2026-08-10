"use client";

import AppBar from "@/core/components/app-bar/AppBar";
import FooterBar from "@/core/components/footer-bar/FooterBar";
import CustomLandingHero from "@/modules/landing/presentation/components/CustomLandingHero";
import CustomLandingPackages from "@/modules/landing/presentation/components/CustomLandingPackages";
import CustomLandingProcess from "@/modules/landing/presentation/components/CustomLandingProcess";
import CustomLandingCompareBanner from "@/modules/landing/presentation/components/CustomLandingCompareBanner";
import CustomLandingCTA from "@/modules/landing/presentation/components/CustomLandingCTA";

export default function CustomLandingPage() {
  return (
    <main className="bg-[#0B0B0F] text-white min-h-screen overflow-x-hidden">
      {/* App Bar */}
      <AppBar />

      {/* Hero */}
      <section className="relative flex justify-center py-24">
        <CustomLandingHero />
      </section>

      {/* Packages */}
      <section className="relative flex justify-center">
        <CustomLandingPackages />
      </section>

      {/* Compare: Landing bajo demanda */}
      <section className="relative flex justify-center py-16">
        <CustomLandingCompareBanner />
      </section>

      {/* Process */}
      <section className="relative flex justify-center py-24">
        <CustomLandingProcess />
      </section>

      {/* CTA */}
      <section className="relative flex justify-center py-32">
        <CustomLandingCTA />
      </section>

      {/* Footer */}
      <FooterBar />
    </main>
  );
}
