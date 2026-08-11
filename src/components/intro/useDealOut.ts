"use client";

import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { useIntroPhase } from "./IntroContext";

const EASE = "cubic-bezier(0.25, 0.1, 0.25, 1)";

// The OTHER visible tiles settle into their grid slots, staggered by index.
const STAGGER_PER_INDEX_MS = 45;
const MAX_STAGGER_MS = 600;
const SETTLE_TRANSFORM_MS = 850;
// Last "other" tile finishes at MAX_STAGGER_MS + SETTLE_TRANSFORM_MS = 1450ms.

// ## The "deck of cards" pose (`gather`)
// Every photo starts stacked directly BEHIND the first one, and they peel
// off that stack one at a time — nothing ever fades. This is a deliberate
// constraint, not an omission: opacity was the old implementation and it
// read as "photos materialise out of nothing" rather than "photos were
// always there, hidden behind this one". Two things make the illusion hold:
//
//  - ANCHOR_SCALE keeps the front card at (essentially) its natural grid
//    size rather than blowing it up into a hero. A scaled-up anchor would
//    force every card behind it to be scaled up too just to stay covered,
//    and their flight out would then read as a shrink instead of the
//    growth the reference calls for.
//  - STACK_FIT scales each hidden card to fit ENTIRELY INSIDE the anchor's
//    box, rather than by some fixed fraction. That distinction matters
//    because this grid mixes 2:3 and 3:2 tiles: a horizontal card behind a
//    vertical anchor scaled by a flat 0.55 would still poke out at the
//    sides. Fitting to `min(w-ratio, h-ratio)` is what makes the occlusion
//    exact for every orientation pairing; the sub-1 factor is a subpixel
//    margin so no edge peeks out at fractional device pixel ratios.
const ANCHOR_SCALE = 1;
const STACK_FIT = 0.96;

// The anchor's own move. It starts at the SAME instant as everything else —
// zero delay, deliberately. "Last to take its place" is achieved purely by
// giving it a longer duration than any other card (1800ms vs the last
// other's 1450ms), never by holding it back: any start delay at all reads as
// the front card being stuck, which is exactly the stall this is tuned to
// avoid. Keep ANCHOR_START_MS at 0 unless that changes.
const ANCHOR_START_MS = 0;
const ANCHOR_MOVE_MS = 1800;
// Anchor lands at ANCHOR_START_MS + ANCHOR_MOVE_MS = 1800ms — 350ms after
// the last other card (1450ms), so it is unambiguously the last to arrive.
export const DEAL_LANDING_MS = ANCHOR_START_MS + ANCHOR_MOVE_MS;
// The budget every consumer of this choreography sizes its own timing
// against: IntroContext's `dealOut` phase duration (see that file's
// DURATIONS — not edited here) and useCollectionDealOut's own timers below.
// DEAL_LANDING_MS (1800ms) leaves a 200ms cushion inside it against
// setTimeout jitter, so cleanup never fires while the anchor is still
// mid-transition (which would snap it to its resting transform — a visible
// cut).
export const DEAL_BUDGET_MS = 2000;

// "The first ~3 rows" (spec) isn't a fixed tile count — the grid is 2
// columns on phone, 4 on desktop, and a taller viewport simply fits more
// rows before the fold. So instead of hardcoding a row/column count, a tile
// is dealt with if any part of its box is inside the viewport at the moment
// the anchor snaps to centre (still in identity layout at that instant, so
// this is a true "is it visible right now" read). MAX_DEAL_TILES is just a
// safety valve for a pathological case (e.g. a very short, very wide
// viewport showing many partial rows) so this can never balloon into
// animating the whole feed.
const MAX_DEAL_TILES = 24;

/**
 * `useLayoutEffect` is a no-op (with a console warning) during SSR, since
 * there's no DOM to measure/mutate synchronously before a paint that isn't
 * happening. This falls back to `useEffect` there and only becomes the real
 * synchronous, pre-paint version once running in the browser — the standard
 * "isomorphic layout effect" shim. Both hooks below need the real thing on
 * the client: `useDealOutSequence`'s `gather` step must snap tiles into
 * their centred/hidden pose before the browser paints, or the snap itself
 * flashes on screen for a frame.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** The low-level, phase-agnostic state machine every "deal out from centre"
 * animation on the site is built from — see the module doc comment below. */
export type DealOutStep = "idle" | "gather" | "deal" | "done";

/**
 * Steps 3-5 of the intro (spec §5.1, client-authoritative wording), and the
 * collection page's equivalent open animation, choreographed as a deck of
 * cards being dealt:
 *
 *  - `gather`: the FIRST photo sits alone at viewport centre, at its natural
 *    grid size, with every OTHER photo currently in view stacked directly
 *    BEHIND it — scaled down just enough to be completely hidden by it, and
 *    fully opaque. On screen this is one photo, alone, on an empty page.
 *  - `deal`: the cards peel off that stack one at a time, staggered by
 *    index, each travelling to its grid slot and growing to its real size on
 *    the way. The anchor starts its own move partway through that settle and
 *    simply *finishes* last, so there's no visible stall before it moves —
 *    just a controlled "last to arrive".
 *  - `done`: every inline style this hook touched is cleared.
 *
 * Nothing in this sequence animates `opacity`. That's the whole point of the
 * deck pose — a photo is never translucent, it's either hidden behind
 * another photo or it isn't. See the ANCHOR_SCALE/STACK_FIT comment above
 * for the geometry that makes the occlusion exact across mixed 2:3 / 3:2
 * tiles.
 *
 * This is intentionally NOT implemented by changing PhotoGrid/PhotoTile (out
 * of scope — see task file-ownership rules) — it works entirely from
 * outside, by grabbing the already-rendered tile elements via the
 * `data-index` attribute PhotoTile already puts on its root node, and
 * nudging their `transform`/`opacity` imperatively. React never manages a
 * `style` prop on that node, so these direct DOM writes are never
 * clobbered by PhotoTile's own re-renders (e.g. its `loaded` state flipping
 * on image load), and every inline style this hook sets is cleared exactly
 * once `step` reaches `done` — that matters because `PhotoTile` wraps its
 * image in a `layoutId` element for the lightbox's shared-element morph, and
 * a leftover inline `transform` would make that morph start from a
 * corrupted rect. Both callers below (`useDealOut` for the home page,
 * `useCollectionDealOut` in `src/components/collection/` for collection
 * pages) must preserve this discipline exactly — it's the one hard
 * invariant this file cannot break.
 *
 * ## Why plain DOM mutation instead of state/framer here
 * The grid can hold up to 20+ tiles on first paint; driving this from React
 * state would mean re-rendering all of them every frame. A one-shot
 * "snap to a computed offset, then transition to identity" (the classic
 * FLIP technique) is imperceptibly different for the user and far cheaper.
 *
 * ## `useDealOutSequence` — the shared core
 * Phase-agnostic: it only reacts to `step` changing between `idle`, `gather`,
 * `deal` and `done`, and has no idea what's driving that. Two callers drive
 * it differently:
 *  - `useDealOut(containerRef)` maps `IntroContext`'s phase onto `step`
 *    (`photo` -> `gather`, `dealOut` -> `deal`, `done` -> `done`, everything
 *    else -> `idle`), keeping its own call signature unchanged so
 *    `OverviewFeed` needs no changes. The `gather` snap is invisible there
 *    because `IntroOverlay` is still opaque at the instant `photo` starts —
 *    see that component for how its fade is sequenced against this.
 *  - `useCollectionDealOut(containerRef, { enabled })` walks the same steps
 *    off its own `setTimeout`s, with no overlay to hide behind — see that
 *    file for how it solves visibility instead (a CSS opacity gate on the
 *    grid wrapper, released only once `gather` has already been applied).
 */
export function useDealOutSequence(
  containerRef: RefObject<HTMLElement | null>,
  step: DealOutStep
) {
  const enteredRef = useRef(false);
  // The exact set of elements this run touched (anchor + visible others),
  // captured once in the `gather` step. `deal` and the `done` cleanup both
  // act on this same snapshot rather than re-querying `[data-index]` live,
  // so a mid-sequence pagination click (unlikely, but possible) can never
  // sweep newly-mounted tiles into the cleanup pass or leave stragglers
  // dangling.
  const dealtRef = useRef<HTMLElement[]>([]);
  const timeoutsRef = useRef<number[]>([]);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const clearTimers = () => {
      timeoutsRef.current.forEach((id) => window.clearTimeout(id));
      timeoutsRef.current = [];
    };

    if (step === "gather") {
      // eslint-disable-next-line no-console
      console.log("GATHER_RUN", Date.now(), (window as any).__gatherRuns = ((window as any).__gatherRuns || 0) + 1);
      enteredRef.current = true;

      const tiles = Array.from(container.querySelectorAll<HTMLElement>("[data-index]"));
      const anchor = tiles.find((el) => el.dataset.index === "0");
      if (!anchor) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const targetX = vw / 2;
      const targetY = vh / 2;

      // Tiles still sit in their real, identity layout right up until the
      // styles below are applied, so this is a genuine on-screen check.
      const visible = tiles.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.bottom > 0 && r.top < vh;
      });
      const dealt = visible.slice(0, MAX_DEAL_TILES);
      if (!dealt.includes(anchor)) dealt.push(anchor);
      dealtRef.current = dealt;

      const anchorRect = anchor.getBoundingClientRect();
      const anchorCx = anchorRect.left + anchorRect.width / 2;
      const anchorCy = anchorRect.top + anchorRect.height / 2;
      // The anchor's on-screen box once posed — what every card behind it
      // has to fit inside of.
      const poseW = anchorRect.width * ANCHOR_SCALE;
      const poseH = anchorRect.height * ANCHOR_SCALE;

      dealt.forEach((el) => {
        el.style.willChange = "transform";
        el.style.transition = "none";
        el.style.transformOrigin = "50% 50%";

        if (el === anchor) {
          // Explicitly above every other card. Well under the lightbox
          // overlay's own z-50, so a tile can never paint over it.
          el.style.zIndex = String(MAX_DEAL_TILES + 1);
          el.style.transform = `translate(${targetX - anchorCx}px, ${targetY - anchorCy}px) scale(${ANCHOR_SCALE})`;
          return;
        }

        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        // A tile with no laid-out box (an aspect-ratio box whose image hasn't
        // resolved yet, say) would make the ratio below Infinity/NaN and blow
        // the transform out entirely — fall back to a safe small scale.
        const fit =
          r.width > 0 && r.height > 0
            ? Math.min(poseW / r.width, poseH / r.height) * STACK_FIT
            : 0.5;
        // Descending z by index, so the deck peels off the TOP: the tile
        // that leaves first (lowest index — see the stagger in `deal`) is
        // the one sitting nearest the front, not buried at the back.
        const index = Number(el.dataset.index ?? 0);
        el.style.zIndex = String(Math.max(1, MAX_DEAL_TILES - index));
        el.style.transform = `translate(${targetX - cx}px, ${targetY - cy}px) scale(${fit})`;
        el.style.pointerEvents = "none";
      });

      return;
    }

    if (step === "deal") {
      const dealt = dealtRef.current;
      const anchor = dealt.find((el) => el.dataset.index === "0") ?? null;
      const others = dealt.filter((el) => el !== anchor);

      // Every OTHER visible tile peels off the deck and settles into its grid
      // slot, staggered by index — growing from its stacked size to its real
      // one as it travels. `transform` is the ONLY property in flight: no
      // opacity, so a card is never translucent, it simply emerges from
      // behind the one in front (see the deck-pose comment up top). The
      // anchor is deliberately excluded from this loop — its own move is
      // scheduled separately below, overlapping this one.
      others.forEach((el) => {
        const index = Number(el.dataset.index ?? 0);
        const delay = Math.min(index * STAGGER_PER_INDEX_MS, MAX_STAGGER_MS);
        el.style.transition = `transform ${SETTLE_TRANSFORM_MS}ms ${EASE} ${delay}ms`;
      });
      // Force a style flush so the browser commits `transition` before we
      // change the target values below — otherwise it can coalesce both
      // into a single recalc and skip the animation entirely.
      void container.offsetHeight;

      // `zIndex` is deliberately NOT reset here — the stacking order has to
      // survive the whole flight, or a card mid-air would suddenly re-sort
      // against the ones still in the deck. It's cleared in `done`.
      const raf = requestAnimationFrame(() => {
        others.forEach((el) => {
          el.style.transform = "none";
          el.style.pointerEvents = "";
        });
      });

      // The anchor's own move starts once most of the others are already in
      // flight (ANCHOR_START_MS sits well inside their settle window, not
      // after it) and simply takes long enough that it's still the last
      // thing moving when it finishes.
      const anchorTimer = window.setTimeout(() => {
        if (!anchor) return;
        anchor.style.transition = `transform ${ANCHOR_MOVE_MS}ms ${EASE}`;
        void anchor.offsetHeight;
        requestAnimationFrame(() => {
          anchor.style.transform = "none";
        });
      }, ANCHOR_START_MS);
      timeoutsRef.current.push(anchorTimer);

      return () => {
        cancelAnimationFrame(raf);
        clearTimers();
      };
    }

    if (step === "done" && enteredRef.current) {
      enteredRef.current = false;
      clearTimers();
      const tiles =
        dealtRef.current.length > 0
          ? dealtRef.current
          : Array.from(container.querySelectorAll<HTMLElement>("[data-index]"));
      tiles.forEach((el) => {
        el.style.transition = "";
        el.style.transform = "";
        // `opacity` is no longer part of the choreography, but it's still
        // cleared: a tile can carry one over from an earlier, interrupted
        // run of this hook, and leaving it set would strand that tile.
        el.style.opacity = "";
        el.style.transformOrigin = "";
        el.style.pointerEvents = "";
        el.style.willChange = "";
        el.style.zIndex = "";
      });
      dealtRef.current = [];
    }
  }, [step, containerRef]);
}

const PHASE_TO_STEP: Record<
  "idle" | "wordmark" | "nav" | "photo" | "dealOut" | "done",
  DealOutStep
> = {
  idle: "idle",
  wordmark: "idle",
  nav: "idle",
  photo: "gather",
  dealOut: "deal",
  done: "done",
};

/**
 * Home-page entry point: drives `useDealOutSequence` off `IntroContext`'s
 * phase machine instead of its own timers. Call signature is unchanged from
 * before this file was split, so `OverviewFeed` needs no changes.
 */
export function useDealOut(containerRef: RefObject<HTMLElement | null>) {
  const phase = useIntroPhase();
  useDealOutSequence(containerRef, PHASE_TO_STEP[phase]);
}
