import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faGear,
  faMagnifyingGlass,
  faBagShopping,
  faRightFromBracket,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart, faUser } from "@fortawesome/free-regular-svg-icons";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useLang } from "../context/LangContext";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium tracking-wide transition-colors px-1 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 rounded ${
    isActive ? "text-brand-700" : "text-[#3F2412] hover:text-brand-700"
  }`;

export function Header() {
  const { user, logout } = useAuth();
  const { itemCount, setDrawerOpen } = useCart();
  const { items: wishlist } = useWishlist();
  const { lang, setLang, t } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : "/shop");
    setMobileOpen(false);
  };

  const LangToggle = (
    <div
      className="flex items-center rounded-full border border-brand-100 bg-brand-50/60 p-0.5 text-[11px] font-bold"
      role="group"
      aria-label="Gjuha"
    >
      <button
        type="button"
        onClick={() => setLang("sq")}
        className={`px-2.5 py-1 rounded-full transition ${
          lang === "sq" ? "bg-brand-600 text-white shadow-sm" : "text-slate-600"
        }`}
        aria-pressed={lang === "sq"}
      >
        SQ
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-2.5 py-1 rounded-full transition ${
          lang === "en" ? "bg-brand-600 text-white shadow-sm" : "text-slate-600"
        }`}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
    </div>
  );

  return (
    <>
      <div className="bg-brand-900 text-white text-[10px] sm:text-xs font-medium py-2 px-3 text-center tracking-wide">
        TRANSPORT FALAS MBI 5.000 LEKË • PAGESË NË DORËZIM
      </div>

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-100">
        <div className="container-page">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 h-16 sm:h-[4.5rem]">
            <div className="flex items-center gap-1 min-w-0">
              <button
                type="button"
                className="lg:hidden p-2 -ml-1 text-slate-700 hover:text-brand-700 shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-300 rounded-lg"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Menu"
                aria-expanded={mobileOpen}
              >
                <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} className="text-xl" />
              </button>

              <Link
                to="/"
                className="shrink-0 flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 rounded-lg"
                aria-label="AruLand Toy Store — Kryefaqja"
              >
                <img
                  src="/AruLand-logo.png"
                  alt="AruLand Toy Store"
                  width={180}
                  height={72}
                  className="h-11 sm:h-12 w-auto max-w-[150px] sm:max-w-[180px] object-contain object-left"
                  decoding="async"
                />
              </Link>
            </div>

            <nav className="hidden lg:flex items-center justify-center gap-5 xl:gap-7">
              <NavLink to="/" end className={navLinkClass}>
                {t("home")}
              </NavLink>
              <NavLink to="/shop" className={navLinkClass}>
                {t("shopAll")}
              </NavLink>
              <a href="/#collections" className="text-sm font-medium text-[#3F2412] hover:text-brand-700 px-1 py-1">
                {t("collections")}
              </a>
              <a href="/#about" className="text-sm font-medium text-[#3F2412] hover:text-brand-700 px-1 py-1">
                {t("about")}
              </a>
              <Link
                to="/contact"
                className="text-sm font-medium text-[#3F2412] hover:text-brand-700 px-1 py-1"
              >
                Kontakt
              </Link>
            </nav>

            <div className="flex items-center justify-end gap-1.5 sm:gap-2">
              <div className="hidden sm:block">{LangToggle}</div>

              <form onSubmit={onSearch} className="hidden md:flex relative">
                <label className="sr-only" htmlFor="nav-search">
                  {t("search")}
                </label>
                <input
                  id="nav-search"
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t("search")}
                  className="pl-10 pr-4 py-2 bg-brand-50 border border-transparent rounded-full text-sm w-40 lg:w-48 focus:w-56 focus:border-brand-200 focus:ring-2 focus:ring-brand-200 transition-all duration-300 outline-none"
                />
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
              </form>

              <Link
                to="/wishlist"
                className="p-2.5 text-slate-700 hover:text-brand-700 hover:bg-brand-50 rounded-full relative focus:outline-none focus:ring-2 focus:ring-brand-300"
                aria-label={t("wishlist")}
              >
                <FontAwesomeIcon icon={faHeart} className="text-lg" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-pink rounded-full border border-white" />
                )}
              </Link>

              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="p-2.5 text-slate-700 hover:text-brand-700 hover:bg-brand-50 rounded-full relative focus:outline-none focus:ring-2 focus:ring-brand-300"
                aria-label={t("cart")}
              >
                <FontAwesomeIcon icon={faBagShopping} className="text-lg" />
                <span className="absolute -top-0.5 -right-0.5 min-w-[1.25rem] h-5 px-1 bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              </button>

              {user?.role === "ADMIN" ? (
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((v) => !v)}
                    className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-brand-50 rounded-full text-brand-700 hover:bg-brand-100 focus:outline-none focus:ring-2 focus:ring-brand-300"
                    title={user.name}
                    aria-label="Admin"
                    aria-expanded={menuOpen}
                  >
                    <FontAwesomeIcon icon={faUser} />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-card border border-brand-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-brand-50"
                      >
                        <FontAwesomeIcon icon={faGear} className="w-4" />
                        Paneli Admin
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          void logout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-brand-50"
                      >
                        <FontAwesomeIcon icon={faRightFromBracket} className="w-4" />
                        {t("logout")}
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {mobileOpen && (
            <div className="lg:hidden pb-4 space-y-1 border-t border-brand-100 pt-3">
              <div className="px-1 pb-2">{LangToggle}</div>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-2.5 ${navLinkClass({ isActive })}`
                }
                onClick={() => setMobileOpen(false)}
              >
                {t("home")}
              </NavLink>
              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-2.5 ${navLinkClass({ isActive })}`
                }
                onClick={() => setMobileOpen(false)}
              >
                {t("shopAll")}
              </NavLink>
              <a
                href="/#collections"
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-[#3F2412]"
                onClick={() => setMobileOpen(false)}
              >
                {t("collections")}
              </a>
              <a
                href="/#about"
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-[#3F2412]"
                onClick={() => setMobileOpen(false)}
              >
                {t("about")}
              </a>
              <Link
                to="/contact"
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-[#3F2412]"
                onClick={() => setMobileOpen(false)}
              >
                Kontakt
              </Link>
              <Link
                to="/track"
                className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700"
                onClick={() => setMobileOpen(false)}
              >
                {t("trackOrder")}
              </Link>
              <form onSubmit={onSearch} className="relative pt-2">
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t("search")}
                  className="w-full pl-10 pr-4 py-2.5 bg-brand-50 rounded-full text-sm outline-none focus:ring-2 focus:ring-brand-200"
                />
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="absolute left-3.5 top-[1.35rem] text-slate-500"
                />
              </form>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
