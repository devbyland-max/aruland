import { Decimal } from "@prisma/client/runtime/library";

export function money(value: Decimal | number | string) {
  return Number(value);
}

export function serializeProduct<T extends Record<string, unknown>>(product: T) {
  const p = { ...product } as Record<string, unknown>;
  if (p.price != null) p.price = money(p.price as Decimal);
  if (p.compareAtPrice != null) p.compareAtPrice = money(p.compareAtPrice as Decimal);
  return p;
}
