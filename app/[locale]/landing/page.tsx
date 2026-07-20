"use client";

import AppBar from "@/core/components/app-bar/AppBar";
import FooterBar from "@/core/components/footer-bar/FooterBar";
import LandingMain from "@/modules/landing/presentation/components/LaindingMain";
import LandingWhy from "@/modules/landing/presentation/components/LandingWhy";
import LandingPlans from "@/modules/landing/presentation/components/LandingPlans";
import LandingProcess from "@/modules/landing/presentation/components/LandingProcess";
import LandingCTA from "@/modules/landing/presentation/components/LandingCTA";

export default function Landing() {
  return (
    <main className="bg-[#0B0B0F] text-white min-h-screen overflow-x-hidden">
      {/* App Bar */}
      <AppBar />

      {/* Hero */}
      <section className="relative flex justify-center py-24">
        <LandingMain />
      </section>

      {/* Why */}
      <section className="relative flex justify-center py-24">
        <LandingWhy />
      </section>

      {/* Plans */}
      <section className="relative flex justify-center">
        <LandingPlans />
      </section>

      {/* Process */}
      <section className="relative flex justify-center py-24">
        <LandingProcess />
      </section>

      {/* CTA */}
      <section className="relative flex justify-center py-32">
        <LandingCTA />
      </section>

      {/* Footer */}
      <FooterBar />
    </main>
  );
}
