export const PRODUCT_CATEGORIES = [
  "Stitch",
  "Me Frymëmarrje",
  "Kafshë",
  "Arusha",
] as const;

export const PRODUCT_BADGES = [
  { value: "", label: "Pa badge" },
  { value: "new", label: "E RE" },
  { value: "hot", label: "HOT" },
  { value: "sale", label: "OFERTË" },
] as const;

export const PRODUCT_COLORS = [
  { value: "blue", label: "Blu" },
  { value: "pink", label: "Rozë" },
  { value: "brown", label: "Kafe" },
  { value: "beige", label: "Bezhë" },
  { value: "cream", label: "Krem" },
  { value: "gray", label: "Gri" },
  { value: "white", label: "Bardhë" },
] as const;

export const ORDER_STATUSES = [
  { value: "PROCESSING", label: "Në përpunim" },
  { value: "AT_POST", label: "Dorëzuar në postë" },
  { value: "IN_TRANSIT", label: "Në lëvizje nga korrieri" },
  { value: "DELIVERED", label: "Dorëzuar" },
  { value: "CANCELLED", label: "Anuluar" },
] as const;

export const TRACKING_STEPS = [
  { value: "PROCESSING", label: "Në përpunim" },
  { value: "AT_POST", label: "Dorëzuar në postë" },
  { value: "IN_TRANSIT", label: "Në lëvizje nga korrieri" },
  { value: "DELIVERED", label: "Dorëzuar" },
] as const;

export type TrackingStatus = (typeof TRACKING_STEPS)[number]["value"];
