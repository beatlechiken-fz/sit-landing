"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import CustomLink from "@/core/components/custom-link/CustomLink";
import Icons from "@/core/assets/Icons";
import Images from "@/core/assets/Images";
import { useTranslations } from "next-intl";
import { HomeCTAButton } from "@/modules/home/presentation/components/HomeCTAButton";

// ─────────────────────────────────────────────
// Ilustración lateral — imagen real, con glow
// ambiental detrás. Se achica en mobile para no
// dominar la pantalla cuando se apila bajo el texto.
// ─────────────────────────────────────────────
function DevIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[260px] sm:max-w-sm lg:max-w-xl">
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-40 w-40 sm:h-56 sm:w-56 rounded-full bg-gradient-to-tr from-teal-500/20 to-sky-500/20 blur-[100px]" />
      </div>
      <Image
        src={Images.heroApps}
        alt="Ilustración de desarrollo de aplicaciones a la medida"
        width={1536}
        height={1024}
        priority
        sizes="(max-width: 640px) 260px, (max-width: 1024px) 384px, 576px"
        className="h-auto w-full select-none"
      />
    </div>
  );
}

export default function DevApps() {
  const t = useTranslations("apps");

  const phone = "524431234567";
  const message =
    "Hola, me gustaría más información sobre el desarrollo de una app.";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    message,
  )}`;

  const items = [
    { label: "iOS", icon: Icons.ios },
    { label: "Android", icon: Icons.android },
    { label: "Web", icon: Icons.web },
    { label: "IA", icon: Icons.iaPowered },
    { label: "macOS", icon: Icons.macos },
    { label: "Windows", icon: Icons.windows },
  ];

  return (
    <section className="relative w-[85%] max-w-7xl flex flex-col mt-16 lg:mt-8 gap-16">
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
            {t("heroBadge")}
          </span>

          <h1 className="text-[clamp(2.4rem,5vw,4.2rem)] font-bold leading-tight font-title">
            <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
              {t("apps1")}
            </span>
            <br />
            {t("apps2")}
          </h1>

          <p className="text-gray-400 max-w-xl text-[clamp(1.05rem,1.6vw,1.25rem)]">
            {t("apps3")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto">
            <div className="w-full sm:w-auto">
              <CustomLink
                url={whatsappUrl}
                appearance="blueGreenBg"
                size="md"
                fullWidth
              >
                {t("appsQuote")}
              </CustomLink>
            </div>
            <HomeCTAButton href="/apps#tipos" variant="outline">
              {t("heroCtaSecondary")}
            </HomeCTAButton>
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
          <DevIllustration />
        </motion.div>
      </div>

      {/* Plataformas */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full"
      >
        {items.map((item) => (
          <motion.div
            key={item.label}
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 },
            }}
            className="
              flex items-center justify-center gap-3
              bg-white/5 border border-white/10
              rounded-xl px-4 py-3
              transition hover:scale-[1.03] hover:border-teal-400/40
            "
          >
            <Image src={item.icon} alt="" width={22} height={22} />
            <span className="text-gray-300 font-medium text-sm">
              {item.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
