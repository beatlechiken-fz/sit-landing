"use client";

import { useTranslations } from "next-intl";
import CustomLink from "@/core/components/custom-link/CustomLink";

export default function FixHero() {
  const t = useTranslations("fixHero");
  const phone = "524431234567";
  const message = t("whatsappMsg");
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <section className="w-[85%] max-w-7xl min-h-[90vh] flex flex-col justify-center items-center text-center gap-10">
      {/* Glow */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="w-[520px] h-[520px] bg-gradient-to-tr from-teal-600/30 to-sky-600/30 blur-[160px]" />
      </div>

      <h1 className="text-[clamp(2.6rem,6vw,5.2rem)] font-extrabold leading-tight">
        <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
          {t("title1")}
        </span>
        <br />
        {t("title2")}
      </h1>

      <p className="text-gray-400 max-w-2xl text-[clamp(1.1rem,2vw,1.4rem)]">
        {t("desc")}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
        <div className="w-full sm:w-auto">
          <CustomLink
            url={whatsappUrl}
            appearance="blueGreenBg"
            size="lg"
            fullWidth
          >
            {t("ctaBtn")}
          </CustomLink>
        </div>
      </div>
    </section>
  );
}
