import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBox,
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
  `text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 rounded ${
    isActive ? "text-brand-700" : "text-slate-700 hover:text-brand-700"
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
    <div className="flex items-center rounded-full border border-brand-100 p-0.5 text-[11px] font-bold">
      <button
        type="button"
        onClick={() => setLang("sq")}
        className={`px-2 py-1 rounded-full ${
          lang === "sq" ? "bg-brand-600 text-white" : "text-slate-600"
        }`}
        aria-label="Shqip"
      >
        SQ
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-2 py-1 rounded-full ${
          lang === "en" ? "bg-brand-600 text-white" : "text-slate-600"
        }`}
        aria-label="English"
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
          <div className="flex items-center gap-2 sm:gap-4 h-14 sm:h-16">
            <button
              type="button"
              className="lg:hidden p-2 -ml-1 text-slate-700 hover:text-brand-700 shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-300 rounded"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} className="text-xl" />
            </button>

            <Link
              to="/"
              className="shrink-0 flex items-center gap-2 leading-none overflow-hidden"
            >
              <img
                src="/AruLand-logo.png"
                alt="AruLand Toy Store"
                width={120}
                height={48}
                className="h-8 sm:h-10 w-auto object-contain"
              />
              <span className="hidden md:block font-display font-bold text-brand-800 text-lg">
                AruLand
              </span>
            </Link>

            <nav className="hidden lg:flex flex-1 items-center justify-center gap-7">
              <NavLink to="/" end className={navLinkClass}>
                {t("home")}
              </NavLink>
              <NavLink to="/shop" className={navLinkClass}>
                {t("shopAll")}
              </NavLink>
              <a href="/#collections" className="text-sm font-medium text-slate-700 hover:text-brand-700">
                {t("collections")}
              </a>
              <a href="/#about" className="text-sm font-medium text-slate-700 hover:text-brand-700">
                {t("about")}
              </a>
              <Link to="/contact" className="text-sm font-medium text-slate-700 hover:text-brand-700">
                {t("contact")}
              </Link>
            </nav>

            <div className="flex items-center justify-end gap-1 sm:gap-2 lg:gap-3 ml-auto shrink-0">
              <div className="hidden sm:block">{LangToggle}</div>

              <form onSubmit={onSearch} className="hidden md:flex relative">
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t("search")}
                  className="pl-10 pr-4 py-2 bg-brand-50 border-none rounded-full text-sm w-40 lg:w-48 focus:w-56 focus:ring-2 focus:ring-brand-200 transition-all duration-300 outline-none"
                />
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="absolute left-3.5 top-2.5 text-slate-500"
                />
              </form>

              <Link
                to="/wishlist"
                className="p-2 text-slate-700 hover:text-brand-700 hover:bg-brand-50 rounded-full relative focus:outline-none focus:ring-2 focus:ring-brand-300"
                aria-label={t("wishlist")}
              >
                <FontAwesomeIcon icon={faHeart} className="text-lg sm:text-xl" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-accent-pink rounded-full border border-white" />
                )}
              </Link>

              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="p-2 text-slate-700 hover:text-brand-700 hover:bg-brand-50 rounded-full relative focus:outline-none focus:ring-2 focus:ring-brand-300"
                aria-label={t("cart")}
              >
                <FontAwesomeIcon icon={faBagShopping} className="text-lg sm:text-xl" />
                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              </button>

              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((v) => !v)}
                    className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-brand-50 rounded-full text-brand-700 hover:bg-brand-100 focus:outline-none focus:ring-2 focus:ring-brand-300"
                    title={user.name}
                    aria-label="Llogaria"
                  >
                    <FontAwesomeIcon icon={faUser} />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-card border border-brand-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/account/orders"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-brand-50"
                      >
                        <FontAwesomeIcon icon={faBox} className="w-4" />
                        {t("myOrders")}
                      </Link>
                      {user.role === "ADMIN" && (
                        <Link
                          to="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-brand-50"
                        >
                          <FontAwesomeIcon icon={faGear} className="w-4" />
                          Admin
                        </Link>
                      )}
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
              <div className="px-3 pb-2">{LangToggle}</div>
              <NavLink
                to="/"
                end
                className={({ isActive }) => `block rounded-xl px-3 py-2.5 ${navLinkClass({ isActive })}`}
                onClick={() => setMobileOpen(false)}
              >
                {t("home")}
              </NavLink>
              <NavLink
                to="/shop"
                className={({ isActive }) => `block rounded-xl px-3 py-2.5 ${navLinkClass({ isActive })}`}
                onClick={() => setMobileOpen(false)}
              >
                {t("shopAll")}
              </NavLink>
              <a
                href="/#collections"
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700"
                onClick={() => setMobileOpen(false)}
              >
                {t("collections")}
              </a>
              <Link
                to="/contact"
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700"
                onClick={() => setMobileOpen(false)}
              >
                {t("contact")}
              </Link>
              <Link
                to="/track"
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700"
                onClick={() => setMobileOpen(false)}
              >
                {t("trackOrder")}
              </Link>
              <form onSubmit={onSearch} className="relative pt-2 px-1">
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t("search")}
                  className="w-full pl-10 pr-4 py-2.5 bg-brand-50 rounded-full text-sm outline-none focus:ring-2 focus:ring-brand-200"
                />
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="absolute left-4 top-[1.35rem] text-slate-500"
                />
              </form>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
