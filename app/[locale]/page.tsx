"use client";

import Images from "@/core/assets/Images";
import AppBar from "@/core/components/app-bar/AppBar";
import FooterBar from "@/core/components/footer-bar/FooterBar";
import { useBreakpoint } from "@/core/hooks/useBreakpoint";
import { CustomBreakpoint } from "@/core/types/general";
import AutomatizationHome from "@/modules/home/presentation/components/AutomatizationHome";
import TechnicalServiceHome from "@/modules/home/presentation/components/TechnicalServiceHome";
import WebSiteHome from "@/modules/home/presentation/components/WebSiteHome";

export default function Home() {
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
      <section
        style={{
          backgroundImage: `${
            breakpoint === "clg" ? `url(${Images.homeIABg})` : ""
          }`,
        }}
        className="relative w-screen flex items-center justify-center bg-cover bg-right"
      >
        {breakpoint !== "clg" && (
          <div className="absolute inset-0 bg-black/40 z-0" />
        )}
        <div className="relative flex items-center justify-center z-10 w-full">
          <AutomatizationHome />
        </div>
      </section>

      {/* ----------- SECTION 2 ------------ */}
      <section className="w-screen flex items-center justify-center bg-[white]">
        <WebSiteHome />
      </section>

      {/* ----------- SECTION 3 ------------ */}
      <section className="w-screen flex items-center justify-center">
        <TechnicalServiceHome />
      </section>

      {/* ----------- FOOTER ------------ */}
      <FooterBar />
    </main>
  );
}
