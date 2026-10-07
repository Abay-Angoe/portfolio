"use client";

import { useEffect, useState } from "react";

/**
 * True on small (`< md`, i.e. ≤ 767px) screens, detected via matchMedia so
 * behaviour (not just styling) can branch. Starts false to match SSR/first
 * paint, then corrects after mount — avoiding a hydration mismatch.
 */
export function useIsMobile(query = "(max-width: 767px)"): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return isMobile;
}
