"use client";

import { useMessages, useTranslations } from "next-intl";

export default function ProcessApps() {
  const t = useTranslations("processApps");
  const messages = useMessages();
  const steps = (messages?.processApps as any)?.steps || [];

  return (
    <section className="w-[85%] max-w-7xl flex flex-col items-center">
      <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold mb-20 text-center animate-fadeIn">
        <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
          {t("title")}
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 w-full">
        {steps.map((item: any, i: number) => (
          <div
            key={i}
            className="
              flex flex-col items-center text-center
              bg-white/5 border border-white/10
              rounded-2xl p-8
              transition hover:-translate-y-2 hover:border-teal-400/40
              animate-fadeIn
            "
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-sky-500 text-black font-bold mb-4">
              {item.step}
            </div>
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-gray-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
