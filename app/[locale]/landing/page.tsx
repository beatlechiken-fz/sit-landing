"use client";

import AppBar from "@/core/components/app-bar/AppBar";
import FooterBar from "@/core/components/footer-bar/FooterBar";
import LandingMain from "@/modules/landing/presentation/components/LaindingMain";
import LandingPlans from "@/modules/landing/presentation/components/LandingPlans";

export default function Landing() {
  return (
    <main className="bg-[#0B0B0F] text-white min-h-screen overflow-x-hidden">
      {/* App Bar */}
      <AppBar />

      {/* Hero */}
      <section className="relative flex justify-center">
        <LandingMain />
      </section>

      {/* Plans */}
      <section className="relative flex justify-center">
        <LandingPlans />
      </section>

      {/* Footer */}
      <FooterBar />
    </main>
  );
}
