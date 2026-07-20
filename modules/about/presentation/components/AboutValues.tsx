"use client";

import { motion } from "framer-motion";
import { useMessages, useTranslations } from "next-intl";

const ICONS: React.ReactNode[] = [
  // Claridad (burbuja de diálogo)
  <>
    <path d="M4 5h16v11H8l-4 4V5z" />
  </>,
  // Responsabilidad (escudo con check)
  <>
    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </>,
  // Resultados (objetivo)
  <>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="0.5" />
  </>,
  // Cercanía (corazón)
  <>
    <path d="M12 20s-7-4.35-9.5-8.5C1 8 2.5 4.5 6 4c2-.3 3.5.7 6 3.1C14.5 4.7 16 3.7 18 4c3.5.5 5 4 3.5 7.5C19 15.65 12 20 12 20z" />
  </>,
];

export default function AboutValues() {
  const t = useTranslations("about");
  const messages = useMessages();
  const values = (messages?.about as any)?.valuesCards || [];
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
          {t("valuesEyebrow")}
        </span>
        <h2 className="text-[clamp(2rem,5vw,3.2rem)] font-bold font-title">
          <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
            {t("valuesTitle")}
          </span>
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {values.map((item: any, i: number) => (
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
