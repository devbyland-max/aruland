import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { useLang } from "../context/LangContext";

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-white border-t border-brand-100 pt-10 sm:pt-14 pb-8">
      <div className="container-page">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-10">
          <div className="space-y-4 col-span-2 md:col-span-1">
            <Link to="/" className="inline-block">
              <img
                src="/AruLand-logo.png"
                alt="AruLand Toy Store"
                width={160}
                height={64}
                className="h-12 w-auto max-w-[160px] object-contain object-left"
              />
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xs">
              Pelushë të buta për përqafime. Pagesë në dorëzim në të gjithë Shqipërinë.
            </p>
            <div className="space-y-2 text-sm text-slate-700">
              <p className="flex items-center gap-2">
                <FontAwesomeIcon icon={faLocationDot} className="text-brand-600" />
                Tiranë, Shqipëri
              </p>
              <p className="flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-brand-600" />
                <a href="mailto:info@aruland.al" className="hover:text-brand-700">
                  info@aruland.al
                </a>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-slate-900">{t("store")}</h4>
            <div className="space-y-2 text-sm text-slate-600">
              <Link to="/shop" className="block hover:text-brand-700">Të gjitha</Link>
              <Link to="/shop?category=Stitch" className="block hover:text-brand-700">Stitch</Link>
              <Link to="/shop?category=Me%20Frym%C3%ABmarrje" className="block hover:text-brand-700">
                Me frymëmarrje
              </Link>
              <Link to="/shop?category=Kafsh%C3%AB" className="block hover:text-brand-700">
                Capybara & Elefant
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-slate-900">{t("help")}</h4>
            <div className="space-y-2 text-sm text-slate-600">
              <Link to="/track" className="block hover:text-brand-700">{t("trackOrder")}</Link>
              <Link to="/contact" className="block hover:text-brand-700">{t("contact")}</Link>
              <Link to="/cart" className="block hover:text-brand-700">{t("cart")}</Link>
              <Link to="/policies#returns" className="block hover:text-brand-700">{t("returns")}</Link>
              <Link to="/policies#shipping" className="block hover:text-brand-700">{t("delivery")}</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-slate-900">{t("contactUs")}</h4>
            <div className="space-y-2 text-sm text-slate-600">
              <Link to="/contact" className="flex items-center gap-2 hover:text-brand-700">
                <FontAwesomeIcon icon={faPhone} className="text-brand-600" />
                {t("contact")}
              </Link>
              <Link to="/policies#privacy" className="block hover:text-brand-700">{t("privacy")}</Link>
              <Link to="/policies#terms" className="block hover:text-brand-700">{t("terms")}</Link>
              <div className="flex gap-3 pt-2">
                <a
                  href="https://www.instagram.com/aru_land_/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-700 font-semibold hover:underline"
                >
                  Instagram @aru_land_
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-700 font-semibold hover:underline"
                >
                  TikTok
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-100 pt-6 flex flex-col sm:flex-row justify-between gap-3">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} AruLand Toy Store. Të gjitha të drejtat e rezervuara.
          </p>
          <p className="text-sm text-slate-600 font-medium">{t("cod")}</p>
        </div>
      </div>
    </footer>
  );
}
