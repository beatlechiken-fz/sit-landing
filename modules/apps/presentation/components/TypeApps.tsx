"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Icons from "@/core/assets/Icons";
import { useMessages, useTranslations } from "next-intl";

type TypeAppCard = {
  key: string;
  title: string;
  desc: string;
  items: string[];
};

export default function TypeApps() {
  const t = useTranslations("apps");
  const messages = useMessages();

  // 👉 Obtenemos las cards desde el JSON
  const cards = (messages?.apps as any)?.appsTypeCards as TypeAppCard[];

  return (
    <section id="tipos" className="w-[85%] max-w-7xl flex flex-col items-center scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center gap-3 mb-16"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
          {t("typeEyebrow")}
        </span>
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold font-title">
          <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
            {t("appsType1")}
          </span>
        </h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: {
            transition: { staggerChildren: 0.15 },
          },
        }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 w-full"
      >
        {cards.map((card, i) => {
          const highlight = card.key === "ai";
          return (
            <motion.div
              key={card.key}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`
                relative rounded-2xl backdrop-blur p-8
                border hover:-translate-y-2 transition
                text-center md:text-left
                ${
                  highlight
                    ? "bg-gradient-to-br from-teal-600/20 to-sky-600/20 border-teal-400/30"
                    : "bg-white/5 border-white/10 hover:border-teal-400/40"
                }
              `}
            >
              {highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 rounded-full bg-gradient-to-r from-teal-400 to-sky-400 px-3 py-1 text-[11px] font-bold text-black">
                  IA
                </span>
              )}

              <h3 className="text-xl font-bold mb-3">{card.title}</h3>

              <p className="text-gray-400 mb-6">{card.desc}</p>

              <ul className="space-y-3 text-gray-300">
                {card.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex gap-3 items-start justify-center md:justify-start"
                  >
                    <Image
                      src={Icons.plusGreen}
                      alt=""
                      width={16}
                      height={16}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
