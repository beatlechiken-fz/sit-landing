import Image from "next/image";

export type ProcessCardProps = {
  title: string;
  description?: string;
  icon?: string;
  iconOpacity?: string;
  iconSize?: number;
  width?: string;
  step?: number;
  classesText?: string;
  circleColor?: string;
};

export default function ProcessCard({
  title,
  description = "",
  icon = "",
  iconOpacity = "",
  iconSize = 20,
  width = "100%",
  step = 1,
  classesText = "text-[1rem]",
  circleColor = "#000",
}: ProcessCardProps) {
  return (
    <main
      className={`flex flex-col items-center`}
      style={{ width: width, maxWidth: width }}
    >
      <section className="relative flex flex-col items-center">
        <div className="absolute -top-5 z-10">
          <div
            className="flex items-center justify-center
                  w-12 h-12
                  rounded-full
                  bg-black
                  text-white
                  text-[20px] font-bold"
          >
            {step}
          </div>
        </div>

        <div
          style={{
            border: `solid 2px ${circleColor}`,
            width: width,
            height: width,
          }}
          className="flex items-center justify-center
                rounded-full
                text-center
                px-4"
        >
          <span className={classesText}>{title}</span>
        </div>
      </section>

      <span className="text-gray-500 text-center mt-4">{description}</span>
    </main>
  );
}
