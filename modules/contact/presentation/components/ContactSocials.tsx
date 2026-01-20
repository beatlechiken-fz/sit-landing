"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const icons = {
  whatsapp: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M20.52 3.48A11.91 11.91 0 0012.06 0C5.45 0 .06 5.39.06 12c0 2.11.55 4.17 1.6 6L0 24l6.2-1.63A11.94 11.94 0 0012.06 24C18.67 24 24 18.61 24 12a11.9 11.9 0 00-3.48-8.52zM12.06 22a9.9 9.9 0 01-5.05-1.39l-.36-.22-3.68.97.98-3.58-.24-.37A9.86 9.86 0 1122 12a9.94 9.94 0 01-9.94 10zm5.5-7.42c-.3-.15-1.77-.87-2.05-.97-.28-.1-.49-.15-.7.15-.2.3-.8.97-.98 1.17-.18.2-.36.22-.66.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.46.13-.6.13-.13.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.7-1.68-.96-2.3-.25-.6-.5-.52-.7-.53h-.6c-.2 0-.52.07-.8.37-.28.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.23 5.13 4.53.72.3 1.28.48 1.72.62.72.23 1.38.2 1.9.12.58-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.12-.28-.2-.58-.35z" />
    </svg>
  ),
  instagram: (
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6 fill-current"
      aria-hidden="true"
    >
      <path d="M7.75 2h8.5C19.55 2 22 4.45 22 7.75v8.5C22 19.55 19.55 22 16.25 22h-8.5C4.45 22 2 19.55 2 16.25v-8.5C2 4.45 4.45 2 7.75 2zm0 1.5C5.79 3.5 3.5 5.79 3.5 7.75v8.5c0 1.96 2.29 4.25 4.25 4.25h8.5c1.96 0 4.25-2.29 4.25-4.25v-8.5c0-1.96-2.29-4.25-4.25-4.25h-8.5z" />
      <path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0 1.5a3.5 3.5 0 110 7 3.5 3.5 0 010-7z" />
      <circle cx="17.5" cy="6.5" r="1.5" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M16.5 1a6.6 6.6 0 003.9 3.9V9a9.9 9.9 0 01-4.1-.9v7.5a6.6 6.6 0 11-6.6-6.6c.4 0 .8 0 1.2.1v3.7a2.9 2.9 0 10 2.3 2.8V1h3.3z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M22.7 0H1.3C.6 0 0 .6 0 1.3v21.3c0 .7.6 1.3 1.3 1.3h11.5v-9.3H9.7v-3.6h3.1V8.4c0-3.1 1.9-4.8 4.7-4.8 1.3 0 2.5.1 2.8.1v3.2h-1.9c-1.5 0-1.8.7-1.8 1.7v2.3h3.6l-.5 3.6h-3.1V24h6.1c.7 0 1.3-.6 1.3-1.3V1.3c0-.7-.6-1.3-1.3-1.3z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M23.5 6.2s-.2-1.7-.8-2.4c-.8-.9-1.7-.9-2.1-.9C17.7 2.6 12 2.6 12 2.6s-5.7 0-8.6.3c-.4 0-1.3 0-2.1.9-.6.7-.8 2.4-.8 2.4S0 8.1 0 10.1v1.9c0 2 .5 3.9.5 3.9s.2 1.7.8 2.4c.8.9 1.9.9 2.4 1 1.8.2 7.3.3 7.3.3s5.7 0 8.6-.3c.4 0 1.3 0 2.1-.9.6-.7.8-2.4.8-2.4s.5-1.9.5-3.9v-1.9c0-2-.5-3.9-.5-3.9zM9.5 14.9V8.7l6.3 3.1-6.3 3.1z" />
    </svg>
  ),
};

const socials = [
  {
    icon: icons.whatsapp,
    labelKey: "whatsapp",
    url: "https://wa.me/521000000000",
    color: "text-green-400",
  },
  {
    icon: icons.instagram,
    labelKey: "instagram",
    url: "https://instagram.com",
    color: "text-pink-400",
  },
  {
    icon: icons.tiktok,
    labelKey: "tiktok",
    url: "https://tiktok.com",
    color: "text-white",
  },
  {
    icon: icons.facebook,
    labelKey: "facebook",
    url: "https://facebook.com",
    color: "text-blue-400",
  },
  {
    icon: icons.youtube,
    labelKey: "youtube",
    url: "https://youtube.com",
    color: "text-red-400",
  },
];

export default function ContactSocials() {
  const t = useTranslations("contact.socials");
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold">{t("title")}</h2>
      <p className="text-gray-400">{t("desc")}</p>

      <div className="grid grid-cols-2 gap-4">
        {socials.map((s, i) => (
          <a
            key={i}
            href={s.url}
            target="_blank"
            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 hover:scale-[1.02] transition"
          >
            <span className={`text-2xl ${s.color}`}>{s.icon}</span>
            <span className="text-sm">{t(`labels.${s.labelKey}`)}</span>
          </a>
        ))}
      </div>
    </motion.div>
  );
}
