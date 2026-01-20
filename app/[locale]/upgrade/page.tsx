"use client";

import AppBar from "@/core/components/app-bar/AppBar";
import FooterBar from "@/core/components/footer-bar/FooterBar";
import UpgradeHero from "@/modules/upgrade/presentation/components/UpgradeHero";
import UpgradeBenefits from "@/modules/upgrade/presentation/components/UpgradeBenefits";
import UpgradeOptions from "@/modules/upgrade/presentation/components/UpgradeOptions";
import UpgradeProcess from "@/modules/upgrade/presentation/components/UpgradeProcess";
import UpgradeCTA from "@/modules/upgrade/presentation/components/UpgrdeCTA";

export default function UpgradePage() {
  return (
    <main className="bg-[#0B0B0F] text-white min-h-screen overflow-x-hidden">
      <AppBar />

      <section className="flex justify-center">
        <UpgradeHero />
      </section>

      <section className="flex justify-center mt-28">
        <UpgradeBenefits />
      </section>

      <section className="flex justify-center mt-28">
        <UpgradeOptions />
      </section>

      <section className="flex justify-center mt-28">
        <UpgradeProcess />
      </section>

      <section className="flex justify-center mt-28 mb-32">
        <UpgradeCTA />
      </section>

      <FooterBar />
    </main>
  );
}
