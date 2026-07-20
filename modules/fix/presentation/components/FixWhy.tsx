"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const ICONS: React.ReactNode[] = [
  // Diagnóstico honesto
  <>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M20 20l-4.35-4.35" />
    <path d="M8 10.5l1.8 1.8L13.5 8" />
  </>,
  // Refacciones de calidad
  <>
    <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
    <path d="M9 12l2 2 4-4" />
  </>,
  // Garantía real
  <>
    <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
    <path d="M12 8v5" />
    <path d="M12 16.5h.01" />
  </>,
];

export default function FixWhy() {
  const t = useTranslations("fixWhy");
  const reasons = t.raw("reasons");

  return (
    <section className="w-[85%] max-w-7xl flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center gap-3 mb-16"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
          {t("eyebrow")}
        </span>
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold font-title">
          <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
            {t("title")}
          </span>
        </h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-full"
      >
        {reasons.map((r: any, i: number) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            className="rounded-2xl bg-white/5 border border-white/10 p-8 transition hover:-translate-y-2 hover:border-teal-400/40"
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

            <h3 className="text-xl font-bold mt-6 mb-3">{r.title}</h3>
            <p className="text-gray-400">{r.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
