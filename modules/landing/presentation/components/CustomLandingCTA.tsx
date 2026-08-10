"use client";

import { motion } from "framer-motion";
import CustomLink from "@/core/components/custom-link/CustomLink";
import { useTranslations } from "next-intl";

export default function CustomLandingCTA() {
  const t = useTranslations("customLandingCTA");

  const phone = "524431234567";
  const quoteUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    t("quoteWhatsappMsg"),
  )}`;
  const callUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    t("callWhatsappMsg"),
  )}`;

  return (
    <section className="w-[85%] max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="
          relative overflow-hidden rounded-3xl
          border border-white/10
          bg-gradient-to-br from-teal-600/10 via-white/5 to-sky-600/10
          px-8 py-16 sm:px-16 sm:py-20
          flex flex-col items-center text-center gap-6
        "
      >
        <div className="pointer-events-none absolute inset-0 -z-10 flex justify-center">
          <div className="w-[520px] h-[320px] bg-gradient-to-tr from-teal-600/20 to-sky-600/20 blur-[140px]" />
        </div>

        <h2 className="text-[clamp(2.2rem,5vw,3.8rem)] font-bold font-title">
          <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
            {t("title")}
          </span>
        </h2>

        <p className="text-gray-400 text-lg max-w-3xl">{t("desc")}</p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center pt-2">
          <div className="w-full sm:w-auto">
            <CustomLink
              url={quoteUrl}
              appearance="blueGreenBg"
              size="lg"
              fullWidth
            >
              {t("quoteBtn")}
            </CustomLink>
          </div>
          <div className="w-full sm:w-auto">
            <CustomLink
              url={callUrl}
              appearance="darkOutline"
              size="lg"
              fullWidth
            >
              {t("callBtn")}
            </CustomLink>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
