"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import CustomLink from "@/core/components/custom-link/CustomLink";
import Icons from "@/core/assets/Icons";
import { useTranslations } from "next-intl";
import { HomeCTAButton } from "@/modules/home/presentation/components/HomeCTAButton";

export default function DevApps() {
  const t = useTranslations("apps");

  const phone = "524431234567";
  const message =
    "Hola, me gustaría más información sobre el desarrollo de una app.";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    message,
  )}`;

  const items = [
    { label: "iOS", icon: Icons.ios },
    { label: "Android", icon: Icons.android },
    { label: "Web", icon: Icons.web },
    { label: "IA", icon: Icons.iaPowered },
    { label: "macOS", icon: Icons.macos },
    { label: "Windows", icon: Icons.windows },
  ];

  return (
    <section className="relative w-full flex flex-col mt-[76px] gap-16">
      <div className="relative min-h-[calc(100vh-76px)] flex items-center overflow-hidden">
        <Image
          src="/img/hero/apps.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0F] via-[#0B0B0F]/90 to-[#0B0B0F]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-transparent to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-[85%] max-w-7xl mx-auto flex flex-col items-center lg:items-start text-center lg:text-left gap-6 py-20"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-1.5 text-xs font-medium text-teal-300">
            <svg
              className="h-3.5 w-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l1.9 5.4L19 9l-5.1 1.6L12 16l-1.9-5.4L5 9l5.1-1.6L12 2z" />
            </svg>
            {t("heroBadge")}
          </span>

          <h1 className="text-[clamp(2.4rem,5vw,4.2rem)] font-bold leading-tight font-title text-white">
            {t("apps1")}
            <br />
            {t("apps2")}
          </h1>

          <p className="text-gray-200 max-w-xl text-[clamp(1.05rem,1.6vw,1.25rem)]">
            {t("apps3")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto">
            <div className="w-full sm:w-auto">
              <CustomLink
                url={whatsappUrl}
                appearance="blueGreenBg"
                size="md"
                fullWidth
              >
                {t("appsQuote")}
              </CustomLink>
            </div>
            <HomeCTAButton href="/apps#tipos" variant="outline">
              {t("heroCtaSecondary")}
            </HomeCTAButton>
          </div>
        </motion.div>
      </div>

      {/* Plataformas */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="w-[85%] max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {items.map((item) => (
          <motion.div
            key={item.label}
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 },
            }}
            className="
              flex items-center justify-center gap-3
              bg-white/5 border border-white/10
              rounded-xl px-4 py-3
              transition hover:scale-[1.03] hover:border-teal-400/40
            "
          >
            <Image src={item.icon} alt="" width={22} height={22} />
            <span className="text-gray-300 font-medium text-sm">
              {item.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
