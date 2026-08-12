"use client";

import { useCallback, useRef, useState } from "react";
import {
  COLLECTION_DEAL_START_MS,
  COLLECTION_GATE_DELAY_MS,
  DEAL_BUDGET_MS,
} from "@/components/intro/introTimings";
import {
  useDealOutSequence,
  useIsomorphicLayoutEffect,
  type DealOutStep,
} from "@/components/intro/useDealOut";

const DONE_MS = COLLECTION_DEAL_START_MS + DEAL_BUDGET_MS;

export interface UseCollectionDealOutOptions {
  /**
   * Whether the sequence should play at all. The caller (CollectionContent)
   * is responsible for computing this — `false` for:
   *  - a `?photo=` lightbox deep link (same reasoning IntroContext uses on
   *    the home page: a full-screen overlay opening on top makes the reveal
   *    pointless, and running both at once is worse, not better);
   *  - a `prefers-reduced-motion` preference;
   *  - a collection with 0-1 photos (nothing to "gather" the rest of).
   * `false` renders the grid at rest, immediately, with no tile transform
   * ever applied — see the `!enabled` branch below.
   */
  enabled: boolean;
}

/**
 * Collection-page entry point for the shared "deal out from centre"
 * sequence — see useDealOut.ts's module doc comment for the full picture,
 * and GridReveal.module.css for how the wrapper stays invisible until
 * `gather` has already run.
 *
 * Returns the grid wrapper's ref CALLBACK, not a RefObject, and that is the
 * whole reason this hook owns the ref instead of taking one. The wrapper it
 * gates renders inside `LightboxProvider`'s `<Suspense>` boundary, and on a
 * reload that boundary is still suspended (`useSearchParams`) when this
 * component's layout effects run: a plain `useRef` reads `null` there. The
 * old shape bailed on that `null` with deps that never changed again, so the
 * effect never re-ran once the grid did mount — no `data-visible`, and the
 * `opacity: 0` gate stayed shut for good. A collection page reloaded from the
 * address bar showed its title and no photographs at all.
 *
 * Nothing else in the component tree announces that commit; React's ref
 * callback is the only signal that fires exactly when the node attaches, so
 * the sequence is keyed off that rather than off mount.
 */
export function useCollectionDealOut({ enabled }: UseCollectionDealOutOptions) {
  const [step, setStep] = useState<DealOutStep>("idle");
  // Both shapes of the same node: the state copy is what re-runs the effect
  // below when the grid attaches, the ref is what useDealOutSequence reads
  // (it wants a stable object, not a value that changes identity).
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const startedRef = useRef(false);

  const setGridRef = useCallback((node: HTMLElement | null) => {
    containerRef.current = node;
    setContainer(node);
  }, []);

  useDealOutSequence(containerRef, step);

  useIsomorphicLayoutEffect(() => {
    if (!container) return;

    if (!enabled) {
      container.dataset.visible = "true";
      setStep("done");
      return;
    }

    startedRef.current = true;
    setStep("gather");

    const timers = [
      window.setTimeout(() => {
        container.dataset.visible = "true";
      }, COLLECTION_GATE_DELAY_MS),
      window.setTimeout(() => setStep("deal"), COLLECTION_DEAL_START_MS),
      window.setTimeout(() => setStep("done"), DONE_MS),
    ];

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [container, enabled]);

  return { setGridRef, dealDone: step === "done" };
}
