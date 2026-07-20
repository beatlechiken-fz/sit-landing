"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import NativeSelect from "@/core/components/native-select/NativeSelect";
import { ClientSession } from "@/core/helpers/auth/client-session";
import { UserMenu } from "./UserMenu";
import { ClientMobileMenu } from "./ClientMobileMenu";
import Image from "next/image";
import Images from "@/core/assets/Images";

const LINKS = [
  { label: "Dashboard", href: "/my-sit/dashboard" },
  { label: "Pedidos", href: "/my-sit/dashboard/pedidos" },
  { label: "Mis beneficios", href: "/my-sit/dashboard/beneficios" },
];

export function ClientNavbar({ session }: { session: ClientSession }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const handleSetLang = (value: string) => {
    router.push(pathname, { locale: value });
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="
          relative mx-auto flex h-[76px] items-center px-6 md:px-10
          bg-black/50 backdrop-blur-2xl
        "
      >
        {/* Línea inferior con glow de marca */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#02AFFF]/40 to-transparent" />

        {/* IZQUIERDA */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src={Images.logoOpacity}
              alt="SIT"
              width={34}
              height={34}
              priority
              className="w-[34px] h-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {LINKS.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== "/my-sit/dashboard" &&
                  pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-4 py-2 rounded-lg transition font-medium text-sm
                    ${active ? "text-white" : "text-gray-400 hover:text-white"}
                  `}
                >
                  {link.label}
                  <span
                    className={`
                      pointer-events-none absolute left-4 right-4 -bottom-[13px] h-[2px]
                      bg-gradient-to-r from-teal-400 to-[#02AFFF]
                      transition-opacity duration-200
                      ${active ? "opacity-100" : "opacity-0"}
                    `}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ESPACIADOR */}
        <div className="flex-1" />

        {/* DERECHA */}
        <div className="flex items-center gap-3">
          <Link
            href="/store"
            className="hidden md:flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Regresar a Store
          </Link>

          <div className="hidden md:block">
            <NativeSelect
              value={locale}
              onChange={(v) => handleSetLang(v)}
              options={[
                { value: "es", label: "es" },
                { value: "en", label: "en" },
              ]}
            />
          </div>

          <div className="hidden sm:block">
            <UserMenu session={session} />
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(true)}
            className="sm:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <ClientMobileMenu session={session} onClose={() => setOpen(false)} />
        )}
      </AnimatePresence>
    </header>
  );
}
