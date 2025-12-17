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

export default function TypeApps() {
  const t = useTranslations("apps");
  const lang = useLanding((state) => state.lang);

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

  const mobileItemsEs: string[] = [
    "iOS",
    "Android",
    "Seguridad",
    "Diseño moderno",
    "Escalabilidad",
    "Eficiencia",
    "Alto rendimiento",
    "Experiencia de usuario",
  ];
  const mobileItemsEn: string[] = [
    "iOS",
    "Android",
    "Seguridad",
    "Diseño moderno",
    "Escalabilidad",
    "Eficiencia",
  ];

  const pwaItemsEs: string[] = [
    "Un solo código",
    "Multiplataforma",
    "Visibilidad nativa",
    "Diseño moderno",
    "Escalabilidad",
    "Eficiencia",
    "Cache",
    "Modo off-line",
  ];
  const pwaItemsEn: string[] = [
    "Un solo código",
    "Multiplataforma",
    "Visibilidad nativa",
    "Diseño moderno",
    "Escalabilidad",
    "Eficiencia",
    "Cache",
    "Modo off-line",
  ];

  const enterpriseItemsEs: string[] = [
    "Escalabilidad",
    "Automatización de procesos",
    "Integración de sistemas",
    "Seguridad",
    "Roles y permisos",
    "Reportes avanzados",
    "Alta disponibilidad",
    "Personalización",
  ];
  const enterpriseItemsEn: string[] = [
    "Un solo código",
    "Multiplataforma",
    "Visibilidad nativa",
    "Diseño moderno",
    "Escalabilidad",
    "Eficiencia",
    "Cache",
    "Modo off-line",
  ];

  const iaItemsEs: string[] = [
    "Automatización inteligente",
    "Análisis de datos",
    "Predicciones",
    "Procesamiento de lenguaje",
    "Aprendizaje automático",
    "Reducción de costos",
    "Escalabilidad",
    "Optimización continua",
  ];
  const iaItemsEn: string[] = [
    "Un solo código",
    "Multiplataforma",
    "Visibilidad nativa",
    "Diseño moderno",
    "Escalabilidad",
    "Eficiencia",
    "Cache",
    "Modo off-line",
  ];

  const mainCardsData: ContentCardProps[] = [
    {
      title: t("mobileApps"),
      icon: Icons.iaPowered,
      iconSize: 48,
      layout: ContentCardLayout.portrait,
      width: "392px",
      gap: "12px",
      classesText:
        "text-[clamp(1rem,2vw,1.4rem)] text-[black] font-bold text-center",
      children: (
        <div>
          <h4 className="text-justify text-[black] mb-6">
            {t("mobileAppsDesc")}
          </h4>
          <div className="flex flex-col text-gray-600 pl-6">
            {(lang === "es" ? mobileItemsEs : mobileItemsEn)?.map(
              (item, index) => (
                <div key={index} className="flex gap-2 py-[6px]">
                  <Image src={Icons.plusGreen} alt="" width={16} height={16} />
                  <span>{item}</span>
                </div>
              )
            )}
          </div>
        </div>
      ),
    },
    {
      title: t("pwa"),
      icon: Icons.ios,
      iconSize: 48,
      layout: ContentCardLayout.portrait,
      width: "392px",
      gap: "12px",
      classesText:
        "text-[clamp(1rem,2vw,1.4rem)] text-[black] font-bold text-center",
      children: (
        <div>
          <h4 className="text-justify text-[black] mb-6">{t("pwaAppsDesc")}</h4>
          <div className="flex flex-col text-gray-600 pl-6">
            {(lang === "es" ? pwaItemsEs : pwaItemsEn)?.map((item, index) => (
              <div key={index} className="flex gap-2 py-[6px]">
                <Image src={Icons.plusGreen} alt="" width={16} height={16} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: t("enterpriseApps"),
      icon: Icons.andriod,
      iconSize: 48,
      layout: ContentCardLayout.portrait,
      width: "392px",
      gap: "12px",
      classesText:
        "text-[clamp(1rem,2vw,1.4rem)] text-[black] font-bold text-center",
      children: (
        <div>
          <h4 className="text-justify text-[black] mb-6">
            {t("enterpriseAppsDesc")}
          </h4>
          <div className="flex flex-col text-gray-600 pl-6">
            {(lang === "es" ? enterpriseItemsEs : enterpriseItemsEn)?.map(
              (item, index) => (
                <div key={index} className="flex gap-2 py-[6px]">
                  <Image src={Icons.plusGreen} alt="" width={16} height={16} />
                  <span>{item}</span>
                </div>
              )
            )}
          </div>
        </div>
      ),
    },
    {
      title: t("iaAutomate"),
      icon: Icons.web,
      iconSize: 48,
      layout: ContentCardLayout.portrait,
      width: "392px",
      gap: "12px",
      classesText:
        "text-[clamp(1rem,2vw,1.4rem)] text-[black] font-bold text-center",
      children: (
        <div>
          <h4 className="text-justify text-[black] mb-6">
            {t("iaAutomateDesc")}
          </h4>
          <div className="flex flex-col text-gray-600 pl-6">
            {(lang === "es" ? iaItemsEs : iaItemsEn)?.map((item, index) => (
              <div key={index} className="flex gap-2 py-[6px]">
                <Image src={Icons.plusGreen} alt="" width={16} height={16} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <main className="flex flex-col items-center gap-8 justify-start w-[85%] mb-12">
      <h1
        style={{ alignItems: "start" }}
        className="
            flex justify-center items-center
            text-[clamp(2rem,5.2vw,4.5rem)]
            leading-tight
            mt-8
            mb-12
            w-full
          "
      >
        <span className="bg-gradient-to-r from-teal-800 to-sky-700 bg-clip-text text-transparent drop-shadow-lg animate-fadeIn opacity-0 [animation-delay:0.3s]">
          {t("typeAppsTitle")}
        </span>
      </h1>
      <section className="flex items-start gap-8 justify-center w-full flex-wrap">
        {mainCardsData.map((item, index) => (
          <ContentCard
            key={index}
            title={item.title}
            icon={item.icon}
            iconSize={item.iconSize}
            layout={item.layout}
            width={item.width}
            gap={item.gap}
            classes="items-center justify-center min-w-[392px] border border-gray-300 rounded-[12px] px-8 py-6 bg-gray-50"
            classesText={item.classesText}
            children={item.children}
          />
        ))}
      </section>
    </main>
  );
}
