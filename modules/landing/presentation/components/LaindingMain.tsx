"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import CustomLink from "@/core/components/custom-link/CustomLink";

// ─────────────────────────────────────────────
// Ilustración lateral — mockup de navegador con
// wireframe de landing page + chips flotantes
// ─────────────────────────────────────────────
function LandingIllustration() {
  const chips = [
    { label: "SEO", pos: "top-0 -left-2 sm:-left-8" },
    { label: "Responsive", pos: "top-8 -right-2 sm:-right-10" },
    { label: "+128% Leads", pos: "bottom-6 -left-4 sm:-left-12" },
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
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          <span className="ml-3 flex-1 rounded-full bg-white/10 px-3 py-1 text-[10px] text-white/40 truncate">
            tunegocio.com.mx
          </span>
        </div>

        {/* Page wireframe */}
        <div className="p-5 flex flex-col gap-3">
          <div className="h-20 rounded-lg bg-gradient-to-tr from-teal-500/30 to-sky-500/30" />
          <div className="h-2.5 w-3/4 rounded-full bg-white/15" />
          <div className="h-2.5 w-1/2 rounded-full bg-white/10" />
          <div className="mt-2 h-8 w-28 rounded-lg bg-gradient-to-r from-teal-400 to-sky-400" />
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

export default function LandingMain() {
  const t = useTranslations("landing");

  const phone = "524431234567";
  const message =
    "Hola, me gustaría más información sobre el desarrollo de mi sitio web.";
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
            {t("landingTitle1")}
          </span>
          <br />
          {t("landingTitle2")}
        </h1>

        <p className="text-gray-300 max-w-xl text-[clamp(1.05rem,1.6vw,1.25rem)]">
          {t("landingDesc1")}
        </p>

        <p className="text-gray-400 max-w-xl">{t("landingDesc2")}</p>

        <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto">
          <div className="w-full sm:w-auto">
            <CustomLink
              url={whatsappUrl}
              appearance="blueGreenBg"
              size="md"
              fullWidth
            >
              {t("landingQuoteBtn")}
            </CustomLink>
          </div>
          <div className="w-full sm:w-auto">
            <CustomLink
              url="#plans"
              appearance="darkOutline"
              size="md"
              fullWidth
            >
              {t("landingPlansBtn")}
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
        <LandingIllustration />
      </motion.div>
    </section>
  );
}
