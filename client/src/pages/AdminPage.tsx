import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Order, Product } from "../lib/types";
import { formatMoney } from "../lib/utils";

const emptyProduct = {
  name: "",
  slug: "",
  description: "",
  price: 2900,
  compareAtPrice: null as number | null,
  imageUrl:
    "https://images.unsplash.com/photo-1530325553241-4f6e79230849?auto=format&fit=crop&w=800&q=80",
  category: "Arusha",
  color: "brown",
  sizeCm: 30,
  stock: 10,
  badges: [] as string[],
  rating: 5,
};

export function AdminPage() {
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    const [p, o] = await Promise.all([api.adminProducts(), api.adminOrders()]);
    setProducts(p.products);
    setOrders(o.orders);
  };

  useEffect(() => {
    void load().catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, []);

  const slugify = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-semibold text-brand-600 mb-1">Admin access only</p>
          <h1 className="font-display font-bold text-3xl text-slate-900">Admin panel</h1>
          <p className="text-slate-500 mt-2">
            Manage products and update order statuses.
          </p>
        </div>

        <div className="flex gap-2 mb-8">
          <button
            type="button"
            onClick={() => setTab("products")}
            className={`px-4 py-2 rounded-xl font-semibold ${
              tab === "products" ? "bg-brand-600 text-white" : "bg-white text-slate-600"
            }`}
          >
            Products
          </button>
          <button
            type="button"
            onClick={() => setTab("orders")}
            className={`px-4 py-2 rounded-xl font-semibold ${
              tab === "orders" ? "bg-brand-600 text-white" : "bg-white text-slate-600"
            }`}
          >
            All orders
          </button>
        </div>

        {error && <p className="text-accent-pink mb-4">{error}</p>}
        {message && <p className="text-green-600 mb-4">{message}</p>}

        {tab === "products" ? (
          <div className="grid lg:grid-cols-2 gap-8">
            <form
              className="bg-white rounded-2xl p-6 shadow-sm space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                setError("");
                setMessage("");
                try {
                  const payload = {
                    ...form,
                    slug: form.slug || slugify(form.name),
                    compareAtPrice: form.compareAtPrice || null,
                  };
                  if (editingId) {
                    await api.adminUpdateProduct(editingId, payload);
                    setMessage("Product updated");
                  } else {
                    await api.adminCreateProduct(payload);
                    setMessage("Product created");
                  }
                  setForm(emptyProduct);
                  setEditingId(null);
                  await load();
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Save failed");
                }
              }}
            >
              <h2 className="font-bold text-lg">
                {editingId ? "Edit product" : "New product"}
              </h2>
              {(
                [
                  ["name", "Name"],
                  ["slug", "Slug (auto if empty)"],
                  ["description", "Description"],
                  ["imageUrl", "Image URL"],
                  ["category", "Category"],
                  ["color", "Color"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label className="text-xs text-slate-500">{label}</label>
                  {key === "description" ? (
                    <textarea
                      required
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                      rows={3}
                    />
                  ) : (
                    <input
                      required={key !== "slug"}
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  )}
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Stock</label>
                  <input
                    type="number"
                    required
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Size (cm)</label>
                  <input
                    type="number"
                    required
                    value={form.sizeCm}
                    onChange={(e) => setForm({ ...form, sizeCm: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Compare at</label>
                  <input
                    type="number"
                    step="0.01"
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
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-slate-900 text-white font-semibold rounded-xl hover:bg-brand-600"
                >
                  {editingId ? "Update" : "Create"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setForm(emptyProduct);
                    }}
                    className="px-4 py-2 border border-slate-200 rounded-xl"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="space-y-3 max-h-[70vh] overflow-y-auto">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl p-4 shadow-sm flex gap-3 items-center"
                >
                  <img src={p.imageUrl} alt="" className="w-14 h-14 object-contain bg-slate-50 rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{p.name}</p>
                    <p className="text-sm text-slate-500">
                      {formatMoney(p.price)} · stock {p.stock}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-brand-600 font-semibold"
                    onClick={() => {
                      setEditingId(p.id);
                      setForm({
                        name: p.name,
                        slug: p.slug,
                        description: p.description,
                        price: p.price,
                        compareAtPrice: p.compareAtPrice,
                        imageUrl: p.imageUrl,
                        category: p.category,
                        color: p.color,
                        sizeCm: p.sizeCm,
                        stock: p.stock,
                        badges: p.badges,
                        rating: p.rating,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-sm text-accent-pink font-semibold"
                    onClick={async () => {
                      if (!confirm(`Delete ${p.name}?`)) return;
                      await api.adminDeleteProduct(p.id);
                      await load();
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex flex-wrap justify-between gap-3 mb-3">
                  <div>
                    <p className="font-bold">#{order.id.slice(-8)}</p>
                    <p className="text-sm text-slate-500">
                      {order.shippingPhone ?? order.shippingEmail} ·{" "}
                      {formatMoney(order.total)}
                    </p>
                  </div>
                  <select
                    value={order.status}
                    onChange={async (e) => {
                      await api.adminUpdateOrderStatus(
                        order.id,
                        e.target.value as Order["status"]
                      );
                      await load();
                    }}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
                  >
                    {["PENDING", "PAID", "FULFILLED", "CANCELLED", "REFUNDED"].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <ul className="text-sm text-slate-600 space-y-1">
                  {order.items.map((i) => (
                    <li key={i.id}>
                      {i.name} × {i.qty}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-slate-500 text-center py-12">No orders yet.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
