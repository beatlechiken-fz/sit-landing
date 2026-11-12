"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import CustomLink from "@/core/components/custom-link/CustomLink";
import { useTranslations } from "next-intl";

export default function MaintenanceHero() {
  const t = useTranslations("maintenance");
  const phone = "524431234567";
  const message = t("heroWhatsappMsg");
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <section className="relative w-full min-h-[calc(100vh-76px)] flex items-center overflow-hidden mt-[76px]">
      <Image
        src="/img/hero/maintenance.jpg"
        alt=""
        fill
        priority
        className="object-cover object-[center_25%]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0F] via-[#0B0B0F]/90 to-[#0B0B0F]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-[85%] max-w-7xl mx-auto flex flex-col items-center lg:items-start text-center lg:text-left gap-6 py-20"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-1.5 text-xs font-medium text-teal-300">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l1.9 5.4L19 9l-5.1 1.6L12 16l-1.9-5.4L5 9l5.1-1.6L12 2z" />
          </svg>
          {t("heroBadge")}
        </span>

        <h1 className="text-[clamp(2.4rem,5vw,4.2rem)] font-bold leading-tight font-title text-white">
          {t("heroTitle1")}
          <br />
          {t("heroTitle2")}
        </h1>

        <p className="text-gray-200 max-w-xl text-[clamp(1.05rem,1.6vw,1.25rem)]">
          {t("heroDesc")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto">
          <div className="w-full sm:w-auto">
            <CustomLink
              url={whatsappUrl}
              appearance="blueGreenBg"
              size="md"
              fullWidth
            >
              {t("heroBtnWhatsapp")}
            </CustomLink>
          </div>
          <div className="w-full sm:w-auto">
            <CustomLink
              url="#plans"
              appearance="darkOutline"
              size="md"
              fullWidth
            >
              {t("heroBtnPlans")}
            </CustomLink>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
