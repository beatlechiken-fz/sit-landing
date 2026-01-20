"use client";

import { motion } from "framer-motion";

import { useTranslations } from "next-intl";

function PartsHero() {
  const t = useTranslations("storeParts");
  return (
    <motion.section
      className="w-[90%] max-w-6xl text-center py-32"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-tight">
        <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          {t("heroTitle1")}
        </span>
        <br />
        {t("heroTitle2")}
      </h1>

      <p className="mt-6 text-gray-400 text-lg max-w-3xl mx-auto">
        {t("heroDesc1")}
        <br />
        {t("heroDesc2")}
      </p>
    </motion.section>
  );
}

export default PartsHero;
