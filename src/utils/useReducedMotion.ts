"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Synchronous, one-shot read of the same preference — for imperative
 * mount-only sequences that must branch on it *before* their first frame.
 *
 * `useReducedMotion` below cannot serve those: it resolves one commit after
 * mount, so a mount-only `useLayoutEffect` always sees its `false` seed and
 * its reduced-motion branch is dead code. Anything that starts animating in
 * that first layout effect (the lightbox's open morph) has to ask directly.
 *
 * Only ever call this from inside an effect. Calling it during render would
 * reintroduce exactly the hydration mismatch the hook is shaped to avoid.
 * Returns `false` on an affirmative "no" AND on any error — matching the rule
 * used everywhere else here, that only a definite `true` suppresses motion.
 */
export function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia(QUERY).matches === true;
  } catch {
    return false;
  }
}

/**
 * Drop-in replacement for framer-motion's `useReducedMotion` (see the
 * animation-stack note in `src/components/intro/useDealOut.ts`): this project
 * standardised on GSAP, and this hook was the last thing keeping ~40kb of
 * framer-motion in the bundle.
 *
 * Deliberately effect-driven, exactly like the hook it replaces, and that is
 * load-bearing rather than incidental:
 *  - It seeds `false` — NOT the real preference — so the server render and
 *    the client's first render are byte-identical and hydration can never
 *    mismatch. `matchMedia` doesn't exist during SSR anyway, but even on the
 *    client the first render must not read it.
 *  - Callers therefore see `false` for one render. Every animation in this
 *    codebase is started from an effect (or a GSAP timeline built in one),
 *    never during render, so nothing has actually moved by the time the real
 *    value lands on the next commit.
 *
 * The listener stays attached for the component's life: the preference can be
 * toggled mid-session (macOS "Reduce motion", browser devtools emulation),
 * and a stale `false` would keep animating for someone who just asked us to
 * stop.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    // Guard rather than assume: `matchMedia` is missing in some embedded
    // webviews and jsdom-style test environments, and an exception here would
    // take the whole component down for a purely cosmetic preference.
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mql = window.matchMedia(QUERY);
    setReduced(mql.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export default useReducedMotion;
