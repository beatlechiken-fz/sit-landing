"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import CustomLink from "@/core/components/custom-link/CustomLink";
import Images from "@/core/assets/Images";
import { useTranslations } from "next-intl";

// ─────────────────────────────────────────────
// Ilustración lateral — imagen real, con glow
// ambiental detrás. Mismo tratamiento responsive
// que ya usamos en HomeHero.tsx / DevApps.tsx.
// ─────────────────────────────────────────────
function IAIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[260px] sm:max-w-sm lg:max-w-xl">
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-40 w-40 sm:h-56 sm:w-56 rounded-full bg-gradient-to-tr from-teal-500/20 to-sky-500/20 blur-[100px]" />
      </div>
      <Image
        src={Images.brainAi}
        alt="Ilustración de inteligencia artificial y automatización"
        width={620}
        height={470}
        priority
        sizes="(max-width: 640px) 260px, (max-width: 1024px) 384px, 576px"
        className="h-auto w-full select-none"
      />
    </div>
  );
}

export default function IAMain() {
  const t = useTranslations("ia");
  const phone = "524431234567";
  const message = t("ctaWhatsappMsg");
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <section className="relative w-[85%] max-w-7xl flex flex-col lg:flex-row items-center gap-14 mt-16 lg:mt-8">
      {/* Fondo de textura */}
      <div className="pointer-events-none absolute inset-0 -z-20 flex justify-center overflow-hidden rounded-[3rem]">
        <Image
          src={Images.homeIABg}
          alt=""
          fill
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0F]/40 via-[#0B0B0F]/70 to-[#0B0B0F]" />
      </div>

      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex justify-center">
        <div className="w-[620px] h-[620px] bg-gradient-to-tr from-teal-600/20 to-sky-600/20 blur-[160px]" />
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
            {t("mainTitle")}
          </span>
        </h1>

        <p className="text-gray-300 max-w-xl text-[clamp(1.05rem,1.6vw,1.25rem)]">
          {t("mainDesc")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto">
          <div className="w-full sm:w-auto">
            <CustomLink
              url={whatsappUrl}
              appearance="blueGreenBg"
              size="md"
              fullWidth
            >
              {t("ctaBtn")}
            </CustomLink>
          </div>
          <div className="w-full sm:w-auto">
            <CustomLink
              url="#servicios"
              appearance="darkOutline"
              size="md"
              fullWidth
            >
              {t("heroCtaSecondary")}
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
        <IAIllustration />
      </motion.div>
    </section>
  );
}
