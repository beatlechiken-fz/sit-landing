"use client";

import CustomLink from "@/core/components/custom-link/CustomLink";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function UpgradeHero() {
  const t = useTranslations("upgrade");

  const phone = "524431234567";
  const message = t("ctaWhatsappMsg");
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

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

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-16">
        <div className="w-full sm:w-auto">
          <CustomLink
            url={whatsappUrl}
            appearance="blueGreenBg"
            size="md"
            fullWidth
          >
            {t("ctaBtn2")}
          </CustomLink>
        </div>
      </div>
    </motion.section>
  );
}
