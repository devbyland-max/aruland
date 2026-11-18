import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "sq" | "en";

const dict = {
  sq: {
    home: "Kryefaqja",
    shopAll: "Dyqani",
    collections: "Koleksione",
    about: "Rreth nesh",
    search: "Kërko pelushë...",
    cart: "Shporta",
    wishlist: "Lista e dëshirave",
    myOrders: "Porositë e mia",
    logout: "Dil",
    addToCart: "Shto në shportë",
    shopNow: "Bli tani",
    exploreCollections: "Shiko koleksionet",
    trending: "Në trend",
    viewAll: "Shiko të gjitha",
    freeShipping: "Transport falas mbi 5.000 Lekë",
    newCollection: "Koleksion i ri",
    heroTitle1: "Gjej mikun tënd",
    heroTitle2: "të ri",
    heroText:
      "Arusha të butë për përqafime. Arusha, Stitch, Capybara dhe më shumë — me pagesë në dorëzim në Shqipëri.",
    material: "Material",
    ecoCotton: "Pelush premium",
    ctaTitle: "Porosit me qetësi",
    ctaText:
      "Pagesë në dorëzim në të gjithë Shqipërinë. Zgjidh pelushin, plotëso adresën dhe gjurmo paketën hap pas hapi.",
    ctaNote: "Pa pagesë online · Transport falas mbi 5.000 Lekë",
    whyAruland: "Pse AruLand",
    whatCustomersSay: "Çfarë thonë klientët",
    aboutText:
      "AruLand Toy Store është dyqani ynë online i pelushëve në Shqipëri. Zgjedhim modele të buta dhe të sigurta për fëmijë, me dërgesë të shpejtë dhe pagesë në dorëzim.",
    shopByOccasion: "Sipas rastit",
    forBaby: "Për bebe",
    birthdayGift: "Dhuratë ditëlindjeje",
    kidsRoom: "Për dhomën e fëmijës",
    faq: "Pyetje të shpeshta",
    trackOrder: "Gjurmo porosinë",
    contact: "Na kontakto",
    cod: "Pagesë në dorëzim",
    leftInStock: "Mbetën {n} copë",
    inStock: "Në stok",
    outOfStock: "Pa stok",
    filters: "Filtrat",
    sortBy: "Rendit",
    popular: "Më të shiturat",
    newest: "Më të rejat",
    priceAsc: "Çmimi: nga i ulëti",
    priceDesc: "Çmimi: nga i larti",
    showing: "Duke shfaqur",
    products: "produkte",
    loading: "Duke ngarkuar...",
    noProducts: "Nuk u gjetën produkte.",
    size: "Madhësia",
    category: "Kategoria",
    priceRange: "Çmimi",
    color: "Ngjyra",
    saleBanner: "Ofertë speciale",
    saleText: "Zbritje në modele të zgjedhura.",
    viewOffer: "Shiko ofertën",
    socialProof: "Nga klientët tanë",
    delivery: "Dërgesa",
    returns: "Kthimet",
    privacy: "Privatësia",
    terms: "Kushtet",
    help: "Ndihmë",
    store: "Dyqani",
    contactUs: "Kontakti",
    whatsappOrder: "Porosit në WhatsApp",
  },
  en: {
    home: "Home",
    shopAll: "Shop All",
    collections: "Collections",
    about: "About Us",
    search: "Search plushies...",
    cart: "Cart",
    wishlist: "Wishlist",
    myOrders: "My orders",
    logout: "Logout",
    addToCart: "Add to Cart",
    shopNow: "Shop Now",
    exploreCollections: "Explore Collections",
    trending: "Trending Now",
    viewAll: "View All",
    freeShipping: "Free shipping over 5.000 Lekë",
    newCollection: "New collection",
    heroTitle1: "Meet your new",
    heroTitle2: " best friend",
    heroText:
      "Ultra-soft plushies made for hugs. Bears, Stitch, capybara and more — cash on delivery across Albania.",
    material: "Material",
    ecoCotton: "Premium plush",
    ctaTitle: "Order with ease",
    ctaText:
      "Cash on delivery across Albania. Pick a plush, add your address, and track the parcel step by step.",
    ctaNote: "No online payment · Free shipping over 5,000 Lekë",
    whyAruland: "Why AruLand",
    whatCustomersSay: "What customers say",
    aboutText:
      "AruLand Toy Store is our online plush shop in Albania. Soft, child-safe toys with fast delivery and cash on delivery.",
    shopByOccasion: "Shop by occasion",
    forBaby: "For babies",
    birthdayGift: "Birthday gift",
    kidsRoom: "Kids room",
    faq: "FAQ",
    trackOrder: "Track order",
    contact: "Contact us",
    cod: "Cash on delivery",
    leftInStock: "{n} left",
    inStock: "In stock",
    outOfStock: "Sold out",
    filters: "Filters",
    sortBy: "Sort by",
    popular: "Most popular",
    newest: "Newest",
    priceAsc: "Price: low to high",
    priceDesc: "Price: high to low",
    showing: "Showing",
    products: "products",
    loading: "Loading...",
    noProducts: "No products found.",
    size: "Size",
    category: "Category",
    priceRange: "Price",
    color: "Color",
    saleBanner: "Special offer",
    saleText: "Discounts on selected models.",
    viewOffer: "View offer",
    socialProof: "From our customers",
    delivery: "Shipping",
    returns: "Returns",
    privacy: "Privacy",
    terms: "Terms",
    help: "Help",
    store: "Store",
    contactUs: "Contact",
    whatsappOrder: "Order on WhatsApp",
  },
} as const;

export type DictKey = keyof typeof dict.sq;

type LangCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey, vars?: Record<string, string | number>) => string;
};

const LangContext = createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("sq");

  const value = useMemo<LangCtx>(
    () => ({
      lang,
      setLang,
      t(key, vars) {
        let s: string = dict[lang][key] ?? dict.sq[key] ?? key;
        if (vars) {
          for (const [k, v] of Object.entries(vars)) {
            s = s.replace(`{${k}}`, String(v));
          }
        }
        return s;
      },
    }),
    [lang]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
