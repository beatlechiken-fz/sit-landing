"use client";

import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ClientSession } from "@/core/helpers/auth/client-session";

const LINKS = [
  { label: "Dashboard", href: "/my-sit/dashboard" },
  { label: "Pedidos", href: "/my-sit/dashboard/pedidos" },
  { label: "Mis beneficios", href: "/my-sit/dashboard/beneficios" },
  { label: "Mi perfil", href: "/my-sit/dashboard/perfil" },
];

export function ClientMobileMenu({
  session,
  onClose,
}: {
  session: ClientSession;
  onClose: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const normalizedPath = pathname.replace(`/${locale}`, "");

  const handleLogout = async () => {
    await fetch("/api/my-sit/logout", { method: "POST" });
    router.push(`/${locale}/my-sit`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl"
    >
      <motion.div
        initial={{ x: "110%" }}
        animate={{ x: 0 }}
        exit={{ x: "110%" }}
        transition={{ type: "spring", stiffness: 220, damping: 28 }}
        className="
          absolute right-0 top-0 h-full
          w-[85%] max-w-sm
          bg-gradient-to-b from-black/90 via-black/80 to-black/95
          border-l border-white/10
          shadow-2xl shadow-black/60
          p-6
        "
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

        {/* Header — usuario */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#02AFFF]/20 text-sm font-bold text-[#02AFFF]">
              {session.nombre[0]}
              {session.apellido[0]}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {session.nombre} {session.apellido}
              </p>
              <p className="truncate text-xs text-white/50">
                {session.email}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path
                d="M6 6l12 12M18 6l12 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Nav */}
        <nav className="flex flex-col gap-2">
          {LINKS.map((link) => {
            const active =
              normalizedPath === link.href ||
              (link.href !== "/my-sit/dashboard" &&
                normalizedPath.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`
                  px-4 py-2.5 rounded-xl transition font-medium text-left
                  ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/store"
            onClick={onClose}
            className="mt-2 px-4 py-2.5 rounded-xl border border-white/10 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            ← Regresar a Store
          </Link>

          <button
            onClick={handleLogout}
            className="mt-2 px-4 py-2.5 rounded-xl text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            Cerrar sesión
          </button>
        </nav>
      </motion.div>
    </motion.div>
  );
}
