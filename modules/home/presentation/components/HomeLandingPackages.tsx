"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { HomeCTAButton } from "./HomeCTAButton";

export default function HomeLandingPackages() {
  const t = useTranslations("homeV2.landingDev");
  const tl = useTranslations("landing");

  const plans = [
    {
      key: "start",
      name: tl("startPlan"),
      price: tl("startPlanPrice"),
      items: tl.raw("startPlanItems") as string[],
      highlight: false,
    },
    {
      key: "pro",
      name: tl("proPlan"),
      price: tl("proPlanPrice"),
      items: tl.raw("proPlanItems") as string[],
      highlight: true,
    },
    {
      key: "enterprise",
      name: tl("enterprisePlan"),
      price: tl("enterprisePlanPrice"),
      items: tl.raw("enterprisePlanItems") as string[],
      highlight: false,
    },
  ];

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
          <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
            {t("title2")}
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl">{t("desc")}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`
              flex flex-col rounded-2xl p-8 border
              ${
                plan.highlight
                  ? "bg-gradient-to-br from-teal-600/20 to-sky-600/20 border-teal-400/30"
                  : "bg-white/5 border-white/10"
              }
            `}
          >
            <h3 className="text-lg font-bold text-center">{plan.name}</h3>
            <div className="text-center my-5">
              <span className="text-3xl font-extrabold text-teal-400">
                {plan.price}
              </span>
              <span className="text-sm text-gray-400 ml-1">MXN</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              {plan.items.slice(0, 3).map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <HomeCTAButton href="/landing">
        {t("cta")}
        <span aria-hidden>→</span>
      </HomeCTAButton>
    </section>
  );
}
