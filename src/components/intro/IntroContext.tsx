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

// Per-phase duration in ms. wordmark 650 + nav 560 + photo 450 + dealOut 1300
// = 2960ms total — under the spec's ~3s ceiling.
//
// `dealOut`'s 1300ms is not a single beat: useDealOut sequences two beats
// inside it (the other visible tiles settle first, staggered up to 180ms +
// their own 480ms transform = 660ms; THEN, only once that's finished, the
// anchor tile gets its own deliberate 550ms move into its grid slot —
// 660 + 550 = 1210ms). This phase's duration must stay >= that inner total;
// 1300 gives a ~90ms cushion against setTimeout jitter, or the `done`
// cleanup below could fire while the anchor is still mid-transition and
// snap it to its resting transform, which reads as a visible cut. See
// useDealOut.ts for the full breakdown.
const DURATIONS: Record<Exclude<IntroPhase, "idle" | "done">, number> = {
  wordmark: 650,
  nav: 560,
  photo: 450,
  dealOut: 1300,
};

// Preloader (Figma `First_screen`, node 31:997 — a blank white page with the
// wordmark centred). That frame IS this intro's `wordmark` phase, so the
// preloader isn't separate UI: it's a hold on that phase until the first
// photos have actually decoded. Without it the sequence runs on a pure timer
// and can deal the grid out onto empty placeholder boxes on a slow
// connection, which is exactly what a preloader exists to prevent.
const PRELOAD_COUNT = 4; // the priority-loaded first row
// Hard ceiling so a slow or dead connection can never trap someone on the
// logo screen — we show the page regardless once this elapses.
const MAX_PRELOAD_WAIT = 2500;

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
  const [assetsReady, setAssetsReady] = useState(false);
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
    const params =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : null;
    const isPhotoDeepLink = params?.has("photo") ?? false;
    // Dev/QA escape hatch: `?intro=1` forces a replay regardless of the
    // sessionStorage flag, so iterating on the design doesn't require a new
    // tab (or clearing storage) for every reload. Read the same
    // hydration-safe way as `isPhotoDeepLink` above — inside this effect,
    // never during render.
    const forceReplay = params?.get("intro") === "1";

    // `useReducedMotion()` can genuinely return `null` (its type is
    // `boolean | null`) — e.g. before `initPrefersReducedMotion()` has ever
    // run in this environment, or if `window.matchMedia` doesn't exist.
    // Treating "not `false`" as "skip" (the previous check) means an
    // *unknown* reading silently disables the intro for everyone; only an
    // affirmative `true` — the user has actually opted into reduced motion —
    // should skip it.
    const prefersReducedMotion = reducedMotion === true;
    const alreadyPlayed = hasPlayedIntro() && !forceReplay;

    const skip = prefersReducedMotion || alreadyPlayed || isPhotoDeepLink;

    // Mark the session as "seen" so a reduced-motion user who later disables
    // that setting mid-session still doesn't get the intro on their next
    // in-app navigation — one intro opportunity per session, full stop.
    // EXCEPT for a `?photo=` deep link: that path never actually played
    // anything (the lightbox took over instead), so it must not burn the
    // session's one shot at the intro on a later plain visit.
    if (!isPhotoDeepLink) {
      markIntroPlayed();
    }

    setPhase(skip ? "done" : "wordmark");
  }, [reducedMotion]);

  // Preloader: while the wordmark sits centred, wait for the first row of
  // photos to decode. The real grid is already server-rendered underneath the
  // opaque overlay, so its <img>s are genuinely downloading during this hold —
  // we just watch them rather than re-fetching anything.
  useEffect(() => {
    if (phase !== "wordmark") return;

    const ac = new AbortController();
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      setAssetsReady(true);
    };

    const cap = window.setTimeout(finish, MAX_PRELOAD_WAIT);

    const images = Array.from(
      document.querySelectorAll<HTMLImageElement>("[data-index] img")
    ).slice(0, PRELOAD_COUNT);

    if (images.length === 0) {
      finish();
    } else {
      let remaining = images.length;
      const settleOne = () => {
        remaining -= 1;
        if (remaining <= 0) finish();
      };
      for (const img of images) {
        // `complete` covers images already cached on a repeat visit.
        if (img.complete) {
          settleOne();
          continue;
        }
        // "error" settles too — a broken image must never stall the intro.
        img.addEventListener("load", settleOne, { once: true, signal: ac.signal });
        img.addEventListener("error", settleOne, { once: true, signal: ac.signal });
      }
    }

    return () => {
      ac.abort();
      window.clearTimeout(cap);
    };
  }, [phase]);

  // Walk the phases on a timer.
  useEffect(() => {
    if (phase === "idle" || phase === "done") return;
    // The preloader gate: hold on the centred wordmark (Figma `First_screen`)
    // until the first photos are ready. Every other phase is purely timed.
    if (phase === "wordmark" && !assetsReady) return;
    const t = setTimeout(() => setPhase(NEXT_PHASE[phase]), DURATIONS[phase]);
    return () => clearTimeout(t);
  }, [phase, assetsReady]);

  return <IntroContext.Provider value={{ phase }}>{children}</IntroContext.Provider>;
}
