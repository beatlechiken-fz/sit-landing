"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { createMenuNavElementAdmin } from "./menuFactoryAdmin";
import MainNavItemAdmin from "./MainNavItemAdmin";

function stripLocale(pathname: string) {
  return pathname.replace(/^\/(en|es)(?=\/|$)/, "");
}

export default function MainNavAdmin({ isMobile = false, onSelect }: any) {
  const t = useTranslations("mainnav");
  const pathname = usePathname();
  const normalizedPath = stripLocale(pathname);

  const [openSubmenuId, setOpenSubmenuId] = useState<string | null>(null);

  const menu = createMenuNavElementAdmin(t);

  const items = Object.values(menu).map((item) => ({
    ...item,
    active:
      normalizedPath === item.url ||
      item.submenu?.some((s: any) => normalizedPath.startsWith(s.url)),
  }));

  return (
    <nav className={`flex ${isMobile ? "flex-col gap-4" : "gap-4"}`}>
      {items.map((item) => (
        <MainNavItemAdmin
          key={item.id}
          {...item}
          isMobile={isMobile}
          isOpen={openSubmenuId === item.id}
          onToggle={() =>
            setOpenSubmenuId(openSubmenuId === item.id ? null : item.id)
          }
          onSelect={onSelect}
        />
      ))}
    </nav>
  );
}
