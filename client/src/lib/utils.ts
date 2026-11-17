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

/** 068xxxxxxx (10 shifra) ose +355 68xxxxxxx */
export function isValidAlbanianPhone(raw: string) {
  const compact = raw.trim().replace(/[\s\-()]/g, "");
  if (/^06\d{8}$/.test(compact)) return true;
  if (/^\+?3556\d{8}$/.test(compact)) return true;
  return false;
}

export function validateShippingForm(form: {
  shippingName: string;
  shippingPhone: string;
  shippingLine1: string;
  shippingCity: string;
}) {
  const name = form.shippingName.trim();
  const phone = form.shippingPhone.trim();
  const address = form.shippingLine1.trim();
  const city = form.shippingCity.trim();

  if (name.length < 3) return "Emri i plotë është i detyrueshëm.";
  if (name.split(/\s+/).filter((p) => p.length >= 2).length < 2) {
    return "Shkruaj emrin dhe mbiemrin.";
  }
  if (!phone) return "Numri i telefonit është i detyrueshëm.";
  if (!isValidAlbanianPhone(phone)) {
    return "Telefoni duhet 068xxxxxxx (10 shifra) ose +355 68xxxxxxx.";
  }
  if (address.length < 3) return "Adresa është e detyrueshme.";
  if (city.length < 2) return "Qyteti është i detyrueshëm.";
  return null;
}
