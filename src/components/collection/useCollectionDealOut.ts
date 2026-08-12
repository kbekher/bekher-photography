"use client";

import { useRef, useState, type RefObject } from "react";
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
 */
export function useCollectionDealOut(
  containerRef: RefObject<HTMLElement | null>,
  { enabled }: UseCollectionDealOutOptions
) {
  const [step, setStep] = useState<DealOutStep>("idle");
  const startedRef = useRef(false);

  useDealOutSequence(containerRef, step);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!enabled) {
      container.dataset.visible = "true";
      if (startedRef.current) setStep("done");
      return;
    }

    startedRef.current = true;
    setStep("gather");

    const timers = [
      window.setTimeout(() => {
        if (containerRef.current) containerRef.current.dataset.visible = "true";
      }, COLLECTION_GATE_DELAY_MS),
      window.setTimeout(() => setStep("deal"), COLLECTION_DEAL_START_MS),
      window.setTimeout(() => setStep("done"), DONE_MS),
    ];

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [containerRef, enabled]);
}
