"use client";

import { motion } from "framer-motion";
import { useMessages, useTranslations } from "next-intl";
import CustomLink from "@/core/components/custom-link/CustomLink";
import { HomeCTAButton } from "./HomeCTAButton";

type IAService = {
  title: string;
  desc: string;
};

export default function HomeIASection() {
  const t = useTranslations("homeV2.ia");
  const messages = useMessages();
  const services = (
    (messages?.ia as { services?: IAService[] } | undefined)?.services ?? []
  ).slice(0, 3);

  const phone = "524431234567";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    t("whatsappMsg"),
  )}`;

  return (
    <section className="w-[85%] max-w-7xl flex flex-col items-center gap-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center gap-4"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
          {t("eyebrow")}
        </span>
        <h2 className="text-[clamp(2rem,4.5vw,3.4rem)] font-bold leading-tight font-title">
          {t("title1")}{" "}
          
            {t("title2")}
          
        </h2>
        <p className="text-gray-400 max-w-2xl">{t("desc")}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {services.map((service, i) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={
              i === 0
                ? "md:col-span-2 flex flex-col justify-center gap-2 rounded-2xl p-8 border border-teal-400/30 bg-teal-400/5 hover:border-teal-400/50 transition-colors"
                : "flex flex-col gap-2 rounded-2xl p-6 border border-white/10 bg-white/5 hover:border-teal-400/40 transition-colors"
            }
          >
            <h3 className={i === 0 ? "text-xl font-bold" : "text-lg font-bold"}>
              {service.title}
            </h3>
            <p className="text-gray-400 text-sm max-w-md">{service.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <HomeCTAButton href="/ia">
          {t("ctaPrimary")}
          <span aria-hidden>→</span>
        </HomeCTAButton>
        <div className="w-full sm:w-auto">
          <CustomLink
            url={whatsappUrl}
            appearance="darkOutline"
            size="md"
            fullWidth
          >
            {t("ctaSecondary")}
          </CustomLink>
        </div>
      </div>
    </section>
  );
}
