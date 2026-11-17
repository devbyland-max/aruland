import { Link, useSearchParams } from "react-router-dom";

export function CheckoutSuccessPage() {
  const [params] = useSearchParams();
  const orderId = params.get("order_id");

  return (
    <section className="py-24">
      <div className="container-page max-w-lg text-center">
        <div className="bg-white rounded-3xl p-10 shadow-card">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
            ✓
          </div>
          <h1 className="font-display font-bold text-3xl text-slate-900 mb-3">
            Porosia u pranua!
          </h1>
          <p className="text-slate-500 mb-4">
            Faleminderit! Pagesa bëhet në dorëzim. Do t&apos;ju kontaktojmë për
            konfirmimin e dorëzimit.
          </p>
          {orderId && (
            <p className="text-sm text-slate-400 mb-6">
              Nr. porosie: {orderId.slice(-8).toUpperCase()}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/account/orders"
              className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700"
            >
              Porositë e mia
            </Link>
            <Link
              to="/shop"
              className="px-6 py-3 border border-slate-200 font-semibold rounded-xl hover:bg-slate-50"
            >
              Vazhdo blerjen
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CheckoutCancelPage() {
  return (
    <section className="py-24">
      <div className="container-page max-w-lg text-center">
        <div className="bg-white rounded-3xl p-10 shadow-card">
          <h1 className="font-display font-bold text-3xl text-slate-900 mb-3">
            Porosia u anulua
          </h1>
          <p className="text-slate-500 mb-6">
            Nuk ka problem — shporta është ende aty.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/checkout"
              className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700"
            >
              Provo përsëri
            </Link>
            <Link
              to="/cart"
              className="px-6 py-3 border border-slate-200 font-semibold rounded-xl hover:bg-slate-50"
            >
              Kthehu te shporta
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
