"use client";

import { motion } from "framer-motion";
import CustomLink from "@/core/components/custom-link/CustomLink";
import { useTranslations } from "next-intl";

export default function PromotionsCTA() {
  const t = useTranslations("promotions");

  const phone = "524431234567";
  const message = "Hola quisiera aprovechar una promoción.";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <motion.section
      className="w-[90%] max-w-4xl text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-bold mb-6">{t("ctaTitle")}</h2>

      <p className="text-gray-400 mb-10">{t("ctaDesc")}</p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <div className="w-full sm:w-auto">
          <CustomLink
            url={whatsappUrl}
            appearance="blueGreenBg"
            size="md"
            fullWidth
          >
            {t("ctaBtn")}
          </CustomLink>
        </div>
      </div>
    </motion.section>
  );
}
