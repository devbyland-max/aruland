import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, type WishlistItem } from "../lib/api";
import { useAuth } from "./AuthContext";

type WishlistContextValue = {
  items: WishlistItem[];
  ids: Set<string>;
  isWished: (productId: string) => boolean;
  refresh: () => Promise<void>;
  toggle: (productId: string) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    try {
      const data = await api.wishlist();
      setItems(data.items);
    } catch {
      setItems([]);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const ids = useMemo(() => new Set(items.map((i) => i.productId)), [items]);

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      ids,
      isWished: (productId) => ids.has(productId),
      refresh,
      async toggle(productId) {
        if (!user) throw new Error("Please log in to use wishlist");
        if (ids.has(productId)) {
          setItems((await api.removeWishlist(productId)).items);
        } else {
          setItems((await api.addWishlist(productId)).items);
        }
      },
    }),
    [items, ids, refresh, user]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
