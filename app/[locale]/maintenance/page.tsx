"use client";

import AppBar from "@/core/components/app-bar/AppBar";
import FooterBar from "@/core/components/footer-bar/FooterBar";

import MaintenanceHero from "@/modules/maintenance/presentation/components/MaintenanceHero";
import MaintenanceBenefits from "@/modules/maintenance/presentation/components/MaintenanceBenefits";
import MaintenancePlans from "@/modules/maintenance/presentation/components/MaintenancePlans";
import MaintenanceProcess from "@/modules/maintenance/presentation/components/MaintenanceProcess";
import MaintenanceCTA from "@/modules/maintenance/presentation/components/MaintenanceCTA";

export default function MaintenancePage() {
  return (
    <main className="bg-[#0B0B0F] text-white min-h-screen overflow-x-hidden">
      <AppBar />

      <section className="relative flex justify-center">
        <MaintenanceHero />
      </section>

      <section className="relative flex justify-center py-32">
        <MaintenanceBenefits />
      </section>

      <section className="relative flex justify-center py-32">
        <MaintenancePlans />
      </section>

      <section className="relative flex justify-center py-32">
        <MaintenanceProcess />
      </section>

      <section className="relative flex justify-center py-32">
        <MaintenanceCTA />
      </section>

      <FooterBar />
    </main>
  );
}
