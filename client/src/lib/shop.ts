/** Same shop line the checkout already uses for order messages. */
export const SHOP_WHATSAPP = "355689001257";

export function whatsAppLink(text: string) {
  return `https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(text)}`;
}
