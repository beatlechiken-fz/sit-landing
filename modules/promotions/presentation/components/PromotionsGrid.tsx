"use client";

import { motion } from "framer-motion";
import { promotionsFeb } from "@/core/mocked-data/promotions-feb";
import { useTranslations } from "next-intl";

export default function PromotionsGrid() {
  const t = useTranslations("promotions");

  return (
    <div className="w-[90%] max-w-6xl mx-auto">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {promotionsFeb.map((promo, i) => (
          <motion.div
            key={promo.id}
            className="
              rounded-2xl 
              bg-white/5 
              border border-white/10 
              p-6 
              pt-10
              relative
            "
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -6, scale: 1.02 }}
          >
            {/* Glow */}
            <div
              className="
                pointer-events-none 
                absolute inset-0 
                rounded-2xl 
                opacity-0 
                hover:opacity-100 
                transition
                bg-gradient-to-br 
                from-pink-500/10 
                to-transparent
              "
            />

            {/* Badge */}
            <span className="absolute top-4 right-4 text-xs bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full">
              {t(`badges.${promo.badgeKey}`)}
            </span>

            <h3 className="text-xl font-bold mb-1">
              {t(`${promo.key}.title`)}
            </h3>

            <p className="text-sm text-gray-400 mb-4">
              {t(`${promo.key}.subtitle`)}
            </p>

            <p className="text-3xl font-extrabold text-pink-400 mb-4">
              {promo.price}
            </p>

            <p className="text-gray-400 text-sm mb-4">
              {t(`${promo.key}.description`)}
            </p>

            <ul className="text-sm text-gray-300 space-y-2 mb-6">
              {promo.includesKeys.map((inc) => (
                <li key={inc}>• {t(`includes.${inc}`)}</li>
              ))}
            </ul>

            <p className="text-xs text-gray-500">
              {t("expires")} {promo.validUntil} {t("month")}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
