import { useEffect } from "react";

const IG_URL = "https://www.instagram.com/aru_land_/";

/** Elfsight Instagram Feed widget for @aru_land_ */
const ELFSIGHT_WIDGET_ID =
  import.meta.env.VITE_ELFSIGHT_INSTAGRAM_ID?.trim() ||
  "35f67ea8-06da-4d50-85e9-cb397fb4a4d6";

declare global {
  interface Window {
    elfsight?: { reinit?: () => void };
  }
}

function useElfsightScript(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-aruland-elfsight="1"]'
    );
    if (existing) {
      window.elfsight?.reinit?.();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    script.dataset.arulandElfsight = "1";
    document.body.appendChild(script);
  }, [enabled]);
}

export function InstagramProfile() {
  const ready = Boolean(ELFSIGHT_WIDGET_ID);
  useElfsightScript(ready);

  return (
    <section id="instagram" className="py-8 sm:py-12 bg-[#0a0a0a]">
      <div className="container-page">
        <div className="max-w-[935px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 px-1">
            <div>
              <p className="text-[#a8a8a8] text-xs uppercase tracking-widest mb-1">
                Instagram
              </p>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
                @aru_land_
              </h2>
              <p className="text-sm text-[#a8a8a8] mt-1">
                Postet reale nga faqja jonë në Instagram.
              </p>
            </div>
            <a
              href={IG_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex self-start sm:self-auto px-4 py-2 rounded-lg bg-[#0095f6] hover:bg-[#1877f2] text-white text-sm font-semibold"
            >
              Hap profilin
            </a>
          </div>

          {ready ? (
            <div className="rounded-2xl overflow-hidden bg-white min-h-[320px]">
              <div
                className={`elfsight-app-${ELFSIGHT_WIDGET_ID}`}
                data-elfsight-app-lazy
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-[#262626] bg-[#121212] p-5 sm:p-8 text-white">
              <p className="font-semibold text-lg mb-2">
                Lidh feed-in real të Instagram (Elfsight)
              </p>
              <ol className="text-sm text-[#c7c7c7] space-y-2 list-decimal pl-5 mb-5 leading-relaxed">
                <li>
                  Hap{" "}
                  <a
                    href="https://elfsight.com/instagram-feed-instashow/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0095f6] hover:underline"
                  >
                    elfsight.com/instagram-feed
                  </a>{" "}
                  dhe krijo account falas.
                </li>
                <li>
                  Zgjidh <strong className="text-white">Instagram Feed</strong> →
                  lidh profilin <strong className="text-white">@aru_land_</strong>.
                </li>
                <li>
                  Te <strong className="text-white">Install / Add to website</strong>{" "}
                  kopjo ID-në e widget-it (p.sh.{" "}
                  <code className="text-brand-200">abcdef12-...</code>).
                </li>
                <li>
                  Vendose në{" "}
                  <code className="text-brand-200">client/.env</code>:
                  <pre className="mt-2 p-3 rounded-xl bg-black/50 text-xs overflow-x-auto text-[#e0e0e0]">
                    {`VITE_ELFSIGHT_INSTAGRAM_ID=ID_JOTË_KËTU`}
                  </pre>
                </li>
                <li>Rinis `npm run dev` dhe rifresko faqen.</li>
              </ol>
              <a
                href={IG_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex px-4 py-2 rounded-lg bg-[#363636] hover:bg-[#262626] text-sm font-semibold"
              >
                Ndërkohë shiko @aru_land_ në Instagram →
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
