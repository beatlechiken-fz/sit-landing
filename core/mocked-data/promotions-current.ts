export type CampaignStatus = "upcoming" | "active";

export type Promotion = {
  id: number;
  key: string;
  discount: string;
  icon: "ssd" | "ram" | "laptopParts" | "battery" | "maintenance" | "phone";
};

export const campaignStatus: CampaignStatus = "upcoming";

export const currentPromotions: Promotion[] = [
  { id: 1, key: "ssd", discount: "20% OFF", icon: "ssd" },
  { id: 2, key: "ram", discount: "15% OFF", icon: "ram" },
  { id: 3, key: "laptopParts", discount: "15% OFF", icon: "laptopParts" },
  { id: 4, key: "battery", discount: "15% OFF", icon: "battery" },
  {
    id: 5,
    key: "secondMaintenance",
    discount: "40% OFF",
    icon: "maintenance",
  },
  { id: 6, key: "phoneScreen", discount: "10% OFF", icon: "phone" },
];
