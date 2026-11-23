import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faHeartBroken } from "@fortawesome/free-solid-svg-icons";
import { formatMoney } from "../lib/utils";
import { Seo } from "../components/Seo";

export function WishlistPage() {
  const { items, toggle } = useWishlist();
  const { addItem } = useCart();

  return (
    <section className="py-12 lg:py-16">
      <Seo title="Lista e dëshirave" description="Pelushët e ruajtura." path="/wishlist" noindex />
      <div className="container mx-auto px-4 lg:px-8">
        <h1 className="font-display font-bold text-3xl text-slate-900 mb-8">
          Lista e dëshirave
        </h1>
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
            <p className="text-slate-500 mb-6">Nuk ke preferenca ende.</p>
            <Link to="/shop" className="text-brand-600 font-semibold">
              Shiko dyqanin
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <Link to={`/product/${item.product.slug}`}>
                  <div className="bg-slate-50 rounded-xl h-48 flex items-center justify-center mb-4">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-4/5 object-contain"
                    />
                  </div>
                  <h3 className="font-bold text-slate-900">{item.product.name}</h3>
                  <p className="text-brand-600 font-bold">
                    {formatMoney(item.product.price)}
                  </p>
                </Link>
                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => void addItem(item.productId)}
                    className="flex-1 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-brand-600 flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faCartPlus} /> Shto
                  </button>
                  <button
                    type="button"
                    onClick={() => void toggle(item.productId)}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-slate-500 hover:text-accent-pink"
                    aria-label="Hiq nga lista"
                  >
                    <FontAwesomeIcon icon={faHeartBroken} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
