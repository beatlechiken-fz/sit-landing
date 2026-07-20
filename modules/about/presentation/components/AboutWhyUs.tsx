"use client";

import { motion } from "framer-motion";
import { useMessages, useTranslations } from "next-intl";

export default function AboutWhyUs() {
  const t = useTranslations("about");
  const messages = useMessages();
  const reasons = (messages?.about as any)?.whyUsReasons || [];
  return (
    <div className="w-[85%] max-w-5xl flex flex-col items-center gap-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center gap-3"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
          {t("whyUsEyebrow")}
        </span>
        <h2 className="text-[clamp(2rem,5vw,3.2rem)] font-bold font-title">
          <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
            {t("whyUsTitle")}
          </span>
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-6 w-full">
        {reasons.map((item: string, i: number) => (
          <motion.div
            key={i}
            className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 transition hover:-translate-y-2 hover:border-teal-400/40"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-sky-500">
              <svg
                className="h-4 w-4 text-black"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <p className="text-gray-300 pt-1">{item}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
