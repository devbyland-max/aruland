import { useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";

export function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <section className="py-10 sm:py-14">
      <Seo
        title="Na kontakto"
        description="Na shkruaj për porosi, dërgesa ose pyetje rreth pelushëve AruLand. Përgjigjemi sa më shpejt."
        path="/contact"
      />
      <div className="container-page max-w-3xl">
        <h1 className="font-display font-bold text-3xl text-slate-900 mb-2">Na kontakto</h1>
        <p className="text-slate-600 mb-8">
          Na shkruaj për porosi, dërgesa ose pyetje. Përgjigjemi sa më shpejt.
        </p>

        {sent ? (
          <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
            <p className="font-semibold text-green-800">Mesazhi u dërgua. Faleminderit!</p>
            <Link to="/shop" className="text-brand-700 font-semibold mt-3 inline-block">
              Kthehu te dyqani
            </Link>
          </div>
        ) : (
          <form
            className="bg-white rounded-2xl p-6 shadow-sm space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <div>
              <label className="text-sm text-slate-700 mb-1 block">Emri</label>
              <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-brand-200" />
            </div>
            <div>
              <label className="text-sm text-slate-700 mb-1 block">Email</label>
              <input type="email" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-brand-200" />
            </div>
            <div>
              <label className="text-sm text-slate-700 mb-1 block">Mesazhi</label>
              <textarea required rows={4} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-brand-200" />
            </div>
            <button type="submit" className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700">
              Dërgo
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
