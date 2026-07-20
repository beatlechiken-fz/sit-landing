"use client";

import CustomLink from "@/core/components/custom-link/CustomLink";
import { currentPromotions } from "@/core/mocked-data/promotions-current";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

// ─────────────────────────────────────────────
// Ilustración lateral — tarjeta de campaña con
// las 6 promociones en preview (título + %),
// fade-in escalonado, y chips flotantes
// ─────────────────────────────────────────────
function PromotionsIllustration() {
  const t = useTranslations("promotions");

  const chips = [
    { label: "Cupos limitados", pos: "top-0 -left-2 sm:-left-12" },
    { label: "Del 3 al 17 de agosto", pos: "bottom-6 -right-2 sm:-right-12" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[380px]">
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-56 w-56 rounded-full bg-gradient-to-tr from-teal-500/25 to-sky-500/25 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden"
      >
        <div className="flex items-center gap-3 border-b border-white/10 bg-white/5 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-teal-500 to-sky-500">
            <svg
              className="h-5 w-5 text-black"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24L3 3v6.59a2 2 0 0 0 .59 1.41l9.59 9.59a2 2 0 0 0 2.82 0l4.59-4.59a2 2 0 0 0 0-2.82z" />
              <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white/90">
              Sit+ · Campaña agosto 2026
            </p>
            <p className="text-xs text-white/40">Próxima campaña</p>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-3">
          {currentPromotions.map((promo, i) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              className="flex items-center justify-between gap-3"
            >
              <span className="text-sm text-white/80">
                {t(`items.${promo.key}.title`)}
              </span>
              <span className="shrink-0 rounded-full bg-teal-400/10 px-2.5 py-0.5 text-xs font-semibold text-teal-300">
                {promo.discount}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {chips.map((chip, i) => (
        <motion.div
          key={chip.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 0.15, duration: 0.6 }}
          className={`
            absolute ${chip.pos}
            flex items-center gap-2 rounded-xl border border-white/10
            bg-white/5 backdrop-blur-xl px-3 py-2 shadow-lg shadow-black/30
          `}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
          <span className="text-xs font-medium text-white/80">
            {chip.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

export default function PromotionsHero() {
  const t = useTranslations("promotions");

  const phone = "524431234567";
  const message = t("heroWhatsappMsg");
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <section className="relative w-[85%] max-w-7xl flex flex-col lg:flex-row items-center gap-14 mt-16 lg:mt-8">
      <div className="pointer-events-none absolute inset-0 -z-10 flex justify-center">
        <div className="w-[520px] h-[520px] bg-gradient-to-tr from-teal-600/30 to-sky-600/30 blur-[160px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-1 flex-col items-center lg:items-start text-center lg:text-left gap-6"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-1.5 text-xs font-medium text-teal-300">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l1.9 5.4L19 9l-5.1 1.6L12 16l-1.9-5.4L5 9l5.1-1.6L12 2z" />
          </svg>
          {t("badgeUpcoming")}
        </span>

        <h1 className="text-[clamp(2.4rem,5vw,4.2rem)] font-bold leading-tight font-title">
          {t("heroTitle1")}
          <br />
          <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
            {t("heroTitle2")}
          </span>
        </h1>

        <p className="text-gray-300 max-w-xl text-[clamp(1.05rem,1.6vw,1.25rem)]">
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
              {t("heroCtaWhatsapp")}
            </CustomLink>
          </div>
          <div className="w-full sm:w-auto">
            <CustomLink
              url="#promociones"
              appearance="darkOutline"
              size="md"
              fullWidth
            >
              {t("heroCtaSecondary")}
            </CustomLink>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="flex-1 flex justify-center"
      >
        <PromotionsIllustration />
      </motion.div>
    </section>
  );
}
