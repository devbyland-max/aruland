import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBaby,
  faCakeCandles,
  faCheckCircle,
  faChevronLeft,
  faChevronRight,
  faGift,
  faHandHoldingHeart,
  faHouse,
  faQuestionCircle,
  faRotateLeft,
  faShieldHalved,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import { api, type Collection, type Product } from "../lib/api";
import { ProductCard } from "../components/ProductCard";
import { ProductImage } from "../components/ProductImage";
import { InstagramProfile } from "../components/InstagramProfile";
import { SectionDecor } from "../components/SectionDecor";
import { useLang } from "../context/LangContext";

const HERO_IMG = "/products/capybara.png";
const COLLECTION_BG = ["bg-sky-100", "bg-amber-50", "bg-brand-100"];

const REVIEWS = [
  {
    name: "Elira K.",
    city: "Tiranë",
    text: "Capybara erdhi shumë e butë dhe e pastër. Pagesa në dorëzim ishte e thjeshtë.",
    stars: 5,
  },
  {
    name: "Arben M.",
    city: "Durrës",
    text: "Stitch Blu ishte dhurata e përsosur për ditëlindjen e vajzës. Dorëzim brenda 2 ditëve.",
    stars: 5,
  },
  {
    name: "Sara D.",
    city: "Vlorë",
    text: "Vidra me frymëmarrje ndihmoi me gjumin e bebit. Do të porosis përsëri.",
    stars: 5,
  },
];

const FAQ = [
  {
    q: "Si funksionon pagesa në dorëzim?",
    a: "Paguani në cash kur merrni produktin. Nuk kërkohet kartë online.",
  },
  {
    q: "Sa kohë zgjat dërgesa?",
    a: "Zakonisht 1–3 ditë pune brenda Shqipërisë, sipas qytetit.",
  },
  {
    q: "A ka transport falas?",
    a: "Po, falas për porosi mbi 5.000 Lekë. Përndryshe tarifa është 300 Lekë.",
  },
];

export function HomePage() {
  const { t } = useLang();
  const [trending, setTrending] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [dot, setDot] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void (async () => {
      try {
        const [popular, cols] = await Promise.all([
          api.products({ sort: "popular", limit: 6 }),
          api.collections(),
        ]);
        setTrending(popular.items.slice(0, 6));
        setCollections(cols.collections);
      } catch {
        /* API may be down */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const scroll = (dir: -1 | 1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  const occasions = useMemo(
    () => [
      { title: t("forBaby"), icon: faBaby, to: "/shop?category=Me%20Frym%C3%ABmarrje" },
      { title: t("birthdayGift"), icon: faCakeCandles, to: "/shop?category=Stitch" },
      { title: t("kidsRoom"), icon: faHouse, to: "/shop?category=Arusha" },
    ],
    [t]
  );

  return (
    <>
      <section className="relative pt-3 pb-6 sm:pt-5 sm:pb-8 overflow-hidden">
        <div className="container-page">
          <div className="bg-brand-50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 relative overflow-hidden shadow-soft">
            <SectionDecor variant="hero" />
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center relative z-10">
              <div className="space-y-4 sm:space-y-5 text-center lg:text-left order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm text-xs sm:text-sm font-semibold text-brand-700">
                  <span className="w-2 h-2 rounded-full bg-accent-pink animate-pulse" />
                  {t("newCollection")}
                </div>
                <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-slate-900 leading-[1.1]">
                  {t("heroTitle1")}{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-700">
                    {t("heroTitle2")}
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 max-w-md mx-auto lg:mx-0 leading-relaxed">
                  {t("heroText")}
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-center lg:justify-start">
                  <Link
                    to="/shop"
                    className="px-7 py-3.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 hover:shadow-lg transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
                  >
                    {t("shopNow")} <FontAwesomeIcon icon={faArrowRight} />
                  </Link>
                  <a
                    href="#collections"
                    className="px-7 py-3.5 border border-brand-200 bg-white text-brand-800 font-semibold rounded-xl hover:bg-brand-50 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
                  >
                    {t("exploreCollections")}
                  </a>
                </div>
                <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm font-medium text-slate-600">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
                    {t("freeShipping")}
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faGift} className="text-brand-600" />
                    {t("cod")}
                  </div>
                </div>
              </div>

              <div className="relative h-[220px] sm:h-[320px] lg:h-[400px] flex items-center justify-center order-1 lg:order-2">
                <ProductImage
                  src={HERO_IMG}
                  alt="Capybara pelush AruLand"
                  width={420}
                  height={480}
                  loading="eager"
                  className="relative z-10 max-w-[88%] sm:max-w-[90%] max-h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-8">
        <div className="container-page">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {occasions.map((o) => (
              <Link
                key={o.title}
                to={o.to}
                className="bg-white border border-brand-100 rounded-2xl px-4 py-4 flex items-center gap-3 hover:shadow-card transition focus:outline-none focus:ring-2 focus:ring-brand-300"
              >
                <span className="w-11 h-11 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center">
                  <FontAwesomeIcon icon={o.icon} />
                </span>
                <div>
                  <p className="text-xs font-semibold text-[#5c3a22]">{t("shopByOccasion")}</p>
                  <p className="font-bold text-slate-900">{o.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="collections" className="py-6 sm:py-10 relative overflow-hidden">
        <SectionDecor variant="collections" />
        <div className="container-page relative z-10">
          <div className="flex justify-between items-end gap-4 mb-5 sm:mb-7">
            <div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 mb-1">
                {t("collections")}
              </h2>
              <p className="text-[#4a3018] text-sm sm:text-base">
                Stitch, frymëmarrje dhe arusha me pelush të butë.
              </p>
            </div>
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 text-brand-700 font-semibold hover:gap-3 transition-all shrink-0"
            >
              {t("viewAll")} <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {collections.map((c, i) => (
              <Link
                key={c.id}
                to={`/shop?q=${encodeURIComponent(c.name.split(" ")[0] ?? "")}`}
                className={`group relative h-52 sm:h-64 rounded-2xl sm:rounded-3xl overflow-hidden shadow-card ${COLLECTION_BG[i % 3]}`}
              >
                <ProductImage
                  src={c.imageUrl}
                  alt=""
                  className="absolute top-2 right-2 h-[62%] w-auto max-w-[52%] object-contain object-bottom drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[#F3E7D9] via-[#F3E7D9]/90 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 z-10 flex items-end justify-between gap-3">
                  <div>
                    <span className="px-3 py-1 bg-white text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full text-[#3F2412] mb-2 inline-block">
                      {c.tag}
                    </span>
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-[#3F2412]">
                      {c.name}
                    </h3>
                  </div>
                  <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#3F2412] shrink-0">
                    <FontAwesomeIcon icon={faArrowRight} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-10 bg-white relative overflow-hidden">
        <SectionDecor variant="trending" />
        <div className="container-page relative z-10">
          <div className="flex items-center justify-between mb-5 gap-3">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
              {t("trending")}
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scroll(-1)}
                className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-300"
                aria-label="Majtas"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-300"
                aria-label="Djathtas"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
          {loading ? (
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="min-w-[260px] h-80 rounded-2xl bg-brand-50 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div
                ref={scroller}
                onScroll={() => {
                  const el = scroller.current;
                  if (!el) return;
                  setDot(Math.round(el.scrollLeft / 300));
                }}
                className="flex overflow-x-auto hide-scroll gap-4 sm:gap-6 pb-4 snap-x snap-mandatory"
              >
                {trending.map((p) => (
                  <ProductCard key={p.id} product={p} variant="carousel" />
                ))}
              </div>
              <div className="flex justify-center gap-2 mt-2">
                {trending.map((p, i) => (
                  <span
                    key={p.id}
                    className={`h-1.5 rounded-full transition-all ${
                      i === Math.min(dot, trending.length - 1)
                        ? "w-6 bg-brand-600"
                        : "w-1.5 bg-brand-200"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="py-6 sm:py-8 bg-brand-50 relative overflow-hidden">
        <SectionDecor variant="trust" />
        <div className="container-page relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                icon: faTruckFast,
                title: "Transport falas",
                text: "Falas mbi 5.000 Lekë në të gjithë Shqipërinë.",
                bg: "bg-brand-100 text-brand-700",
              },
              {
                icon: faHandHoldingHeart,
                title: "Pelushë të buta",
                text: "Materiale premium, të sigurta për fëmijë.",
                bg: "bg-pink-100 text-pink-700",
              },
              {
                icon: faRotateLeft,
                title: t("cod"),
                text: "Paguani kur merrni pelushin në derë.",
                bg: "bg-amber-100 text-amber-800",
              },
              {
                icon: faShieldHalved,
                title: "Porosi e thjeshtë",
                text: "Plotëso të dhënat dhe ne të kontaktojmë.",
                bg: "bg-yellow-100 text-yellow-800",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm text-center"
              >
                <div
                  className={`w-12 h-12 ${f.bg} rounded-full flex items-center justify-center text-xl mx-auto mb-3`}
                >
                  <FontAwesomeIcon icon={f.icon} />
                </div>
                <h3 className="font-bold text-base mb-1 text-slate-900">{f.title}</h3>
                <p className="text-[#4a3018] text-sm">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-6 sm:py-10 bg-white relative overflow-hidden">
        <SectionDecor variant="about" />
        <div className="container-page relative z-10 grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 mb-3">
              {t("whyAruland")}
            </h2>
            <p className="text-[#3F2412] leading-relaxed mb-4">{t("aboutText")}</p>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 mt-0.5" />
                Pagesë në dorëzim në të gjithë Shqipërinë
              </li>
              <li className="flex gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 mt-0.5" />
                Modele të buta: Stitch, arusha, capybara, elefant
              </li>
            </ul>
          </div>
          <div className="rounded-3xl bg-brand-50 p-6 flex items-center justify-center min-h-[240px] relative overflow-hidden">
            <ProductImage
              src="/products/stitch-blue.jpg"
              alt="Stitch Blu AruLand"
              className="max-h-56 object-contain relative z-10"
            />
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-10 bg-brand-50 relative overflow-hidden">
        <SectionDecor variant="reviews" />
        <div className="container-page relative z-10">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 mb-5">
            {t("whatCustomersSay")}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {REVIEWS.map((r) => (
              <figure key={r.name} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="text-yellow-400 text-sm mb-2">{"★".repeat(r.stars)}</div>
                <blockquote className="text-[#3F2412] text-sm leading-relaxed mb-4">
                  “{r.text}”
                </blockquote>
                <figcaption className="text-sm font-semibold text-slate-900">
                  {r.name}{" "}
                  <span className="font-normal text-[#4a3018]">· {r.city}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-10 relative overflow-hidden">
        <SectionDecor variant="faq" />
        <div className="container-page relative z-10">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 mb-5 flex items-center gap-2">
            <FontAwesomeIcon icon={faQuestionCircle} className="text-brand-600" />
            {t("faq")}
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="bg-white border border-brand-100 rounded-2xl p-4 group"
              >
                <summary className="font-semibold text-slate-900 cursor-pointer list-none flex justify-between gap-3">
                  {item.q}
                  <span className="text-brand-600 group-open:rotate-45 transition">+</span>
                </summary>
                <p className="text-sm text-[#4a3018] mt-2 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <InstagramProfile />

      <section className="py-6 sm:py-8 relative overflow-hidden">
        <div className="container-page relative z-10">
          <div className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-pink-50 border border-brand-100 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <SectionDecor variant="shipping" />
            <div className="relative z-10">
              <h3 className="font-bold text-lg text-slate-900 mb-1">Dërgesa & pagesa</h3>
              <p className="text-sm text-slate-600">
                Pagesë në dorëzim · Kurierë lokalë · Transport falas mbi 5.000 Lekë
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1.5 rounded-full bg-brand-50 text-brand-800 text-xs font-bold shadow-sm rotate-[-3deg]">
                COD
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white border border-brand-100 text-slate-700 text-xs font-bold shadow-sm rotate-[2deg]">
                Kurier Shqipëri
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
