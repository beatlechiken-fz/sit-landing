"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function ContactHero() {
  const t = useTranslations("contact.hero");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-[90%] max-w-4xl text-center"
    >
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t("title")}</h1>
      <p className="text-gray-400 text-lg">
        {t("desc1")}
        <br />
        {t("desc2")}
      </p>
    </motion.div>
  );
}
