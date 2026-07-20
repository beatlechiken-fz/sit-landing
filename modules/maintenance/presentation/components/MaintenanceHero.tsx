"use client";

import { motion } from "framer-motion";
import CustomLink from "@/core/components/custom-link/CustomLink";
import { useTranslations } from "next-intl";

// ─────────────────────────────────────────────
// Ilustración lateral — panel de diagnóstico con
// gauge de rendimiento + barras antes/después +
// chips flotantes de resultado
// ─────────────────────────────────────────────
function MaintenanceIllustration() {
  const chips = [
    { label: "Sin sobrecalentamiento", pos: "top-0 -left-2 sm:-left-12" },
    { label: "+40% rendimiento", pos: "top-14 -right-2 sm:-right-14" },
    { label: "Garantía incluida", pos: "bottom-2 -left-4 sm:-left-10" },
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
        {/* Header */}
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
              <path d="M3 12a9 9 0 1 1 9 9" />
              <path d="M12 7v5l3 3" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white/90">
              Diagnóstico del equipo
            </p>
            <p className="text-xs text-white/40">Análisis en tiempo real</p>
          </div>
        </div>

        {/* Gauge + barras */}
        <div className="p-5 flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 34}
                  initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                  whileInView={{ strokeDashoffset: 2 * Math.PI * 34 * 0.08 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                />
                <defs>
                  <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#2dd4bf" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-teal-300">
                92%
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white/90">
                Salud general
              </p>
              <p className="text-xs text-white/40">Óptima tras mantenimiento</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-xs text-white/40">Antes</span>
              <div className="h-2.5 flex-1 rounded-full bg-white/10">
                <div className="h-full w-[85%] rounded-full bg-red-400/60" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-xs text-white/40">Después</span>
              <div className="h-2.5 flex-1 rounded-full bg-white/10">
                <div className="h-full w-[35%] rounded-full bg-gradient-to-r from-teal-400 to-sky-400" />
              </div>
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

export default function MaintenanceHero() {
  const t = useTranslations("maintenance");
  const phone = "524431234567";
  const message = t("heroWhatsappMsg");
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <section className="relative w-[85%] max-w-7xl flex flex-col lg:flex-row items-center gap-14 mt-16 lg:mt-8">
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex justify-center">
        <div className="w-[520px] h-[520px] bg-gradient-to-tr from-teal-600/30 to-sky-600/30 blur-[160px]" />
      </div>

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

      {/* Ilustración */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="flex-1 flex justify-center"
      >
        <MaintenanceIllustration />
      </motion.div>
    </section>
  );
}
