"use client";

import CustomLink from "@/core/components/custom-link/CustomLink";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

// ─────────────────────────────────────────────
// Ilustración lateral — mockup de chat con
// burbujas de conversación con fade-in
// escalonado, y chips flotantes de refuerzo
// ─────────────────────────────────────────────
function ContactIllustration() {
  const messages = [
    { from: "them", text: "Hola 👋 ¿En qué podemos ayudarte?" },
    { from: "me", text: "Necesito cotizar un servicio" },
    { from: "them", text: "Con gusto, un asesor te contacta en minutos" },
  ];

  const chips = [
    { label: "Respuesta rápida", pos: "top-0 -left-2 sm:-left-12" },
    { label: "Atención personalizada", pos: "bottom-6 -right-2 sm:-right-12" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[380px]">
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-56 w-56 rounded-full bg-gradient-to-tr from-teal-500/25 to-sky-500/25 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden"
      >
        <div className="flex items-center gap-3 border-b border-white/10 bg-white/5 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-teal-500 to-sky-500">
            <svg
              className="h-5 w-5 text-black"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M4 4h16v12H8l-4 4V4z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white/90">Sit+ · Chat</p>
            <p className="text-xs text-white/40">En línea ahora</p>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-3">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.2 }}
              className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <span
                className={`
                  max-w-[85%] rounded-2xl px-4 py-2 text-sm
                  ${
                    msg.from === "me"
                      ? "bg-gradient-to-r from-teal-500 to-sky-500 text-black font-medium"
                      : "bg-white/10 text-white/80"
                  }
                `}
              >
                {msg.text}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {chips.map((chip, i) => (
        <motion.div
          key={chip.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 0.15, duration: 0.6 }}
          className={`
            absolute ${chip.pos}
            flex items-center gap-2 rounded-xl border border-white/10
            bg-white/5 backdrop-blur-xl px-3 py-2 shadow-lg shadow-black/30
          `}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
          <span className="text-xs font-medium text-white/80">
            {chip.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

export default function ContactHero() {
  const t = useTranslations("contact.hero");

  const phone = "524431234567";
  const whatsappUrl = `https://wa.me/${phone}`;

  return (
    <section className="relative w-[85%] max-w-7xl flex flex-col lg:flex-row items-center gap-14 mt-16 lg:mt-8">
      <div className="pointer-events-none absolute inset-0 -z-10 flex justify-center">
        <div className="w-[520px] h-[520px] bg-gradient-to-tr from-teal-600/30 to-sky-600/30 blur-[160px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-1 flex-col items-center lg:items-start text-center lg:text-left gap-6"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-1.5 text-xs font-medium text-teal-300">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l1.9 5.4L19 9l-5.1 1.6L12 16l-1.9-5.4L5 9l5.1-1.6L12 2z" />
          </svg>
          {t("badge")}
        </span>

        <h1 className="text-[clamp(2.4rem,5vw,4.2rem)] font-bold leading-tight font-title">
          {t("title")}
        </h1>

        <p className="text-gray-300 max-w-xl text-[clamp(1.05rem,1.6vw,1.25rem)]">
          {t("desc1")}
          <br />
          {t("desc2")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto">
          <div className="w-full sm:w-auto">
            <CustomLink
              url={whatsappUrl}
              appearance="blueGreenBg"
              size="md"
              fullWidth
            >
              {t("ctaWhatsapp")}
            </CustomLink>
          </div>
          <div className="w-full sm:w-auto">
            <CustomLink
              url="#formulario"
              appearance="darkOutline"
              size="md"
              fullWidth
            >
              {t("ctaSecondary")}
            </CustomLink>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="flex-1 flex justify-center"
      >
        <ContactIllustration />
      </motion.div>
    </section>
  );
}
