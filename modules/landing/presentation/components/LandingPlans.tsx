"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Icons from "@/core/assets/Icons";
import { useLanding } from "@/modules/home/presentation/store/useLanding";
import CustomLink from "@/core/components/custom-link/CustomLink";

export default function LandingPlans() {
  const t = useTranslations("landing");
  const lang = useLanding((state) => state.lang);

  const getItems = (key: string) => t.raw(`${key}PlanItems`);

  const phone = "524431234567";

  const getWhatsappUrl = (messageKey: string) => {
    const message = t(`whatsapp.${messageKey}`);
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section id="plans" className="w-full max-w-7xl px-6 py-24 mx-auto">
      {/* Title */}
      <h2 className="text-[clamp(2.2rem,5vw,3.8rem)] font-bold mb-16 text-center animate-fadeIn">
        <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
          {t("plansTitle")}
        </span>
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">
        {/* START */}
        <PlanCard
          title={t("startPlan")}
          price={t("startPlanPrice")}
          desc={t("startPlanDesc")}
          items={getItems("start")}
          button={t("startPlanBtn")}
          whatsappUrl={getWhatsappUrl("start")}
        />

        {/* PRO */}
        <PlanCard
          highlighted
          title={t("proPlan")}
          price={t("proPlanPrice")}
          desc={t("proPlanDesc")}
          items={getItems("pro")}
          button={t("proPlanBtn")}
          whatsappUrl={getWhatsappUrl("pro")}
        />

        {/* ENTERPRISE */}
        <PlanCard
          title={t("enterprisePlan")}
          price={t("enterprisePlanPrice")}
          desc={t("enterprisePlanDesc")}
          items={getItems("enterprise")}
          button={t("enterprisePlanBtn")}
          whatsappUrl={getWhatsappUrl("enterprise")}
          outline
        />
      </div>
    </section>
  );
}

function PlanCard({
  title,
  price,
  desc,
  items,
  button,
  highlighted = false,
  outline = false,
  whatsappUrl,
}: any) {
  return (
    <div
      className={`
        h-full flex flex-col rounded-2xl p-8
        ${
          highlighted
            ? "bg-gradient-to-br from-teal-600/20 to-sky-600/20 border border-teal-400/30 scale-[1.03] shadow-xl"
            : "bg-white/5 backdrop-blur border border-white/10 hover:border-teal-400/40"
        }
        transition animate-fadeIn
      `}
    >
      <h3 className="text-xl font-bold mb-2 text-center">{title}</h3>

      <div className="text-center my-6">
        <span className="text-4xl font-extrabold text-teal-400">{price}</span>
        <span className="text-sm text-gray-400 ml-1">MXN</span>
      </div>

      <p className="text-gray-400 text-center mb-6">{desc}</p>

      <ul className="space-y-3 text-gray-300 mb-8">
        {items.map((item: string, i: number) => (
          <li key={i} className="flex gap-3">
            <Image src={Icons.plusGreen} alt="" width={18} height={18} />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto w-full sm:w-auto">
        <CustomLink
          url={whatsappUrl}
          appearance={outline ? "darkOutline" : "blueGreenBg"}
          fullWidth
          size="lg"
        >
          {button}
        </CustomLink>
      </div>
    </div>
  );
}
