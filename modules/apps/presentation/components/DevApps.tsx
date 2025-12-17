import { useTranslations } from "next-intl";
import CustomLink from "@/core/components/custom-link/CustomLink";
import { CustomBreakpoint } from "@/core/types/general";
import { useBreakpoint } from "@/core/hooks/useBreakpoint";
import styles from "./DevApss.module.scss";
import Image from "next/image";
import Images from "@/core/assets/Images";
import TinyCard, {
  TinyCardLayout,
  TinyCardProps,
} from "@/core/components/tiny-card/TinyCard";
import Icons from "@/core/assets/Icons";

export default function DevApps() {
  const t = useTranslations("apps");

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

  const mainCardsData: TinyCardProps[] = [
    {
      title: t("iaPowered"),
      icon: Icons.iaPowered,
      iconSize: 48,
      layout: TinyCardLayout.portrait,
      width: "fit-content",
      gap: "12px",
      classesText: "text-[clamp(1rem,2vw,1.4rem)] text-[gray]",
    },
    {
      title: t("ios"),
      icon: Icons.ios,
      iconSize: 48,
      layout: TinyCardLayout.portrait,
      width: "fit-content",
      gap: "12px",
      classesText: "text-[clamp(1rem,2vw,1.4rem)] text-[gray]",
    },
    {
      title: t("android"),
      icon: Icons.andriod,
      iconSize: 48,
      layout: TinyCardLayout.portrait,
      width: "fit-content",
      gap: "12px",
      classesText: "text-[clamp(1rem,2vw,1.4rem)] text-[gray]",
    },
    {
      title: t("web"),
      icon: Icons.web,
      iconSize: 48,
      layout: TinyCardLayout.portrait,
      width: "fit-content",
      gap: "12px",
      classesText: "text-[clamp(1rem,2vw,1.4rem)] text-[gray]",
    },
    {
      title: t("mac"),
      icon: Icons.macos,
      iconSize: 48,
      layout: TinyCardLayout.portrait,
      width: "fit-content",
      gap: "12px",
      classesText: "text-[clamp(1rem,2vw,1.4rem)] text-[gray]",
    },
    {
      title: t("windows"),
      icon: Icons.windows,
      iconSize: 48,
      layout: TinyCardLayout.portrait,
      width: "fit-content",
      gap: "12px",
      classesText: "text-[clamp(1rem,2vw,1.4rem)] text-[gray]",
    },
  ];

  return (
    <main className={styles.bgWrapper}>
      {/* Capa del trapecio de fondo */}
      <div
        className={
          breakpoint === "cxs" ? styles.trapecioBgXs : styles.trapecioBg
        }
      ></div>

      {/* Contenido encima */}
      <section
        style={{
          flexDirection: breakpoint !== "cxs" ? "row" : "column",
          width: breakpoint !== "cxs" ? "85%" : "85%",
        }}
        className="absolute flex items-starts justify-start h-screen z-10"
      >
        <section
          style={{
            width:
              breakpoint === "clg"
                ? "60%"
                : breakpoint === "cmd"
                ? "55%"
                : breakpoint === "csm"
                ? "50%"
                : "100%",
          }}
          className="flex flex-col justify-between z-10"
        >
          <section
            style={{
              alignItems: "start",
            }}
            className="flex flex-col justify-start h-screen w-full"
          >
            <h1
              style={{ alignItems: "start" }}
              className="
            flex flex-col justify-start
            text-[clamp(2rem,5.2vw,4.5rem)]
            leading-tight
            mt-32
            w-full
          "
            >
              <span className="bg-gradient-to-r from-teal-800 to-sky-700 bg-clip-text text-transparent drop-shadow-lg animate-fadeIn opacity-0 [animation-delay:0.3s]">
                {t("title")}
              </span>
            </h1>

            <h4
              style={{
                marginTop: "24px",
                width: "90%",
              }}
              className="text-white text-[clamp(1.5rem,2vw,2rem)] w-[80%] lg:w-[65%]"
            >
              {t("titleDescription")}
            </h4>

            <section
              style={{
                marginTop:
                  breakpoint === "clg" || breakpoint === "cmd"
                    ? "64px"
                    : "32px",
              }}
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
            <section
              style={{
                flexWrap: breakpoint === "cxs" ? "wrap" : "nowrap",
                justifyContent: breakpoint === "cxs" ? "center" : "start",
                alignContent: breakpoint === "cxs" ? "flex-end" : "flex-end",
                paddingBottom: breakpoint === "cxs" ? "112px" : "86px",
              }}
              className="flex gap-0 items-end gap-10 h-full w-[85%]"
            >
              {mainCardsData.map((item, index) => (
                <TinyCard
                  key={index}
                  title={item.title}
                  icon={item.icon}
                  iconSize={item.iconSize}
                  layout={item.layout}
                  width={item.width}
                  gap={item.gap}
                  classesText={item.classesText}
                />
              ))}
            </section>
          </section>
        </section>

        {breakpoint !== "cxs" && (
          <section
            style={{
              width:
                breakpoint === "clg"
                  ? "40%"
                  : breakpoint === "cmd"
                  ? "45%"
                  : breakpoint === "csm"
                  ? "50%"
                  : "0%",
            }}
            className="flex justify-start h-full z-10"
          >
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
                src={Images.celphoneApps}
                alt=""
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
