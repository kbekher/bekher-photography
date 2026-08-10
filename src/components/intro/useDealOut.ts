"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useIntroPhase } from "./IntroContext";

const EASE = "cubic-bezier(0.25, 0.1, 0.25, 1)";

// Beat 1 — the OTHER visible tiles settle into their grid slots, staggered.
const STAGGER_MS = 16;
const MAX_STAGGER_MS = 180;
const SETTLE_TRANSFORM_MS = 480;
const SETTLE_OPACITY_MS = 380;

// Beat 2 — the anchor's own move, LAST, once beat 1 has fully finished.
// Kept in the 500-700ms range (spec) so it reads as deliberate, not
// incidental, rather than blending into the settle above.
const ANCHOR_MOVE_MS = 550;
const BEAT1_TOTAL_MS = MAX_STAGGER_MS + SETTLE_TRANSFORM_MS; // 660ms

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
 * Steps 3-5 of the intro (spec §5.1, client-authoritative wording): the
 * FIRST photo appears alone, centred and enlarged; then every OTHER photo
 * currently in view flies/settles into its grid slot, staggered; and ONLY
 * THEN, last of all, does the first photo travel from centre-stage into its
 * own grid slot. The anchor is the final beat, never simultaneous with the
 * rest.
 *
 * This is intentionally NOT implemented by changing PhotoGrid/PhotoTile (out
 * of scope — see task file-ownership rules) — it works entirely from
 * outside, by grabbing the already-rendered tile elements via the
 * `data-index` attribute PhotoTile already puts on its root node, and
 * nudging their `transform`/`opacity` imperatively. React never manages a
 * `style` prop on that node, so these direct DOM writes are never
 * clobbered by PhotoTile's own re-renders (e.g. its `loaded` state flipping
 * on image load), and every inline style this hook sets is cleared exactly
 * once the intro reaches `done` (see the last branch below) — that matters
 * because `PhotoTile` wraps its image in a `layoutId` element for the
 * lightbox's shared-element morph, and a leftover inline `transform` would
 * make that morph start from a corrupted rect.
 *
 * ## Why plain DOM mutation instead of state/framer here
 * The grid can hold up to 20 tiles on first paint; driving this from React
 * state would mean re-rendering all of them every frame. A one-shot
 * "snap to a computed offset, then transition to identity" (the classic
 * FLIP technique) is imperceptibly different for the user and far cheaper.
 *
 * ## Sequencing with IntroOverlay
 * The `photo` phase's snap-to-hidden/centred state is applied instantly
 * (`transition: none`) the moment the phase flips — at that exact instant
 * IntroOverlay is still opaque (its own fade-out is just beginning), so the
 * snap is never visible; the overlay's fade is what "reveals" the already-
 * repositioned anchor tile.
 *
 * ## Sequencing within `dealOut`
 * Beat 1 and beat 2 are sequenced with a plain `setTimeout` inside this
 * hook, independent of (but budgeted to finish inside) the `dealOut` phase
 * duration IntroContext drives — see the DURATIONS comment there for how
 * that budget is derived from BEAT1_TOTAL_MS + ANCHOR_MOVE_MS.
 */
export function useDealOut(containerRef: RefObject<HTMLElement | null>) {
  const phase = useIntroPhase();
  const enteredRef = useRef(false);
  // The exact set of elements this run touched (anchor + visible others),
  // captured once in the `photo` phase. `dealOut` and the `done` cleanup
  // both act on this same snapshot rather than re-querying `[data-index]`
  // live, so a mid-intro pagination click (unlikely, but possible) can never
  // sweep newly-mounted tiles into the cleanup pass or leave stragglers
  // dangling.
  const dealtRef = useRef<HTMLElement[]>([]);
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const clearTimers = () => {
      timeoutsRef.current.forEach((id) => window.clearTimeout(id));
      timeoutsRef.current = [];
    };

    if (phase === "photo") {
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
      const scale = Math.min(
        1.9,
        Math.max(1.2, (Math.min(vw, vh) * 0.42) / Math.max(anchorRect.width, anchorRect.height))
      );

      dealt.forEach((el) => {
        el.style.willChange = "transform, opacity";
        el.style.transition = "none";
        el.style.transformOrigin = "50% 50%";

        if (el === anchor) {
          el.style.transform = `translate(${targetX - anchorCx}px, ${targetY - anchorCy}px) scale(${scale})`;
          el.style.opacity = "1";
          return;
        }

        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        el.style.transform = `translate(${targetX - cx}px, ${targetY - cy}px) scale(0.55)`;
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
      });

      return;
    }

    if (phase === "dealOut") {
      const dealt = dealtRef.current;
      const anchor = dealt.find((el) => el.dataset.index === "0") ?? null;
      const others = dealt.filter((el) => el !== anchor);

      // Beat 1: every OTHER visible tile settles into its grid slot,
      // staggered by index. The anchor is deliberately excluded from this —
      // it must keep reading as "held" centre-stage while this plays out.
      others.forEach((el) => {
        const index = Number(el.dataset.index ?? 0);
        const delay = Math.min(index * STAGGER_MS, MAX_STAGGER_MS);
        el.style.transition = `transform ${SETTLE_TRANSFORM_MS}ms ${EASE} ${delay}ms, opacity ${SETTLE_OPACITY_MS}ms ease-out ${delay}ms`;
      });
      // Force a style flush so the browser commits `transition` before we
      // change the target values below — otherwise it can coalesce both
      // into a single recalc and skip the animation entirely.
      void container.offsetHeight;

      const raf = requestAnimationFrame(() => {
        others.forEach((el) => {
          el.style.transform = "none";
          el.style.opacity = "1";
          el.style.pointerEvents = "";
        });
      });

      // Beat 2: ONLY once beat 1 has fully finished, the anchor makes its
      // own deliberate move from centre-stage into its grid slot — the
      // last thing to move in the whole intro.
      const anchorTimer = window.setTimeout(() => {
        if (!anchor) return;
        anchor.style.transition = `transform ${ANCHOR_MOVE_MS}ms ${EASE}`;
        void anchor.offsetHeight;
        requestAnimationFrame(() => {
          anchor.style.transform = "none";
        });
      }, BEAT1_TOTAL_MS);
      timeoutsRef.current.push(anchorTimer);

      return () => {
        cancelAnimationFrame(raf);
        clearTimers();
      };
    }

    if (phase === "done" && enteredRef.current) {
      enteredRef.current = false;
      clearTimers();
      const tiles =
        dealtRef.current.length > 0
          ? dealtRef.current
          : Array.from(container.querySelectorAll<HTMLElement>("[data-index]"));
      tiles.forEach((el) => {
        el.style.transition = "";
        el.style.transform = "";
        el.style.opacity = "";
        el.style.transformOrigin = "";
        el.style.pointerEvents = "";
        el.style.willChange = "";
      });
      dealtRef.current = [];
    }
  }, [phase, containerRef]);
}
