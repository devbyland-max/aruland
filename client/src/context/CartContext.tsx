import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api, type CartItem } from "../lib/api";
import { useAuth } from "./AuthContext";

type CartContextValue = {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  loading: boolean;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  refresh: () => Promise<void>;
  addItem: (productId: string, qty?: number) => Promise<void>;
  addToCart: (productId: string, qty?: number) => Promise<void>;
  updateQty: (productId: string, qty: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const apply = (data: { items: CartItem[]; subtotal: number; itemCount: number }) => {
    setItems(data.items);
    setSubtotal(data.subtotal);
    setItemCount(data.itemCount);
  };

  const refresh = useCallback(async () => {
    try {
      apply(await api.cart());
    } catch {
      apply({ items: [], subtotal: 0, itemCount: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh, user?.id]);

  const addItem = async (productId: string, qty = 1) => {
    apply(await api.addToCart(productId, qty));
    setDrawerOpen(true);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        itemCount,
        loading,
        drawerOpen,
        setDrawerOpen,
        refresh,
        addItem,
        addToCart: addItem,
        updateQty: async (productId, qty) => {
          apply(await api.updateCart(productId, qty));
        },
        removeItem: async (productId) => {
          apply(await api.removeFromCart(productId));
        },
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
