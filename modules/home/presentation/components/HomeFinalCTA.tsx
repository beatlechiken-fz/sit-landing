"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import CustomLink from "@/core/components/custom-link/CustomLink";

export default function HomeFinalCTA() {
  const t = useTranslations("homeV2.finalCta");
  const phone = "524431234567";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    t("whatsappMsg"),
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
        </div>

        <h2 className="text-[clamp(2rem,4.5vw,3.4rem)] font-bold leading-tight font-title">
          {t("title1")}{" "}
          
            {t("title2")}
          
        </h2>

        <p className="text-gray-400 max-w-xl text-lg">{t("desc")}</p>

        <div className="w-full sm:w-auto pt-2">
          <CustomLink
            url={whatsappUrl}
            appearance="blueGreenBg"
            size="lg"
            fullWidth
          >
            {t("cta")}
          </CustomLink>
        </div>
      </motion.div>
    </section>
  );
}
