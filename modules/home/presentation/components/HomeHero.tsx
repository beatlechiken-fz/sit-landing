"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import CustomLink from "@/core/components/custom-link/CustomLink";
import { HomeCTAButton } from "./HomeCTAButton";

export default function HomeHero() {
  const t = useTranslations("homeV2.hero");

  const phone = "524431234567";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    t("whatsappMsg"),
  )}`;

  const highlights = [
    { title: t("highlight1Title"), desc: t("highlight1Desc") },
    { title: t("highlight2Title"), desc: t("highlight2Desc") },
    { title: t("highlight3Title"), desc: t("highlight3Desc") },
  ];

  return (
    <section className="relative w-full flex flex-col mt-[76px] gap-16">
      <div className="relative min-h-[calc(100vh-76px)] flex items-center overflow-hidden">
        <Image
          src="/img/hero/home.png"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#0B0B0F]/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-transparent to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-[85%] max-w-7xl mx-auto flex flex-col items-center text-center gap-6 py-20"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-1.5 text-xs font-medium text-teal-300">
            <svg
              className="h-3.5 w-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l1.9 5.4L19 9l-5.1 1.6L12 16l-1.9-5.4L5 9l5.1-1.6L12 2z" />
            </svg>
            {t("badge")}
          </span>

          <h1 className="text-[clamp(2.4rem,5vw,4.2rem)] font-bold leading-tight font-title text-white">
            {t("title1")}
            <br />
            {t("title2")}
          </h1>

          <p className="text-gray-200 max-w-xl text-[clamp(1.05rem,1.6vw,1.25rem)]">
            {t("desc")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto">
            <HomeCTAButton href="/apps">
              {t("ctaPrimary")}
              <span aria-hidden>→</span>
            </HomeCTAButton>
            <div className="w-full sm:w-auto">
              <CustomLink
                url={whatsappUrl}
                appearance="darkOutline"
                size="md"
                fullWidth
              >
                {t("ctaSecondary")}
              </CustomLink>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Highlights */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="w-[85%] max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        {highlights.map((h) => (
          <motion.div
            key={h.title}
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 },
            }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <h3 className="font-semibold text-white mb-1">{h.title}</h3>
            <p className="text-sm text-gray-400">{h.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
