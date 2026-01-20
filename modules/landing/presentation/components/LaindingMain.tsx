"use client";

import { useTranslations } from "next-intl";
import CustomLink from "@/core/components/custom-link/CustomLink";

export default function LandingMain() {
  const t = useTranslations("landing");

  const phone = "524431234567";
  const message =
    "Hola, me gustaría más información sobre el desarrollo de mi sitio web.";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    message,
  )}`;

  return (
    <section className="w-full max-w-7xl px-6 pt-32 pb-24 flex flex-col items-center text-center relative overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="w-[600px] h-[600px] bg-gradient-to-tr from-teal-600/30 to-sky-600/30 blur-[160px]" />
      </div>

      {/* Title */}
      <h1 className="text-[clamp(2.8rem,6vw,5rem)] font-extrabold leading-tight animate-fadeIn">
        <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
          {t("landingTitle1")}
        </span>
        <br />
        {t("landingTitle2")}
      </h1>

      {/* Description */}
      <p className="mt-6 max-w-3xl text-lg md:text-xl text-gray-300 animate-fadeIn [animation-delay:0.15s]">
        {t("landingDesc1")}
      </p>

      <p className="mt-4 max-w-3xl text-gray-400 animate-fadeIn [animation-delay:0.25s]">
        {t("landingDesc2")}
      </p>

      {/* CTA */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn [animation-delay:0.35s]">
        <div className="w-full sm:w-auto">
          <CustomLink url="#plans" appearance="blueGreenBg" size="md" fullWidth>
            {t("landingPlansBtn")}
          </CustomLink>
        </div>

        <div className="w-full sm:w-auto">
          <CustomLink
            url={whatsappUrl}
            appearance="darkOutline"
            size="md"
            fullWidth
          >
            {t("landingQuoteBtn")}
          </CustomLink>
        </div>
      </div>
    </section>
  );
}
