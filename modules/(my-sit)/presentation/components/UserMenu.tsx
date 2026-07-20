"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ClientSession } from "@/core/helpers/auth/client-session";

export function UserMenu({ session }: { session: ClientSession }) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (!abierto) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [abierto]);

  const handleLogout = async () => {
    await fetch("/api/my-sit/logout", { method: "POST" });
    router.push(`/${locale}/my-sit`);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setAbierto((v) => !v)}
        className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 transition-colors hover:bg-white/10"
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#02AFFF]/20 text-xs font-bold text-[#02AFFF]">
          {session.nombre[0]}
          {session.apellido[0]}
        </div>
        <span className="hidden text-sm font-medium text-white/80 sm:block">
          {session.nombre}
        </span>
        <svg
          className={`h-3.5 w-3.5 text-white/40 transition-transform duration-200 ${abierto ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {abierto && (
        <div
          className="
            absolute right-0 top-full mt-3 w-52
            bg-black/80 backdrop-blur-2xl
            border border-white/10
            rounded-2xl p-2 shadow-2xl shadow-black/40
            z-50
          "
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-medium text-white">
              {session.nombre} {session.apellido}
            </p>
            <p className="truncate text-xs text-white/40">{session.email}</p>
          </div>

          <div className="my-1 h-px bg-white/10" />

          <Link
            href="/my-sit/dashboard"
            onClick={() => setAbierto(false)}
            className="block rounded-xl px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/my-sit/dashboard/perfil"
            onClick={() => setAbierto(false)}
            className="block rounded-xl px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            Mi perfil
          </Link>

          <div className="my-1 h-px bg-white/10" />

          <button
            onClick={handleLogout}
            className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
