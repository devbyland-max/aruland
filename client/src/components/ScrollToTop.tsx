import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Always open navigated pages at the top of the viewport. */
export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}
