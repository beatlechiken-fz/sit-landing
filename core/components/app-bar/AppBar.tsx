"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Images from "@/core/assets/Images";
import MainNav from "./MainNav";
import MobileMenu from "./MobileMenu";
import NativeSelect from "../native-select/NativeSelect";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function AppBar() {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleSetLang = (value: string) => {
    router.push(pathname, { locale: value });
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full py-2">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mx-auto flex h-[64px] items-center px-6 md:px-10 bg-black/60 backdrop-blur-xl border-b border-white/10"
      >
        {/* IZQUIERDA */}
        <div className="flex items-center gap-6">
          {pathname !== "/" && (
            <Image
              src={Images.logoOpacity}
              alt="SIT"
              width={32}
              height={32}
              priority
            />
          )}

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <MainNav />
          </div>
        </div>

        {/* ESPACIADOR */}
        <div className="flex-1" />

        {/* DERECHA */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <NativeSelect
              value={locale}
              onChange={(e) => handleSetLang(e)}
              options={[
                { value: "es", label: "es" },
                { value: "en", label: "en" },
              ]}
            />
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
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
        {open && <MobileMenu onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </header>
  );
}
