import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faHeart } from "@fortawesome/free-solid-svg-icons";
import { api } from "../lib/api";
import type { Product } from "../lib/types";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatMoney } from "../lib/utils";

export function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const { addItem } = useCart();
  const { ids, toggle } = useWishlist();
  const isWished = (id: string) => ids.has(id);

  useEffect(() => {
    if (!slug) return;
    void (async () => {
      try {
        const { product: p } = await api.product(slug);
        setProduct(p);
      } catch {
        setProduct(null);
      }
    })();
  }, [slug]);

  if (!product) {
    return (
      <div className="py-24 text-center text-slate-500">
        Product not found.{" "}
        <Link to="/shop" className="text-brand-600 font-semibold">
          Back to shop
        </Link>
      </div>
    );
  }

  const soldOut = product.stock < 1;

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="container-page">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-12 items-start">
          <div className="bg-brand-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 flex items-center justify-center min-h-[260px] sm:min-h-[380px] lg:min-h-[420px]">
            <img
              src={product.imageUrl}
              alt={product.name}
              className={`max-h-[240px] sm:max-h-[360px] lg:max-h-[400px] object-contain drop-shadow-2xl ${soldOut ? "opacity-50 grayscale" : ""}`}
            />
          </div>

          <div className="space-y-5 sm:space-y-6">
            <div>
              <p className="text-sm font-semibold text-brand-600 mb-2">{product.category}</p>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl font-bold text-brand-600">
                  {formatMoney(product.price)}
                </span>
                {product.compareAtPrice != null && (
                  <span className="text-base sm:text-lg text-slate-400 line-through">
                    {formatMoney(product.compareAtPrice)}
                  </span>
                )}
              </div>
              <p className="text-sm text-[#4a3018] mt-2">
                ★ {product.rating.toFixed(1)} · {product.sizeCm}cm ·{" "}
                {soldOut ? "Pa stok" : `${product.stock} në stok`}
              </p>
            </div>

            <p className="text-[#3F2412] leading-relaxed text-sm sm:text-base">{product.description}</p>

            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-slate-600">Qty</label>
              <input
                type="number"
                min={1}
                max={product.stock || 1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                className="w-20 border border-brand-100 rounded-xl px-3 py-2 bg-white"
                disabled={soldOut}
              />
            </div>

            {error && <p className="text-sm text-accent-pink">{error}</p>}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                disabled={soldOut}
                onClick={async () => {
                  try {
                    setError("");
                    await addItem(product.id, qty);
                  } catch (e) {
                    setError(e instanceof Error ? e.message : "Could not add to cart");
                  }
                }}
                className="flex-1 py-3.5 sm:py-4 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faCartPlus} /> Add to Cart
              </button>
              <button
                type="button"
                onClick={() => void toggle(product.id)}
                className={`px-6 py-3.5 sm:py-4 rounded-xl border font-semibold flex items-center justify-center gap-2 ${
                  isWished(product.id)
                    ? "border-accent-pink text-accent-pink bg-accent-light"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <FontAwesomeIcon icon={faHeart} /> Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
