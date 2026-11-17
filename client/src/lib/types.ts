export type Role = "CUSTOMER" | "ADMIN";

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt?: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  imageUrl: string;
  category: string;
  color: string;
  sizeCm: number;
  stock: number;
  badges: string[];
  rating: number;
};

export type Collection = {
  id: string;
  name: string;
  slug: string;
  tag: string;
  imageUrl: string;
};

export type CartItem = {
  id: string;
  productId: string;
  qty: number;
  lineTotal: number;
  product: Product;
};

export type CartResponse = {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
};

export type WishlistItem = {
  id: string;
  productId: string;
  product: Product;
};

export type OrderItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  qty: number;
  imageUrl: string;
};

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "FULFILLED"
  | "CANCELLED"
  | "REFUNDED";

export type Order = {
  id: string;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  total: number;
  currency?: string;
  shippingName?: string | null;
  shippingEmail?: string | null;
  shippingPhone?: string | null;
  shippingLine1?: string | null;
  shippingLine2?: string | null;
  shippingCity?: string | null;
  shippingPostal?: string | null;
  shippingCountry?: string | null;
  paymentMethod?: string | null;
  createdAt: string;
  items: OrderItem[];
  user?: { id: string; email: string; name: string } | null;
};

export type ProductsResponse = {
  items: Product[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
