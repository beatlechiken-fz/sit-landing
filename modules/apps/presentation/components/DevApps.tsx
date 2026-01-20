"use client";

import Image from "next/image";
import CustomLink from "@/core/components/custom-link/CustomLink";
import Icons from "@/core/assets/Icons";
import { useTranslations } from "next-intl";

export default function DevApps() {
  const t = useTranslations("apps");

  const phone = "524431234567";
  const message =
    "Hola, me gustaría más información sobre el desarrollo de una app.";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    message,
  )}`;

  const items = [
    { label: "iOS", icon: Icons.ios },
    { label: "Android", icon: Icons.android },
    { label: "Web", icon: Icons.web },
    { label: "IA", icon: Icons.iaPowered },
    { label: "macOS", icon: Icons.macos },
    { label: "Windows", icon: Icons.windows },
  ];

  return (
    <section className="w-[85%] max-w-5xl min-h-[85vh] flex items-center">
      <div className="w-full flex flex-col items-center text-center gap-10">
        {/* Title */}
        <h1 className="text-[clamp(2.4rem,5vw,4.2rem)] font-bold leading-tight animate-fadeIn">
          <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
            {t("apps1")}
          </span>
          <br />
          {t("apps2")}
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-[clamp(1.1rem,2vw,1.4rem)] max-w-2xl animate-fadeIn [animation-delay:0.15s]">
          {t("apps3")}
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fadeIn [animation-delay:0.3s]">
          <div className="w-full sm:w-auto">
            <CustomLink
              url={whatsappUrl}
              appearance="blueGreenBg"
              size="md"
              fullWidth
            >
              {t("appsQuote")}
            </CustomLink>
          </div>
        </div>

        {/* Platforms */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-10 max-w-xl w-full animate-fadeIn [animation-delay:0.45s]">
          {items.map((item, i) => (
            <div
              key={i}
              className="
                flex items-center justify-center gap-3
                bg-white/5 border border-white/10
                rounded-xl px-4 py-3
                transition hover:scale-[1.03] hover:border-teal-400/40
              "
            >
              <Image src={item.icon} alt="" width={24} height={24} />
              <span className="text-gray-300 font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
