"use client";

import { motion } from "framer-motion";
import { useTranslations, useMessages } from "next-intl";

export default function MaintenanceProcess() {
  const t = useTranslations("maintenance");
  const messages = useMessages();
  const steps = (messages?.maintenance as any)?.processSteps || [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-[85%] max-w-7xl flex flex-col items-center gap-16"
    >
      <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-center">
        <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
          {t("processTitle")}
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 w-full">
        {steps.map((s: string, i: number) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-xl p-6 text-center"
          >
            <div className="text-teal-400 font-bold mb-2">0{i + 1}</div>
            <p className="text-gray-300">{s}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
