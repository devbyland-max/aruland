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

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-brand-600" : "text-slate-600 hover:text-brand-600"
  }`;

export function Header() {
  const { user, logout } = useAuth();
  const { itemCount, setDrawerOpen } = useCart();
  const { items: wishlist } = useWishlist();
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

  return (
    <>
      <div className="bg-brand-900 text-white text-[10px] sm:text-xs font-medium py-2 px-3 text-center tracking-wide">
        TRANSPORT FALAS MBI 5000 ALL • PAGESË NË DORËZIM
      </div>

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-100">
        <div className="container-page">
          <div className="flex items-center gap-2 sm:gap-4 h-14 sm:h-16">
            <button
              type="button"
              className="lg:hidden p-2 -ml-1 text-slate-600 hover:text-brand-600 shrink-0"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} className="text-xl" />
            </button>

            <Link to="/" className="shrink-0 flex items-center leading-none overflow-hidden">
              <img
                src="/AruLand-logo.png"
                alt="AruLand Toy Store"
                width={96}
                height={40}
                className="h-7 sm:h-8 w-auto object-contain"
                style={{ maxHeight: 32, maxWidth: 96 }}
              />
            </Link>

            <nav className="hidden lg:flex flex-1 items-center justify-center gap-8">
              <NavLink to="/" end className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/shop" className={navLinkClass}>
                Shop All
              </NavLink>
              <a href="/#collections" className="text-sm font-medium text-slate-600 hover:text-brand-600">
                Collections
              </a>
              <a href="/#about" className="text-sm font-medium text-slate-600 hover:text-brand-600">
                About Us
              </a>
            </nav>

            <div className="flex items-center justify-end gap-1 sm:gap-2 lg:gap-3 ml-auto shrink-0">
              <form onSubmit={onSearch} className="hidden md:flex relative">
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search plushies..."
                  className="pl-10 pr-4 py-2 bg-brand-50 border-none rounded-full text-sm w-40 lg:w-48 focus:w-56 focus:ring-2 focus:ring-brand-200 transition-all duration-300 outline-none"
                />
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="absolute left-3.5 top-2.5 text-slate-400"
                />
              </form>

              <Link
                to="/wishlist"
                className="p-2 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-full relative"
                aria-label="Wishlist"
              >
                <FontAwesomeIcon icon={faHeart} className="text-lg sm:text-xl" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-accent-pink rounded-full border border-white" />
                )}
              </Link>

              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="p-2 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-full relative"
                aria-label="Cart"
              >
                <FontAwesomeIcon icon={faBagShopping} className="text-lg sm:text-xl" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>

              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((v) => !v)}
                    className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-brand-50 rounded-full text-brand-700 hover:bg-brand-100"
                    title={user.name}
                    aria-label="Account menu"
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
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                      >
                        <FontAwesomeIcon icon={faBox} className="w-4" />
                        My orders
                      </Link>
                      {user.role === "ADMIN" && (
                        <Link
                          to="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                        >
                          <FontAwesomeIcon icon={faGear} className="w-4" />
                          Admin panel
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          void logout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                      >
                        <FontAwesomeIcon icon={faRightFromBracket} className="w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {mobileOpen && (
            <div className="lg:hidden pb-4 space-y-1 border-t border-brand-100 pt-3 animate-[fadeIn_.2s_ease]">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-2.5 ${navLinkClass({ isActive })}`
                }
                onClick={() => setMobileOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-2.5 ${navLinkClass({ isActive })}`
                }
                onClick={() => setMobileOpen(false)}
              >
                Shop All
              </NavLink>
              <a
                href="/#collections"
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600"
                onClick={() => setMobileOpen(false)}
              >
                Collections
              </a>
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-2.5 ${navLinkClass({ isActive })}`
                }
                onClick={() => setMobileOpen(false)}
              >
                Cart
              </NavLink>
              <NavLink
                to="/wishlist"
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-2.5 ${navLinkClass({ isActive })}`
                }
                onClick={() => setMobileOpen(false)}
              >
                Wishlist
              </NavLink>
              {user ? (
                <>
                  <NavLink
                    to="/account/orders"
                    className={({ isActive }) =>
                      `block rounded-xl px-3 py-2.5 ${navLinkClass({ isActive })}`
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    My orders
                  </NavLink>
                  {user.role === "ADMIN" && (
                    <NavLink
                      to="/admin"
                      className={({ isActive }) =>
                        `block rounded-xl px-3 py-2.5 ${navLinkClass({ isActive })}`
                      }
                      onClick={() => setMobileOpen(false)}
                    >
                      Admin panel
                    </NavLink>
                  )}
                  <button
                    type="button"
                    className="block w-full text-left rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600"
                    onClick={() => {
                      void logout();
                      setMobileOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : null}
              <form onSubmit={onSearch} className="relative pt-2">
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search plushies..."
                  className="w-full pl-10 pr-4 py-2.5 bg-brand-50 rounded-full text-sm outline-none focus:ring-2 focus:ring-brand-200"
                />
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="absolute left-3.5 top-[1.35rem] text-slate-400"
                />
              </form>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
