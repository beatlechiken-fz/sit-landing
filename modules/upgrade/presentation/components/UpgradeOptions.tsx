"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations, useMessages } from "next-intl";
import Images from "@/core/assets/Images";

const IMAGES = [
  Images.upgradeSsd,
  Images.upgradeRam,
  Images.upgradeGpu,
  Images.upgradeDisk,
];

// Íconos de respaldo por categoría — se muestran si la
// imagen real (Images.upgradeXxx) aún no fue subida (404).
const FALLBACK_ICONS: React.ReactNode[] = [
  // SSD / NVMe
  <>
    <rect x="3" y="7" width="18" height="10" rx="2" />
    <path d="M7 7V5" />
    <path d="M12 7V5" />
    <path d="M17 7V5" />
  </>,
  // Memoria RAM
  <>
    <rect x="4" y="5" width="16" height="14" rx="1.5" />
    <path d="M8 5v3" />
    <path d="M12 5v3" />
    <path d="M16 5v3" />
    <path d="M8 16v3" />
    <path d="M12 16v3" />
    <path d="M16 16v3" />
  </>,
  // Tarjeta gráfica
  <>
    <rect x="3" y="6" width="18" height="9" rx="1.5" />
    <circle cx="8" cy="10.5" r="1.5" />
    <circle cx="13" cy="10.5" r="1.5" />
    <path d="M3 18h10" />
  </>,
  // Discos secundarios
  <>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 3v2" />
  </>,
];

function OptionCard({
  title,
  desc,
  image,
  icon,
  index,
}: {
  title: string;
  desc: string;
  image: string;
  icon: React.ReactNode;
  index: number;
}) {
  const [errored, setErrored] = useState(false);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-teal-400/40 transition-colors"
    >
      <div className="relative flex h-40 items-center justify-center bg-black/30 p-6">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-teal-400/10 to-sky-400/10 blur-xl" />
        </div>
        {!errored ? (
          <Image
            src={image}
            alt={title}
            width={96}
            height={96}
            onError={() => setErrored(true)}
            className="relative z-10 object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <svg
            className="relative z-10 h-12 w-12 text-white/20"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            {icon}
          </svg>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-6 border-t border-white/10">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-gray-400">{desc}</p>
      </div>
    </motion.div>
  );
}

export default function UpgradeOptions() {
  const t = useTranslations("upgrade");
  const messages = useMessages();
  const upgrades = (messages?.upgrade as any)?.options || [];

  return (
    <section
      id="opciones"
      className="w-[85%] max-w-6xl flex flex-col items-center gap-14 scroll-mt-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center gap-3"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
          {t("optionsEyebrow")}
        </span>
        <h2 className="text-[clamp(2rem,5vw,3.2rem)] font-bold font-title">
          <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
            {t("optionsTitle")}
          </span>
        </h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
      >
        {upgrades.map((item: any, i: number) => (
          <OptionCard
            key={i}
            title={item.title}
            desc={item.desc}
            image={IMAGES[i]}
            icon={FALLBACK_ICONS[i]}
            index={i}
          />
        ))}
      </motion.div>
    </section>
  );
}
