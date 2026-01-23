"use client";

import { motion } from "framer-motion";
import CustomLink from "@/core/components/custom-link/CustomLink";
import { useTranslations } from "next-intl";

export default function WebSiteHome() {
  const t = useTranslations("home");

  const items = [
    t("landingPro"),
    t("landingConvert"),
    t("landingSEO"),
    t("landingDesign"),
  ];

  const phone = "524431234567";
  const message =
    "Hola, me gustaría más información sobre el desarrollo de mi sitio web.";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    message,
  )}`;

  return (
    <section className="w-[85%] max-w-7xl flex flex-col mt-16 lg:mt-0 items-center text-center gap-16">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-[clamp(2rem,5vw,4rem)] font-bold"
      >
        <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent font-title">
          {t("landing1")}
        </span>
      </motion.h2>

      <p className="text-gray-400 max-w-2xl text-lg">{t("landingDesc")}</p>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl"
      >
        {items.map((item, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-xl py-4 px-6
                       hover:border-teal-400/40 transition"
          >
            {item}
          </motion.div>
        ))}
      </motion.div>

      <div className="w-full sm:w-auto">
        <CustomLink
          url={whatsappUrl}
          appearance="blueGreenBg"
          size="md"
          fullWidth
        >
          {t("landingInfo")}
        </CustomLink>
      </div>
    </section>
  );
}
