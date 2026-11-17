import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../context/CartContext";
import { formatMoney } from "../lib/utils";

export function CartPage() {
  const { items, subtotal, updateQty, removeItem } = useCart();
  const shipping = subtotal >= 5000 || subtotal === 0 ? 0 : 300;

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="container-page max-w-5xl">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 mb-6 sm:mb-8">
          Shporta
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center shadow-sm">
            <p className="text-slate-500 mb-6">Shporta është bosh.</p>
            <Link
              to="/shop"
              className="inline-flex px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700"
            >
              Vazhdo blerjen
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 flex gap-3 sm:gap-4 shadow-sm items-center"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 sm:w-24 sm:h-24 object-contain bg-brand-50 rounded-xl shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="font-bold text-slate-900 hover:text-brand-600 text-sm sm:text-base line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-brand-600 font-semibold text-sm sm:text-base">
                      {formatMoney(item.product.price)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        className="w-8 h-8 rounded-lg border border-slate-200"
                        onClick={() => void updateQty(item.productId, item.qty - 1)}
                      >
                        <FontAwesomeIcon icon={faMinus} className="text-xs" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.qty}</span>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-lg border border-slate-200"
                        onClick={() => void updateQty(item.productId, item.qty + 1)}
                      >
                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm sm:text-base">
                      {formatMoney(item.lineTotal)}
                    </p>
                    <button
                      type="button"
                      className="text-slate-400 hover:text-accent-pink mt-2"
                      onClick={() => void removeItem(item.productId)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm h-fit space-y-4 sticky top-24">
              <h2 className="font-bold text-lg">Përmbledhja</h2>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Nëntotali</span>
                <span className="font-semibold">{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Transporti</span>
                <span className="font-semibold">
                  {shipping === 0 ? "Falas" : formatMoney(shipping)}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between font-bold text-lg">
                <span>Totali</span>
                <span>{formatMoney(subtotal + shipping)}</span>
              </div>
              <p className="text-xs text-slate-500">Pagesë në dorëzim</p>
              <Link
                to="/checkout"
                className="block w-full text-center py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700"
              >
                Vazhdo te checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
