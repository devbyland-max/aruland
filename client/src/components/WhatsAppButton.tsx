import { whatsAppLink } from "../lib/shop";

export function WhatsAppButton() {
  return (
    <a
      href={whatsAppLink("Përshëndetje AruLand, dua të pyes për një pelush.")}
      target="_blank"
      rel="noreferrer"
      className="fixed z-[70] bottom-24 right-4 sm:bottom-8 sm:right-6 flex items-center gap-2 rounded-full bg-[#3F2412] text-white px-4 py-3 shadow-float text-sm font-semibold hover:bg-brand-700"
      aria-label="Na shkruaj në WhatsApp"
    >
      <span aria-hidden="true">WA</span>
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
