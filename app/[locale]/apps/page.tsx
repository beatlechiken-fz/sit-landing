"use client";

import Images from "@/core/assets/Images";
import AppBar from "@/core/components/app-bar/AppBar";
import FooterBar from "@/core/components/footer-bar/FooterBar";
import { useBreakpoint } from "@/core/hooks/useBreakpoint";
import { CustomBreakpoint } from "@/core/types/general";
import DevApps from "@/modules/apps/presentation/components/DevApps";
import ProcessApps from "@/modules/apps/presentation/components/ProcessApps";
import TypeApps from "@/modules/apps/presentation/components/TypeApps";
import AutomatizationHome from "@/modules/home/presentation/components/AutomatizationHome";
import TechnicalServiceHome from "@/modules/home/presentation/components/TechnicalServiceHome";
import WebSiteHome from "@/modules/home/presentation/components/WebSiteHome";

export default function Apps() {
  const breakpointsConfig: Record<
    CustomBreakpoint,
    { min?: number; max?: number }
  > = {
    cxs: { max: 839 },
    csm: { min: 840, max: 1022 },
    cmd: { min: 1023, max: 1199 },
    clg: { min: 1200 },
  };

  const breakpoint = useBreakpoint(breakpointsConfig);

  return (
    <main>
      {/* ----------- APP BAR --------------*/}
      <AppBar />

      {/* ----------- SECTION 1 ------------ */}
      <section className="relative w-screen flex items-center justify-center bg-[white]">
        <DevApps />
      </section>

      {/* ----------- SECTION 2 ------------ */}
      <section className="relative w-screen flex items-center justify-center bg-[white]">
        <TypeApps />
      </section>

      {/* ----------- SECTION 3 ------------ */}
      <section className="relative w-screen flex items-center justify-center bg-[white]">
        <ProcessApps />
      </section>

      {/* ----------- FOOTER ------------ */}
      <FooterBar />
    </main>
  );
}
