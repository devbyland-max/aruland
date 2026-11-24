import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faHandHoldingHeart,
  faRotateLeft,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import { api, type Collection, type Product } from "../lib/api";
import { ProductCard } from "../components/ProductCard";
import { InstagramProfile } from "../components/InstagramProfile";
import { Seo } from "../components/Seo";

const HERO_PHOTOS = [
  { src: "/products/stitch-blue.jpg", alt: "Stitch Blu, pelush AruLand" },
  { src: "/products/arushi-roze.jpg", alt: "Arushë rozë AruLand" },
  { src: "/products/capybara.jpg", alt: "Capybara e butë AruLand" },
  { src: "/products/elephant.jpg", alt: "Elefant gri AruLand" },
];

const HOME_PHOTOS = [
  { src: "/products/arushi-jumbo.jpg", alt: "Arushi jumbo krem AruLand", className: "sm:col-span-2 sm:row-span-2" },
  { src: "/products/breathing-bunny.jpg", alt: "Lepur i butë me sy të mbyllur", className: "" },
  { src: "/products/stitch-pink.jpg", alt: "Stitch rozë AruLand", className: "" },
  { src: "/products/arushi-mini.jpg", alt: "Arushë e vogël AruLand", className: "" },
  { src: "/products/arushi-kafe.jpg", alt: "Arushi kafe AruLand", className: "" },
];

type Shelf = "new" | "popular" | "sale";

function isOffer(product: Product) {
  return product.compareAtPrice != null || product.badges.some((b) => b.toLowerCase() === "sale");
}

export function HomePage() {
  const [popular, setPopular] = useState<Product[]>([]);
  const [newest, setNewest] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [shelf, setShelf] = useState<Shelf>("popular");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const [pop, fresh, cols] = await Promise.all([
          api.products({ sort: "popular", limit: 10 }),
          api.products({ sort: "newest", limit: 8 }),
          api.collections(),
        ]);
        setPopular(pop.items);
        setNewest(fresh.items);
        setCollections(cols.collections);
      } catch {
        /* API may be down */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const offers = useMemo(() => {
    const seen = new Set<string>();
    return [...newest, ...popular].filter((product) => {
      if (!isOffer(product) || seen.has(product.id)) return false;
      seen.add(product.id);
      return true;
    });
  }, [newest, popular]);

  const shelfItems =
    shelf === "new" ? newest.slice(0, 5) : shelf === "sale" ? offers.slice(0, 5) : popular.slice(0, 5);

  return (
    <>
      <Seo
        title="AruLand Toy Store | Pelushë dhe arusha në Shqipëri"
        description="Pelushë të butë për përqafime dhe dhurata. Arusha, Stitch, Capybara dhe më shumë, me pagesë në dorëzim. Transport falas mbi 5.000 Lekë."
        path="/"
      />

      <section className="relative min-h-[78vh] overflow-hidden bg-[#f6efe6]">
        <div className="absolute inset-0 grid grid-cols-2">
          {HERO_PHOTOS.map((photo) => (
            <img
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              className="h-full w-full object-cover"
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#f6efe6] from-0% via-[#f6efe6]/88 via-[28%] to-transparent to-[52%]" />
        <div className="relative z-10 flex min-h-[78vh] items-center">
          <div className="container-page w-full py-16 fade-up">
            <div className="max-w-xl">
              <p className="text-xs tracking-[0.22em] uppercase text-brand-600 mb-4">AruLand Toy Store</p>
              <h1 className="font-display font-medium text-5xl sm:text-6xl lg:text-7xl text-[#3F2412] leading-[1.02]">
                Gjej mikun tënd të ri
              </h1>
              <p className="mt-5 max-w-md text-base sm:text-lg text-[#5c3a22] leading-relaxed">
                Arusha të butë për përqafime. Stitch, capybara dhe kafshë me frymëmarrje, me pagesë në dorëzim në Shqipëri dhe Kosovë.
              </p>
              <Link
                to="/shop"
                className="mt-8 inline-flex w-fit px-8 py-3.5 rounded-full bg-[#3F2412] text-white text-sm font-semibold hover:bg-brand-700"
              >
                Bli tani
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#3F2412] text-[#f6efe6] overflow-hidden py-2.5">
        <div className="marquee-track text-xs sm:text-sm tracking-wide">
          {Array.from({ length: 2 }).map((_, copy) => (
            <span key={copy} className="px-6 whitespace-nowrap">
              Transport falas mbi 5.000 Lekë · Pagesë në dorëzim · Pelushë të zgjedhur me dorë · Dërgesë 1–3 ditë ·
            </span>
          ))}
        </div>
      </div>

      <section className="container-page py-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: faTruckFast, title: "Transport falas", text: "Mbi 5.000 Lekë" },
          { icon: faHandHoldingHeart, title: "Pagesë në dorëzim", text: "Cash kur të vijë paketa" },
          { icon: faComments, title: "WhatsApp", text: "Përgjigje për porosinë" },
          { icon: faRotateLeft, title: "Kthim 14 ditë", text: "Nëse pelushi nuk të përshtatet" },
        ].map((item) => (
          <div key={item.title} className="flex items-start gap-3 py-2">
            <FontAwesomeIcon icon={item.icon} className="mt-1 text-[#3F2412]" />
            <div>
              <p className="text-sm font-semibold text-[#3F2412]">{item.title}</p>
              <p className="text-xs text-[#5c3a22]">{item.text}</p>
            </div>
          </div>
        ))}
      </section>

      <section id="collections" className="container-page pb-6">
        <h2 className="font-display text-3xl sm:text-4xl font-medium mb-5">Më të shiturat</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {(
            [
              ["popular", "Më të shitura"],
              ["new", "Të rejat"],
              ["sale", "Oferta"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setShelf(id)}
              className={`px-4 py-2 rounded-full text-sm ${
                shelf === id ? "bg-[#3F2412] text-white" : "bg-white text-[#3F2412]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {loading ? (
          <p className="text-sm text-[#5c3a22]">Duke ngarkuar pelushët...</p>
        ) : shelfItems.length === 0 ? (
          <p className="text-sm text-[#5c3a22]">Nuk ka produkte në këtë listë ende.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {shelfItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        {collections.length > 0 && (
          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                to="/shop"
                className="relative min-h-36 rounded-2xl overflow-hidden bg-[#f6efe6]"
              >
                <img
                  src={collection.imageUrl}
                  alt={collection.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <span className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#f6efe6] to-transparent font-display text-xl text-[#3F2412]">
                  {collection.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="container-page py-12">
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2 className="font-display text-3xl sm:text-4xl font-medium">Të rejat</h2>
          <Link to="/shop?sort=newest" className="text-sm font-semibold underline underline-offset-4">
            Shiko të gjitha
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {newest.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section id="about" className="container-page py-8 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <img
          src="/products/arushi-kafe.jpg"
          alt="Arushi kafe AruLand, i gatshëm për dhuratë"
          loading="lazy"
          className="w-full aspect-[4/5] object-cover rounded-3xl bg-[#f6efe6]"
        />
        <div>
          <h2 className="font-display text-4xl sm:text-5xl font-medium leading-tight">Për kë është AruLand?</h2>
          <ul className="mt-6 space-y-4 text-[#3F2412]">
            <li>Për fëmijën që fle më qetë me një mik të butë pranë.</li>
            <li>Për dhuratën që do ta mbash mend, jo për një lodër që harrohet.</li>
            <li>Për prindin që do pagesë në dorëzim dhe një pelush të pastër.</li>
          </ul>
          <Link
            to="/shop"
            className="mt-8 inline-flex px-7 py-3 rounded-full bg-[#3F2412] text-white text-sm font-semibold"
          >
            Zgjidh një pelush
          </Link>
        </div>
      </section>

      <section className="container-page py-12">
        <h2 className="font-display text-3xl sm:text-4xl font-medium mb-6">Pelushët në shtëpi</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 auto-rows-[140px] sm:auto-rows-[180px]">
          {HOME_PHOTOS.map((photo) => (
            <img
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className={`w-full h-full object-cover rounded-2xl ${photo.className}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ))}
        </div>
      </section>

      <section className="px-6 py-16 sm:py-24 text-center">
        <p className="font-display font-medium text-3xl sm:text-5xl lg:text-6xl text-[#3F2412] leading-tight max-w-4xl mx-auto">
          Të zgjedhur me dorë.
          <br />
          Të testuar për butësi.
          <br />
          Të dërguar me dashuri.
        </p>
      </section>

      <section className="container-page pb-16 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <img
          src="/products/breathing-otter.jpg"
          alt="Vidër me frymëmarrje, pelush i butë AruLand"
          loading="lazy"
          className="w-full aspect-square object-cover rounded-3xl bg-[#f6efe6]"
        />
        <div>
          <h2 className="font-display text-4xl font-medium">Si zgjedhim pelushët</h2>
          <p className="mt-4 text-[#3F2412] leading-relaxed">
            Çdo model kalon nga dora jonë para se të hyjë në dyqan. Shohim qepjet, mbushjen dhe nëse pelushi qëndron i butë pas një përqafimi. Materiali është pelush i destinuar për dhomën e fëmijës, dhe e dërgojmë të paketuar pastër.
          </p>
          <p className="mt-3 text-sm text-[#5c3a22]">Pa video të jashtme. Kjo është fotoja reale e modelit.</p>
        </div>
      </section>

      <InstagramProfile />
    </>
  );
}
