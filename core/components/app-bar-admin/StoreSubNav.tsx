"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "Productos", href: "/admin/dashboard/store" },
  { label: "Servicios", href: "/admin/dashboard/store/services" },
  { label: "Grupos", href: "/admin/dashboard/store/groups" },
  { label: "Cupones", href: "/admin/dashboard/store/coupons" },
  { label: "Clientes", href: "/admin/dashboard/store/users" },
  { label: "Tratos", href: "/admin/dashboard/store/deals" },
];

export function StoreSubNav() {
  const pathname = usePathname();

  // Normaliza quitando el locale
  const path = pathname.replace(/^\/(en|es)/, "");

  return (
    <div className="fixed top-16 left-0 right-0 z-30 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-1 px-4">
        {LINKS.map((link) => {
          const active =
            path === link.href ||
            (link.href !== "/admin/dashboard/store" &&
              path.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                relative px-4 py-3 text-sm font-medium transition-colors
                ${active ? "text-white" : "text-zinc-500 hover:text-zinc-300"}
              `}
            >
              {link.label}
              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#02AFFF]" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
