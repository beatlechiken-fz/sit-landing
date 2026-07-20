"use client";

import { motion } from "framer-motion";
import { useMessages, useTranslations } from "next-intl";

export default function IATech() {
  const t = useTranslations("ia");
  const messages = useMessages();
  const tech = (messages?.ia as any)?.tech as string[];
  return (
    <section className="w-[85%] max-w-6xl py-24 flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-3 mb-10"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
          {t("techEyebrow")}
        </span>
        <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-bold font-title">
          {t("techTitle")}
        </h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        className="flex flex-wrap justify-center gap-4"
      >
        {tech.map((item, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
            className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 transition hover:border-teal-400/40 hover:text-white"
          >
            {item}
          </motion.span>
        ))}
      </motion.div>
    </section>
  );
}
