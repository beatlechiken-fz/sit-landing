"use client";

import AppBar from "@/core/components/app-bar/AppBar";
import FooterBar from "@/core/components/footer-bar/FooterBar";

import FixHero from "@/modules/fix/presentation/components/FixHero";
import FixServices from "@/modules/fix/presentation/components/FixServices";
import FixProcess from "@/modules/fix/presentation/components/FixProcess";
import FixWhy from "@/modules/fix/presentation/components/FixWhy";
import FixCTA from "@/modules/fix/presentation/components/FixCTA";

export default function RepairsPage() {
  return (
    <main className="bg-[#0B0B0F] text-white min-h-screen overflow-x-hidden">
      <AppBar />

      <section className="relative flex justify-center">
        <FixHero />
      </section>

      <section className="relative flex justify-center py-32">
        <FixServices />
      </section>

      <section className="relative flex justify-center py-32">
        <FixProcess />
      </section>

      <section className="relative flex justify-center py-32">
        <FixWhy />
      </section>

      <section className="relative flex justify-center py-32">
        <FixCTA />
      </section>

      <FooterBar />
    </main>
  );
}
