import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../context/CartContext";
import { formatMoney } from "../lib/utils";

export function CartDrawer() {
  const {
    drawerOpen,
    setDrawerOpen,
    items,
    subtotal,
    updateQty,
    removeItem,
  } = useCart();

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40"
        aria-label="Close cart"
        onClick={() => setDrawerOpen(false)}
      />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-float flex flex-col pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="font-display font-bold text-xl text-slate-900">Your Cart</h2>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-slate-500 text-sm py-12 text-center">
              Your cart is empty.{" "}
              <Link
                to="/shop"
                onClick={() => setDrawerOpen(false)}
                className="text-brand-600 font-semibold"
              >
                Shop now
              </Link>
            </p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-20 h-20 object-contain bg-slate-50 rounded-xl"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.product.slug}`}
                    onClick={() => setDrawerOpen(false)}
                    className="font-semibold text-slate-900 hover:text-brand-600 line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-brand-600 font-bold text-sm mt-0.5">
                    {formatMoney(item.product.price)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600"
                      onClick={() => void updateQty(item.productId, item.qty - 1)}
                    >
                      <FontAwesomeIcon icon={faMinus} className="text-xs" />
                    </button>
                    <span className="text-sm font-semibold w-6 text-center">{item.qty}</span>
                    <button
                      type="button"
                      className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600"
                      onClick={() => void updateQty(item.productId, item.qty + 1)}
                    >
                      <FontAwesomeIcon icon={faPlus} className="text-xs" />
                    </button>
                    <button
                      type="button"
                      className="ml-auto text-slate-400 hover:text-accent-pink"
                      onClick={() => void removeItem(item.productId)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-slate-100 px-6 py-5 space-y-3">
          <div className="flex justify-between font-semibold">
            <span>Nëntotali</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <p className="text-xs text-slate-500">
            {subtotal >= 5000
              ? "Ke transport falas!"
              : `Shto edhe ${Math.max(0, 5000 - subtotal)} ALL për transport falas.`}
          </p>
          <Link
            to="/cart"
            onClick={() => setDrawerOpen(false)}
            className="block w-full text-center py-3 rounded-xl border border-slate-200 font-semibold hover:bg-slate-50"
          >
            View Cart
          </Link>
          <Link
            to="/checkout"
            onClick={() => setDrawerOpen(false)}
            className={`block w-full text-center py-3 rounded-xl font-semibold text-white ${
              items.length ? "bg-brand-600 hover:bg-brand-700" : "bg-slate-300 pointer-events-none"
            }`}
          >
            Checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}
