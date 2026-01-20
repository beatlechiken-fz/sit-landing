"use client";

import { motion } from "framer-motion";

import { useMessages, useTranslations } from "next-intl";

export default function AboutWhyUs() {
  const t = useTranslations("about");
  const messages = useMessages();
  const reasons = (messages?.about as any)?.whyUsReasons || [];
  return (
    <div className="w-[90%] max-w-5xl">
      <motion.h2
        className="text-3xl font-bold mb-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {t("whyUsTitle")}
      </motion.h2>

      <div className="grid sm:grid-cols-2 gap-6">
        {reasons.map((item: string, i: number) => (
          <motion.div
            key={i}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <p className="text-gray-300">{item}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
