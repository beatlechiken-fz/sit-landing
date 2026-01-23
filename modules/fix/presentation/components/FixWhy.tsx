"use client";

import { useTranslations } from "next-intl";

export default function FixWhy() {
  const t = useTranslations("fixWhy");
  const reasons = t.raw("reasons");

  return (
    <section className="w-[85%] max-w-7xl flex flex-col items-center">
      <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold mb-16 text-center font-title">
        <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
          {t("title")}
        </span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-full">
        {reasons.map((r: any, i: number) => (
          <div
            key={i}
            className="rounded-2xl bg-white/5 border border-white/10 p-8 hover:border-sky-400/40 transition"
          >
            <h3 className="text-xl font-bold mb-3">{r.title}</h3>
            <p className="text-gray-400">{r.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
