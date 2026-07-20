"use client";

import { motion } from "framer-motion";
import {
  currentPromotions,
  type Promotion,
} from "@/core/mocked-data/promotions-current";
import { useTranslations } from "next-intl";

const ICONS: Record<Promotion["icon"], React.ReactNode> = {
  ssd: (
    <>
      <rect x="3" y="7" width="18" height="10" rx="2" />
      <path d="M7 7V5" />
      <path d="M12 7V5" />
      <path d="M17 7V5" />
    </>
  ),
  ram: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="1.5" />
      <path d="M8 5v3" />
      <path d="M12 5v3" />
      <path d="M16 5v3" />
      <path d="M8 16v3" />
      <path d="M12 16v3" />
      <path d="M16 16v3" />
    </>
  ),
  laptopParts: (
    <>
      <rect x="4" y="4" width="16" height="10" rx="1" />
      <path d="M2 18h20l-2-4H4l-2 4z" />
    </>
  ),
  battery: (
    <>
      <rect x="2" y="8" width="18" height="8" rx="2" />
      <path d="M22 11v2" />
    </>
  ),
  maintenance: (
    <>
      <path d="M4 15a8 8 0 1 1 16 0" />
      <path d="M12 15l3.5-4.5" />
      <circle cx="12" cy="15" r="0.5" />
    </>
  ),
  phone: (
    <>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
};

export default function PromotionsGrid() {
  const t = useTranslations("promotions");

  return (
    <div
      id="promociones"
      className="w-[85%] max-w-6xl flex flex-col items-center gap-14 scroll-mt-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center gap-3"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
          {t("gridEyebrow")}
        </span>
        <h2 className="text-[clamp(2rem,5vw,3.2rem)] font-bold font-title">
          <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
            {t("gridTitle")}
          </span>
        </h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
      >
        {currentPromotions.map((promo) => (
          <motion.div
            key={promo.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 transition hover:-translate-y-2 hover:border-teal-400/40"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-400/10">
              <svg
                className="h-6 w-6 text-teal-300"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                {ICONS[promo.icon]}
              </svg>
            </div>

            <p className="mt-5 text-2xl font-extrabold bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
              {promo.discount}
            </p>

            <h3 className="font-semibold text-lg mt-1 mb-2">
              {t(`items.${promo.key}.title`)}
            </h3>
            <p className="text-sm text-gray-400">
              {t(`items.${promo.key}.desc`)}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
