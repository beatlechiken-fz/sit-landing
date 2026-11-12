"use client";

import { motion } from "framer-motion";
import CustomLink from "@/core/components/custom-link/CustomLink";
import { useTranslations, useMessages } from "next-intl";

type Tier = {
  key?: string;
  name: string;
  desc: string;
  price: string;
  items: string[];
  highlight?: boolean;
  btn: string;
  whatsappMsg: string;
};

export default function IATiers() {
  const t = useTranslations("ia");
  const messages = useMessages();
  const phone = "524431234567";
  const tiers =
    (messages?.ia as { tiers?: Tier[] } | undefined)?.tiers ?? [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      id="tiers"
      className="w-[85%] max-w-7xl flex flex-col items-center gap-10 scroll-mt-24"
    >
      <div className="flex flex-col items-center text-center gap-3">
        <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
          {t("tiersEyebrow")}
        </span>
        <h2 className="text-[clamp(2rem,5vw,3.8rem)] font-bold font-title">
          <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
            {t("tiersTitle")}
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-full">
        {tiers.map((tier, i) => {
          const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(tier.whatsappMsg)}`;
          return (
            <div
              key={tier.key ?? i}
              className={`flex flex-col rounded-2xl p-8 border transition hover:-translate-y-2 hover:border-teal-400/40 ${
                tier.highlight
                  ? "bg-gradient-to-br from-teal-600/20 to-sky-600/20 border-teal-400/30 scale-[1.03]"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <h3 className="text-xl font-bold text-center">{tier.name}</h3>
              <p className="text-center text-gray-400 mt-2">{tier.desc}</p>

              <div className="text-center my-6 text-lg font-bold text-teal-400">
                {tier.price}
              </div>

              <ul className="space-y-3 text-gray-300 mb-8">
                {tier.items.map((item: string, idx: number) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>

              <div className="mt-auto w-full sm:w-auto">
                <CustomLink
                  url={whatsappUrl}
                  appearance={tier.highlight ? "blueGreenBg" : "darkOutline"}
                  size="lg"
                  fullWidth
                >
                  {tier.btn}
                </CustomLink>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-gray-500 text-center max-w-xl">
        {t("tiersNote")}
      </p>
    </motion.section>
  );
}
