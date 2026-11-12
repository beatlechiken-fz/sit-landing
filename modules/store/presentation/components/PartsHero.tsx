"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";

function PartsHero() {
  const t = useTranslations("storeParts");
  return (
    <section className="relative w-full min-h-[calc(100vh-76px)] flex items-center justify-center overflow-hidden mt-[76px]">
      <Image
        src="/img/hero/parts.jpg"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[#0B0B0F]/75" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-transparent to-transparent" />

      <motion.div
        className="relative z-10 w-[90%] max-w-6xl text-center py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-tight text-white">
          {t("heroTitle1")}
          <br />
          {t("heroTitle2")}
        </h1>

        <p className="mt-6 text-gray-200 text-lg max-w-3xl mx-auto">
          {t("heroDesc1")}
          <br />
          {t("heroDesc2")}
        </p>
      </motion.div>
    </section>
  );
}

export default PartsHero;
