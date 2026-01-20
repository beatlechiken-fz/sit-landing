"use client";

import CustomLink from "@/core/components/custom-link/CustomLink";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function IAMain() {
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
      className="w-full max-w-7xl px-6 pt-32 pb-24 flex flex-col items-center text-center relative"
    >
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="w-[620px] h-[620px] bg-gradient-to-tr from-teal-600/30 to-sky-600/30 blur-[160px]" />
      </div>

      <h1 className="text-[clamp(2.6rem,6vw,5rem)] font-extrabold leading-tight">
        <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
          {t("mainTitle")}
        </span>
      </h1>

      <p className="mt-6 max-w-3xl text-lg md:text-xl text-gray-300">
        {t("mainDesc")}
      </p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto"
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
