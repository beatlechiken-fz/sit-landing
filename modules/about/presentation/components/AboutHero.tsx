"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function AboutHero() {
  const t = useTranslations("about");
  return (
    <motion.section
      className="w-[90%] max-w-6xl text-center py-32"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-[clamp(2.6rem,6vw,4.8rem)] font-bold leading-tight">
        {t("heroTitle1")}
        <br />
        <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          {t("heroTitle2")}
        </span>
      </h1>

      <p className="mt-6 text-gray-400 text-lg max-w-3xl mx-auto">
        {t("heroDesc")}
      </p>
    </motion.section>
  );
}
