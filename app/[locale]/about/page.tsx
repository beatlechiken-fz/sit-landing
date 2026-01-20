"use client";

import AppBar from "@/core/components/app-bar/AppBar";
import FooterBar from "@/core/components/footer-bar/FooterBar";

import AboutHero from "@/modules/about/presentation/components/AboutHero";
import AboutValues from "@/modules/about/presentation/components/AboutValues";
import AboutWhyUs from "@/modules/about/presentation/components/AboutWhyUs";
import AboutCTA from "@/modules/about/presentation/components/AboutCTA";

export default function AboutPage() {
  return (
    <main className="bg-[#0B0B0F] text-white min-h-screen overflow-x-hidden">
      <AppBar />

      <section className="flex justify-center">
        <AboutHero />
      </section>

      <section className="flex justify-center mt-28">
        <AboutValues />
      </section>

      <section className="flex justify-center mt-28">
        <AboutWhyUs />
      </section>

      <section className="flex justify-center mt-28 mb-32">
        <AboutCTA />
      </section>

      <FooterBar />
    </main>
  );
}
