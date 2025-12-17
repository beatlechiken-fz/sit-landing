import { useTranslations } from "next-intl";
import { CustomBreakpoint } from "@/core/types/general";
import { useBreakpoint } from "@/core/hooks/useBreakpoint";
import Image from "next/image";
import Icons from "@/core/assets/Icons";
import ContentCard, {
  ContentCardLayout,
  ContentCardProps,
} from "@/core/components/content-card/ContentCard";
import { useLanding } from "@/modules/home/presentation/store/useLanding";
import ProcessCard, {
  ProcessCardProps,
} from "@/core/components/process-card/ProcessCard";

export default function ProcessApps() {
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

  const mainCardsData: ProcessCardProps[] = [
    {
      title: t("devStep1"),
      description: t("devDescStep1"),
      width: "160px",
      step: 1,
      circleColor: "#b9d4d2ff",
      classesText:
        "text-[clamp(1rem,2vw,1.3rem)] text-[black] font-bold text-center",
    },
    {
      title: t("devStep2"),
      description: t("devDescStep2"),
      width: "160px",
      step: 2,
      circleColor: "#a9d3cfff",
      classesText:
        "text-[clamp(1rem,2vw,1.3rem)] text-[black] font-bold text-center",
    },
    {
      title: t("devStep3"),
      description: t("devDescStep3"),
      width: "160px",
      step: 3,
      circleColor: "#4DB6AC",
      classesText:
        "text-[clamp(1rem,2vw,1.3rem)] text-[black] font-bold text-center",
    },
    {
      title: t("devStep4"),
      description: t("devDescStep4"),
      width: "160px",
      step: 4,
      circleColor: "#00897B",
      classesText:
        "text-[clamp(1rem,2vw,1.3rem)] text-[black] font-bold text-center",
    },
    {
      title: t("devStep5"),
      description: t("devDescStep5"),
      width: "160px",
      step: 5,
      circleColor: "#004D40",
      classesText:
        "text-[clamp(1rem,2vw,1.3rem)] text-[black] font-bold text-center",
    },
  ];

  return (
    <main className="flex flex-col items-center gap-8 justify-start w-[85%] mb-24">
      <h1
        style={{ alignItems: "start" }}
        className="
            flex justify-center items-center
            text-[clamp(2rem,5.2vw,4.5rem)]
            leading-tight
            mt-8
            mb-18
            w-full
          "
      >
        <span className="bg-gradient-to-r from-teal-800 to-sky-700 bg-clip-text text-transparent drop-shadow-lg animate-fadeIn opacity-0 [animation-delay:0.3s]">
          {t("processAppsTitle")}
        </span>
      </h1>
      <section className="flex items-start gap-16 justify-center w-full flex-wrap">
        {mainCardsData.map((item, index) => (
          <ProcessCard
            key={index}
            title={item.title}
            description={item.description}
            icon={item.icon}
            iconSize={item.iconSize}
            width={item.width}
            step={item.step}
            circleColor={item.circleColor}
            classesText={item.classesText}
          />
        ))}
      </section>
    </main>
  );
}
