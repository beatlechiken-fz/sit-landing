import Images from "@/core/assets/Images";
import Card from "@/core/components/card/Card";
import CustomLink from "@/core/components/custom-link/CustomLink";
import { useTranslations } from "next-intl";

export default function TechnicalServiceHome() {
  const t = useTranslations("home");

  type CardContent = {
    title: string;
    text: string;
    label?: string;
  };

  const cardContent: CardContent[] = [
    {
      title: t("titleMaintance"),
      text: t("textMaintance"),
      label: t("labelMaintance"),
    },
    {
      title: t("titleFix"),
      text: t("textFix"),
      label: t("labelFix"),
    },
    {
      title: t("titleSale"),
      text: t("textSale"),
      label: t("labelSale"),
    },
  ];

  const classesCard =
    "rounded-3xl flex flex-col gap-4 p-8 py-4 items-center border border-white w-full";

  return (
    <main
      style={{ backgroundImage: `url(${Images.technicalService})` }}
      className={`relative flex items-center justify-center w-full h-full py-12 bg-cover bg-center h-min-[700px] h-auto`}
    >
      <section className="absolute inset-0 bg-gray/10"></section>
      <section
        className={`relative z-10 flex flex-col items-center w-[100%] h-full px-12 sm:px-24`}
      >
        <div className="flex flex-col w-full items-center lg:items-end">
          <span className="text-[clamp(2rem,4vw,5rem)] text-white font-bold">
            {t("techinalServiceTitle")}
          </span>

          <h3 className="text-white text-[clamp(1.4rem,2.5vw,2rem)] w-[80%] md:w-[50%] mt-4 text-center lg:text-right">
            {t("techinalServiceTitleDescription")}
          </h3>

          <section className="flex flex-col md:flex-row gap-8 mt-12 md:mt-16 animate-fadeIn opacity-0 [animation-delay:0.1s]">
            <CustomLink
              url="/apps"
              appearance="blueGreenBg"
              size="lg"
              fullWidth={false}
              width="w-[290px]"
            >
              <div className="flex gap-3 items-center">
                <span>{t("quoteService")}</span>
              </div>
            </CustomLink>
          </section>
        </div>

        <div className="flex flex-col lg:flex-row w-full gap-8 mt-24">
          {cardContent.map((item, index) => (
            <Card
              key={index}
              appearance="whiteTransparent"
              classes={classesCard}
            >
              <h5 className="flex text-[clamp(1.2rem,2vw,1.5rem)] font-bold text-center h-[62px] items-center">
                {item.title}
              </h5>
              <div className="w-fit">
                <CustomLink
                  appearance="blueDarkBg"
                  url="/"
                  size="xlg"
                  fullWidth={true}
                >
                  <div className="flex gap-3 items-center w-full text-center">
                    <span>{item.label}</span>
                  </div>
                </CustomLink>
              </div>
              <span className="text-[clamp(1rem,2vw,1.2rem)] text-center mt-4">
                {item.text}
              </span>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
