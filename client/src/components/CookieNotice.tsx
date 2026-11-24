import { useEffect, useState } from "react";

const KEY = "aruland-cookie";

export function CookieNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(localStorage.getItem(KEY) !== "1");
  }, []);

  if (!open) return null;

  return (
    <div className="fixed z-[70] bottom-4 left-4 right-24 sm:right-auto sm:max-w-sm bg-[#3F2412] text-white rounded-2xl p-4 shadow-float">
      <p className="text-sm leading-relaxed">
        Përdorim cookie vetëm që shporta dhe gjuha të mbahen mend në këtë shfletues.
      </p>
      <button
        type="button"
        onClick={() => {
          localStorage.setItem(KEY, "1");
          setOpen(false);
        }}
        className="mt-3 px-4 py-2 rounded-full bg-white text-[#3F2412] text-sm font-semibold"
      >
        Në rregull
      </button>
    </div>
  );
}
