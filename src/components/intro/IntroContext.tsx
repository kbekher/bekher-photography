"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { markIntroPlayed } from "./introSession";

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

// Per-phase duration in ms. wordmark 3400 + nav 1450 + photo 1450 +
// dealOut 2000 = 8300ms total. Each number is load-bearing for a specific
// beat rather than an arbitrary budget split, so none of them can be
// retuned in isolation:
//
// - wordmark (3400ms): the full K+B -> "Kristina Bekher" morph
//   (IntroOverlay) lives entirely inside this window — monogram pose, hold,
//   K/B spreading apart to their natural positions, then every other
//   character fading in left-to-right — and finishes with a ~350ms hold
//   before advancing. See IntroOverlay's own timeline comment for the
//   beat-by-beat breakdown; this number must stay in sync with its
//   REMAINING_WINDOW_END_MS.
// - nav (1450ms): NOT a single fade. The wordmark spends the first 1000ms
//   travelling from centre-stage up into its header position; only once
//   that's fully settled does the navbar echo start its own 450ms fade-in
//   (IntroOverlay gives it a matching 1000ms transition-delay). The nav must
//   never appear to move alongside — or worse, ahead of — the wordmark
//   still in transit.
// - photo (1450ms): the overlay dissolves (~450ms) to reveal the feed's
//   first photo alone, centred, with every other photo stacked behind it
//   (OverviewFeed) — then there's a deliberate ~1000ms hold on that single
//   centred image before the deck deals out. That hold is what makes the
//   reveal read as intentional rather than a blip on the way to the grid.
// - dealOut (2000ms): owned by useDealOut, which sequences its own overlapping
//   beats inside this window (the stacked tiles peel off staggered, and the
//   anchor — starting mid-flight — lands last at 1800ms; see useDealOut.ts's
//   DEAL_BUDGET_MS, which this must stay equal to). If this ever drops below
//   useDealOut's inner total, the `done` cleanup below fires mid-transition
//   and snaps the anchor to its resting transform — a visible cut.
const DURATIONS: Record<Exclude<IntroPhase, "idle" | "done">, number> = {
  wordmark: 3400,
  nav: 1450,
  photo: 1450,
  dealOut: 2000,
};

// Preloader (Figma `First_screen`, node 31:997 — a blank white page with the
// wordmark centred). That frame IS this intro's `wordmark` phase, so the
// preloader isn't separate UI: it's a hold on that phase until the first
// photos have actually decoded. Without it the sequence runs on a pure timer
// and can deal the grid out onto empty placeholder boxes on a slow
// connection, which is exactly what a preloader exists to prevent.
const PRELOAD_COUNT = 4; // the priority-loaded first row
// Hard ceiling so a slow or dead connection can never trap someone on the
// logo screen — we show the page regardless once this elapses. Deliberately
// equal to DURATIONS.wordmark: that 3400ms is a choreographed animation that
// must start the instant the phase is entered (see the phase-walk effect
// below — its timer is never delayed by this gate), so the preload wait can
// only ever run CONCURRENTLY with the animation, never stack in front of or
// after it. Capping it at the same 3400ms means the asset gate can, at
// worst, hold the phase open for a few extra ms of setTimeout jitter past
// the animation's natural end — never a second multi-second wait.
const MAX_PRELOAD_WAIT = 3400;

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

// Set to true the instant a decide-once effect (below) actually calls
// markIntroPlayed() — i.e. the moment THIS JS realm burns the session's one
// intro opportunity for real. Deliberately module scope, not component state
// (not even a ref): a ref lives and dies with its component instance, and a
// client-side nav away from `/` before `phase` reaches `"done"` unmounts
// IntroProvider (see the cleanup effect below — it only clears
// `data-intro="play"` on `done`, which an interrupted intro never reaches)
// without ever burning the flag down. A nav back to `/` then mounts a BRAND
// NEW IntroProvider with a fresh `decided` ref, which would happily read the
// still-stale "play" attribute and replay the whole intro — even though
// sessionStorage was already marked in step one. A module-scope variable, by
// contrast, survives for exactly as long as the attribute can possibly stay
// stale (both live only within one JS realm, i.e. until an actual page
// reload — see layout.tsx's head script, which is what sets the attribute in
// the first place and only ever runs once per real load), so it can never
// disagree with it.
//
// This intentionally does NOT track "has any decision been made" — only
// "has markIntroPlayed() been called". That distinction is what preserves
// the `?photo=` deep-link exception just below: a deep-link mount decides
// (usually "don't play") without burning the shot, so a LATER mount in the
// same realm (e.g. the lightbox closes client-side, or the user navigates
// elsewhere and back to `/` without a full reload) is still free to make its
// own fresh decision, exactly as before this fix. It's also why this can't
// simply be `hasPlayedIntro()` re-checked here: that would also correctly
// catch the interrupted-replay bug, but it can't distinguish "burned by an
// earlier mount in THIS realm" from "burned in an earlier real session, now
// legitimately overridden by a `?intro=1` forced replay on a fresh reload" —
// the latter must still be allowed to play, and a fresh reload always starts
// a fresh JS realm, so this flag (unlike sessionStorage) correctly resets
// for it.
let burnedThisPageLoad = false;

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
 * user prefer reduced motion? — is made TWICE, deliberately, by two layers
 * that must never be allowed to disagree:
 *
 *  1. An inline, synchronous `<script>` in `layout.tsx`'s `<head>` (see
 *     that file) runs before the body is even parsed, using the same
 *     rules as below, and sets `data-intro="play"` on `<html>` if the
 *     intro should play. `globals.css` keys the overlay's visibility
 *     purely off that attribute, so the preloader can be visible from the
 *     very first painted frame — no React state can do that, because a
 *     `useState` initial value only reaches the DOM once hydration runs,
 *     which is already after first paint.
 *  2. This component's `useEffect` below, which — instead of recomputing
 *     the decision from `sessionStorage`/`matchMedia` a second time and
 *     risking a different answer — simply reads back the attribute the
 *     script already set. It runs strictly *after* the DOM has committed,
 *     by which point the CSS gate has already been doing its job for
 *     however long hydration took; this just hands off from "CSS is
 *     holding a static frame" to "React is animating a phase machine".
 *
 * `phase` itself is still seeded with `useState<IntroPhase>("idle")` — a
 * plain literal, not something computed from `sessionStorage`/`matchMedia`
 * — so the server render and the client's first render (before hydration
 * reconciles) stay byte-for-byte identical, and IntroOverlay's rendered
 * markup/props are identical on both sides too (see IntroOverlay's
 * `mounted` check, which includes `idle`). There is nothing here for React
 * to warn about mismatching; only the *visibility* of that identical markup
 * differs pre-hydration, and that's decided in CSS, not React.
 */
export default function IntroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>("idle");
  const [assetsReady, setAssetsReady] = useState(false);
  // Flips true once `wordmark`'s 5000ms animation timer has elapsed. Kept
  // separate from `assetsReady` on purpose — see the phase-walk effect
  // below, which requires BOTH before leaving `wordmark`, so a fast
  // connection never truncates the animation and a slow one only ever
  // extends the hold past 5000ms instead of stacking a wait in front of it.
  const [wordmarkTimeUp, setWordmarkTimeUp] = useState(false);
  const decided = useRef(false);

  // Decide once, after mount, whether to play at all.
  useEffect(() => {
    if (decided.current) return;
    decided.current = true;

    // A `?photo=n` deep link opens the lightbox immediately on load. Playing
    // the intro underneath it would run two full-screen animations at once
    // and deal the grid out behind an already-open overlay, so a deep link
    // wins outright. The head script already folds this into its play/skip
    // decision too; it's re-read here only for the `markIntroPlayed`
    // exception below. Read from `window.location` rather than
    // `useSearchParams()` on purpose: this must not influence render (see
    // "Hydration safety" above), and it avoids forcing a Suspense boundary
    // around the whole home page.
    const params =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : null;
    const isPhotoDeepLink = params?.has("photo") ?? false;

    // If THIS realm already burned the session's one shot — an earlier
    // IntroProvider mount, earlier in this same page load, already called
    // markIntroPlayed() — no later mount may play again, full stop, even
    // though `data-intro="play"` may still be sitting stale on <html> (see
    // `burnedThisPageLoad`'s doc comment above for why the attribute alone
    // can't be trusted here, and why this check has to come BEFORE the
    // attribute is ever read below).
    if (burnedThisPageLoad) {
      setPhase("done");
      return;
    }

    // The inline head script (layout.tsx) already made this exact call —
    // session flag, `?intro=1` replay, prefers-reduced-motion, `?photo=`
    // deep link — before the first paint. Reading its result back here
    // rather than recomputing it means these two decisions can never
    // disagree with each other.
    const willPlay = document.documentElement.dataset.intro === "play";

    // Mark the session as "seen" so a reduced-motion user who later disables
    // that setting mid-session still doesn't get the intro on their next
    // in-app navigation — one intro opportunity per session, full stop.
    // EXCEPT for a `?photo=` deep link: that path never actually played
    // anything (the lightbox took over instead), so it must not burn the
    // session's one shot at the intro on a later plain visit.
    if (!isPhotoDeepLink) {
      markIntroPlayed();
      burnedThisPageLoad = true;
    }

    setPhase(willPlay ? "wordmark" : "done");
  }, []);

  // The head script's `data-intro="play"` attribute is only meant to hold
  // through the pre-hydration window; once the intro machine has actually
  // reached its resting state (played to completion OR was skipped above),
  // clear it so nothing — a later client-side nav back to `/`, a stray CSS
  // rule — can key off a stale "play" value for the rest of the session.
  useEffect(() => {
    if (phase === "done") {
      document.documentElement.removeAttribute("data-intro");
    }
  }, [phase]);

  // Belt-and-braces: also clear the attribute if IntroProvider unmounts
  // before ever reaching `done` — exactly the interrupted-navigation
  // scenario `burnedThisPageLoad` above is designed around. This is NOT what
  // makes that scenario safe, though — an unmount cleanup firing before the
  // next mount's effect runs is a React scheduling detail, not a guarantee,
  // so the actual decision above never depends on it. This just means one
  // less stale attribute sitting on <html> in the meantime.
  useEffect(() => {
    return () => {
      document.documentElement.removeAttribute("data-intro");
    };
  }, []);

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

  // Walk the phases on a timer. Every phase's timer starts the INSTANT the
  // phase is entered — this matters most for `wordmark`, whose 5000ms IS the
  // K+B -> wordmark choreography (IntroOverlay): that animation must never
  // be delayed by the asset-preload gate below, or the gate would stack an
  // extra wait in FRONT of the animation instead of only ever extending it.
  //
  // `wordmark` is the one phase this timer doesn't advance directly — it
  // just flips `wordmarkTimeUp`, and the effect after this one is what
  // actually calls `setPhase`, once BOTH that flag and `assetsReady` are
  // true. Every other phase is purely timed and advances straight away.
  useEffect(() => {
    if (phase === "idle" || phase === "done") return;
    const t = setTimeout(() => {
      if (phase === "wordmark") {
        setWordmarkTimeUp(true);
      } else {
        setPhase(NEXT_PHASE[phase]);
      }
    }, DURATIONS[phase]);
    return () => clearTimeout(t);
  }, [phase]);

  // Leave `wordmark` only once its animation has actually finished AND the
  // first row of photos has decoded — see the timer effect above (animation
  // clock) and the preloader effect above it (asset clock). Splitting this
  // into its own effect, keyed off both flags, is what lets a fast
  // connection wait out the full 5000ms unbothered while a slow one holds
  // a little longer without ever truncating the animation.
  useEffect(() => {
    if (phase === "wordmark" && wordmarkTimeUp && assetsReady) {
      setPhase("nav");
    }
  }, [phase, wordmarkTimeUp, assetsReady]);

  return <IntroContext.Provider value={{ phase }}>{children}</IntroContext.Provider>;
}
