import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCheckCircle,
  faChevronLeft,
  faChevronRight,
  faHandHoldingHeart,
  faLeaf,
  faRotateLeft,
  faShieldHalved,
  faStar,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import { api, type Collection, type Product } from "../lib/api";
import { ProductCard } from "../components/ProductCard";

const HERO_IMG =
  "https://cdn.dribbble.com/userupload/12469058/file/original-860d2fadb2444b4b9d4d6792189900a0.png";

export function HomePage() {
  const [trending, setTrending] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [shopPreview, setShopPreview] = useState<Product[]>([]);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void (async () => {
      try {
        const [prod, cols, preview] = await Promise.all([
          api.products({ sort: "popular", limit: 8 }),
          api.collections(),
          api.products({ sort: "newest", limit: 6 }),
        ]);
        setTrending(prod.items);
        setCollections(cols.collections);
        setShopPreview(preview.items);
      } catch {
        /* API may be down */
      }
    })();
  }, []);

  const scroll = (dir: -1 | 1) => {
    scroller.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  const collectionBg = ["bg-brand-100", "bg-pink-50", "bg-amber-50"];

  return (
    <>
      <section className="relative pt-4 pb-10 sm:pt-8 sm:pb-16 lg:py-16 overflow-hidden">
        <div className="container-page">
          <div className="bg-brand-50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-14 relative overflow-hidden shadow-soft">
            <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-brand-200 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-56 sm:w-96 h-56 sm:h-96 bg-brand-100 rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/4" />

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
              <div className="space-y-5 sm:space-y-7 text-center lg:text-left order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-full shadow-sm text-xs sm:text-sm font-semibold text-brand-600">
                  <span className="w-2 h-2 rounded-full bg-accent-pink animate-pulse" />
                  New Collection Available
                </div>
                <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-slate-900 leading-[1.1]">
                  Meet Your New <br className="hidden sm:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-700">
                    Best Friend
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 max-w-md mx-auto lg:mx-0 leading-relaxed">
                  Handcrafted, ultra-soft plushies made for hugs. Discover adorable
                  companions from AruLand Toy Store.
                </p>
                <div className="flex flex-col xs:flex-row sm:flex-row items-stretch sm:items-center gap-3 justify-center lg:justify-start">
                  <Link
                    to="/shop"
                    className="px-7 py-3.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Shop Now <FontAwesomeIcon icon={faArrowRight} />
                  </Link>
                </div>
                <div className="pt-2 sm:pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-slate-500">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                    Free Shipping
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                    4.9/5 Rating
                  </div>
                </div>
              </div>

              <div className="relative h-[240px] sm:h-[340px] lg:h-[460px] flex items-center justify-center order-1 lg:order-2">
                <div className="hidden sm:flex absolute top-6 right-4 lg:top-10 lg:right-10 bg-white p-3 lg:p-4 rounded-2xl shadow-float z-20 animate-bounce [animation-duration:3s]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 lg:w-10 lg:h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <FontAwesomeIcon icon={faLeaf} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Material</p>
                      <p className="text-sm font-bold text-slate-800">Eco-Cotton</p>
                    </div>
                  </div>
                </div>
                <img
                  src={HERO_IMG}
                  alt="AruLand plush"
                  className="max-w-[85%] sm:max-w-full max-h-full object-contain drop-shadow-2xl z-10 hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="collections" className="py-10 sm:py-14">
        <div className="container-page">
          <div className="flex justify-between items-end gap-4 mb-6 sm:mb-10">
            <div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 mb-1 sm:mb-2">
                Explore Collections
              </h2>
              <p className="text-slate-500 text-sm sm:text-base">
                Find the perfect companion for every mood.
              </p>
            </div>
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 text-brand-600 font-semibold hover:gap-3 transition-all shrink-0"
            >
              View All <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {collections.map((c, i) => (
              <Link
                key={c.id}
                to={`/shop?q=${encodeURIComponent(c.name.split(" ")[0] ?? "")}`}
                className={`group relative h-56 sm:h-72 lg:h-80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-card ${collectionBg[i % 3]}`}
              >
                <div className="absolute inset-0 p-5 sm:p-8 flex flex-col justify-between z-10">
                  <div>
                    <span className="px-3 py-1 bg-white/80 backdrop-blur text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full text-slate-800 mb-2 sm:mb-3 inline-block">
                      {c.tag}
                    </span>
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900">
                      {c.name}
                    </h3>
                  </div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center text-slate-900 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 translate-y-0 sm:translate-y-4 sm:group-hover:translate-y-0 transition-all duration-300">
                    <FontAwesomeIcon icon={faArrowRight} />
                  </div>
                </div>
                <img
                  src={c.imageUrl}
                  className="absolute bottom-0 right-0 w-1/2 sm:w-3/4 object-contain translate-y-2 translate-x-2 sm:translate-y-4 sm:translate-x-4 group-hover:scale-110 transition-transform duration-500"
                  alt={c.name}
                />
              </Link>
            ))}
          </div>
          <Link
            to="/shop"
            className="sm:hidden mt-5 inline-flex items-center gap-2 text-brand-600 font-semibold"
          >
            View All <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </section>

      <section className="py-10 sm:py-14 bg-white">
        <div className="container-page">
          <div className="flex items-center justify-between mb-6 sm:mb-8 gap-3">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
              Trending Now
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scroll(-1)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-brand-50"
                aria-label="Scroll left"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-brand-50"
                aria-label="Scroll right"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
          <div ref={scroller} className="flex overflow-x-auto hide-scroll gap-4 sm:gap-6 pb-6 snap-x">
            {trending.map((p) => (
              <ProductCard key={p.id} product={p} variant="carousel" />
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-16 bg-brand-50">
        <div className="container-page">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: faTruckFast,
                title: "Transport falas",
                text: "Falas mbi 5000 ALL në të gjithë Shqipërinë.",
                bg: "bg-brand-100 text-brand-600",
              },
              {
                icon: faHandHoldingHeart,
                title: "Arusha të buta",
                text: "Materiale premium, të sigurta për fëmijë.",
                bg: "bg-pink-100 text-pink-600",
              },
              {
                icon: faRotateLeft,
                title: "Pagesë në dorëzim",
                text: "Paguani kur merrni arushin në derë.",
                bg: "bg-amber-100 text-amber-700",
              },
              {
                icon: faShieldHalved,
                title: "Porosi e thjeshtë",
                text: "Plotëso të dhënat dhe ne të kontaktojmë për dorëzim.",
                bg: "bg-yellow-100 text-yellow-700",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm text-center hover:-translate-y-1 transition-transform"
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 ${f.bg} rounded-full flex items-center justify-center text-xl sm:text-2xl mx-auto mb-3 sm:mb-4`}
                >
                  <FontAwesomeIcon icon={f.icon} />
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-16">
        <div className="container-page">
          <div className="flex justify-between items-end gap-3 mb-6 sm:mb-8">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
              Shop Favorites
            </h2>
            <Link to="/shop" className="text-brand-600 font-semibold text-sm sm:text-base shrink-0">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {shopPreview.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
