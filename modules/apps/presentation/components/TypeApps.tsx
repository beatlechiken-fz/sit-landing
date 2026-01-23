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
    <section className="w-[85%] max-w-7xl flex flex-col items-center">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-[clamp(2rem,5vw,3.5rem)] font-bold mb-16 text-center"
      >
        <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent font-title">
          {t("appsType1")}
        </span>
      </motion.h2>

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
        {cards.map((card, i) => (
          <motion.div
            key={card.key}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="
              rounded-2xl bg-white/5 backdrop-blur
              border border-white/10 p-8
              hover:border-teal-400/40 hover:-translate-y-2 transition
              text-center md:text-left
            "
          >
            <h3 className="text-xl font-bold mb-3">{card.title}</h3>

            <p className="text-gray-400 mb-6">{card.desc}</p>

            <ul className="space-y-3 text-gray-300">
              {card.items.map((item, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 items-start justify-center md:justify-start"
                >
                  <Image src={Icons.plusGreen} alt="" width={16} height={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
