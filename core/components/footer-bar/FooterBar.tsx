"use client";

import { useTranslations } from "next-intl";
import {
  createMenuNavElement,
  MenuNavElement,
} from "@/core/components/app-bar/menuFactory";

export default function FooterBar() {
  const t = useTranslations("mainnav");
  const menu: MenuNavElement = createMenuNavElement(t);

  // Redes sociales
  const socialLinks = [
    {
      id: "youtube",
      href: "#",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M23.5 6.2s-.2-1.7-.8-2.4c-.8-.9-1.7-.9-2.1-.9C17.7 2.6 12 2.6 12 2.6h0s-5.7 0-8.6.3c-.4 0-1.3 0-2.1.9-.6.7-.8 2.4-.8 2.4S0 8.1 0 10.1v1.9c0 2 .5 3.9.5 3.9s.2 1.7.8 2.4c.8.9 1.9.9 2.4 1 1.8.2 7.3.3 7.3.3s5.7 0 8.6-.3c.4 0 1.3 0 2.1-.9.6-.7.8-2.4.8-2.4s.5-1.9.5-3.9v-1.9c0-2-.5-3.9-.5-3.9zM9.5 14.9V8.7l6.3 3.1-6.3 3.1z" />
        </svg>
      ),
    },
    {
      id: "instagram",
      href: "#",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3.2A4.8 4.8 0 1 0 16.8 12 4.8 4.8 0 0 0 12 7.2zm0 7.8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm4.8-8.6a1.1 1.1 0 1 1-1.1-1.1 1.1 1.1 0 0 1 1.1 1.1z" />
        </svg>
      ),
    },
    // Agrega Facebook, TikTok, etc. siguiendo el mismo patrón
  ];

  return (
    <footer className="w-full bg-black text-white px-6 py-10">
      <div className="w-[80%] mx-auto flex flex-col gap-8">
        {/* ROW 1 — Menú */}
        <div className="flex flex-wrap justify-center gap-16 text-sm">
          {Object.values(menu).map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
              <span className="font-semibold">{item.label}</span>
              {item.submenu?.map((sub) => (
                <a
                  key={sub.id}
                  href={sub.url}
                  className="text-gray-300 hover:text-white transition"
                >
                  {sub.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* ROW 2 — Redes sociales */}
        <div className="flex items-center gap-6 justify-center">
          {socialLinks.map((s) => (
            <a
              key={s.id}
              href={s.href}
              aria-label={s.id}
              className="hover:scale-110 transition"
            >
              {s.icon}
            </a>
          ))}
        </div>

        {/* ROW 3 — Texto final */}
        <div className="text-xs text-center opacity-80">
          Morelia, MX. Soluciones Integrales en Tecnología. 2025
        </div>
      </div>
    </footer>
  );
}
