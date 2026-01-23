"use client";

import { useTranslations } from "next-intl";
import {
  createMenuNavElement,
  MenuNavElement,
} from "@/core/components/app-bar/menuFactory";
import { motion } from "framer-motion";

export default function FooterBar() {
  const t = useTranslations("footer");

  const socialLinks = [
    {
      id: "whatsapp",
      href: "#",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a9.9 9.9 0 0 0-8.6 14.9L2 22l5.3-1.4A9.9 9.9 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.1l-.3-.2-3.1.8.8-3-.2-.3a8.2 8.2 0 1 1 7.1 3.8zm4.5-6.2c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.1.2-.6.8-.7.9-.1.1-.3.2-.5.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.6-1.4-1.8-.1-.2 0-.4.1-.5.1-.1.2-.3.3-.4.1-.1.1-.2.2-.3.1-.1 0-.3 0-.4-.1-.1-.5-1.3-.7-1.7-.2-.4-.4-.4-.5-.4h-.4c-.1 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.4 3.9 3.4.5.2.9.4 1.3.5.5.2.9.1 1.2.1.4-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.4-.3z" />
        </svg>
      ),
    },
    {
      id: "youtube",
      href: "#",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.5 6.2s-.2-1.7-.8-2.4c-.8-.9-1.7-.9-2.1-.9C17.7 2.6 12 2.6 12 2.6h0s-5.7 0-8.6.3c-.4 0-1.3 0-2.1.9-.6.7-.8 2.4-.8 2.4S0 8.1 0 10.1v1.9c0 2 .5 3.9.5 3.9s.2 1.7.8 2.4c.8.9 1.9.9 2.4 1 1.8.2 7.3.3 7.3.3s5.7 0 8.6-.3c.4 0 1.3 0 2.1-.9.6-.7.8-2.4.8-2.4s.5-1.9.5-3.9v-1.9c0-2-.5-3.9-.5-3.9zM9.5 14.9V8.7l6.3 3.1-6.3 3.1z" />
        </svg>
      ),
    },
    {
      id: "instagram",
      href: "#",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3.2A4.8 4.8 0 1 0 16.8 12 4.8 4.8 0 0 0 12 7.2zm0 7.8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm4.8-8.6a1.1 1.1 0 1 1-1.1-1.1 1.1 1.1 0 0 1 1.1 1.1z" />
        </svg>
      ),
    },
    {
      id: "tiktok",
      href: "#",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.7 2h-2.9v13.2c0 1.5-1.2 2.7-2.7 2.7s-2.7-1.2-2.7-2.7 1.2-2.7 2.7-2.7c.3 0 .6.1.9.1V9.7c-.3 0-.6-.1-.9-.1-3.1 0-5.6 2.5-5.6 5.6s2.5 5.6 5.6 5.6 5.6-2.5 5.6-5.6V7.5c.8.6 1.8 1 2.9 1V5.7c-1.6-.1-2.9-1.4-2.9-2.9z" />
        </svg>
      ),
    },
    {
      id: "facebook",
      href: "#",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.1V12h2.1V9.8c0-2.1 1.2-3.3 3.1-3.3.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.3V12h2.2l-.4 2.9h-1.8v7A10 10 0 0 0 22 12z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-black text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10">
        {/* Redes sociales */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center gap-6"
        >
          {socialLinks.map((s) => (
            <a
              key={s.id}
              href={s.href}
              aria-label={s.id}
              className="text-white/70 hover:text-white hover:scale-110 transition"
            >
              {s.icon}
            </a>
          ))}
        </motion.div>

        {/* Texto final */}
        <div className="text-xs text-center text-white/50">{t("rights")}</div>
      </div>
    </footer>
  );
}
