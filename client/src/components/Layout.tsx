import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";
import { Newsletter } from "./Newsletter";

export function Layout() {
  return (
    <div className="min-h-svh flex flex-col bg-surface-light text-slate-800">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Newsletter />
      <Footer />
      <CartDrawer />
    </div>
  );
}
