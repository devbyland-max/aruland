import { useState } from "react";

export function Newsletter() {
  return (
    <section id="about" className="py-10 sm:py-16 bg-white overflow-hidden relative">
      <div className="container-page">
        <div className="bg-brand-900 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-14 relative overflow-hidden text-center lg:text-left">
          <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-brand-500 rounded-full blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-40 sm:w-64 h-40 sm:h-64 bg-accent-pink rounded-full blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            <div className="max-w-xl w-full">
              <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-3 sm:mb-4">
                Join the Ohana!
              </h2>
              <p className="text-brand-100 text-sm sm:text-lg mb-6 sm:mb-8">
                Subscribe to our newsletter and get 15% off your first order. Be
                the first to know about limited edition drops!
              </p>
              <NewsletterForm />
              <p className="text-brand-300 text-xs mt-3 sm:mt-4">
                We respect your privacy. No spam, just cute updates.
              </p>
            </div>

            <div className="relative w-40 h-40 sm:w-56 sm:h-56 lg:w-72 lg:h-72 flex-shrink-0 hidden sm:block">
              <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse" />
              <img
                src="https://cdn.dribbble.com/userupload/12469058/file/original-860d2fadb2444b4b9d4d6792189900a0.png"
                className="w-full h-full object-contain relative z-10 drop-shadow-2xl rotate-12"
                alt="AruLand newsletter"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return <p className="text-white font-semibold">Thanks for joining!</p>;
  }

  return (
    <form
      className="flex flex-col sm:flex-row gap-3 sm:gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (email.trim()) setDone(true);
      }}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400 backdrop-blur-sm text-sm sm:text-base"
      />
      <button
        type="submit"
        className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-brand-900 font-bold rounded-xl hover:bg-brand-50 transition-colors shadow-lg"
      >
        Subscribe
      </button>
    </form>
  );
}
