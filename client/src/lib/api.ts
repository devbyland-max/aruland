import type {
  CartResponse,
  Collection,
  Order,
  OrderStatus,
  Product,
  User,
  WishlistItem,
} from "./types";

export type {
  CartItem,
  CartResponse,
  Collection,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  Role,
  User,
  WishlistItem,
} from "./types";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { message?: string }).message || "Request failed");
  }
  return data as T;
}

export const api = {
  me: () => request<{ user: User }>("/api/auth/me"),
  login: (body: { email: string; password: string }) =>
    request<{ user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  register: (body: { name: string; email: string; password: string }) =>
    request<{ user: User }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  logout: () =>
    request<{ message: string }>("/api/auth/logout", { method: "POST" }),

  products: (params: Record<string, string | number | undefined> = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "") qs.set(k, String(v));
    });
    return request<{
      items: Product[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/api/products?${qs}`);
  },
  product: (slug: string) =>
    request<{ product: Product }>(`/api/products/${slug}`),
  collections: () =>
    request<{ collections: Collection[] }>("/api/collections"),

  cart: () => request<CartResponse>("/api/cart"),
  addToCart: (productId: string, qty = 1) =>
    request<CartResponse>("/api/cart", {
      method: "POST",
      body: JSON.stringify({ productId, qty }),
    }),
  updateCart: (productId: string, qty: number) =>
    request<CartResponse>("/api/cart", {
      method: "PATCH",
      body: JSON.stringify({ productId, qty }),
    }),
  removeFromCart: (productId?: string) =>
    request<CartResponse>(
      productId ? `/api/cart?productId=${productId}` : "/api/cart",
      { method: "DELETE" }
    ),

  wishlist: () => request<{ items: WishlistItem[] }>("/api/wishlist"),
  addWishlist: (productId: string) =>
    request<{ items: WishlistItem[] }>("/api/wishlist", {
      method: "POST",
      body: JSON.stringify({ productId }),
    }),
  removeWishlist: (productId: string) =>
    request<{ items: WishlistItem[] }>(`/api/wishlist/${productId}`, {
      method: "DELETE",
    }),

  checkout: (body: Record<string, string>) =>
    request<{
      orderId: string;
      whatsappUrl: string;
      shopPhone: string;
      message: string;
    }>("/api/checkout", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  orders: () => request<{ orders: Order[] }>("/api/orders"),

  adminProducts: () =>
    request<{ products: Product[] }>("/api/admin/products"),
  adminCreateProduct: (body: Partial<Product> & Record<string, unknown>) =>
    request<{ product: Product }>("/api/admin/products", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  adminUpdateProduct: (
    id: string,
    body: Partial<Product> & Record<string, unknown>
  ) =>
    request<{ product: Product }>(`/api/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  adminDeleteProduct: (id: string) =>
    request<{ ok: boolean }>(`/api/admin/products/${id}`, {
      method: "DELETE",
    }),
  adminOrders: () => request<{ orders: Order[] }>("/api/admin/orders"),
  adminUpdateOrderStatus: (id: string, status: OrderStatus) =>
    request<{ order: Order }>(`/api/admin/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
