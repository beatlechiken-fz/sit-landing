"use client";

import { motion } from "framer-motion";
import { useTranslations, useMessages } from "next-intl";

export default function UpgradeProcess() {
  const t = useTranslations("upgrade");
  const messages = useMessages();
  const steps = (messages?.upgrade as any)?.processSteps || [];
  return (
    <div className="w-[90%] max-w-5xl">
      <motion.h2
        className="text-3xl font-bold mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {t("processTitle")}
      </motion.h2>

      <div className="grid md:grid-cols-4 gap-6">
        {steps.map((item: any, i: number) => (
          <motion.div
            key={i}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <span className="text-emerald-400 font-bold text-sm">
              Paso {i + 1}
            </span>
            <h3 className="font-semibold mt-2 mb-1">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
