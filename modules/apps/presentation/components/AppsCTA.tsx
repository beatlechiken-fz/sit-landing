"use client";

import { motion } from "framer-motion";
import CustomLink from "@/core/components/custom-link/CustomLink";
import { useTranslations } from "next-intl";

export default function AppsCTA() {
  const t = useTranslations("appsCTA");

  const phone = "524431234567";
  const message =
    "Hola, me gustaría más información sobre el desarrollo de una app.";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    message,
  )}`;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-[85%] max-w-5xl text-center flex flex-col items-center gap-10"
    >
      <h2 className="text-[clamp(2.2rem,5vw,3.8rem)] font-bold font-title">
        <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
          {t("title")}
        </span>
      </h2>

      <p className="text-gray-400 text-lg max-w-3xl">{t("desc")}</p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-6 w-full justify-center"
      >
        <div className="w-full sm:w-auto">
          <CustomLink
            url={whatsappUrl}
            appearance="blueGreenBg"
            size="md"
            fullWidth
          >
            {t("callBtn")}
          </CustomLink>
        </div>
      </motion.div>
    </motion.section>
  );
}
