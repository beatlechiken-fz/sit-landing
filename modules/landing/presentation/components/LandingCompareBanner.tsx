"use client";

import { useTranslations } from "next-intl";
import LandingSwitchBanner from "./LandingSwitchBanner";

/** Se muestra en /landing ("bajo demanda") y apunta a /landing/a-la-medida. */
export default function LandingCompareBanner() {
  const t = useTranslations("landing");

  return (
    <LandingSwitchBanner
      eyebrow={t("compareBannerEyebrow")}
      title={t("compareBannerTitle")}
      desc={t("compareBannerDesc")}
      btn={t("compareBannerBtn")}
      href="/landing/a-la-medida"
    />
  );
}
