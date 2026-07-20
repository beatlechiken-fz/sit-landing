"use client";

import { motion } from "framer-motion";
import { useMessages } from "next-intl";

export default function AboutStats() {
  const messages = useMessages();
  const stats = (messages?.about as any)?.stats || [];

  return (
    <div className="w-[85%] max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/5 py-10"
      >
        {stats.map((item: any, i: number) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center gap-2 px-6 py-6 sm:py-0 text-center"
          >
            <span className="text-[clamp(2.2rem,5vw,3.2rem)] font-bold font-title bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
              {item.value}
            </span>
            <span className="text-sm text-gray-400">{item.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
