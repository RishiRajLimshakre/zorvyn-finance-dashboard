import { useMemo } from "react";
import { normalizeUi, useFinanceStore } from "../store/useFinanceStore";

/**
 * Stable normalized ui: subscribe to the raw `ui` object only, then memoize normalization.
 * Avoids `useFinanceStore((s) => normalizeUi(s.ui))` which returns a new object every snapshot
 * and triggers "Maximum update depth" / getSnapshot warnings with React 19.
 */
export function useAppUi() {
  const rawUi = useFinanceStore((state) => state.ui);
  const ui = useMemo(() => normalizeUi(rawUi), [rawUi]);
  return { ui, rawUi };
}
