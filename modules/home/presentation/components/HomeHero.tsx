"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import CustomLink from "@/core/components/custom-link/CustomLink";
import Images from "@/core/assets/Images";
import { HomeCTAButton } from "./HomeCTAButton";

// ─────────────────────────────────────────────
// Ilustración lateral — imagen real, con glow
// ambiental detrás para que se integre al fondo.
// Se achica en mobile para no dominar la pantalla
// cuando se apila debajo del texto.
// ─────────────────────────────────────────────
function HeroImage() {
  return (
    <div className="relative mx-auto w-full max-w-[260px] sm:max-w-sm lg:max-w-xl">
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-40 w-40 sm:h-56 sm:w-56 rounded-full bg-gradient-to-tr from-teal-500/20 to-sky-500/20 blur-[100px]" />
      </div>
      <Image
        src={Images.heroSplash}
        alt="Ilustración de desarrollo de apps con IA"
        width={1503}
        height={1047}
        priority
        sizes="(max-width: 640px) 260px, (max-width: 1024px) 384px, 576px"
        className="h-auto w-full select-none"
      />
    </div>
  );
}

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
    <section className="relative w-[85%] max-w-7xl flex flex-col mt-28 lg:mt-16 gap-16">
      <div className="flex flex-col lg:flex-row items-center gap-14">
        {/* Texto */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-1 flex-col items-center lg:items-start text-center lg:text-left gap-6"
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

          <h1 className="text-[clamp(2.4rem,5vw,4.2rem)] font-bold leading-tight font-title">
            {t("title1")}
            <br />
            <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
              {t("title2")}
            </span>
          </h1>

          <p className="text-gray-400 max-w-xl text-[clamp(1.05rem,1.6vw,1.25rem)]">
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

        {/* Ilustración */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex-1 flex justify-center"
        >
          <HeroImage />
        </motion.div>
      </div>

      {/* Highlights */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full"
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
