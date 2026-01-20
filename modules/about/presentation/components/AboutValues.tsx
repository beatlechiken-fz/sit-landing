"use client";

import { motion } from "framer-motion";

import { useMessages, useTranslations } from "next-intl";

export default function AboutValues() {
  const t = useTranslations("about");
  const messages = useMessages();
  const values = (messages?.about as any)?.valuesCards || [];
  return (
    <div className="w-[90%] max-w-6xl text-center">
      <motion.h2
        className="text-3xl font-bold mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {t("valuesTitle")}
      </motion.h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((item: any, i: number) => (
          <motion.div
            key={i}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <h3 className="font-semibold text-lg mb-2 text-emerald-400">
              {item.title}
            </h3>
            <p className="text-sm text-gray-400">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
