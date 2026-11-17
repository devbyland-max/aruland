import type { Product } from "../lib/api";

const PLACEHOLDER =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <rect fill="#F3E8D8" width="400" height="400"/>
      <text x="200" y="200" text-anchor="middle" fill="#7B461E" font-family="Nunito,sans-serif" font-size="22">AruLand</text>
    </svg>`
  );

export const IMAGE_PLACEHOLDER = PLACEHOLDER;

export function productImageFilter(_product: Pick<Product, "color" | "slug">) {
  return undefined;
}

export function formatMoney(n: number) {
  return (
    new Intl.NumberFormat("sq-AL", {
      maximumFractionDigits: 0,
    }).format(n) + " Lekë"
  );
}

export function badgeLabel(badge: string) {
  const map: Record<string, string> = {
    new: "E RE",
    hot: "HOT",
    sale: "OFERTË",
    sold: "PA STOK",
  };
  return map[badge.toLowerCase()] ?? badge.toUpperCase();
}

export function productMaterial(_product: Pick<Product, "category">) {
  return "Pelush premium";
}
