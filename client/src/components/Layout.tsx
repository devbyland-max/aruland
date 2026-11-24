import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";
import { CookieNotice } from "./CookieNotice";
import { WhatsAppButton } from "./WhatsAppButton";

export function Layout() {
  return (
    <div className="min-h-svh flex flex-col bg-surface-light text-[#3F2412]">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
      <CookieNotice />
    </div>
  );
}
