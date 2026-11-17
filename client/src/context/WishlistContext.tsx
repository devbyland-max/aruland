import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, type Product, type WishlistItem } from "../lib/api";
import { useAuth } from "./AuthContext";

const GUEST_KEY = "aruland_wishlist_ids";

type WishlistContextValue = {
  items: WishlistItem[];
  ids: Set<string>;
  isWished: (productId: string) => boolean;
  refresh: () => Promise<void>;
  toggle: (productId: string) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

function readGuestIds(): string[] {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeGuestIds(ids: string[]) {
  localStorage.setItem(GUEST_KEY, JSON.stringify(ids));
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [guestIds, setGuestIds] = useState<string[]>(() => readGuestIds());

  const refresh = useCallback(async () => {
    if (user) {
      try {
        const data = await api.wishlist();
        setItems(data.items);
      } catch {
        setItems([]);
      }
      return;
    }

    const ids = readGuestIds();
    setGuestIds(ids);
    if (!ids.length) {
      setItems([]);
      return;
    }

    try {
      const { items: products } = await api.products({ limit: 48 });
      const byId = new Map(products.map((p: Product) => [p.id, p]));
      setItems(
        ids
          .map((id) => {
            const product = byId.get(id);
            if (!product) return null;
            return {
              id: `guest-${id}`,
              productId: id,
              product,
            } as WishlistItem;
          })
          .filter(Boolean) as WishlistItem[]
      );
    } catch {
      setItems([]);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const ids = useMemo(() => {
    if (user) return new Set(items.map((i) => i.productId));
    return new Set(guestIds);
  }, [user, items, guestIds]);

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      ids,
      isWished: (productId) => ids.has(productId),
      refresh,
      async toggle(productId) {
        if (user) {
          if (ids.has(productId)) {
            setItems((await api.removeWishlist(productId)).items);
          } else {
            setItems((await api.addWishlist(productId)).items);
          }
          return;
        }

        const next = ids.has(productId)
          ? guestIds.filter((id) => id !== productId)
          : [...guestIds, productId];
        writeGuestIds(next);
        setGuestIds(next);
        await refresh();
      },
    }),
    [items, ids, refresh, user, guestIds]
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
