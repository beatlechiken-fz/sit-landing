"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Images from "@/core/assets/Images";
import MainNavAdmin from "./MainNavAdmin";
import MobileMenuAdmin from "./MobileMenuAdmin";
import NativeSelect from "../native-select/NativeSelect";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import Icons from "@/core/assets/Icons";
import { useUIStore } from "@/modules/admin/store/presentation/store/ui.store";
import { useCarritoStore } from "@/modules/admin/store/presentation/store/carrito.store";
import { CartModal } from "@/modules/admin/store/presentation/components/CartModal";

export default function AppBarAdmin() {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleSetLang = (value: string) => {
    router.push(pathname, { locale: value });
  };

  const toggleCarrito = useUIStore((s) => s.toggleCarrito);
  const totalLineas = useCarritoStore((s) =>
    s.lineas.reduce((acc, l) => acc + l.cantidad, 0),
  );

  return (
    <header className="fixed top-0 left-0 z-50 w-full">
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
            <MainNavAdmin />
          </div>
        </div>

        {/* ESPACIADOR */}
        <div className="flex-1" />

        {/* DERECHA */}
        <div className="flex items-center gap-4">
          <button onClick={toggleCarrito} className="relative">
            <Image
              src={Icons.shoppingBag}
              alt="Carrito"
              width={22}
              height={22}
            />
            {totalLineas > 0 && (
              <span
                className="
    absolute -top-1.5 -right-1.5
    flex h-4 w-4 items-center justify-center
    rounded-full bg-[#02AFFF]
    text-[10px] font-bold text-white
  "
              >
                {totalLineas}
              </span>
            )}
          </button>
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
        {open && <MobileMenuAdmin onClose={() => setOpen(false)} />}
      </AnimatePresence>
      <CartModal />
    </header>
  );
}
