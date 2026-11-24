import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faStar } from "@fortawesome/free-solid-svg-icons";
import { api } from "../lib/api";
import type { Product } from "../lib/types";
import { useCart } from "../context/CartContext";
import { formatMoney } from "../lib/utils";
import { ProductImage } from "../components/ProductImage";
import { ProductCard } from "../components/ProductCard";
import { absoluteUrl, Seo } from "../components/Seo";
import { PRODUCT_COLORS } from "../lib/catalog";
import { whatsAppLink } from "../lib/shop";

function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const startX = useRef(0);
  const count = images.length;
  const current = images[Math.min(index, Math.max(0, count - 1))] ?? images[0];
  const go = (dir: -1 | 1) => {
    if (count < 2) return;
    setIndex((i) => (i + dir + count) % count);
  };

  useEffect(() => {
    setIndex(0);
  }, [images]);

  return (
    <div>
      <div
        className="relative aspect-square bg-[#f6efe6] rounded-3xl overflow-hidden flex items-center justify-center"
        onTouchStart={(e) => {
          startX.current = e.touches[0]?.clientX ?? 0;
        }}
        onTouchEnd={(e) => {
          const dx = (e.changedTouches[0]?.clientX ?? 0) - startX.current;
          if (dx > 40) go(-1);
          if (dx < -40) go(1);
        }}
      >
        {current && (
          <ProductImage
            src={current}
            alt={alt}
            loading="eager"
            className="max-h-full max-w-full object-contain"
          />
        )}
        {count > 1 && (
          <>
            <button type="button" aria-label="Fotoja e mëparshme" onClick={() => go(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white">
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button type="button" aria-label="Fotoja tjetër" onClick={() => go(1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white">
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </>
        )}
      </div>
      {count > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {images.slice(0, 5).map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              aria-label={`Foto ${i + 1} e ${alt}`}
              onClick={() => setIndex(i)}
              className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#f6efe6] border-2 ${
                i === index ? "border-[#3F2412]" : "border-transparent"
              }`}
            >
              <ProductImage src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const TABS = ["Përshkrimi", "Dërgesa", "Kthimet", "Materiali & kujdesi"] as const;

export function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Përshkrimi");
  const [error, setError] = useState("");
  const { addItem } = useCart();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    void (async () => {
      try {
        const { product: p } = await api.product(slug);
        setProduct(p);
        const list = await api.products({ limit: 12 });
        setRelated(list.items.filter((item) => item.id !== p.id).slice(0, 5));
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return <p className="container-page py-24 text-[#5c3a22]">Duke hapur pelushin...</p>;
  }

  if (!product) {
    return (
      <div className="py-24 text-center text-[#5c3a22]">
        Ky pelush nuk u gjet.{" "}
        <Link to="/shop" className="font-semibold underline">
          Kthehu te dyqani
        </Link>
      </div>
    );
  }

  const soldOut = product.stock < 1;
  const gallery = product.imageUrls?.length ? product.imageUrls : [product.imageUrl];
  const color = PRODUCT_COLORS.find((c) => c.value === product.color)?.label ?? product.color;
  const wa = whatsAppLink(
    `Përshëndetje, dua të porosis ${product.name}, ${product.sizeCm} cm, sasia ${qty}.`
  );

  return (
    <article className="pb-16">
      <Seo
        title={product.name}
        description={product.description.slice(0, 160)}
        path={`/product/${product.slug}`}
        image={gallery[0]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: absoluteUrl(gallery[0]),
          sku: product.slug,
          brand: { "@type": "Brand", name: "AruLand" },
          offers: {
            "@type": "Offer",
            url: absoluteUrl(`/product/${product.slug}`),
            priceCurrency: "ALL",
            price: product.price,
            availability: soldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
          },
        }}
      />
      <div className="container-page pt-6">
        <p className="text-xs text-[#5c3a22] mb-6">
          <Link to="/">Ballina</Link>
          <span> · </span>
          <Link to="/shop">Pelushë</Link>
          <span> · </span>
          <span>{product.name}</span>
        </p>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          <ProductGallery images={gallery} alt={`${product.name}, pelush AruLand`} />

          <div>
            <h1 className="font-display font-medium text-4xl sm:text-5xl text-[#3F2412]">{product.name}</h1>
            <p className="mt-3 flex items-center gap-2 text-sm text-[#5c3a22]">
              <FontAwesomeIcon icon={faStar} className="text-amber-500" />
              {product.rating.toFixed(1)} yje të listuara
            </p>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl font-semibold">{formatMoney(product.price)}</span>
              {product.compareAtPrice != null && (
                <span className="text-lg text-[#8a6a52] line-through">{formatMoney(product.compareAtPrice)}</span>
              )}
            </div>

            <p className="mt-6 text-xs tracking-wide uppercase text-[#5c3a22]">Madhësia</p>
            <div className="mt-2">
              <span className="inline-flex px-4 py-2 rounded-full border border-[#3F2412] text-sm">
                {product.sizeCm} cm
              </span>
            </div>
            <p className="mt-2 text-xs text-[#5c3a22]">Ky model vjen vetëm në këtë madhësi.</p>

            <p className="mt-5 text-xs tracking-wide uppercase text-[#5c3a22]">Ngjyra</p>
            <div className="mt-2">
              <span className="inline-flex px-4 py-2 rounded-full bg-[#f6efe6] text-sm">{color}</span>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button type="button" className="w-10 h-10 rounded-full border" onClick={() => setQty((n) => Math.max(1, n - 1))} aria-label="Zvogëlo sasinë">
                −
              </button>
              <span className="w-8 text-center">{qty}</span>
              <button type="button" className="w-10 h-10 rounded-full border" onClick={() => setQty((n) => Math.min(product.stock || 1, n + 1))} aria-label="Rrit sasinë" disabled={soldOut}>
                +
              </button>
            </div>

            {error && <p className="mt-3 text-sm text-accent-pink">{error}</p>}

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                disabled={soldOut}
                onClick={async () => {
                  try {
                    setError("");
                    await addItem(product.id, qty);
                  } catch (e) {
                    setError(e instanceof Error ? e.message : "Nuk u shtua në shportë");
                  }
                }}
                className="flex-1 py-3.5 rounded-full bg-[#3F2412] text-white font-semibold disabled:opacity-40"
              >
                {soldOut ? "Pa stok" : "Shto në shportë"}
              </button>
              <a href={wa} target="_blank" rel="noreferrer" className="flex-1 py-3.5 rounded-full border border-[#3F2412] text-center font-semibold">
                Porosit në WhatsApp
              </a>
            </div>
            <p className="mt-3 text-sm text-[#5c3a22]">Pagesë në dorëzim. Nuk paguhet online.</p>

            <ul className="mt-6 space-y-2 text-sm text-[#3F2412]">
              <li>Mbërrin brenda 1–3 ditësh</li>
              <li>Transport falas mbi 5.000 Lekë</li>
              <li>Kthim brenda 14 ditësh nëse pelushi është i papërdorur</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-[#eadfd2] pt-6">
          <div className="flex gap-4 overflow-x-auto text-sm">
            {TABS.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setTab(name)}
                className={`pb-2 whitespace-nowrap ${tab === name ? "border-b-2 border-[#3F2412] font-semibold" : "text-[#5c3a22]"}`}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="max-w-2xl py-6 text-[#3F2412] leading-relaxed space-y-3">
            {tab === "Përshkrimi" && (
              <>
                <h2 className="font-display text-2xl font-medium">Pse do e duash</h2>
                <p>{product.description}</p>
                <h2 className="font-display text-2xl font-medium">Madhësia</h2>
                <p>{product.sizeCm} cm, e mjaftueshme për përqafim dhe për ta vendosur në krevat ose në raft.</p>
                <h2 className="font-display text-2xl font-medium">Materiali</h2>
                <p>Pelush i butë, i qepur për lojë të qetë. Ngjyra e këtij modeli është {color.toLowerCase()}.</p>
              </>
            )}
            {tab === "Dërgesa" && (
              <p>Dërgojmë në Shqipëri dhe Kosovë me korrier. Zakonisht paketa niset brenda një dite pune dhe mbërrin për 1–3 ditë. Mbi 5.000 Lekë transporti është falas, përndryshe 300 Lekë.</p>
            )}
            {tab === "Kthimet" && (
              <p>Ke 14 ditë për ta kthyer pelushin nëse është i papërdorur dhe me etiketën. Na shkruaj në WhatsApp para se ta dërgosh mbrapsht.</p>
            )}
            {tab === "Materiali & kujdesi" && (
              <p>Pastro njollat e lehta me leckë të lagur. Për një freskim të plotë, vendose në cikël të butë dhe lëre të thahet vetë, larg ngrohjes së fortë. Mos e hekuros.</p>
            )}
          </div>
        </div>

        <section className="mt-8 grid md:grid-cols-2 gap-8 items-center bg-[#f6efe6] rounded-3xl p-6 sm:p-8">
          <ProductImage
            src={gallery[0]}
            alt={`${product.name} pas një freskimi të lehtë`}
            loading="lazy"
            className="w-full aspect-square object-contain"
          />
          <div>
            <h2 className="font-display text-3xl font-medium">Këshillë: si ta shkrish pelushin</h2>
            <p className="mt-3 leading-relaxed">
              Nëse vjen pak i ngjeshur nga paketa, lëre të marrë formë me duar dhe një orë në ajër. Pastaj një cikël i shkurtër me ajër të vakët e kthen butësinë. Nuk kemi video të veçantë për këtë model.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-3xl font-medium">Vlerësimet</h2>
          <p className="mt-3 text-[#5c3a22] max-w-xl">
            Ky pelush ka {product.rating.toFixed(1)} yje të vendosura te produkti. Nuk publikojmë komente të shkruara derisa të jenë nga porosi reale, ndaj këtu nuk ka emra të sajuara.
          </p>
        </section>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-3xl font-medium mb-6">Mund të të pëlqejnë edhe</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
