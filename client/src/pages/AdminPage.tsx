import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import type { Order, Product } from "../lib/types";
import { formatMoney } from "../lib/utils";
import { Seo } from "../components/Seo";
import { ProductImage } from "../components/ProductImage";
import { useAuth } from "../context/AuthContext";
import {
  ORDER_STATUSES,
  PRODUCT_BADGES,
  PRODUCT_CATEGORIES,
  PRODUCT_COLORS,
  trackingCodeFromId,
} from "../lib/catalog";

const emptyProduct = {
  name: "",
  slug: "",
  description: "",
  price: 2900,
  compareAtPrice: null as number | null,
  imageUrl: "/products/arushi-kafe.jpg",
  imageUrls: [] as string[],
  category: "Arusha",
  color: "brown",
  sizeCm: 30,
  stock: 10,
  badges: [] as string[],
  rating: 5,
};

export function AdminPage() {
  const { logout, user } = useAuth();
  const [tab, setTab] = useState<"products" | "orders">("orders");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [badge, setBadge] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const [p, o] = await Promise.all([api.adminProducts(), api.adminOrders()]);
    setProducts(p.products);
    setOrders(o.orders);
  };

  useEffect(() => {
    void load().catch((e) =>
      setError(e instanceof Error ? e.message : "Ngarkimi dështoi")
    );
  }, []);

  const slugify = (name: string) =>
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  return (
    <section className="py-10 lg:py-14">
      <Seo title="Admin" description="Paneli i administrimit." path="/admin" noindex />
      <div className="container-page">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-brand-600 mb-1">
              Vetëm admin · {user?.email}
            </p>
            <h1 className="font-display font-bold text-3xl text-slate-900">
              Paneli Admin
            </h1>
            <p className="text-slate-600 mt-1 text-sm">
              Ndrysho arushat (emër, foto, çmim) dhe menaxho porositë.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-50"
            >
              Faqja
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold"
            >
              Dil
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          <button
            type="button"
            onClick={() => setTab("orders")}
            className={`px-4 py-2 rounded-xl font-semibold ${
              tab === "orders" ? "bg-brand-600 text-white" : "bg-white text-slate-600"
            }`}
          >
            Porositë ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("products")}
            className={`px-4 py-2 rounded-xl font-semibold ${
              tab === "products" ? "bg-brand-600 text-white" : "bg-white text-slate-600"
            }`}
          >
            Produktet ({products.length})
          </button>
        </div>

        {error && <p className="text-accent-pink mb-4">{error}</p>}
        {message && <p className="text-green-700 mb-4">{message}</p>}

        {tab === "products" ? (
          <div className="grid lg:grid-cols-2 gap-8">
            <form
              className="bg-white rounded-2xl p-6 shadow-sm space-y-3 h-fit"
              onSubmit={async (e) => {
                e.preventDefault();
                setError("");
                setMessage("");
                try {
                  const gallery = form.imageUrls.length
                    ? form.imageUrls
                    : [form.imageUrl];
                  const payload = {
                    ...form,
                    slug: form.slug || slugify(form.name),
                    compareAtPrice: form.compareAtPrice || null,
                    badges: badge ? [badge] : [],
                    imageUrl: gallery[0],
                    imageUrls: gallery,
                  };
                  if (editingId) {
                    await api.adminUpdateProduct(editingId, payload);
                    setMessage("Produkti u përditësua.");
                  } else {
                    await api.adminCreateProduct(payload);
                    setMessage("Produkti u krijua.");
                  }
                  setForm(emptyProduct);
                  setBadge("");
                  setEditingId(null);
                  await load();
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Ruajtja dështoi");
                }
              }}
            >
              <h2 className="font-bold text-lg">
                {editingId ? "Ndrysho produktin" : "Produkt i ri"}
              </h2>

              <div>
                <label className="text-xs text-slate-600 font-medium mb-1 block">
                  Fotot e produktit
                </label>
                <div className="bg-brand-50 rounded-xl p-3 flex flex-col items-center gap-3">
                  {form.imageUrls.length ? (
                    <div className="flex gap-2 w-full overflow-x-auto pb-1">
                      {form.imageUrls.map((url, i) => (
                        <div key={`${url}-${i}`} className="relative shrink-0 w-20">
                          <ProductImage
                            src={url}
                            alt=""
                            loading="eager"
                            className="w-20 h-20 object-contain bg-white rounded-lg"
                          />
                          {i === 0 && (
                            <span className="absolute left-1 top-1 text-[9px] font-bold bg-white/90 text-[#3F2412] px-1 rounded">
                              Kryesore
                            </span>
                          )}
                          <button
                            type="button"
                            className="absolute right-1 top-1 w-5 h-5 rounded-full bg-white text-slate-700 text-xs leading-none shadow"
                            aria-label="Hiq foton"
                            onClick={() =>
                              setForm((f) => {
                                const imageUrls = f.imageUrls.filter((_, idx) => idx !== i);
                                return {
                                  ...f,
                                  imageUrls,
                                  imageUrl: imageUrls[0] ?? f.imageUrl,
                                };
                              })
                            }
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 py-6">Nuk ka foto ende</p>
                  )}
                  <label className="w-full cursor-pointer">
                    <span className="flex items-center justify-center w-full py-2.5 rounded-xl bg-white border border-brand-200 text-sm font-semibold text-brand-800 hover:bg-brand-100">
                      {uploading ? "Duke ngarkuar..." : "Shto foto"}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      multiple
                      className="sr-only"
                      disabled={uploading}
                      onChange={async (e) => {
                        const files = [...(e.target.files ?? [])];
                        e.target.value = "";
                        if (!files.length) return;
                        setUploading(true);
                        setError("");
                        try {
                          const urls: string[] = [];
                          for (const file of files) {
                            const { url } = await api.adminUploadImage(file);
                            urls.push(url);
                          }
                          setForm((f) => {
                            const imageUrls = [...f.imageUrls, ...urls].slice(0, 8);
                            return { ...f, imageUrls, imageUrl: imageUrls[0] ?? f.imageUrl };
                          });
                          setMessage(
                            urls.length > 1
                              ? `${urls.length} foto u ngarkuan.`
                              : "Foto u ngarkua."
                          );
                        } catch (err) {
                          setError(
                            err instanceof Error ? err.message : "Ngarkimi dështoi"
                          );
                        } finally {
                          setUploading(false);
                        }
                      }}
                    />
                  </label>
                  <p className="text-[11px] text-[#4a3018] text-center">
                    Deri në 8 foto. E para del te dyqani, të gjitha te faqja e produktit. JPG, PNG ose WEBP · max 5MB
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-600 font-medium">Emri</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-medium">
                  Slug (auto nëse bosh)
                </label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-medium">Përshkrimi</label>
                <textarea
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 font-medium">Kategoria</label>
                  <select
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    {PRODUCT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-medium">Badge</label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    {PRODUCT_BADGES.map((b) => (
                      <option key={b.label} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-600 font-medium">Ngjyra</label>
                  <select
                    required
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    {PRODUCT_COLORS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 font-medium">Çmimi (Lekë)</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-medium">Çmim i vjetër</label>
                  <input
                    type="number"
                    value={form.compareAtPrice ?? ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        compareAtPrice: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-medium">Stoku</label>
                  <input
                    type="number"
                    required
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-medium">Madhësia (cm)</label>
                  <input
                    type="number"
                    required
                    value={form.sizeCm}
                    onChange={(e) => setForm({ ...form, sizeCm: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700"
                >
                  {editingId ? "Ruaj ndryshimet" : "Krijo produktin"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setForm(emptyProduct);
                      setBadge("");
                    }}
                    className="px-4 py-2 border border-slate-200 rounded-xl"
                  >
                    Anulo
                  </button>
                )}
              </div>
            </form>

            <div className="space-y-3 max-h-[75vh] overflow-y-auto">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl p-4 shadow-sm flex gap-3 items-center"
                >
                  <ProductImage
                    src={p.imageUrl}
                    alt=""
                    loading="lazy"
                    className="w-16 h-16 object-contain bg-slate-50 rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{p.name}</p>
                    <p className="text-sm text-slate-600">
                      {formatMoney(p.price)} · stok {p.stock} · {p.category}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-brand-700 font-semibold"
                    onClick={() => {
                      setEditingId(p.id);
                      setForm({
                        name: p.name,
                        slug: p.slug,
                        description: p.description,
                        price: p.price,
                        compareAtPrice: p.compareAtPrice,
                        imageUrl: p.imageUrl,
                        imageUrls: p.imageUrls?.length ? p.imageUrls : [p.imageUrl],
                        category: p.category,
                        color: p.color,
                        sizeCm: p.sizeCm,
                        stock: p.stock,
                        badges: p.badges,
                        rating: p.rating,
                      });
                      setBadge(p.badges[0] ?? "");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Ndrysho
                  </button>
                  <button
                    type="button"
                    className="text-sm text-accent-pink font-semibold"
                    onClick={async () => {
                      if (!confirm(`Fshi ${p.name}?`)) return;
                      await api.adminDeleteProduct(p.id);
                      await load();
                    }}
                  >
                    Fshi
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.length === 0 && (
              <p className="text-slate-500 text-center py-12 bg-white rounded-2xl">
                Nuk ka porosi ende. Porositë nga checkout shfaqen këtu.
              </p>
            )}
            {orders.map((order) => {
              const trackCode = trackingCodeFromId(order.id);
              return (
              <div key={order.id} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
                <div className="flex flex-wrap justify-between gap-3 mb-4">
                  <div>
                    <p className="font-bold text-lg">#{trackCode}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleString("sq-AL")} ·{" "}
                      {order.paymentMethod === "COD" ? "Pagesë në dorëzim" : order.paymentMethod}
                    </p>
                    <Link
                      to={`/track?code=${trackCode}`}
                      className="text-xs font-semibold text-brand-700 hover:underline mt-1 inline-block"
                    >
                      Hap gjurmimin publik →
                    </Link>
                  </div>
                  <select
                    value={order.status}
                    onChange={async (e) => {
                      const status = e.target.value as Order["status"];
                      setOrders((prev) =>
                        prev.map((o) => (o.id === order.id ? { ...o, status } : o))
                      );
                      try {
                        await api.adminUpdateOrderStatus(order.id, status);
                      } catch (err) {
                        setError(
                          err instanceof Error
                            ? err.message
                            : "Përditësimi i statusit dështoi"
                        );
                        await load();
                      }
                    }}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold bg-white"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-sm mb-4">
                  <div className="bg-brand-50 rounded-xl p-3 space-y-1">
                    <p className="font-semibold text-slate-900">Klienti</p>
                    <p>{order.shippingName ?? "—"}</p>
                    <p>{order.shippingPhone ?? "—"}</p>
                    {order.shippingEmail && <p>{order.shippingEmail}</p>}
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 space-y-1">
                    <p className="font-semibold text-slate-900">Adresa</p>
                    <p>{order.shippingLine1 ?? "—"}</p>
                    {order.shippingLine2 && <p>{order.shippingLine2}</p>}
                    <p>
                      {[order.shippingCity, order.shippingPostal, order.shippingCountry]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>

                <ul className="text-sm text-slate-700 space-y-1 border-t border-slate-100 pt-3">
                  {order.items.map((i) => (
                    <li key={i.id} className="flex justify-between gap-3">
                      <span>
                        {i.name} × {i.qty}
                      </span>
                      <span className="font-semibold">
                        {formatMoney(i.price * i.qty)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex justify-between font-bold text-base">
                  <span>Totali</span>
                  <span>{formatMoney(order.total)}</span>
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
