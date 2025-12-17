import Image from "next/image";

export enum TinyCardLayout {
  landscape = "landscape",
  portrait = "portrait",
}

export type TinyCardProps = {
  title: string;
  icon?: string;
  iconOpacity?: string;
  iconSize?: number;
  layout?: TinyCardLayout;
  width?: string;
  gap?: string;
  classes?: string;
  classesText?: string;
};

export default function TinyCard({
  title,
  icon = "",
  iconOpacity = "",
  iconSize = 20,
  layout = TinyCardLayout.landscape,
  width = "100%",
  gap = "8px",
  classes = "items-center justify-center max-w-full min-w-[92px]",
  classesText = "text-[1rem]",
}: TinyCardProps) {
  return (
    <main
      className={`
        flex ${
          layout === TinyCardLayout.landscape ? "flex-row" : "flex-col"
        } ${classes}
      `}
      style={{ width: width, gap: gap }}
    >
      {icon !== "" && (
        <Image
          src={icon}
          alt=""
          width={iconSize}
          height={iconSize}
          style={{ opacity: iconOpacity }}
        />
      )}

      <h3 className={classesText}>{title}</h3>
    </main>
  );
}
