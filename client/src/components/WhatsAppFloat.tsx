const WA = "https://wa.me/355689001257?text=" + encodeURIComponent(
  "Përshëndetje! Dua të bëj një porosi te AruLand."
);

export function WhatsAppFloat() {
  return (
    <a
      href={WA}
      target="_blank"
      rel="noreferrer"
      aria-label="Porosit në WhatsApp"
      className="fixed bottom-5 right-5 z-[60] w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-200 transition"
    >
      <svg viewBox="0 0 32 32" className="w-7 h-7 fill-current" aria-hidden>
        <path d="M16.01 3C9.39 3 4 8.37 4 14.96c0 2.1.55 4.07 1.52 5.79L4 29l8.45-2.21a12 12 0 0 0 3.56.54c6.62 0 12.01-5.37 12.01-11.96C28.02 8.37 22.63 3 16.01 3zm6.98 16.95c-.29.82-1.7 1.5-2.37 1.6-.61.08-1.38.12-2.23-.14-.52-.16-1.18-.38-2.03-.74-3.57-1.55-5.9-5.15-6.08-5.39-.18-.24-1.46-1.94-1.46-3.7s.92-2.62 1.25-2.98c.33-.36.72-.45.96-.45h.7c.22 0 .52-.08.81.62.29.72 1 2.45 1.09 2.63.09.18.14.39.03.62-.11.24-.17.39-.33.6-.16.21-.35.47-.5.63-.16.17-.33.35-.14.69.18.33.82 1.35 1.76 2.18 1.21 1.07 2.23 1.4 2.56 1.56.33.16.52.13.71-.08.19-.21.82-.95 1.04-1.28.22-.33.44-.27.74-.16.3.11 1.9.9 2.23 1.06.33.16.55.24.63.38.08.13.08.77-.21 1.59z" />
      </svg>
    </a>
  );
}
