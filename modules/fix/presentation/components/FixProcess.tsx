"use client";

import { useTranslations } from "next-intl";

export default function FixProcess() {
  const t = useTranslations("fixProcess");
  const steps = t.raw("steps");

  return (
    <section className="w-[85%] max-w-7xl flex flex-col items-center">
      <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold mb-20 text-center font-title">
        <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
          {t("title")}
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 w-full">
        {steps.map((s: any, i: number) => (
          <div
            key={i}
            className="flex flex-col items-center text-center bg-white/5 border border-white/10 rounded-2xl p-8"
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-sky-500 text-black font-bold mb-4">
              {s.step}
            </div>
            <h3 className="font-semibold mb-2">{s.title}</h3>
            <p className="text-gray-400 text-sm">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
