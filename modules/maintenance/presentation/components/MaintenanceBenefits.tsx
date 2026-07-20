"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const ICONS: React.ReactNode[] = [
  // Mayor rendimiento (velocímetro)
  <>
    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
    <path d="M12 12l4.2-4.2" />
    <path d="M12 8v.01" />
  </>,
  // Menos calentamiento (copo)
  <>
    <path d="M12 2v20" />
    <path d="M5 6l14 12" />
    <path d="M19 6L5 18" />
    <path d="M12 8l-2.5-1.5" />
    <path d="M12 8l2.5-1.5" />
    <path d="M12 16l-2.5 1.5" />
    <path d="M12 16l2.5 1.5" />
  </>,
  // Arranque más rápido (rayo)
  <>
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
  </>,
  // Prevención de fallas (escudo check)
  <>
    <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
    <path d="M9 12l2 2 4-4" />
  </>,
];

export default function MaintenanceBenefits() {
  const t = useTranslations("maintenance");
  const benefits = t.raw("benefits");

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-[85%] max-w-7xl flex flex-col items-center gap-16"
    >
      <div className="flex flex-col items-center text-center gap-3">
        <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
          {t("benefitsEyebrow")}
        </span>
        <h2 className="text-[clamp(2rem,5vw,3.8rem)] font-bold font-title">
          <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
            {t("benefitsTitle")}
          </span>
        </h2>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
      >
        {benefits.map((b: any, i: number) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-teal-400/40 hover:-translate-y-2 transition"
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

            <h3 className="text-lg font-bold mt-5 mb-2">{b.title}</h3>
            <p className="text-gray-400 text-sm">{b.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
