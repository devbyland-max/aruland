import type { MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { useAuth } from "../context/AuthContext";
import { badgeLabel, formatMoney, productImageFilter } from "../lib/utils";

type Props = {
  product: Product;
  variant?: "carousel" | "trending" | "grid";
};

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex text-yellow-400 text-xs gap-0.5">
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const wished = ids.has(product.id);
  const soldOut = product.stock <= 0;
  const badge = soldOut
    ? "SOLD OUT"
    : product.badges[0]
      ? badgeLabel(product.badges[0])
      : null;
  const isCarousel = variant === "carousel" || variant === "trending";

  const onWish = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await toggle(product.id);
    } catch {
      navigate("/login");
    }
  };

  if (isCarousel) {
    return (
      <div className="min-w-[240px] sm:min-w-[280px] md:min-w-[300px] snap-center">
        <div className="bg-surface-light rounded-2xl sm:rounded-3xl p-4 sm:p-6 relative group hover:shadow-card transition-all duration-300 border border-transparent hover:border-brand-100 h-full flex flex-col">
          {badge && badge !== "SOLD OUT" && (
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-accent-pink text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded z-10">
              {badge}
            </div>
          )}
          <button
            type="button"
            onClick={onWish}
            className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center z-10 ${
              wished ? "text-accent-pink" : "text-slate-400 hover:text-accent-pink"
            }`}
          >
            <FontAwesomeIcon icon={wished ? faHeartSolid : faHeartRegular} />
          </button>
          <Link
            to={`/product/${product.slug}`}
            className="h-44 sm:h-56 md:h-64 flex items-center justify-center mb-4 sm:mb-6 relative"
          >
            <div className="absolute inset-0 bg-brand-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-95 group-hover:scale-100" />
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-500"
              style={{ filter: productImageFilter(product) }}
            />
          </Link>
          <div className="mt-auto">
            <div className="flex justify-between items-start gap-2 mb-2">
              <div className="min-w-0">
                <Link
                  to={`/product/${product.slug}`}
                  className="font-bold text-base sm:text-lg text-slate-900 line-clamp-1"
                >
                  {product.name}
                </Link>
                <p className="text-xs sm:text-sm text-slate-500">{product.sizeCm}cm</p>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span
                  className={`font-bold text-base sm:text-lg ${
                    product.compareAtPrice ? "text-accent-pink" : "text-brand-600"
                  }`}
                >
                  {formatMoney(product.price)}
                </span>
                {product.compareAtPrice != null && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatMoney(product.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              disabled={soldOut}
              onClick={() => void addItem(product.id)}
              className="w-full py-2.5 sm:py-3 mt-3 sm:mt-4 bg-brand-600 text-white rounded-xl text-sm sm:text-base font-medium flex items-center justify-center gap-2 hover:bg-brand-700 disabled:opacity-40"
            >
              <FontAwesomeIcon icon={faCartPlus} /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-card transition-all duration-300 group">
      <div className="relative bg-brand-50 rounded-lg sm:rounded-xl h-40 sm:h-52 md:h-56 mb-3 sm:mb-4 flex items-center justify-center overflow-hidden">
        {badge && (
          <div
            className={`absolute top-2 left-2 sm:top-3 sm:left-3 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded z-10 ${
              badge === "SOLD OUT"
                ? "bg-slate-800"
                : badge === "HOT"
                  ? "bg-red-500"
                  : "bg-accent-pink"
            }`}
          >
            {badge}
          </div>
        )}
        <Link
          to={`/product/${product.slug}`}
          className="h-4/5 flex items-center justify-center"
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`h-full object-contain group-hover:scale-110 transition-transform duration-500 ${
              soldOut ? "opacity-50 grayscale" : ""
            }`}
            style={{ filter: soldOut ? undefined : productImageFilter(product) }}
          />
        </Link>
        <button
          type="button"
          onClick={onWish}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 shadow-sm transition-colors"
        >
          <FontAwesomeIcon
            icon={wished ? faHeartSolid : faHeartRegular}
            className={wished ? "text-accent-pink" : ""}
          />
        </button>
        {!soldOut && (
          <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 translate-y-0 lg:translate-y-full lg:group-hover:translate-y-0 transition-transform duration-300">
            <button
              type="button"
              onClick={() => void addItem(product.id)}
              className="w-full py-2 bg-white/95 backdrop-blur text-slate-900 text-xs sm:text-sm font-bold rounded-lg shadow-sm hover:bg-brand-500 hover:text-white transition-colors"
            >
              Quick Add
            </button>
          </div>
        )}
      </div>
      <Link
        to={`/product/${product.slug}`}
        className="font-bold text-slate-900 mb-1 block text-sm sm:text-base line-clamp-1"
      >
        {product.name}
      </Link>
      <div className="flex justify-between items-center gap-2">
        <span className={`font-bold text-sm sm:text-base ${soldOut ? "text-slate-400" : "text-brand-600"}`}>
          {formatMoney(product.price)}
        </span>
        <Stars rating={product.rating} />
      </div>
    </div>
  );
}

export default ProductCard;
