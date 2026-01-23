"use client";

import { motion } from "framer-motion";
import CustomLink from "@/core/components/custom-link/CustomLink";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Images from "@/core/assets/Images";

export default function AutomatizationHome() {
  const t = useTranslations("home");

  const phone = "524431234567";
  const message =
    "Hola, me gustaría recibir información sobre el desarrollo de una aplicación.";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    message,
  )}`;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-[85%] max-w-7xl min-h-auto lg:min-h-[90vh] mt-30 lg:mt-16 flex flex-col justify-start lg:justify-center gap-12"
    >
      {/* Logo */}
      <div className="flex items-center gap-4 justify-center lg:justify-start">
        <Image
          src={Images.logoOpacity}
          alt="SIT"
          priority
          width={92}
          height={92}
          className="w-[clamp(80px,8vw,92px)] h-auto object-contain"
        />
      </div>

      <h1 className="text-[clamp(2.5rem,5vw,5rem)] font-bold leading-tight font-title">
        <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
          {t("automatization1")}
        </span>
        <br />
        {t("automatization2")}
      </h1>

      <p className="text-gray-400 text-[clamp(1.1rem,2vw,1.4rem)] max-w-2xl">
        {t("automatization3")}
      </p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-6"
      >
        <div className="w-full sm:w-auto">
          <CustomLink
            url={whatsappUrl}
            appearance="blueGreenBg"
            size="md"
            fullWidth
          >
            {t("automatizationExpert")}
          </CustomLink>
        </div>

        <div className="w-full sm:w-auto">
          <CustomLink url="/apps" appearance="darkOutline" size="md" fullWidth>
            {t("automatizationInfo")}
          </CustomLink>
        </div>
      </motion.div>
    </motion.section>
  );
}
