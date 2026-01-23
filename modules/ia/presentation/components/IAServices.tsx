"use client";

import { motion } from "framer-motion";
import { useMessages, useTranslations } from "next-intl";

export default function IAServices() {
  const t = useTranslations("ia");
  const messages = useMessages();
  const services = (messages?.ia as any)?.services as any[];
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-[85%] max-w-7xl py-24"
    >
      <h2 className="text-[clamp(2.2rem,5vw,3.8rem)] font-bold mb-16 text-center font-title">
        <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
          {t("servicesTitle")}
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {services.map((item, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-8 hover:border-teal-400/40 transition"
          >
            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
            <p className="text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
