"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Images from "@/core/assets/Images";
import MainNav from "./MainNav";
import MobileMenu from "./MobileMenu";
import NativeSelect from "../native-select/NativeSelect";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useCarritoStore } from "@/modules/store/presentation/store/carrito.store";
import { useUIStore } from "@/modules/store/presentation/store/ui.store";
import { ClientSession } from "@/core/helpers/auth/client-session";
import { UserMenu } from "@/modules/(my-sit)/presentation/components/UserMenu";

export function AuthArea() {
  const [session, setSession] = useState<ClientSession | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("/api/my-sit/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setSession(data))
      .catch(() => setSession(null))
      .finally(() => setChecked(true));
  }, []);

  if (!checked) return null;

  if (session) {
    return <UserMenu session={session} />;
  }

  return (
    <Link
      href="/my-sit"
      className="rounded-xl bg-gradient-to-r from-teal-400 to-[#02AFFF] px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
    >
      Iniciar sesión
    </Link>
  );
}

function CartButton() {
  const [mounted, setMounted] = useState(false);
  const lineas = useCarritoStore((s) => s.lineas);
  const abrirCarrito = useUIStore((s) => s.abrirCarrito);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  const cantidad = mounted
    ? lineas.reduce((acc, l) => acc + l.cantidad, 0)
    : 0;

  if (cantidad === 0 && pathname !== "/store") return null;

  return (
    <button
      onClick={abrirCarrito}
      className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
      aria-label="Carrito"
    >
      <svg
        className="h-5 w-5 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.6}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      {cantidad > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-teal-400 to-[#02AFFF] text-[10px] font-bold text-black">
          {cantidad}
        </span>
      )}
    </button>
  );
}

export default function AppBar() {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
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
        {/* Línea inferior con glow de marca en vez de borde plano */}
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
          <div className="hidden lg:flex items-center gap-1">
            <MainNav />
          </div>
        </div>

        {/* ESPACIADOR */}
        <div className="flex-1" />

        {/* DERECHA */}
        <div className="flex items-center gap-3">
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

          <div className="hidden sm:block">
            <AuthArea />
          </div>

          <CartButton />

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
