import Link from "next/link";

export const LinkAppearance = {
  pink: {
    type: "solid",
    classes: "bg-pink-500 text-white",
  },
  purple: {
    type: "solid",
    classes: "bg-purple-500 text-white",
  },
  blueGreenText: {
    type: "text-gradient",
    classes:
      "bg-gradient-to-r from-emerald-200 to-teal-400 bg-clip-text text-transparent",
  },
  blueGreenBg: {
    type: "solid-gradient",
    classes: "bg-gradient-to-r from-emerald-400 to-teal-500 text-white",
  },
  blueDarkBg: {
    type: "solid-gradient",
    classes: "bg-gradient-to-r from-sky-500 to-blue-700 text-white",
  },
  tealGreenDarkBg: {
    type: "solid-gradient",
    classes: "bg-gradient-to-r from-teal-600 to-green-700 text-white",
  },
  whiteBg: {
    type: "solid-gradient",
    classes: "bg-gradient-to-r from-white to-gray-300 text-black",
  },
  blackBg: {
    type: "solid-gradient",
    classes: "bg-gradient-to-r from-gray-100 to-gray-300 text-black",
  },
  darkOutline: {
    type: "solid",
    classes:
      "border border-white/20 text-white bg-transparent hover:bg-white/10",
  },
} as const;

export type LinkAppearanceKey = keyof typeof LinkAppearance;
export type LinkAppearanceConfig = (typeof LinkAppearance)[LinkAppearanceKey];

type Props = {
  url: string;
  appearance: LinkAppearanceKey;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg" | "xlg";
  children?: React.ReactNode;
  width?: string;
};

export default function CustomLink({
  url,
  appearance,
  fullWidth = true,
  size = "md",
  children = "",
  width = "0",
}: Props) {
  const { type, classes } = LinkAppearance[appearance];

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-12 px-6 text-base",
    lg: "h-14 px-8 text-lg",
    xlg: "h-16 px-8 text-lg",
  };

  const widthC = fullWidth ? "w-full" : width !== "0" ? width : "w-fit";

  const baseButton = `
    ${sizes[size]}
    ${widthC}
    flex items-center justify-center
    rounded-xl font-semibold
    transition duration-200
    hover:opacity-90
  `;

  // Si es gradiente de texto, el botón sigue siendo contenedor normal
  const finalClasses =
    type === "text-gradient"
      ? `${baseButton} text-transparent ${classes}`
      : `${baseButton} ${classes}`;

  return (
    <Link href={url} className={finalClasses}>
      {children}
    </Link>
  );
}
