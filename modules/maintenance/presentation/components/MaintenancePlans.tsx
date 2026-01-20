"use client";

import { motion } from "framer-motion";
import CustomLink from "@/core/components/custom-link/CustomLink";
import { useTranslations, useMessages } from "next-intl";

export default function MaintenancePlans() {
  const t = useTranslations("maintenance");
  const messages = useMessages();
  const phone = "524431234567";
  // Get plans from translations file
  const plans = (messages?.maintenance as any)?.plans || [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      id="plans"
      className="w-[85%] max-w-7xl flex flex-col items-center gap-16"
    >
      <h2 className="text-[clamp(2rem,5vw,3.8rem)] font-bold text-center">
        <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
          {t("plansTitle")}
        </span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-full">
        {plans.map((p: any, i: number) => {
          const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(p.whatsappMsg)}`;
          return (
            <div
              key={i}
              className={`flex flex-col rounded-2xl p-8 border ${
                p.highlight
                  ? "bg-gradient-to-br from-teal-600/20 to-sky-600/20 border-teal-400/30 scale-[1.03]"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <h3 className="text-xl font-bold text-center">{p.name}</h3>
              <p className="text-center text-gray-400 mt-2">{p.desc}</p>

              <div className="text-center my-6 text-4xl font-extrabold text-teal-400">
                {p.price}
              </div>

              <ul className="space-y-3 text-gray-300 mb-8">
                {p.items.map((item: string, idx: number) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mt-auto w-full sm:w-auto"
              >
                <CustomLink
                  url={whatsappUrl}
                  appearance={p.highlight ? "blueGreenBg" : "darkOutline"}
                  size="lg"
                  fullWidth
                >
                  {p.btn || t("ctaBtnWhatsapp")}
                </CustomLink>
              </motion.div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
