import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { api } from "../lib/api";
import type { Product } from "../lib/types";
import { ProductCard } from "../components/ProductCard";
import { useLang } from "../context/LangContext";

import { PRODUCT_CATEGORIES } from "../lib/catalog";

const CATEGORIES = [...PRODUCT_CATEGORIES];
const COLORS = [
  { id: "blue", className: "bg-sky-500" },
  { id: "pink", className: "bg-pink-400" },
  { id: "brown", className: "bg-amber-800" },
  { id: "beige", className: "bg-amber-200" },
  { id: "cream", className: "bg-amber-100 border border-amber-200" },
  { id: "gray", className: "bg-slate-400" },
];
const SIZES = [
  { id: "s", label: "≤ 25cm", min: 0, max: 25 },
  { id: "m", label: "26–40cm", min: 26, max: 40 },
  { id: "l", label: "41cm+", min: 41, max: 200 },
];

export function ShopPage() {
  const { t } = useLang();
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = params.get("category") ?? "";
  const color = params.get("color") ?? "";
  const sort = params.get("sort") ?? "popular";
  const q = params.get("q") ?? "";
  const page = Number(params.get("page") ?? "1");
  const minPrice = params.get("minPrice") ?? "0";
  const maxPrice = params.get("maxPrice") ?? "10000";
  const size = params.get("size") ?? "";

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key);
    else next.set(key, value);
    if (key !== "page") next.delete("page");
    setParams(next);
  };

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        const sizeRange = SIZES.find((s) => s.id === size);
        const data = await api.products({
          category: category || undefined,
          color: color || undefined,
          sort,
          q: q || undefined,
          page,
          limit: 9,
          minPrice: minPrice === "" ? undefined : Number(minPrice),
          maxPrice: maxPrice === "" ? undefined : Number(maxPrice),
          minSize: sizeRange?.min,
          maxSize: sizeRange?.max,
        });
        setItems(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error(err);
        setItems([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    })();
  }, [category, color, sort, q, page, minPrice, maxPrice, size]);

  const filters = (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-900">
          <FontAwesomeIcon icon={faFilter} className="text-brand-600" /> {t("filters")}
        </h3>
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-4">
            <h4 className="font-medium mb-3 text-slate-800">{t("category")}</h4>
            <div className="space-y-2">
              {CATEGORIES.map((c) => (
                <label key={c} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={category === c}
                    onChange={() => setFilter("category", category === c ? "" : c)}
                    className="w-5 h-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500 accent-brand-600"
                  />
                  <span className="text-slate-700 group-hover:text-brand-700 text-sm sm:text-base">
                    {c}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-b border-slate-200 pb-4">
            <h4 className="font-medium mb-3 text-slate-800">{t("size")}</h4>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setFilter("size", size === s.id ? "" : s.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                    size === s.id
                      ? "bg-brand-600 text-white border-brand-600"
                      : "bg-white text-slate-700 border-slate-200 hover:border-brand-300"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-b border-slate-200 pb-4">
            <h4 className="font-medium mb-3 text-slate-800">{t("priceRange")}</h4>
            <div className="flex items-center gap-3 mb-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setFilter("minPrice", e.target.value)}
                className="w-full bg-brand-50 border border-brand-100 rounded-lg py-2 px-3 text-sm"
                aria-label="Çmimi minimal"
              />
              <span className="text-slate-500">-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setFilter("maxPrice", e.target.value)}
                className="w-full bg-brand-50 border border-brand-100 rounded-lg py-2 px-3 text-sm"
                aria-label="Çmimi maksimal"
              />
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-slate-800">{t("color")}</h4>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setFilter("color", color === c.id ? "" : c.id)}
                  className={`w-8 h-8 rounded-full ${c.className} ${
                    color === c.id ? "ring-2 ring-offset-2 ring-brand-300" : ""
                  }`}
                  aria-label={c.id}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-brand-500 to-brand-900 rounded-2xl p-5 sm:p-6 text-white text-center">
        <h4 className="font-bold text-lg sm:text-xl mb-2">{t("saleBanner")}</h4>
        <p className="text-brand-100 text-sm mb-4">{t("saleText")}</p>
        <button
          type="button"
          onClick={() => setFilter("sort", "price_asc")}
          className="px-4 py-2 bg-white text-brand-700 font-bold rounded-lg text-sm w-full hover:bg-brand-50"
        >
          {t("viewOffer")}
        </button>
      </div>
    </div>
  );

  return (
    <section className="py-8 sm:py-10 lg:py-12">
      <div className="container-page">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-brand-100 font-semibold text-slate-800 shadow-sm"
            >
              <span className="flex items-center gap-2">
                <FontAwesomeIcon icon={faFilter} className="text-brand-600" />
                {t("filters")}
              </span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`text-slate-500 transition-transform ${filtersOpen ? "rotate-180" : ""}`}
              />
            </button>
            {filtersOpen && (
              <div className="mt-3 p-4 bg-white rounded-2xl border border-brand-100 shadow-sm">
                {filters}
              </div>
            )}
          </div>

          <aside className="hidden lg:block w-64 flex-shrink-0">{filters}</aside>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5 sm:mb-6">
              <p className="text-slate-600 text-sm sm:text-base">
                {t("showing")}{" "}
                <span className="font-bold text-slate-900">{total}</span> {t("products")}
                {q ? <span> për “{q}”</span> : null}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 text-sm hidden sm:inline">{t("sortBy")}:</span>
                <select
                  value={sort}
                  onChange={(e) => setFilter("sort", e.target.value)}
                  className="bg-white border border-brand-100 rounded-lg px-3 sm:px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-auto"
                >
                  <option value="popular">{t("popular")}</option>
                  <option value="newest">{t("newest")}</option>
                  <option value="price_asc">{t("priceAsc")}</option>
                  <option value="price_desc">{t("priceDesc")}</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-72 rounded-2xl bg-brand-50 animate-pulse" />
                ))}
              </div>
            ) : items.length === 0 ? (
              <p className="text-slate-600 py-16 text-center">{t("noProducts")}</p>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                {items.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center flex-wrap mt-8 sm:mt-10 gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setFilter("page", String(page - 1))}
                  className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-40"
                  aria-label="Faqja e mëparshme"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(0, 5)
                  .map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setFilter("page", String(n))}
                      className={`w-10 h-10 rounded-lg font-bold flex items-center justify-center ${
                        n === page
                          ? "bg-brand-600 text-white shadow-md"
                          : "border border-slate-200 text-slate-700 hover:bg-brand-50"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setFilter("page", String(page + 1))}
                  className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-40"
                  aria-label="Faqja tjetër"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
