import type { Product } from "../lib/api";

const FILTERS: Record<string, string> = {
  pink: "hue-rotate(300deg)",
  purple: "hue-rotate(180deg)",
  black: "grayscale(100%)",
  yellow: "hue-rotate(45deg)",
  green: "hue-rotate(120deg)",
};

export function productImageFilter(product: Pick<Product, "color" | "slug">) {
  if (product.slug.includes("vintage")) return "sepia(100%)";
  if (product.slug.includes("halloween")) return "grayscale(100%)";
  return FILTERS[product.color] ?? undefined;
}

export function formatMoney(n: number) {
  return new Intl.NumberFormat("sq-AL", {
    style: "currency",
    currency: "ALL",
    maximumFractionDigits: 0,
  }).format(n);
}

export function badgeLabel(badge: string) {
  return badge.toUpperCase();
}
