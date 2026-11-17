import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatMoney } from "../lib/utils";

const FREE_SHIPPING_FROM = 5000;
const SHIPPING_FEE = 300;

export function CheckoutPage() {
  const { user } = useAuth();
  const { items, subtotal, refresh } = useCart();
  const navigate = useNavigate();
  const shippingFee =
    subtotal >= FREE_SHIPPING_FROM || subtotal === 0 ? 0 : SHIPPING_FEE;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    shippingName: user?.name ?? "",
    shippingPhone: "",
    shippingEmail: user?.email ?? "",
    shippingLine1: "",
    shippingLine2: "",
    shippingCity: "",
    shippingPostal: "",
    shippingCountry: "AL",
  });

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-slate-500 mb-4">Shporta është bosh.</p>
        <Link to="/shop" className="text-brand-600 font-semibold">
          Shiko arushat
        </Link>
      </div>
    );
  }

  return (
    <section className="py-12 lg:py-16">
      <div className="container-page max-w-5xl">
        <h1 className="font-display font-bold text-3xl text-slate-900 mb-2">
          Finalizo porosinë
        </h1>
        <p className="text-slate-500 mb-8">
          Pagesa bëhet në dorëzim. Plotëso të dhënat për dorëzim.
        </p>

        <div className="grid lg:grid-cols-5 gap-8">
          <form
            className="lg:col-span-3 bg-white rounded-3xl p-6 shadow-sm space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError("");
              try {
                const result = await api.checkout(form);
                await refresh();
                if (result.whatsappUrl) {
                  window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
                }
                navigate(
                  `/checkout/success?order_id=${result.orderId}&wa=1`
                );
              } catch (err) {
                setError(
                  err instanceof Error ? err.message : "Porosia dështoi"
                );
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="rounded-2xl bg-brand-50 border border-brand-100 p-4 text-sm text-brand-800">
              <p className="font-semibold mb-1">Pagesë në dorëzim</p>
              <p>Nuk paguani online. Pagesa bëhet kur merrni arushin.</p>
            </div>

            <h2 className="font-bold text-lg">Të dhënat e dorëzimit</h2>

            {(
              [
                ["shippingName", "Emri i plotë", true],
                ["shippingPhone", "Numri i telefonit", true],
                ["shippingEmail", "Email (opsionale)", false],
                ["shippingLine1", "Adresa", true],
                ["shippingLine2", "Shënime / kati (opsionale)", false],
                ["shippingCity", "Qyteti", true],
                ["shippingPostal", "Kodi postar (opsionale)", false],
              ] as const
            ).map(([key, label, required]) => (
              <div key={key}>
                <label className="text-sm text-slate-600 mb-1 block">{label}</label>
                <input
                  required={required}
                  type={key === "shippingEmail" ? "email" : key === "shippingPhone" ? "tel" : "text"}
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  placeholder={key === "shippingPhone" ? "Numri juaj" : undefined}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-brand-200"
                />
              </div>
            ))}

            {error && <p className="text-sm text-accent-pink">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50"
            >
              {loading ? "Duke dërguar..." : "Konfirmo porosinë (në dorëzim)"}
            </button>
          </form>

          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm h-fit space-y-3">
            <h2 className="font-bold text-lg">Përmbledhja</h2>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm gap-4">
                <span className="text-slate-600 truncate">
                  {item.product.name} × {item.qty}
                </span>
                <span className="font-semibold">{formatMoney(item.lineTotal)}</span>
              </div>
            ))}
            <div className="border-t border-slate-100 pt-3 flex justify-between text-sm">
              <span className="text-slate-500">Transporti</span>
              <span>{shippingFee === 0 ? "Falas" : formatMoney(shippingFee)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Totali</span>
              <span>{formatMoney(subtotal + shippingFee)}</span>
            </div>
            <p className="text-xs text-slate-500">
              Transport falas mbi {formatMoney(FREE_SHIPPING_FROM)}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
