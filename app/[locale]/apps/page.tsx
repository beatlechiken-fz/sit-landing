"use client";

import AppBar from "@/core/components/app-bar/AppBar";
import FooterBar from "@/core/components/footer-bar/FooterBar";

import DevApps from "@/modules/apps/presentation/components/DevApps";
import WhyApps from "@/modules/apps/presentation/components/WhyApps";
import TypeApps from "@/modules/apps/presentation/components/TypeApps";
import ProcessApps from "@/modules/apps/presentation/components/ProcessApps";
import AppsCTA from "@/modules/apps/presentation/components/AppsCTA";

export default function Apps() {
  return (
    <main className="bg-[#0B0B0F] text-white min-h-screen overflow-x-hidden">
      <AppBar />

      <section className="relative flex justify-center py-24">
        <DevApps />
      </section>

      <section className="relative flex justify-center py-24">
        <WhyApps />
      </section>

      <section className="relative flex justify-center py-24">
        <TypeApps />
      </section>

      <section className="relative flex justify-center py-24">
        <ProcessApps />
      </section>

      <section className="relative flex justify-center py-32">
        <AppsCTA />
      </section>

      <FooterBar />
    </main>
  );
}
