"use client";

import { motion } from "framer-motion";
import { useTranslations, useMessages } from "next-intl";

const ICONS: React.ReactNode[] = [
  // Arranque en segundos (rayo)
  <>
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
  </>,
  // Multitarea sin trabarse (ventanas superpuestas)
  <>
    <rect x="3" y="3" width="12" height="12" rx="1.5" />
    <path d="M9 9h12v12H9z" />
  </>,
  // Mayor rendimiento gráfico (monitor con gráfico)
  <>
    <rect x="3" y="4" width="18" height="12" rx="1.5" />
    <path d="M8 20h8" />
    <path d="M12 16v4" />
    <path d="M7 12l3-3 2 2 4-4" />
  </>,
];

export default function UpgradeBenefits() {
  const t = useTranslations("upgrade");
  const messages = useMessages();
  const benefits = (messages?.upgrade as any)?.benefits || [];

  return (
    <div className="w-[85%] max-w-6xl flex flex-col items-center gap-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center gap-3"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
          {t("benefitsEyebrow")}
        </span>
        <h2 className="text-[clamp(2rem,5vw,3.2rem)] font-bold font-title">
          <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
            {t("benefitsTitle")}
          </span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 w-full">
        {benefits.map((item: any, i: number) => (
          <motion.div
            key={i}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 transition hover:-translate-y-2 hover:border-teal-400/40"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
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
                {ICONS[i]}
              </svg>
            </div>
            <h3 className="font-semibold text-lg mt-5 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
