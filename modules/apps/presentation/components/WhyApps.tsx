"use client";

import Image from "next/image";
import Icons from "@/core/assets/Icons";
import { useMessages, useTranslations } from "next-intl";

type WhyAppCard = {
  key: keyof typeof ICON_MAP;
  title: string;
  desc: string;
};

const ICON_MAP = {
  results: Icons.business,
  scale: Icons.scale,
  support: Icons.support,
} as const;

export default function WhyApps() {
  const t = useTranslations("apps");
  const messages = useMessages();

  const items = (messages?.apps as any)?.appsWhyCards as WhyAppCard[];

  return (
    <section className="w-[85%] max-w-7xl flex flex-col items-center">
      <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold mb-16 text-center animate-fadeIn font-title">
        <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
          {t("appsWhy1")}
        </span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-full">
        {items.map((item, i) => (
          <div
            key={item.key}
            className="
              rounded-2xl bg-white/5 backdrop-blur
              border border-white/10 p-8
              transition hover:-translate-y-2 hover:border-teal-400/40
              animate-fadeIn
            "
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <Image src={ICON_MAP[item.key]} alt="" width={48} height={48} />

            <h3 className="text-xl font-bold mt-6 mb-3">{item.title}</h3>

            <p className="text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
