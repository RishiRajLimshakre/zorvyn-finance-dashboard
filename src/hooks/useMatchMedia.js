import { useState, useEffect } from "react";

/**
 * Subscribes to a CSS media query (e.g. `(max-width: 640px)`).
 * SSR-safe: returns `false` until mounted.
 */
export function useMatchMedia(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
}
