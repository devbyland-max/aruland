import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { LangProvider } from "./context/LangContext";
import { Layout } from "./components/Layout";
import { Protected } from "./components/Protected";
import { ScrollToTop } from "./components/ScrollToTop";
import { HomePage } from "./pages/HomePage";
import { ShopPage } from "./pages/ShopPage";
import { ProductPage } from "./pages/ProductPage";
import { CartPage } from "./pages/CartPage";
import { WishlistPage } from "./pages/WishlistPage";
import { LoginPage } from "./pages/LoginPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import {
  CheckoutCancelPage,
  CheckoutSuccessPage,
} from "./pages/CheckoutResultPages";
import { AdminPage } from "./pages/AdminPage";
import { ContactPage } from "./pages/ContactPage";
import { TrackOrderPage } from "./pages/TrackOrderPage";
import { PoliciesPage } from "./pages/PoliciesPage";

export default function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:slug" element={<ProductPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
                  <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/track" element={<TrackOrderPage />} />
                  <Route path="/policies" element={<PoliciesPage />} />

                  {/* Admin only — not linked in storefront nav */}
                  <Route path="/admin/login" element={<LoginPage />} />
                  <Route path="/login" element={<Navigate to="/admin/login" replace />} />
                  <Route path="/register" element={<Navigate to="/" replace />} />
                  <Route
                    path="/admin"
                    element={
                      <Protected adminOnly>
                        <AdminPage />
                      </Protected>
                    }
                  />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </LangProvider>
  );
}
