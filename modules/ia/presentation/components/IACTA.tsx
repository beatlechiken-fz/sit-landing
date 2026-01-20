"use client";

import CustomLink from "@/core/components/custom-link/CustomLink";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function IACTA() {
  const t = useTranslations("ia");
  const phone = "524431234567";
  const message = t("ctaWhatsappMsg");
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full max-w-7xl px-6 py-32 text-center relative"
    >
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="w-[520px] h-[520px] bg-gradient-to-tr from-sky-600/20 to-teal-600/20 blur-[160px]" />
      </div>

      <h2 className="text-[clamp(2.4rem,5vw,4rem)] font-extrabold mb-6">
        {t("ctaTitle")}
      </h2>
      <p className="max-w-2xl mx-auto text-gray-300 mb-10">{t("ctaDesc")}</p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto"
      >
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
      </motion.div>
    </motion.section>
  );
}
