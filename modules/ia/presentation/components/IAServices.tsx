"use client";

import { motion } from "framer-motion";
import { useMessages, useTranslations } from "next-intl";

const ICONS: React.ReactNode[] = [
  // Chatbots inteligentes
  <>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </>,
  // Agentes de IA
  <>
    <rect x="5" y="8" width="14" height="11" rx="2" />
    <path d="M12 8V4" />
    <circle cx="12" cy="3" r="1" />
    <circle cx="9" cy="13" r="1" />
    <circle cx="15" cy="13" r="1" />
    <path d="M9 17h6" />
    <path d="M2 12h3" />
    <path d="M19 12h3" />
  </>,
  // Automatización de procesos
  <>
    <path d="M12 2v4" />
    <path d="M12 18v4" />
    <path d="M4.9 4.9l2.8 2.8" />
    <path d="M16.3 16.3l2.8 2.8" />
    <path d="M2 12h4" />
    <path d="M18 12h4" />
    <path d="M4.9 19.1l2.8-2.8" />
    <path d="M16.3 7.7l2.8-2.8" />
    <circle cx="12" cy="12" r="3" />
  </>,
  // Migración y limpieza de datos
  <>
    <ellipse cx="12" cy="5" rx="8" ry="3" />
    <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
    <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
  </>,
  // Implementación de modelos IA
  <>
    <rect x="7" y="7" width="10" height="10" rx="1" />
    <path d="M12 2v3" />
    <path d="M12 19v3" />
    <path d="M2 12h3" />
    <path d="M19 12h3" />
    <path d="M4.5 4.5l2 2" />
    <path d="M17.5 17.5l2 2" />
    <path d="M4.5 19.5l2-2" />
    <path d="M17.5 6.5l2-2" />
  </>,
  // Apps con inteligencia artificial
  <>
    <rect x="6" y="2" width="12" height="20" rx="2" />
    <path d="M11 18h2" />
  </>,
];

export default function IAServices() {
  const t = useTranslations("ia");
  const messages = useMessages();
  const services = (messages?.ia as any)?.services as any[];
  return (
    <section id="servicios" className="w-[85%] max-w-7xl py-24 flex flex-col items-center scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center gap-3 mb-16"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
          {t("servicesEyebrow")}
        </span>
        <h2 className="text-[clamp(2.2rem,5vw,3.8rem)] font-bold font-title">
          <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
            {t("servicesTitle")}
          </span>
        </h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full"
      >
        {services.map((item, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-8 hover:border-teal-400/40 hover:-translate-y-2 transition"
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

            <h3 className="text-xl font-bold mt-6 mb-3">{item.title}</h3>
            <p className="text-gray-400">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
