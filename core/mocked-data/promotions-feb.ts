export type Promotion = {
  id: number;
  key: "coupleMaintenance" | "ssdUpgrade" | "screen" | "giftCard";
  price: string;
  badgeKey: "bestSeller" | "fast" | "gift";
  includesKeys: string[];
  validUntil: string;
};

export const promotionsFeb: Promotion[] = [
  {
    id: 1,
    key: "coupleMaintenance",
    price: "$650 - $1,390 MXN",
    badgeKey: "bestSeller",
    includesKeys: ["cleaning", "optimization", "backup"],
    validUntil: "9 - 15",
  },
  {
    id: 2,
    key: "ssdUpgrade",
    price: "15% OFF",
    badgeKey: "fast",
    includesKeys: ["ssdInstall", "cloning", "bootOptimization"],
    validUntil: "9 - 15",
  },
  {
    id: 3,
    key: "screen",
    price: "15% OFF",
    badgeKey: "fast",
    includesKeys: ["screenInstall"],
    validUntil: "9 - 15",
  },
  {
    id: 4,
    key: "giftCard",
    price: "Desde $500",
    badgeKey: "gift",
    includesKeys: ["customizable", "anyService", "idealGift"],
    validUntil: "9 - 15",
  },
];
