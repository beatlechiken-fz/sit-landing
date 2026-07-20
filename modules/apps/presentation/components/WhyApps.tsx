"use client";

import { motion } from "framer-motion";
import { useMessages, useTranslations } from "next-intl";

type WhyAppCard = {
  key: "results" | "scale" | "support";
  title: string;
  desc: string;
};

// Íconos inline (currentColor) — los .svg de public/icons usan
// stroke="currentColor", así que se cargan como JSX para heredar
// el color de marca en vez de perderlo dentro de un <img>.
const ICONS: Record<WhyAppCard["key"], React.ReactNode> = {
  results: (
    <>
      <rect x="3" y="10" width="4" height="10" rx="1" />
      <rect x="10" y="6" width="4" height="14" rx="1" />
      <rect x="17" y="3" width="4" height="17" rx="1" />
    </>
  ),
  scale: (
    <>
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20V8" />
      <path d="M22 20H2" />
    </>
  ),
  support: (
    <>
      <path d="M12 3a9 9 0 0 0-9 9v3a2 2 0 0 0 2 2h2v-5H5v-1a7 7 0 1 1 14 0v1h-2v5h2a2 2 0 0 0 2-2v-3a9 9 0 0 0-9-9z" />
      <path d="M8 21h8" />
    </>
  ),
};

export default function WhyApps() {
  const t = useTranslations("apps");
  const messages = useMessages();

  const items = (messages?.apps as any)?.appsWhyCards as WhyAppCard[];

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
          {t("whyEyebrow")}
        </span>
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold font-title">
          <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
            {t("appsWhy1")}
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
        {items.map((item) => (
          <motion.div
            key={item.key}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            className="
              rounded-2xl bg-white/5 backdrop-blur
              border border-white/10 p-8
              transition hover:-translate-y-2 hover:border-teal-400/40
            "
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
                {ICONS[item.key]}
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
