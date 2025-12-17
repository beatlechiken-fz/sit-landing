import Image from "next/image";

export const CardAppearance = {
  blueSoft: {
    type: "solid",
    classesAppearance: "bg-blue-100 text-black",
  },
  whiteTransparent: {
    type: "solid",
    classesAppearance: "bg-white/80 text-black",
  },
  blueGreenBg: {
    type: "solid-gradient",
    classesAppearance:
      "bg-gradient-to-r from-emerald-400 to-teal-500 text-white",
  },
} as const;

export type CardAppearanceKey = keyof typeof CardAppearance;
export type CardAppearanceConfig = (typeof CardAppearance)[CardAppearanceKey];

export type TinyCardProps = {
  appearance: CardAppearanceKey;
  classes?: string;
  children: React.ReactNode;
};

export default function Card({
  appearance,
  classes = "",
  children,
}: TinyCardProps) {
  const { type, classesAppearance } = CardAppearance[appearance];

  return (
    <main
      className={`
        flex ${classes} ${classesAppearance}
      `}
    >
      {children}
    </main>
  );
}
