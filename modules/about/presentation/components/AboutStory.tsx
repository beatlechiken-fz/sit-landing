"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function AboutStory() {
  const t = useTranslations("about");

  return (
    <div
      id="historia"
      className="w-[85%] max-w-6xl flex flex-col items-center gap-14 scroll-mt-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center gap-4 max-w-3xl"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
          {t("storyEyebrow")}
        </span>
        <h2 className="text-[clamp(2rem,5vw,3.2rem)] font-bold font-title">
          <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
            {t("storyTitle")}
          </span>
        </h2>
        <p className="text-gray-400 text-base sm:text-lg">
          {t("storyParagraph1")}
        </p>
        <p className="text-gray-400 text-base sm:text-lg">
          {t("storyParagraph2")}
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-2xl bg-white/5 border border-white/10 transition hover:-translate-y-2 hover:border-teal-400/40"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-400/10 mb-5">
            <svg
              className="h-6 w-6 text-teal-300"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-2">{t("missionTitle")}</h3>
          <p className="text-sm text-gray-400">{t("missionText")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-8 rounded-2xl bg-white/5 border border-white/10 transition hover:-translate-y-2 hover:border-teal-400/40"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-400/10 mb-5">
            <svg
              className="h-6 w-6 text-teal-300"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-2">{t("visionTitle")}</h3>
          <p className="text-sm text-gray-400">{t("visionText")}</p>
        </motion.div>
      </div>
    </div>
  );
}
