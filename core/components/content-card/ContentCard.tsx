import Image from "next/image";

export enum ContentCardLayout {
  landscape = "landscape",
  portrait = "portrait",
}

export type ContentCardProps = {
  title: string;
  icon?: string;
  iconOpacity?: string;
  iconSize?: number;
  layout?: ContentCardLayout;
  width?: string;
  gap?: string;
  classes?: string;
  classesText?: string;
  children: React.ReactNode;
};

export default function ContentCard({
  title,
  icon = "",
  iconOpacity = "",
  iconSize = 20,
  layout = ContentCardLayout.landscape,
  width = "100%",
  gap = "8px",
  classes = "items-center justify-center min-w-[92px]",
  classesText = "text-[1rem]",
  children,
}: ContentCardProps) {
  return (
    <main
      className={`
        flex ${
          layout === ContentCardLayout.landscape ? "flex-row" : "flex-col"
        } ${classes}
      `}
      style={{ width: width, gap: gap, maxWidth: width }}
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
      <div>{children}</div>
    </main>
  );
}
