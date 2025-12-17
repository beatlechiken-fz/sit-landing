import { useTranslations } from "next-intl";
import CustomLink from "@/core/components/custom-link/CustomLink";
import { CustomBreakpoint } from "@/core/types/general";
import { useBreakpoint } from "@/core/hooks/useBreakpoint";
import Image from "next/image";
import Images from "@/core/assets/Images";

export default function AutomatizationHome() {
  const t = useTranslations("home");

  const breakpointsConfig: Record<
    CustomBreakpoint,
    { min?: number; max?: number }
  > = {
    cxs: { max: 839 },
    csm: { min: 840, max: 1022 },
    cmd: { min: 1023, max: 1199 },
    clg: { min: 1200 },
  };

  const breakpoint = useBreakpoint(breakpointsConfig);

  return (
    <main
      style={{ width: breakpoint === "clg" ? "80%" : "90%" }}
      className={`flex items-center justify-center ${
        breakpoint === "clg" ? "h-screen" : "h-screen"
      } py-20`}
    >
      <section
        style={{ flexDirection: breakpoint === "clg" ? "row" : "column" }}
        className="flex items-center justify-start h-full w-full"
      >
        <section
          style={{
            alignItems: breakpoint === "clg" ? "start" : "center",
            width: breakpoint === "clg" ? "60%" : "100%",
          }}
          className="flex flex-col justify-start h-full"
        >
          <h1
            style={{ alignItems: breakpoint === "clg" ? "start" : "center" }}
            className="
             flex flex-col justify-start
             text-[clamp(2rem,5.2vw,4.5rem)]
             leading-tight
             mt-20
             w-full
          "
          >
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 animate-fadeIn opacity-0 [animation-delay:0.6s] text-[clamp(2rem,6vw,6rem)]">
              <span className="font-bold bg-gradient-to-r from-sky-300 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
                {t("ia")}
              </span>
              <span className="font-bold bg-blue-300 bg-clip-text text-transparent drop-shadow-lg">
                {t("plus")}
              </span>
              <span className="font-bold bg-gradient-to-r from-emerald-200 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">
                {t("apps")}
              </span>
            </div>

            <span className="bg-gradient-to-r from-pink-100 to-purple-400 bg-clip-text text-transparent drop-shadow-lg animate-fadeIn opacity-0 [animation-delay:0.3s]">
              {t("title")}
            </span>
          </h1>

          <h3
            style={{
              textAlign: breakpoint === "clg" ? "left" : "center",
              marginTop: breakpoint === "clg" ? "74px" : "44px",
              width: breakpoint === "clg" ? "100%" : "85%",
            }}
            className="text-[white] text-[clamp(1.5rem,2vw,2rem)] w-[80%] lg:w-[65%] font-bold"
          >
            {t("titleDescription")}
          </h3>

          <h4
            style={{
              textAlign: breakpoint === "clg" ? "left" : "center",
              marginTop: breakpoint === "clg" ? "24px" : "24px",
              width: breakpoint === "clg" ? "90%" : "85%",
            }}
            className="text-[white] text-[clamp(1.5rem,2vw,2rem)] w-[80%] lg:w-[65%]"
          >
            {t("subtitleDescription")}
          </h4>

          {breakpoint !== "clg" && (
            <div
              className="mt-12"
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                overflow: "hidden",
              }}
            >
              <Image
                src={Images.brainAi}
                alt=""
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          )}

          <section
            style={{ marginTop: breakpoint === "clg" ? "56px" : "24px" }}
            className="animate-fadeIn opacity-0 [animation-delay:0.1s]"
          >
            <CustomLink
              url="/apps"
              appearance="whiteBg"
              size="lg"
              fullWidth={false}
            >
              <div className="flex gap-3 items-center">
                <span>{t("quoteApp")}</span>
              </div>
            </CustomLink>
          </section>
        </section>

        {/*
        <section
          style={{
            width: breakpoint === "clg" ? "40%" : "100%",
            marginTop: breakpoint === "clg" ? "0" : "32px",
          }}
          className="h-full flex items-start justify-center animate-fadeIn opacity-0 [animation-delay:0.9s]"
        >
          <div
            style={{ height: `${currentVideoHeight}vh` }}
            className={`flex items-end justify-end`}
          >
            <video
              src={Videos.chatBotEs}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </section>
        */}
      </section>
    </main>
  );
}
