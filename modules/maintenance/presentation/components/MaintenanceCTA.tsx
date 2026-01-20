"use client";

import { motion } from "framer-motion";
import CustomLink from "@/core/components/custom-link/CustomLink";
import { useTranslations } from "next-intl";

export default function MaintenanceCTA() {
  const t = useTranslations("maintenance");
  const phone = "524431234567";
  const message = t("heroWhatsappMsg");
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-[85%] max-w-5xl text-center flex flex-col items-center gap-10"
    >
      <h2 className="text-[clamp(2.2rem,5vw,3.8rem)] font-bold">
        <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
          {t("ctaTitle")}
        </span>
      </h2>

      <p className="text-gray-400 text-lg max-w-3xl">{t("ctaDesc")}</p>

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
            {t("ctaBtnWhatsapp")}
          </CustomLink>
        </div>
      </motion.div>
    </motion.section>
  );
}
