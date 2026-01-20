"use client";

import { motion } from "framer-motion";
import CustomLink from "@/core/components/custom-link/CustomLink";
import { useTranslations } from "next-intl";

export default function MaintenanceHero() {
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
      className="w-[85%] max-w-7xl min-h-[90vh] flex flex-col justify-center items-center text-center gap-10"
    >
      {/* Glow */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="w-[540px] h-[540px] bg-gradient-to-tr from-teal-600/30 to-sky-600/30 blur-[160px]" />
      </div>

      <h1 className="text-[clamp(2.6rem,6vw,5.2rem)] font-extrabold leading-tight">
        <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
          {t("heroTitle1")}
        </span>
        <br />
        {t("heroTitle2")}
      </h1>

      <p className="text-gray-400 max-w-2xl text-[clamp(1.1rem,2vw,1.4rem)]">
        {t("heroDesc")}
      </p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto"
      >
        <div className="w-full sm:w-auto">
          <CustomLink url="#plans" appearance="blueGreenBg" size="lg" fullWidth>
            {t("heroBtnPlans")}
          </CustomLink>
        </div>
        <div className="w-full sm:w-auto">
          <CustomLink
            url={whatsappUrl}
            appearance="darkOutline"
            size="lg"
            fullWidth
          >
            {t("heroBtnWhatsapp")}
          </CustomLink>
        </div>
      </motion.div>
    </motion.section>
  );
}
