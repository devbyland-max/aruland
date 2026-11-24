import { type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartPlus,
  faStar,
  faStarHalfStroke,
  faHeart as faHeartSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import type { Product } from "../lib/api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useLang } from "../context/LangContext";
import { badgeLabel, formatMoney, productMaterial } from "../lib/utils";
import { ProductImage } from "./ProductImage";

type Props = {
  product: Product;
  variant?: "carousel" | "trending" | "grid";
};

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex text-yellow-400 text-xs gap-0.5" aria-label={`${rating} yje`}>
      {Array.from({ length: full }).map((_, i) => (
        <FontAwesomeIcon key={`f${i}`} icon={faStar} />
      ))}
      {half && <FontAwesomeIcon icon={faStarHalfStroke} />}
      {Array.from({ length: Math.max(0, 5 - full - (half ? 1 : 0)) }).map((_, i) => (
        <FontAwesomeIcon key={`e${i}`} icon={faStar} className="opacity-25" />
      ))}
    </div>
  );
}

export function ProductCard({ product, variant = "grid" }: Props) {
  const { addItem } = useCart();
  const { ids, toggle } = useWishlist();
  const { t } = useLang();
  const wished = ids.has(product.id);
  const soldOut = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const badge = soldOut
    ? "PA STOK"
    : product.badges[0]
      ? badgeLabel(product.badges[0])
      : null;
  const isCarousel = variant === "carousel" || variant === "trending";

  const onWish = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggle(product.id);
    } catch {
      /* ignore */
    }
  };

  const wishBtn = (
    <button
      type="button"
      onClick={onWish}
      aria-label={wished ? "Hiq nga lista e dëshirave" : "Shto te lista e dëshirave"}
      className={`absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center z-20 focus:outline-none focus:ring-2 focus:ring-brand-300 ${
        wished ? "text-accent-pink" : "text-slate-500 hover:text-accent-pink"
      }`}
    >
      <FontAwesomeIcon icon={wished ? faHeartSolid : faHeartRegular} />
    </button>
  );

  const badgeEl = badge ? (
    <div
      className={`absolute top-3 left-3 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded z-20 shadow-sm ${
        badge === "PA STOK"
          ? "bg-slate-800"
          : badge === "HOT"
            ? "bg-red-500"
            : badge === "OFERTË"
              ? "bg-amber-600"
              : "bg-accent-pink"
      }`}
    >
      {badge}
    </div>
  ) : null;

  const meta = (
    <p className="text-xs sm:text-sm text-[#4a3018]">
      {product.sizeCm}cm · {productMaterial(product)}
    </p>
  );

  const stockLine = soldOut ? (
    <p className="text-xs font-semibold text-slate-600 mt-1">{t("outOfStock")}</p>
  ) : lowStock ? (
    <p className="text-xs font-semibold text-amber-700 mt-1">
      {t("leftInStock", { n: product.stock })}
    </p>
  ) : null;

  const priceBlock = (
    <div className="flex flex-col items-end shrink-0">
      <span
        className={`font-bold text-base sm:text-lg ${
          product.compareAtPrice ? "text-accent-pink" : "text-brand-600"
        }`}
      >
        {formatMoney(product.price)}
      </span>
      {product.compareAtPrice != null && (
        <span className="text-xs text-slate-500 line-through">
          {formatMoney(product.compareAtPrice)}
        </span>
      )}
    </div>
  );

  if (isCarousel) {
    return (
        <div className="min-w-[240px] sm:min-w-[280px] md:min-w-[300px] snap-center shrink-0">
          <div className="bg-surface-light rounded-2xl sm:rounded-3xl p-4 sm:p-5 relative group hover:shadow-card transition-all duration-300 border border-transparent hover:border-brand-100 h-full flex flex-col overflow-visible">
            {badgeEl}
            {wishBtn}
            <Link
              to={`/product/${product.slug}`}
              className="h-44 sm:h-52 md:h-56 flex items-center justify-center mb-4 relative overflow-hidden rounded-2xl bg-brand-50/60"
            >
              <ProductImage
                src={product.imageUrl}
                alt={product.name}
                width={280}
                height={224}
                className="h-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
            <div className="mt-auto">
              <div className="flex justify-between items-start gap-2 mb-1">
                <div className="min-w-0">
                  <Link
                    to={`/product/${product.slug}`}
                    className="font-bold text-base sm:text-lg text-slate-900 line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  {meta}
                  {stockLine}
                </div>
                {priceBlock}
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  disabled={soldOut}
                  onClick={() => void addItem(product.id)}
                  className="flex-1 py-2.5 sm:py-3 bg-brand-600 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-brand-700 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-brand-300"
                >
                  <FontAwesomeIcon icon={faCartPlus} /> {t("addToCart")}
                </button>
              </div>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="bg-transparent group">
        <div className="relative bg-[#f6efe6] aspect-square mb-3 overflow-hidden rounded-2xl">
          {badgeEl}
          {wishBtn}
          <Link to={`/product/${product.slug}`} className="absolute inset-0 block">
            <ProductImage
              src={product.imageUrl}
              alt={product.name}
              width={480}
              height={480}
              className={`h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                soldOut ? "opacity-50 grayscale" : ""
              }`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Link>
          {!soldOut && (
            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 z-20 flex gap-2 translate-y-0 lg:translate-y-full lg:group-hover:translate-y-0 transition-transform duration-300">
              <button
                type="button"
                onClick={() => void addItem(product.id)}
                className="flex-1 py-2 bg-white/95 backdrop-blur text-slate-900 text-xs sm:text-sm font-bold rounded-lg shadow-sm hover:bg-brand-500 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-300"
              >
                Shto
              </button>
            </div>
          )}
        </div>
        <Link
          to={`/product/${product.slug}`}
          className="font-medium text-[#3F2412] mb-1 block text-sm sm:text-base line-clamp-1"
        >
          {product.name}
        </Link>
        <Stars rating={product.rating} />
        {stockLine}
        <p className="mt-1 flex flex-wrap items-baseline gap-2">
          <span
            className={`font-semibold text-sm sm:text-base whitespace-nowrap ${
              soldOut ? "text-slate-400" : product.compareAtPrice ? "text-accent-pink" : "text-[#3F2412]"
            }`}
          >
            {formatMoney(product.price)}
          </span>
          {product.compareAtPrice != null && (
            <span className="text-xs text-[#8a6a52] line-through whitespace-nowrap">
              {formatMoney(product.compareAtPrice)}
            </span>
          )}
        </p>
      </div>
  );
}

export default ProductCard;
