import { Seo } from "../components/Seo";

export function PoliciesPage() {
  return (
    <section className="py-10 sm:py-14">
      <Seo
        title="Dërgesa dhe politikat"
        description="Dërgesa në Shqipëri, transport falas mbi 5.000 Lekë dhe politika e kthimit për pelushët AruLand."
        path="/policies"
      />
      <div className="container-page max-w-3xl prose prose-slate">
        <h1 className="font-display font-bold text-3xl text-slate-900 mb-6">Politikat</h1>

        <div id="shipping" className="mb-8 scroll-mt-24">
          <h2 className="font-bold text-xl mb-2">Dërgesa</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Dërgesa bëhet në të gjithë Shqipërinë. Transporti është falas për porosi mbi 5.000 Lekë;
            përndryshe tarifa është 300 Lekë. Koha tipike e dorëzimit: 1–3 ditë pune.
          </p>
        </div>

        <div id="returns" className="mb-8 scroll-mt-24">
          <h2 className="font-bold text-xl mb-2">Politika e kthimit</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Mund të kërkoni kthim brenda 7 ditëve nëse produkti është i papërdorur dhe në paketimin
            origjinal. Na kontaktoni përmes faqes Kontakt.
          </p>
        </div>

        <div id="privacy" className="mb-8 scroll-mt-24">
          <h2 className="font-bold text-xl mb-2">Privatësia</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Të dhënat e porosise (emri, telefoni, adresa) përdoren vetëm për përpunimin dhe
            dorëzimin e porosise. Nuk i shesim të dhënat te palë të treta.
          </p>
        </div>

        <div id="terms" className="mb-8 scroll-mt-24">
          <h2 className="font-bold text-xl mb-2">Kushtet e përdorimit</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Duke bërë porosi te AruLand, pranoni pagesën në dorëzim dhe kohën e dërgesës sipas
            disponueshmërisë së stokut. Çmimet shfaqen në Lekë.
          </p>
        </div>
      </div>
    </section>
  );
}
