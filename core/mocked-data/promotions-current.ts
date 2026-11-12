export type CampaignStatus = "upcoming" | "active";

export type Promotion = {
  id: number;
  key: string;
  discount: string;
  icon: "ssd" | "ram" | "laptopParts" | "battery" | "maintenance" | "phone" | "printer";
};

export const campaignStatus: CampaignStatus = "upcoming";

export const currentPromotions: Promotion[] = [
  { id: 1, key: "celularRepair", discount: "15% OFF", icon: "phone" },
  { id: 2, key: "laptopRepair", discount: "15% OFF", icon: "laptopParts" },
  { id: 3, key: "printerRepair", discount: "20% OFF", icon: "printer" },
  { id: 4, key: "ssdRam", discount: "15% OFF", icon: "ssd" },
  { id: 5, key: "thermalPaste", discount: "20% OFF", icon: "maintenance" },
];
