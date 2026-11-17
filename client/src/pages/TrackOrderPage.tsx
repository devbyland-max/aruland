import { useState } from "react";
import { api } from "../lib/api";
import type { OrderStatus } from "../lib/types";
import { TRACKING_STEPS } from "../lib/catalog";
import { formatMoney } from "../lib/utils";

function stepIndex(status: OrderStatus) {
  const i = TRACKING_STEPS.findIndex((s) => s.value === status);
  return i >= 0 ? i : status === "CANCELLED" ? -1 : 0;
}

export function TrackOrderPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<{
    code: string;
    status: OrderStatus;
    total: number;
    createdAt: string;
    shippingCity: string | null;
    items: { name: string; qty: number }[];
  } | null>(null);

  return (
    <section className="py-10 sm:py-14">
      <div className="container-page max-w-xl">
        <h1 className="font-display font-bold text-3xl text-slate-900 mb-2">
          Gjurmo porosinë
        </h1>
        <p className="text-slate-600 mb-8">
          Vendos 8 shifrat e fundit të numrit të porosise.
        </p>
        <form
          className="bg-white rounded-2xl p-6 shadow-sm space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setOrder(null);
            const clean = code.trim().toUpperCase();
            if (clean.length < 4) {
              setError("Vendos një kod porosie të vlefshëm.");
              return;
            }
            setLoading(true);
            try {
              const data = await api.trackOrder(clean);
              setOrder(data.order);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Nuk u gjet");
            } finally {
              setLoading(false);
            }
          }}
        >
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="p.sh. A1B2C3D4"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-brand-200 uppercase"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50"
          >
            {loading ? "Duke kërkuar..." : "Kontrollo statusin"}
          </button>
          {error && (
            <p className="text-sm text-accent-pink bg-pink-50 rounded-xl p-3">{error}</p>
          )}
        </form>

        {order && (
          <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm space-y-5">
            <div>
              <p className="font-bold text-lg">#{order.code}</p>
              <p className="text-sm text-slate-500">
                {new Date(order.createdAt).toLocaleString("sq-AL")}
                {order.shippingCity ? ` · ${order.shippingCity}` : ""}
              </p>
              <p className="text-sm font-semibold text-brand-700 mt-1">
                {formatMoney(order.total)}
              </p>
            </div>

            {order.status === "CANCELLED" ? (
              <p className="text-sm font-semibold text-accent-pink">
                Porosia është anuluar.
              </p>
            ) : (
              <ol className="space-y-3">
                {TRACKING_STEPS.map((step, i) => {
                  const current = stepIndex(order.status);
                  const done = i <= current;
                  const active = i === current;
                  return (
                    <li key={step.value} className="flex gap-3 items-start">
                      <span
                        className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          done
                            ? "bg-brand-600 text-white"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {done ? "✓" : i + 1}
                      </span>
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            active ? "text-brand-800" : done ? "text-slate-800" : "text-slate-400"
                          }`}
                        >
                          {step.label}
                        </p>
                        {active && (
                          <p className="text-xs text-slate-500">Statusi aktual</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}

            <ul className="text-sm text-slate-600 border-t border-slate-100 pt-3 space-y-1">
              {order.items.map((item, idx) => (
                <li key={`${item.name}-${idx}`}>
                  {item.name} × {item.qty}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
