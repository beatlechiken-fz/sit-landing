"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import CustomLink from "@/core/components/custom-link/CustomLink";

// ─────────────────────────────────────────────
// Ilustración lateral — mockup de dashboard con
// notificaciones de correo/Telegram + chips
// ─────────────────────────────────────────────
function CustomLandingIllustration() {
  const t = useTranslations("customLanding");

  const chips = [
    { label: "Supabase", pos: "top-0 -left-2 sm:-left-8" },
    { label: t("chipEmailTelegram"), pos: "top-8 -right-2 sm:-right-14" },
    { label: t("chipOwned"), pos: "bottom-6 -left-4 sm:-left-14" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[360px] sm:max-w-[420px]">
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-56 w-56 rounded-full bg-gradient-to-tr from-teal-500/25 to-sky-500/25 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          <span className="ml-3 flex-1 rounded-full bg-white/10 px-3 py-1 text-[10px] text-white/40 truncate">
            tunegocio.com.mx/contacto
          </span>
        </div>

        {/* Notificaciones simuladas */}
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-400/20 text-teal-300 text-xs font-bold">
              DB
            </span>
            <div className="flex-1">
              <div className="h-2 w-24 rounded-full bg-white/20" />
              <div className="mt-1.5 h-2 w-16 rounded-full bg-white/10" />
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-400/20 text-sky-300 text-xs font-bold">
              ✉
            </span>
            <div className="flex-1">
              <div className="h-2 w-28 rounded-full bg-white/20" />
              <div className="mt-1.5 h-2 w-20 rounded-full bg-white/10" />
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-400/20 text-teal-300 text-xs font-bold">
              TG
            </span>
            <div className="flex-1">
              <div className="h-2 w-20 rounded-full bg-white/20" />
              <div className="mt-1.5 h-2 w-24 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </motion.div>

      {chips.map((chip, i) => (
        <motion.div
          key={chip.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 + i * 0.15, duration: 0.6 }}
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

export default function CustomLandingHero() {
  const t = useTranslations("customLanding");

  const phone = "524431234567";
  const message = t("whatsapp.basic");
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    message,
  )}`;

  return (
    <section className="relative w-[85%] max-w-7xl flex flex-col lg:flex-row items-center gap-14 mt-16 lg:mt-8">
      {/* Texto */}
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
          {t("heroBadge")}
        </span>

        <h1 className="text-[clamp(2.4rem,5vw,4.2rem)] font-bold leading-tight font-title">
          <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
            {t("heroTitle1")}
          </span>
          <br />
          {t("heroTitle2")}
        </h1>

        <p className="text-gray-300 max-w-xl text-[clamp(1.05rem,1.6vw,1.25rem)]">
          {t("heroDesc1")}
        </p>

        <p className="text-gray-400 max-w-xl">{t("heroDesc2")}</p>

        <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto">
          <div className="w-full sm:w-auto">
            <CustomLink
              url={whatsappUrl}
              appearance="blueGreenBg"
              size="md"
              fullWidth
            >
              {t("heroQuoteBtn")}
            </CustomLink>
          </div>
          <div className="w-full sm:w-auto">
            <CustomLink
              url="#packages"
              appearance="darkOutline"
              size="md"
              fullWidth
            >
              {t("heroPlansBtn")}
            </CustomLink>
          </div>
        </div>
      </motion.div>

      {/* Ilustración */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="flex-1 flex justify-center"
      >
        <CustomLandingIllustration />
      </motion.div>
    </section>
  );
}
