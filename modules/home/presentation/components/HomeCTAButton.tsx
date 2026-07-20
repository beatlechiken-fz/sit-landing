"use client";

import { Link } from "@/i18n/navigation";

export function HomeCTAButton({
  href,
  children,
  variant = "solid",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline";
}) {
  const classes =
    variant === "solid"
      ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-white"
      : "border border-white/20 text-white bg-transparent hover:bg-white/10";

  return (
    <Link
      href={href}
      className={`h-12 px-6 rounded-xl font-semibold transition duration-200 hover:opacity-90 flex items-center justify-center text-center gap-2 ${classes}`}
    >
      {children}
    </Link>
  );
}
