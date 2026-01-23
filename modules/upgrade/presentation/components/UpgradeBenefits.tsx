"use client";

import { motion } from "framer-motion";
import { useTranslations, useMessages } from "next-intl";

export default function UpgradeBenefits() {
  const t = useTranslations("upgrade");
  const messages = useMessages();
  const benefits = (messages?.upgrade as any)?.benefits || [];
  return (
    <div className="w-[90%] max-w-5xl text-center">
      <motion.h2
        className="text-3xl font-bold mb-10 font-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {t("benefitsTitle")}
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-6">
        {benefits.map((item: any, i: number) => (
          <motion.div
            key={i}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
