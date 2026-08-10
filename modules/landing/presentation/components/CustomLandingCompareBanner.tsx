"use client";

import { useTranslations } from "next-intl";
import LandingSwitchBanner from "./LandingSwitchBanner";

/** Se muestra en /landing/a-la-medida y apunta de vuelta a /landing ("bajo demanda"). */
export default function CustomLandingCompareBanner() {
  const t = useTranslations("customLanding");

  return (
    <LandingSwitchBanner
      eyebrow={t("compareBannerEyebrow")}
      title={t("compareBannerTitle")}
      desc={t("compareBannerDesc")}
      btn={t("compareBannerBtn")}
      href="/landing"
    />
  );
}
