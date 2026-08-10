"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";
import { hasPlayedIntro, markIntroPlayed } from "./introSession";

/**
 * The first-load intro's state machine (spec §5.1):
 *   idle -> wordmark -> nav -> photo -> dealOut -> done
 *
 * - idle:     resting state. Both the server render and the client's FIRST
 *             render are always `idle` — see "Hydration safety" below.
 * - wordmark: K+B appears, then morphs into "Kristina Bekher", centred.
 * - nav:      the wordmark travels up to its header position; the navbar
 *             fades in beneath it (IntroOverlay).
 * - photo:    the overlay dissolves, revealing the feed's first photo alone,
 *             centred (OverviewFeed).
 * - dealOut:  the rest of the grid deals out from that centre point into its
 *             slots (OverviewFeed).
 * - done:     resting state again — nothing left to animate.
 *
 * `idle` and `done` are both "nothing extra to render" states, which is what
 * makes the reduced-motion / already-played paths trivial: they just jump
 * straight from `idle` to `done` and every consumer's default (no overlay,
 * no transform) is already the correct final UI.
 */
export type IntroPhase = "idle" | "wordmark" | "nav" | "photo" | "dealOut" | "done";

// Per-phase duration in ms. wordmark 650 + nav 560 + photo 450 + dealOut 750
// = 2410ms total — comfortably under the spec's ~2.5s ceiling so the intro
// reads as a flourish, never a loading gate.
const DURATIONS: Record<Exclude<IntroPhase, "idle" | "done">, number> = {
  wordmark: 650,
  nav: 560,
  photo: 450,
  dealOut: 750,
};

const NEXT_PHASE: Record<Exclude<IntroPhase, "idle" | "done">, IntroPhase> = {
  wordmark: "nav",
  nav: "photo",
  photo: "dealOut",
  dealOut: "done",
};

export interface IntroContextValue {
  phase: IntroPhase;
}

const IntroContext = createContext<IntroContextValue>({ phase: "idle" });

/** Read the current intro phase. Safe to call anywhere — the default (inert)
 * context value is `idle`, i.e. "nothing playing, render normally". */
export function useIntroPhase(): IntroPhase {
  return useContext(IntroContext).phase;
}

/**
 * Orchestrates the first-load intro. Mount this once, near the top of the
 * home page tree, above both the overlay (IntroOverlay) and the photo grid
 * (OverviewFeed) — both read `phase` via `useIntroPhase()`.
 *
 * ## Hydration safety (the main trap here)
 * `phase` is seeded with `useState<IntroPhase>("idle")` — a plain literal,
 * not something computed from `sessionStorage` or `matchMedia`. That means
 * the server render, and the client's first render *before* hydration
 * reconciles, are byte-for-byte identical: `idle` on both sides, so neither
 * the overlay nor any grid transform is part of the initial HTML. There is
 * nothing here for React to warn about mismatching.
 *
 * The actual decision — has this session already seen the intro? does the
 * user prefer reduced motion? — only happens inside a `useEffect`, which by
 * definition never runs during SSR and never runs during the render that
 * produces the hydration output; it runs strictly *after* the DOM has
 * committed. So the very first thing a user (or a hydration diff) ever sees
 * is guaranteed to be the plain, static page — the intro is layered on top
 * a moment later, client-side only.
 */
export default function IntroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>("idle");
  const reducedMotion = useReducedMotion();
  const decided = useRef(false);

  // Decide once, after mount, whether to play at all.
  useEffect(() => {
    if (decided.current) return;
    decided.current = true;

    // `useReducedMotion` resolves synchronously on the client (it reads
    // `matchMedia` eagerly), but we still never let its value influence the
    // render that produced this component's first paint — only this effect,
    // which necessarily runs after that paint has already committed.
    // A `?photo=n` deep link opens the lightbox immediately on load. Playing
    // the intro underneath it would run two full-screen animations at once
    // and deal the grid out behind an already-open overlay, so a deep link
    // wins outright. Read from `window.location` rather than
    // `useSearchParams()` on purpose: this must not influence render (see
    // "Hydration safety" above), and it avoids forcing a Suspense boundary
    // around the whole home page.
    const isPhotoDeepLink =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("photo");

    const skip = reducedMotion !== false || hasPlayedIntro() || isPhotoDeepLink;

    // Mark the session as "seen" regardless of *why* we're skipping, so a
    // reduced-motion user who later disables that setting mid-session still
    // doesn't get the intro on their next in-app navigation — one intro
    // opportunity per session, full stop.
    markIntroPlayed();

    setPhase(skip ? "done" : "wordmark");
  }, [reducedMotion]);

  // Walk the phases on a timer.
  useEffect(() => {
    if (phase === "idle" || phase === "done") return;
    const t = setTimeout(() => setPhase(NEXT_PHASE[phase]), DURATIONS[phase]);
    return () => clearTimeout(t);
  }, [phase]);

  return <IntroContext.Provider value={{ phase }}>{children}</IntroContext.Provider>;
}
