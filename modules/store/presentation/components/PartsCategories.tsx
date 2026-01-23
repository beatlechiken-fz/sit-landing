"use client";

import { motion } from "framer-motion";

import { useTranslations, useMessages } from "next-intl";

const PartsCategories = () => {
  const t = useTranslations("storeParts");
  const messages = useMessages();
  const categories = (messages?.storeParts as any)?.categories || [];

  return (
    <div className="w-[90%] max-w-6xl">
      <motion.h2
        className="text-3xl font-bold mb-12 text-center font-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {t("categoriesTitle")}
      </motion.h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((item: any, i: number) => (
          <motion.div
            key={i}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/40 transition"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PartsCategories;
