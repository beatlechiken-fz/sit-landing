"use client";

import { motion } from "framer-motion";

import { useTranslations, useMessages } from "next-intl";

const PartsWhy = () => {
  const t = useTranslations("storeParts");
  const messages = useMessages();
  const reasons = (messages?.storeParts as any)?.whyReasons || [];

  return (
    <div className="w-[90%] max-w-5xl text-center">
      <motion.h2
        className="text-3xl font-bold mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {t("whyTitle")}
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-6">
        {reasons.map((item: any, i: number) => (
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
};

export default PartsWhy;
