"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Icons from "@/core/assets/Icons";
import CustomLink from "@/core/components/custom-link/CustomLink";

type PackageKey = "basic" | "pro" | "store";

export default function CustomLandingPackages() {
  const t = useTranslations("customLanding");
  const phone = "524431234567";

  const getWhatsappUrl = (key: PackageKey) => {
    const message = t(`whatsapp.${key}`);
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const packages: {
    key: PackageKey;
    name: string;
    setupPrice: string;
    maintenancePrice: string;
    desc: string;
    items: string[];
    fairUse: string;
    btn: string;
    highlighted?: boolean;
  }[] = [
    {
      key: "basic",
      name: t("basicPlan"),
      setupPrice: t("basicSetupPrice"),
      maintenancePrice: t("basicMaintenancePrice"),
      desc: t("basicDesc"),
      items: t.raw("basicItems"),
      fairUse: t("basicFairUse"),
      btn: t("basicBtn"),
    },
    {
      key: "pro",
      name: t("proPlan"),
      setupPrice: t("proSetupPrice"),
      maintenancePrice: t("proMaintenancePrice"),
      desc: t("proDesc"),
      items: t.raw("proItems"),
      fairUse: t("proFairUse"),
      btn: t("proBtn"),
      highlighted: true,
    },
    {
      key: "store",
      name: t("storePlan"),
      setupPrice: t("storeSetupPrice"),
      maintenancePrice: t("storeMaintenancePrice"),
      desc: t("storeDesc"),
      items: t.raw("storeItems"),
      fairUse: t("storeFairUse"),
      btn: t("storeBtn"),
    },
  ];

  return (
    <section
      id="packages"
      className="w-full max-w-7xl px-6 py-24 mx-auto scroll-mt-24"
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center gap-3 mb-6"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
          {t("packagesEyebrow")}
        </span>
        <h2 className="text-[clamp(2.2rem,5vw,3.8rem)] font-bold font-title">
          <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
            {t("packagesTitle")}
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl">{t("packagesSubtitle")}</p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch mt-10">
        {packages.map((pkg) => (
          <div
            key={pkg.key}
            className={`
              h-full flex flex-col rounded-2xl p-8
              ${
                pkg.highlighted
                  ? "bg-gradient-to-br from-teal-600/20 to-sky-600/20 border border-teal-400/30 scale-[1.03] shadow-xl"
                  : "bg-white/5 backdrop-blur border border-white/10 hover:border-teal-400/40"
              }
              transition animate-fadeIn
            `}
          >
            <h3 className="text-xl font-bold mb-2 text-center">{pkg.name}</h3>

            <div className="text-center my-6 flex flex-col gap-1">
              <div>
                <span className="text-4xl font-extrabold text-teal-400">
                  {pkg.setupPrice}
                </span>
                <span className="text-sm text-gray-400 ml-1">
                  MXN {t("setupLabel")}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                + {pkg.maintenancePrice} MXN/mes ({t("maintenanceLabel")})
              </div>
            </div>

            <p className="text-gray-400 text-center mb-6">{pkg.desc}</p>

            <ul className="space-y-3 text-gray-300 mb-4">
              {pkg.items.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <Image
                    src={Icons.plusGreen}
                    alt=""
                    width={18}
                    height={18}
                    className="shrink-0 mt-0.5"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-xs text-gray-500 mb-6 italic">{pkg.fairUse}</p>

            <div className="mt-auto w-full sm:w-auto">
              <CustomLink
                url={getWhatsappUrl(pkg.key)}
                appearance={pkg.highlighted ? "blueGreenBg" : "darkOutline"}
                fullWidth
                size="lg"
              >
                {pkg.btn}
              </CustomLink>
            </div>
          </div>
        ))}
      </div>

      {/* Nota de pago */}
      <p className="mt-10 text-center text-sm text-gray-500 max-w-3xl mx-auto">
        {t("paymentNote")}
      </p>

      {/* Nota de dominio y hosting (aparte del mantenimiento) */}
      <p className="mt-3 text-center text-sm text-gray-500 max-w-3xl mx-auto">
        {t("hostingNote")}
      </p>

      {/* Nota de escalado por demanda */}
      <div className="mt-8 rounded-2xl border border-teal-400/20 bg-teal-400/5 p-6 sm:p-8 max-w-4xl mx-auto">
        <h4 className="font-semibold text-teal-300 mb-2 flex items-center gap-2">
          <svg
            className="h-5 w-5 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          {t("scalingNoteTitle")}
        </h4>
        <p className="text-gray-400 text-sm leading-relaxed">
          {t("scalingNoteDesc")}
        </p>
      </div>
    </section>
  );
}
