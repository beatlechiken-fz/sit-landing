"use client";

import { motion } from "framer-motion";
import { useMessages, useTranslations } from "next-intl";

type WhyCard = {
  key: "design" | "speed" | "results";
  title: string;
  desc: string;
};

const ICONS: Record<WhyCard["key"], React.ReactNode> = {
  design: (
    <>
      <path d="M9 3H5a2 2 0 0 0-2 2v4" />
      <path d="M15 3h4a2 2 0 0 1 2 2v4" />
      <path d="M9 21H5a2 2 0 0 1-2-2v-4" />
      <path d="M15 21h4a2 2 0 0 0 2-2v-4" />
      <path d="M13 11l5-5" />
      <path d="M13 11V7h4" />
    </>
  ),
  speed: (
    <>
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
    </>
  ),
  results: (
    <>
      <path d="M3 3v18h18" />
      <path d="M7 15l4-4 3 3 5-6" />
    </>
  ),
};

export default function LandingWhy() {
  const t = useTranslations("landing");
  const messages = useMessages();
  const items = (messages?.landing as any)?.whyCards as WhyCard[];

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
            {t("whyTitle")}
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
