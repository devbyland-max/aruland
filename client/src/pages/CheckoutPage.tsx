import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { citiesFor, countryForCity } from "../lib/cities";
import { formatMoney, validateShippingForm } from "../lib/utils";
import { Seo } from "../components/Seo";

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
      <Seo title="Finalizo porosinë" description="Porosi me pagesë në dorëzim." path="/checkout" noindex />
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
              setError("");
              const invalid = validateShippingForm(form);
              if (invalid) {
                setError(invalid);
                return;
              }
              setLoading(true);
              try {
                const result = await api.checkout({
                  ...form,
                  shippingName: form.shippingName.trim(),
                  shippingPhone: form.shippingPhone.trim(),
                  shippingLine1: form.shippingLine1.trim(),
                  shippingCity: form.shippingCity.trim(),
                });
                await refresh();
                navigate(`/checkout/success?order_id=${result.orderId}`);
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
            <p className="text-xs text-slate-500 -mt-2">
              Emri i plotë, telefoni, adresa dhe qyteti janë të detyrueshme.
            </p>

            {(
              [
                ["shippingName", "Emri i plotë *", true, undefined],
                [
                  "shippingPhone",
                  "Numri i telefonit *",
                  true,
                  "068… / +355… ose 044… / +383…",
                ],
                ["shippingEmail", "Email (opsionale)", false, undefined],
                ["shippingLine1", "Adresa *", true, "Rruga, nr., lagjia"],
                ["shippingLine2", "Shënime / kati (opsionale)", false, undefined],
              ] as const
            ).map(([key, label, required, placeholder]) => (
              <div key={key}>
                <label className="text-sm text-slate-600 mb-1 block">{label}</label>
                <input
                  required={required}
                  type={key === "shippingEmail" ? "email" : key === "shippingPhone" ? "tel" : "text"}
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  placeholder={placeholder}
                  autoComplete={
                    key === "shippingName"
                      ? "name"
                      : key === "shippingPhone"
                        ? "tel"
                        : key === "shippingLine1"
                          ? "street-address"
                          : undefined
                  }
                  inputMode={key === "shippingPhone" ? "tel" : undefined}
                  pattern={
                    key === "shippingPhone"
                      ? "(\\+?355\\s?6\\d{8}|06\\d{8}|\\+?383\\s?4\\d{7}|04\\d{7})"
                      : undefined
                  }
                  title={
                    key === "shippingPhone"
                      ? "Shqipëri: 068xxxxxxx ose +355 6… · Kosovë: 044xxxxxxx ose +383 4…"
                      : undefined
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-brand-200"
                />
              </div>
            ))}

            <div>
              <label className="text-sm text-slate-600 mb-1 block">Qyteti *</label>
              <select
                required
                value={form.shippingCity}
                onChange={(e) => {
                  const city = e.target.value;
                  setForm((f) => ({
                    ...f,
                    shippingCity: city,
                    shippingCountry: city ? countryForCity(city) : "AL",
                  }));
                }}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-brand-200"
              >
                <option value="">Zgjidh qytetin</option>
                <optgroup label="Shqipëri">
                  {citiesFor("AL").map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Kosovë">
                  {citiesFor("XK").map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-600 mb-1 block">
                Kodi postar (opsionale)
              </label>
              <input
                value={form.shippingPostal}
                onChange={(e) => set("shippingPostal", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-brand-200"
              />
            </div>

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
