"use client";

import { useTranslations } from "next-intl";

export default function FixServices() {
  const t = useTranslations("fixServices");
  const services = t.raw("services");

  return (
    <section className="w-[85%] max-w-7xl flex flex-col items-center gap-16">
      <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold text-center font-title">
        <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
          {t("title")}
        </span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
        {services.map((s: any, i: number) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:border-teal-400/40 transition"
          >
            <h3 className="text-xl font-bold mb-3">{s.title}</h3>
            <p className="text-gray-400">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
