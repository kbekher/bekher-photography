"use client";

import { useRef, useState, type RefObject } from "react";
import {
  DEAL_BUDGET_MS,
  useDealOutSequence,
  useIsomorphicLayoutEffect,
  type DealOutStep,
} from "@/components/intro/useDealOut";

// Collection-page timeline, measured from mount. Title (0ms) and description
// (~100ms) are driven by CollectionContent's own framer variants and are
// untouched by this hook — only the grid is:
//   0ms     `gather` is applied synchronously, before the browser's first
//           paint (see useIsomorphicLayoutEffect below) — the anchor (first
//           photo) snaps to centre-stage, every other tile snaps to
//           hidden/scaled-down. The grid wrapper is still `opacity: 0` at
//           this instant (GridReveal.module.css's static gate class), so
//           none of this snap is ever visible.
//   ~350ms  the wrapper's CSS opacity gate releases, fading in over ~350ms.
//           Because `gather` already ran, the ONLY thing that becomes
//           visible is the centred first photo — every other tile is stacked
//           directly behind it, fully opaque but completely occluded.
//   ~1000ms `deal` begins — the exact same choreography as the intro's
//           useDealOut (see DEAL_BUDGET_MS/DEAL_LANDING_MS there): the deck
//           peels off card by card into the grid, and the anchor itself,
//           starting mid-flight, finishes last.
//   ~3000ms `done` — every inline style this hook touched is cleared.
const GATE_DELAY_MS = 350;
const DEAL_START_MS = 1000;
const DONE_MS = DEAL_START_MS + DEAL_BUDGET_MS;

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
 * `gather` has already run. Unlike `useDealOut`, there's no IntroContext
 * phase machine to ride on a collection page, so this hook owns its own
 * timeline: `gather` -> hold -> `deal` -> `done`, walked on plain
 * `setTimeout`s, with the wrapper's `data-visible` attribute toggled
 * imperatively (not via React state — nothing here should re-render the
 * grid on a timer tick).
 */
export function useCollectionDealOut(
  containerRef: RefObject<HTMLElement | null>,
  { enabled }: UseCollectionDealOutOptions
) {
  const [step, setStep] = useState<DealOutStep>("idle");
  // Distinguishes "enabled was false from the very start" (nothing was ever
  // touched, no cleanup needed) from "enabled flipped true -> false
  // mid-flight" (e.g. a reduced-motion preference detected after the
  // sequence had already started), which DOES need to unwind whatever
  // `gather`/`deal` already applied.
  const startedRef = useRef(false);

  // `fadeContainer` is deliberately left off (the default) — this page's
  // wrapper already has its own CSS-class-driven gate (GridReveal.module.css's
  // `.gate`, released via `data-visible` below on this hook's own
  // GATE_DELAY_MS schedule). Turning useDealOutSequence's own container fade
  // on here too would fight that: an inline `style.opacity` always beats a
  // stylesheet rule, so it would hijack the gate's timing instead of
  // composing with it. See useDealOut.ts's `useDealOut` for the sibling
  // caller that DOES need this (home has no gate of its own).
  useDealOutSequence(containerRef, step);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!enabled) {
      // Nothing to gather — reveal the grid at rest immediately. If the
      // sequence had already started, snapping straight to `done` runs
      // useDealOutSequence's cleanup branch, clearing whatever inline
      // styles `gather`/`deal` left behind on the tiles.
      container.dataset.visible = "true";
      if (startedRef.current) setStep("done");
      return;
    }

    startedRef.current = true;
    setStep("gather");

    const timers = [
      window.setTimeout(() => {
        if (containerRef.current) containerRef.current.dataset.visible = "true";
      }, GATE_DELAY_MS),
      window.setTimeout(() => setStep("deal"), DEAL_START_MS),
      window.setTimeout(() => setStep("done"), DONE_MS),
    ];

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [containerRef, enabled]);
}
