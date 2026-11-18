import { Link } from "react-router-dom";
import { ProductImage } from "./ProductImage";
import { useLang } from "../context/LangContext";

/** Bottom CTA band — stickers + main plush (no white plate behind the image). */
export function Newsletter() {
  const { t } = useLang();

  return (
    <section className="py-8 sm:py-12 bg-white overflow-hidden relative">
      <div className="container-page">
        <div className="cta-band relative overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 text-center lg:text-left">
          <div className="pointer-events-none absolute inset-0 cta-band-pattern" aria-hidden />
          <div className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-[#c9a07a]/30 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 translate-x-1/4 translate-y-1/4 rounded-full bg-[#f42556]/20 blur-3xl" aria-hidden />

          <span className="cta-sticker cta-sticker-heart right-[8%] top-[16%] hidden lg:flex" aria-hidden>
            ♥
          </span>
          <span className="cta-sticker cta-sticker-pill right-[18%] bottom-[16%] hidden lg:flex" aria-hidden>
            COD
          </span>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            <div className="max-w-xl w-full">
              <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-3">
                {t("ctaTitle")}
              </h2>
              <p className="text-brand-100 text-sm sm:text-base mb-6">
                {t("ctaText")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  to="/shop"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-brand-900 font-bold rounded-xl hover:bg-brand-50 transition-colors shadow-lg text-center"
                >
                  {t("shopNow")}
                </Link>
                <Link
                  to="/track"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-white/15 border border-white/30 text-white font-bold rounded-xl hover:bg-white/25 transition-colors text-center backdrop-blur-sm"
                >
                  {t("trackOrder")}
                </Link>
              </div>
              <p className="text-brand-200 text-xs mt-4">{t("ctaNote")}</p>
            </div>

            <div className="relative w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 flex-shrink-0 hidden sm:block cta-float-main">
              <ProductImage
                src="/products/stitch-pink.jpg"
                alt="Pelush AruLand"
                className="w-full h-full object-contain relative z-10 drop-shadow-2xl mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
