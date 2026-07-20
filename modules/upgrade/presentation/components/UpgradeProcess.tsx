"use client";

import { motion } from "framer-motion";
import { useTranslations, useMessages } from "next-intl";

export default function UpgradeProcess() {
  const t = useTranslations("upgrade");
  const messages = useMessages();
  const steps = (messages?.upgrade as any)?.processSteps || [];

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
          {t("processEyebrow")}
        </span>
        <h2 className="text-[clamp(2rem,5vw,3.2rem)] font-bold font-title">
          <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
            {t("processTitle")}
          </span>
        </h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="relative grid md:grid-cols-4 gap-8 w-full"
      >
        <div className="pointer-events-none absolute top-7 left-0 right-0 hidden md:block h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />

        {steps.map((item: any, i: number) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            className="relative flex flex-col items-center text-center bg-white/5 border border-white/10 rounded-2xl p-8 transition hover:-translate-y-2 hover:border-teal-400/40"
          >
            <div className="relative z-10 w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-sky-500 text-black font-bold mb-4">
              {i + 1}
            </div>
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
