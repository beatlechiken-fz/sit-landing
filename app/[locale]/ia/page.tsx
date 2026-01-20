"use client";

import AppBar from "@/core/components/app-bar/AppBar";
import FooterBar from "@/core/components/footer-bar/FooterBar";
import IAMain from "@/modules/ia/presentation/components/IAMain";
import IAServices from "@/modules/ia/presentation/components/IAServices";
import IAProcess from "@/modules/ia/presentation/components/IAProcess";
import IATech from "@/modules/ia/presentation/components/IATech";
import IACTA from "@/modules/ia/presentation/components/IACTA";

export default function IA() {
  return (
    <main className="bg-[#0B0B0F] text-white min-h-screen overflow-x-hidden">
      <AppBar />

      <section className="relative flex justify-center">
        <IAMain />
      </section>

      <section className="relative flex justify-center">
        <IAServices />
      </section>

      <section className="relative flex justify-center">
        <IAProcess />
      </section>

      <section className="relative flex justify-center">
        <IATech />
      </section>

      <section className="relative flex justify-center">
        <IACTA />
      </section>

      <FooterBar />
    </main>
  );
}
