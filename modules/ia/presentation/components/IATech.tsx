"use client";

import { motion } from "framer-motion";
import { useMessages, useTranslations } from "next-intl";

export default function IATech() {
  const t = useTranslations("ia");
  const messages = useMessages();
  const tech = (messages?.ia as any)?.tech as string[];
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-[85%] max-w-6xl py-24 text-center"
    >
      <h2 className="text-3xl font-bold mb-10 font-title">{t("techTitle")}</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {tech.map((item, i) => (
          <span
            key={i}
            className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300"
          >
            {item}
          </span>
        ))}
      </div>
    </motion.section>
  );
}
