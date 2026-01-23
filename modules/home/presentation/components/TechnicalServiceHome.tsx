"use client";

import { motion } from "framer-motion";
import CustomLink from "@/core/components/custom-link/CustomLink";
import { useMessages, useTranslations } from "next-intl";

type TechServiceCard = {
  title: string;
  desc: string;
};

export default function TechnicalServiceHome() {
  const t = useTranslations("home");
  const messages = useMessages();

  const cards = (messages?.home as any)?.techServiceCards as TechServiceCard[];

  const phone = "524431234567";
  const message = "Hola, me gustaría cotizar un servicio técnico.";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    message,
  )}`;

  return (
    <section className="w-[85%] max-w-7xl flex flex-col items-center gap-16">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-[clamp(2rem,5vw,4rem)] font-bold text-center"
      >
        <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent font-title">
          {t("techService1")}
        </span>
      </motion.h2>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
      >
        {cards.map((card, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center
                       hover:border-teal-400/40 hover:-translate-y-2 transition"
          >
            <h3 className="text-xl font-bold mb-4">{card.title}</h3>
            <p className="text-gray-400">{card.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="w-full sm:w-auto">
        <CustomLink
          url={whatsappUrl}
          appearance="blueGreenBg"
          size="md"
          fullWidth
        >
          {t("techServiceQuote")}
        </CustomLink>
      </div>
    </section>
  );
}
