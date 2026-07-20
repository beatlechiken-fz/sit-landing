"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Images from "@/core/assets/Images";

const IMAGES = [
  Images.fixComputers,
  Images.fixPhones,
  Images.fixPrinters,
  Images.fixUpgrades,
];

// Íconos de respaldo por categoría — se muestran si la
// imagen real (Images.fixXxx) aún no fue subida (404).
const FALLBACK_ICONS: React.ReactNode[] = [
  // Computadoras & Laptops
  <>
    <rect x="4" y="4" width="16" height="11" rx="1.5" />
    <path d="M2 19h20" />
  </>,
  // Celulares
  <>
    <rect x="7" y="2" width="10" height="20" rx="2" />
    <path d="M11 18h2" />
  </>,
  // Impresoras
  <>
    <path d="M6 9V3h12v6" />
    <rect x="4" y="9" width="16" height="8" rx="1.5" />
    <path d="M6 17v4h12v-4" />
  </>,
  // Actualizaciones
  <>
    <rect x="7" y="7" width="10" height="10" rx="1" />
    <path d="M12 2v3" />
    <path d="M12 19v3" />
    <path d="M2 12h3" />
    <path d="M19 12h3" />
  </>,
];

function ServiceCard({
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
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-gray-400">{desc}</p>
      </div>
    </motion.div>
  );
}

export default function FixServices() {
  const t = useTranslations("fixServices");
  const services = t.raw("services");

  return (
    <section id="servicios" className="w-[85%] max-w-7xl flex flex-col items-center gap-16 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center gap-3"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
          {t("eyebrow")}
        </span>
        <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold font-title">
          <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
            {t("title")}
          </span>
        </h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
      >
        {services.map((s: any, i: number) => (
          <ServiceCard
            key={i}
            title={s.title}
            desc={s.desc}
            image={IMAGES[i]}
            icon={FALLBACK_ICONS[i]}
            index={i}
          />
        ))}
      </motion.div>
    </section>
  );
}
