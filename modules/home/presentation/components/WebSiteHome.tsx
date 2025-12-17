import Images from "@/core/assets/Images";
import CustomLink from "@/core/components/custom-link/CustomLink";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

export default function WebSiteHome() {
  const t = useTranslations("home");

  const [xs, setXs] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    setXs(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setXs(e.matches);

    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const cardClasses =
    "gap-4 items-center justify-center px-8 py-4 sm:w-[250px] w-full text-black justify-start";

  return (
    <main className={`flex items-center justify-center w-full h-full py-12`}>
      <section
        className={`flex flex-col items-center w-[100%] h-full ${
          xs ? "px-12" : "px-24"
        }`}
      >
        <h2
          className="
            flex
            text-[clamp(2rem,4vw,5.5rem)]
            bg-gradient-to-r from-gray-700 to-gray-400 bg-clip-text text-transparent drop-shadow-lg
            animate-fadeIn opacity-0 [animation-delay:0.3s]
          "
        >
          {t("websiteTitle")}
        </h2>

        <h3 className="text-gray-500 text-[clamp(1.4rem,2.5vw,2rem)] w-[50%] mt-4 text-center">
          {t("websiteTitleDescription")}
        </h3>

        <section className="flex flex-col sm:flex-row gap-8 mt-12 md:mt-16 animate-fadeIn opacity-0 [animation-delay:0.1s]">
          <CustomLink
            url="/apps"
            appearance="blueGreenBg"
            size="lg"
            fullWidth={false}
            width="w-[250px]"
          >
            <div className="flex gap-3 items-center">
              <span>{t("websitePricing")}</span>
            </div>
          </CustomLink>

          <CustomLink
            url="/apps"
            appearance="blackBg"
            size="lg"
            fullWidth={false}
            width="w-[250px]"
          >
            <div className="flex gap-3 items-center">
              <span>{t("customSite")}</span>
            </div>
          </CustomLink>
        </section>

        <div className="flex items-end justify-end animate-fadeIn opacity-0 [animation-delay:0.9s] mt-20 sm:mt-24">
          <img
            src={Images.devices}
            alt=""
            className="max-w-full h-auto object-contain"
          />
        </div>
      </section>
    </main>
  );
}
