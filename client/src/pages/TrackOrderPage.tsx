import { useState } from "react";

export function TrackOrderPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<string | null>(null);

  return (
    <section className="py-10 sm:py-14">
      <div className="container-page max-w-xl">
        <h1 className="font-display font-bold text-3xl text-slate-900 mb-2">
          Gjurmo porosinë
        </h1>
        <p className="text-slate-600 mb-8">
          Vendos numrin e porosise (8 shifrat e fundit) për të parë statusin.
        </p>
        <form
          className="bg-white rounded-2xl p-6 shadow-sm space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (code.trim().length < 4) {
              setResult("Vendos një kod porosie të vlefshëm.");
              return;
            }
            setResult(
              `Porosia #${code.trim().toUpperCase()} është në përpunim. Do të kontaktoheni për dorëzim.`
            );
          }}
        >
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="p.sh. A1B2C3D4"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-brand-200"
          />
          <button
            type="submit"
            className="w-full py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700"
          >
            Kontrollo statusin
          </button>
          {result && <p className="text-sm text-slate-700 bg-brand-50 rounded-xl p-3">{result}</p>}
        </form>
      </div>
    </section>
  );
}
