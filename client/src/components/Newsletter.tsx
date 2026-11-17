import { useState } from "react";
import { ProductImage } from "./ProductImage";
import { useLang } from "../context/LangContext";

export function Newsletter() {
  const { t } = useLang();

  return (
    <section className="py-8 sm:py-12 bg-white overflow-hidden relative">
      <div className="container-page">
        <div className="bg-brand-900 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden text-center lg:text-left">
          <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-brand-500 rounded-full blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            <div className="max-w-xl w-full">
              <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-3">
                {t("joinOhana")}
              </h2>
              <p className="text-brand-100 text-sm sm:text-base mb-6">
                {t("newsletterText")}
              </p>
              <NewsletterForm />
              <p className="text-brand-200 text-xs mt-3">{t("privacyNote")}</p>
            </div>

            <div className="relative w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 flex-shrink-0 hidden sm:block">
              <div className="absolute inset-0 bg-white/10 rounded-full" />
              <ProductImage
                src="/products/stitch-pink.jpg"
                alt="Pelush AruLand newsletter"
                className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsletterForm() {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");

  if (status === "ok") {
    return <p className="text-white font-semibold">{t("thanksJoin")}</p>;
  }

  return (
    <form
      className="flex flex-col sm:flex-row gap-3"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
        if (!ok) {
          setStatus("err");
          return;
        }
        setStatus("ok");
      }}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status === "err") setStatus("idle");
        }}
        placeholder={t("emailPlaceholder")}
        aria-invalid={status === "err"}
        className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm sm:text-base"
      />
      <button
        type="submit"
        className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-brand-900 font-bold rounded-xl hover:bg-brand-50 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
      >
        {t("subscribe")}
      </button>
      {status === "err" && (
        <p className="text-pink-200 text-sm w-full basis-full">{t("invalidEmail")}</p>
      )}
    </form>
  );
}
