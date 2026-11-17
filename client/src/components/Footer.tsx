import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-white border-t border-brand-100 pt-10 sm:pt-16 pb-8">
      <div className="container-page">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 mb-10">
          <div className="space-y-4 col-span-2 md:col-span-1">
            <Link to="/" className="inline-block">
              <img
                src="/AruLand-logo.png"
                alt="AruLand Toy Store"
                className="h-10 w-auto max-w-[120px] object-contain"
              />
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Arusha të buta për përqafime. Pagesë në dorëzim në të gjithë Shqipërinë.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-3 sm:mb-4">Dyqani</h4>
            <div className="space-y-2 text-sm text-slate-500">
              <Link to="/shop" className="block hover:text-brand-600">Të gjitha</Link>
              <Link to="/shop?sort=newest" className="block hover:text-brand-600">Të rejat</Link>
              <Link to="/shop?category=Arusha" className="block hover:text-brand-600">Arusha</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-3 sm:mb-4">Ndihmë</h4>
            <div className="space-y-2 text-sm text-slate-500">
              <Link to="/account/orders" className="block hover:text-brand-600">Porositë</Link>
              <Link to="/cart" className="block hover:text-brand-600">Shporta</Link>
              <Link to="/wishlist" className="block hover:text-brand-600">Wishlist</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-brand-100 pt-6">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} AruLand Toy Store. Të gjitha të drejtat e rezervuara.
          </p>
        </div>
      </div>
    </footer>
  );
}
