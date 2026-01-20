"use client";

import AppBar from "@/core/components/app-bar/AppBar";
import FooterBar from "@/core/components/footer-bar/FooterBar";

import AutomatizationHome from "@/modules/home/presentation/components/AutomatizationHome";
import WebSiteHome from "@/modules/home/presentation/components/WebSiteHome";
import TechnicalServiceHome from "@/modules/home/presentation/components/TechnicalServiceHome";

export default function Home() {
  return (
    <main className="bg-[#0B0B0F] text-white min-h-screen overflow-x-hidden">
      <AppBar />

      <section className="flex justify-center">
        <AutomatizationHome />
      </section>

      <section className="flex justify-center py-28">
        <WebSiteHome />
      </section>

      <section className="flex justify-center py-28">
        <TechnicalServiceHome />
      </section>

      <FooterBar />
    </main>
  );
}
