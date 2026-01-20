"use client";

import { motion } from "framer-motion";
import { useMessages, useTranslations } from "next-intl";

// Steps will come from translations

export default function IAProcess() {
  const t = useTranslations("ia");
  const messages = useMessages();
  const steps = (messages?.ia as any)?.processSteps as any[];
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-[85%] max-w-7xl py-24"
    >
      <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold mb-20 text-center">
        <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
          {t("processTitle")}
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10">
        {steps.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center bg-white/5 border border-white/10 rounded-2xl p-8"
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-sky-500 text-black font-bold mb-4">
              {item.step}
            </div>
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-gray-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
