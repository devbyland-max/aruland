import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { api } from "../lib/api";
import type { Order } from "../lib/types";
import { useAuth } from "../context/AuthContext";
import { formatMoney } from "../lib/utils";

export function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const { orders: list } = await api.orders();
        setOrders(list);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-brand-600 mb-1">Customer account</p>
          <h1 className="font-display font-bold text-3xl text-slate-900">My orders</h1>
          <p className="text-slate-500 mt-2">
            Hello{user?.name ? `, ${user.name}` : ""}. Here is your order history.
          </p>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-xl">
              <FontAwesomeIcon icon={faBoxOpen} />
            </div>
            <p className="text-slate-500 mb-4">You have not ordered anything yet.</p>
            <Link
              to="/shop"
              className="inline-flex px-6 py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700"
            >
              Browse shop
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex flex-wrap justify-between gap-2 mb-4">
                  <div>
                    <p className="font-bold text-slate-900">Order {order.id.slice(-8)}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 self-start">
                    {order.status}
                  </span>
                </div>
                <ul className="space-y-2 mb-4">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate-600">
                        {item.name} × {item.qty}
                      </span>
                      <span className="font-semibold">
                        {formatMoney(item.price * item.qty)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-slate-100 pt-3 flex justify-between font-bold">
                  <span>Totali</span>
                  <span>{formatMoney(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
