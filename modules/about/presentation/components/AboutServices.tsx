"use client";

import { motion } from "framer-motion";
import { useMessages, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const HREFS = ["/fix", "/maintenance", "/upgrade", "/apps", "/parts"];

const ICONS: React.ReactNode[] = [
  // Reparación (llave inglesa)
  <>
    <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2-2 2.4-2.4z" />
  </>,
  // Mantenimiento (velocímetro)
  <>
    <path d="M4 15a8 8 0 1 1 16 0" />
    <path d="M12 15l3.5-4.5" />
    <circle cx="12" cy="15" r="0.5" />
  </>,
  // Actualización (rayo)
  <>
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
  </>,
  // Apps a la medida (code brackets)
  <>
    <path d="M9 6 3 12l6 6" />
    <path d="M15 6l6 6-6 6" />
  </>,
  // Refacciones (caja)
  <>
    <path d="M21 8 12 3 3 8l9 5 9-5z" />
    <path d="M3 8v9l9 5 9-5V8" />
    <path d="M12 13v9" />
  </>,
];

export default function AboutServices() {
  const t = useTranslations("about");
  const messages = useMessages();
  const services = (messages?.about as any)?.services || [];

  return (
    <div className="w-[85%] max-w-6xl flex flex-col items-center gap-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center gap-3"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
          {t("servicesEyebrow")}
        </span>
        <h2 className="text-[clamp(2rem,5vw,3.2rem)] font-bold font-title">
          <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
            {t("servicesTitle")}
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl">{t("servicesDesc")}</p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 w-full"
      >
        {services.map((item: any, i: number) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Link
              href={HREFS[i]}
              className="group flex flex-col h-full gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 transition hover:-translate-y-2 hover:border-teal-400/40"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-400/10">
                <svg
                  className="h-6 w-6 text-teal-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  {ICONS[i]}
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-teal-300 opacity-0 group-hover:opacity-100 transition">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
