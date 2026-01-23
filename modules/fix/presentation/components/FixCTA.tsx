"use client";

import { useTranslations } from "next-intl";
import CustomLink from "@/core/components/custom-link/CustomLink";

export default function FixCTA() {
  const t = useTranslations("fixCTA");
  const phone = "524431234567";
  const message = t("whatsappMsg");
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <section className="w-[85%] max-w-5xl text-center flex flex-col items-center gap-10">
      <h2 className="text-[clamp(2.2rem,5vw,3.8rem)] font-bold font-title">
        <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
          {t("title")}
        </span>
      </h2>

      <p className="text-gray-400 text-lg max-w-3xl">{t("desc")}</p>

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
