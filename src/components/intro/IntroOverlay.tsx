"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useReducedMotion } from "@/utils/useReducedMotion";
import { whenFontsReady } from "./fontsReady";
import { useIntroPhase } from "./IntroContext";
import {
  EASE,
  MONOGRAM_FADE_MS,
  MONOGRAM_HOLD_MS,
  NAV_FADE_MS,
  OVERLAY_DISSOLVE_MS,
  PLUS_FADE_MS,
  REMAINING_FADE_MS,
  REMAINING_START_MS,
  REMAINING_WINDOW_END_MS,
  SPREAD_MS,
  SPREAD_START_MS,
  TRAVEL_MS,
} from "./introTimings";
const NAV_LABELS = ["Overview", "Index", "About"];

// The wordmark, split into individually-animatable characters. `K` and the
// `B` of "Bekher" are the two that ever move — everything else only ever
// fades in place. Computed once at module scope (not per-render) so the
// index math below (and the per-character stagger, which is derived from
// this array's length) always matches the string beside it instead of
// silently drifting if one is ever edited without the other.
const WORDMARK = "Kristina Bekher";
const CHARS = [...WORDMARK];
const K_INDEX = 0;
// Derived from the space's position rather than a hardcoded "Bekher"
// substring search, so an edit to WORDMARK can never desync B_INDEX from
// where the second word actually starts. The guard below is what makes that
// safe rather than just quieter: `String.indexOf` returns -1 on no match,
// and WORD2_INDICES' `i > B_INDEX` filter would happily treat a stray -1 as
// "everything is word 2" — silent corruption, not a visible error — if
// WORDMARK were ever edited to drop the space entirely.
const SPACE_INDEX = WORDMARK.indexOf(" "); // 8 — the one glyph in neither word
if (SPACE_INDEX === -1) {
  throw new Error(
    `IntroOverlay: WORDMARK ("${WORDMARK}") must contain exactly one space separating the two words it morphs between.`
  );
}
const B_INDEX = SPACE_INDEX + 1; // 9 — first glyph of the second word ("Bekher")
// The two words' remaining glyphs (everything but their own leading K/B),
// each its own left-to-right reveal order — "ristina" and "ekher" type
// SIMULTANEOUSLY, not as one flat left-to-right sweep across the whole
// string. Precomputing both orders here, derived from K_INDEX/SPACE_INDEX/
// B_INDEX/CHARS.length rather than hardcoded glyph counts, means the timer
// effect and remainingStyle below never have to know how long either word
// is — and both stay correct if WORDMARK is ever edited.
const WORD1_INDICES = CHARS.map((_, i) => i).filter(
  (i) => i > K_INDEX && i < SPACE_INDEX
);
const WORD2_INDICES = CHARS.map((_, i) => i).filter((i) => i > B_INDEX);
const WORD1_ORDER = new Map<number, number>(
  WORD1_INDICES.map((charIndex, order) => [charIndex, order])
);
const WORD2_ORDER = new Map<number, number>(
  WORD2_INDICES.map((charIndex, order) => [charIndex, order])
);

// Gap between K/+/B in the monogram pose, expressed as a fraction of the
// wordmark's font-size rather than a fixed px value, so it scales with any
// future type-size change instead of silently drifting from the rest of the
// glyph metrics (which are all measured in real px off the live DOM below).
const MONOGRAM_GAP_EM = 0.18;

// Timeline, all relative to the `wordmark` phase's start. Every number below
// is imported from introTimings.ts, where WORDMARK_DURATION_MS is *derived*
// from the last beat here — so this choreography can never overrun the phase
// that exists to hold it open:
//   t=0     monogram pose (K, +, B) fades in at centre over MONOGRAM_FADE_MS.
//   t=1080  MONOGRAM_HOLD_MS elapses and `+` starts fading out over
//           PLUS_FADE_MS. On its OWN beat: the brief is "the plus
//           disappears, THEN K moves left", so the spread below does not
//           start alongside it the way it used to.
//   t=500   SPREAD_START_MS: K glides left and B glides right, from their
//           monogram positions to their natural in-word positions, over
//           SPREAD_MS on the slower EASE curve so the move reads as
//           deliberate. This lands SPREAD_OVERLAP_MS before the `+` has
//           fully gone, which is what keeps the two beats reading as one
//           gesture instead of a stall between them.
//   t=776   REMAINING_START_MS: "ristina" and "ekher" start typing in
//           PARALLEL, each left to right, both starting on this same beat —
//           not one flat left-to-right sweep across the whole string. Each
//           word's per-character stagger is solved independently from its
//           own glyph count (WORD1_INDICES.length / WORD2_INDICES.length,
//           NOT hardcoded), so a 7-glyph and a 5-glyph word both land their
//           LAST character's fade exactly on REMAINING_WINDOW_END_MS, and
//           this stays correct even if WORDMARK is ever edited. The space
//           between them has no ink and gets no beat at all — it's simply
//           always visible, present only to hold its glyph's advance width
//           for the layout measurement below. This leaves a short hold
//           before the phase advances to `nav`.
interface WordmarkMetrics {
  ready: boolean;
  /** translateX (px) that carries K from its natural position to its slot
   *  in the centred "K+B" monogram. */
  kX: number;
  /** Same, for the B of "Bekher". */
  bX: number;
  /** left offset (px), within the wordmark container, of the "+" glyph. */
  plusLeft: number;
}

const INITIAL_METRICS: WordmarkMetrics = { ready: false, kX: 0, bX: 0, plusLeft: 0 };

/**
 * Pure measurement pass over the live glyph elements: computes the monogram
 * pose's translateX offsets (kX/bX) and the "+"'s left offset. Module-scope
 * (not a closure inside either effect below) so the mount-time measurement
 * and the resize-time re-measurement call the exact same logic — two
 * independently maintained copies is exactly how they'd eventually drift
 * out of sync with each other.
 */
function measureWordmark(
  container: HTMLElement,
  kEl: HTMLElement,
  bEl: HTMLElement,
  plusEl: HTMLElement,
  markReady = true
): WordmarkMetrics {
  // The gap is a fraction of the CONTAINER's computed font-size, not a
  // hardcoded px value — see MONOGRAM_GAP_EM above.
  const fontSize = parseFloat(getComputedStyle(container).fontSize) || 16;
  const gap = fontSize * MONOGRAM_GAP_EM;

  const W = container.offsetWidth;
  const kLeft = kEl.offsetLeft;
  const kW = kEl.offsetWidth;
  const bLeft = bEl.offsetLeft;
  const bW = bEl.offsetWidth;
  const plusW = plusEl.offsetWidth;

  // The centred "K+B" group's total width, then where it starts so it's
  // centred within the wordmark's natural full width W.
  const monoW = kW + gap + plusW + gap + bW;
  const monoStart = (W - monoW) / 2;

  return {
    ready: true,
    kX: monoStart - kLeft,
    bX: monoStart + kW + gap + plusW + gap - bLeft,
    plusLeft: monoStart + kW + gap,
  };
}

/**
 * Steps 1-2 of the intro (spec §5.1): a fixed, opaque white sheet that shows
 * a K+B monogram morphing into the "Kristina Bekher" wordmark, then carries
 * it up into its real header position while a decorative navbar echo fades
 * in beneath it — before dissolving to reveal the real page underneath.
 *
 * ## The morph, mechanically
 * "Kristina Bekher" is rendered in full, up front, as one `<span>` per
 * character inside a relatively-positioned container — never swapped for a
 * separate "K+B" string. Every character stays in its natural (plain-text)
 * layout position for the component's entire life; nothing but `opacity`
 * and `transform` ever changes, which is what makes a smooth morph possible
 * instead of a cross-fade between two independently-laid-out strings:
 *  - K and the B of "Bekher" are translated (via `transform: translateX`,
 *    which doesn't affect layout/reflow) from their natural spot to a
 *    centred "K+B" pose, then eased back to `translateX(0)` — their natural
 *    spot — once the monogram beat ends. Because K's natural position is
 *    LEFT of centre and its monogram position is nearer centre, this reads
 *    as "K slides left" on the transition to the final wordmark, and B
 *    slides right — that's the intended read, not a bug.
 *  - Every other character sits at opacity 0 in its natural position from
 *    the start, and is simply faded to opacity 1, one at a time, once the
 *    monogram beat ends. It never moves.
 *  - The `+` is the only glyph NOT part of "Kristina Bekher" — it's an
 *    absolutely-positioned sibling inside the same container, positioned
 *    from the same measurement pass (see below), visible only during the
 *    monogram pose.
 * See the timeline constants above for exact beat timings.
 *
 * ## Measuring the monogram pose
 * The monogram's layout (how far K/B must travel, where `+` sits) depends
 * on real glyph widths, which aren't knowable from CSS alone — so a
 * `useLayoutEffect` measures the live DOM once on mount (and again on
 * resize) via `offsetLeft`/`offsetWidth`, computed BEFORE paint so there's
 * no flash of an un-measured layout. That measurement waits on
 * `whenFontsReady()` — glyph widths measured against the Arial fallback
 * would place the monogram at offsets the real face never wanted. Until it
 * lands the per-character wordmark renders `visibility: hidden` rather than
 * guessing, and a statically-centred "K+B" in the same pose stands in for it
 * — see the comment on that fallback in the render below.
 *
 * ## Why this can fake the header's exact position without measuring it
 * The real header (PageShell) is `flex flex-col items-center pt-24`, then
 * the logotype, then `mt-24` before the navbar — fixed, known pixel
 * offsets, not something that needs `getBoundingClientRect`. This overlay
 * reuses those exact same values, so the wordmark's *resting* position here
 * (no transform) is already pixel-identical to the real one. The only thing
 * that needs to animate is a translateY from that resting spot out to
 * viewport-centre, which a single `calc(50vh - 24px - ...)` handles: `50vh`
 * puts its top edge at viewport-middle, and `-50%` (a percentage of the
 * element's *own* box, per the CSS transform spec) pulls it up by half its
 * own height, landing it dead-centre regardless of viewport size. That
 * translateY now takes TRAVEL_MS, not an instant snap — see the
 * timeline constants above — and the nav echo is held back by a matching
 * transition-delay so it never appears to move alongside a still-travelling
 * wordmark.
 *
 * ## The entrance fade, and where it lives
 * The white sheet itself never fades IN — it's opaque from the first painted
 * frame (globals.css's `data-intro="play"` gate) and only ever fades OUT,
 * during the `photo` phase. The wordmark inside it does fade in, but that
 * fade is not driven from here: it belongs to the `intro-content` gate in
 * globals.css, which holds this overlay's contents at opacity 0 until Switzer
 * has actually loaded (see fontsReady.ts) and then fades them in over
 * MONOGRAM_FADE_MS — the monogram's own entrance beat, just triggered by the
 * font rather than by a timer. The alternative was painting the K+B in the
 * metric-adjusted Arial fallback and letting `font-display: swap` redraw it
 * mid-animation at a different size, which is the one glitch a preloader
 * built entirely out of one wordmark cannot afford. IntroProvider waits on
 * the same promise before leaving `idle`, so the fade and the first beat of
 * the choreography are the same moment.
 *
 * ## Reduced motion
 * Reduced-motion users never see this component at all — IntroContext jumps
 * straight from `idle` to `done` for them (see its doc comment). This file
 * still degrades gracefully if it were ever shown regardless (belt and
 * braces, and it keeps `idle`'s pre-hydration paint sane even for a
 * reduced-motion user whose preference hasn't been read yet): `useReducedMotion`
 * gates every inline transition to `"none"`, landing every character at its
 * final opacity/position with no animation. The hook resolves the preference
 * inside an effect and seeds `false` until then (see
 * `src/utils/useReducedMotion.ts`), never reading it during render, so server
 * and first-client-render markup stay identical — see IntroContext's
 * hydration-safety note for why that matters.
 *
 * ## a11y
 * Purely decorative — the real, interactive Logotype/NavBar are already
 * present underneath (PageShell always server-renders them). This sheet is
 * `aria-hidden` and non-interactive so it never becomes a duplicate landmark
 * or a duplicate "Kristina Bekher" link for assistive tech. The wordmark's
 * individual character `<span>`s live inside one wrapping container (rather
 * than being scattered directly into the DOM) so that if `aria-hidden` were
 * ever removed from an ancestor, a screen reader would still encounter one
 * text run, not fifteen single-character nodes.
 */
export default function IntroOverlay() {
  const phase = useIntroPhase();
  const reducedMotion = useReducedMotion();

  const containerRef = useRef<HTMLSpanElement>(null);
  const charRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const plusRef = useRef<HTMLSpanElement>(null);

  const [metrics, setMetrics] = useState<WordmarkMetrics>(INITIAL_METRICS);
  // Mirrors `metrics` for `remeasure`'s "did anything actually change?" test,
  // which must run outside a state updater — see there.
  const metricsRef = useRef<WordmarkMetrics>(INITIAL_METRICS);
  // True for the one commit that applies a resize-triggered re-measurement
  // (see the resize effect below) — folded into `noTransition` so that
  // commit renders with `transition: none` instead of genuinely animating
  // K/B sideways to the new monogram position. Cleared on the next frame,
  // once that snapped position has painted — see the effect that owns this
  // flag, further down, for why a single rAF is enough.
  const [suppressTransition, setSuppressTransition] = useState(false);
  // `monoIn`/`plusOut`/`spread`/`revealedWord1`/`revealedWord2` drive the
  // wordmark's own internal choreography — see the timeline constants above.
  // They're only ever written by the timer effect below, while `phase ===
  // "wordmark"`. `revealedWord1`/`revealedWord2` are how many of "ristina"'s
  // / "ekher"'s glyphs (in their own left-to-right order — see WORD1_ORDER/
  // WORD2_ORDER) have started fading in; the two counters advance on
  // independent timers so both words type in parallel rather than one flat
  // sequence.
  //
  // `plusOut` is deliberately separate from `spread` rather than derived from
  // it. They used to be the same flag, which forced the `+` to fade at the
  // exact instant K/B started travelling; splitting them is what lets the
  // plus leave first and the letters follow.
  const [monoIn, setMonoIn] = useState(false);
  const [plusOut, setPlusOut] = useState(false);
  const [spread, setSpread] = useState(false);
  const [revealedWord1, setRevealedWord1] = useState(0);
  const [revealedWord2, setRevealedWord2] = useState(0);
  // True once the centred monogram has been painted (idle hold or a prior
  // fade-in). Used to skip a second opacity pop when `idle` hands off to
  // `wordmark` — re-fading would flash the letters invisible for a frame.
  const monogramVisibleRef = useRef(false);

  // `idle` is included (not just wordmark/nav/photo) so this renders on the
  // very first client render too — `phase` starts as `"idle"` identically on
  // server and client (see IntroContext's hydration-safety note), so this
  // stays byte-identical across the hydration boundary. That's what lets the
  // overlay's markup exist in the prerendered HTML at all: the CSS gate in
  // globals.css (`[data-intro="play"] .intro-overlay`) is what actually
  // decides whether it's visible before hydration ever runs, not this flag.
  // `dealOut`/`done` are excluded same as before — once the anchor tile has
  // taken over (see useDealOut.ts), this sheet must be gone for good.
  const mounted =
    phase === "idle" || phase === "wordmark" || phase === "nav" || phase === "photo";

  // Whether a glyph re-measurement can still matter. Once `nav`/`photo` pin
  // `effectiveSpread`/translateX(0) regardless of `metrics` (see below), and
  // once `dealOut`/`done` stop this component rendering at all (`mounted`
  // above), per-glyph offsets are moot — see the resize effect below, which
  // is what this actually gates.
  const canResize = phase === "idle" || phase === "wordmark";

  // The one place a re-measurement is ever triggered from. `snap` forces the
  // resulting commit to render with `transition: none`, for every caller
  // except the very first (mount) measurement — see `suppressTransition`.
  const remeasure = useCallback((snap: boolean, markReady = true) => {
    const container = containerRef.current;
    const kEl = charRefs.current[K_INDEX];
    const bEl = charRefs.current[B_INDEX];
    const plusEl = plusRef.current;
    if (!container || !kEl || !bEl || !plusEl) return;

    const next = measureWordmark(container, kEl, bEl, plusEl, markReady);

    // Bail out when nothing actually moved. `measureWordmark` returns a fresh
    // object every call, so without this every re-measure forces a commit —
    // and a re-measure commit sets `transition: none` on EVERY animated
    // property in this component, which jumps whatever beat is mid-flight
    // straight to its end value. A resize that changed no glyph metric (the
    // common case: this container is `inline-block`, so its width comes from
    // the text, not the viewport) would otherwise make the spread or a glyph
    // fade visibly pop for no reason at all.
    //
    // Compared against a ref rather than inside a `setMetrics` updater
    // because the comparison has to decide whether to ALSO arm
    // `suppressTransition`, and a state updater must stay pure — StrictMode
    // double-invokes them.
    const prev = metricsRef.current;
    if (
      prev.ready &&
      prev.kX === next.kX &&
      prev.bX === next.bX &&
      prev.plusLeft === next.plusLeft
    ) {
      return;
    }

    metricsRef.current = next;
    // Both state updates are queued from the same synchronous scope, so React
    // batches them into one commit — which is what makes the new position
    // paint without a transition rather than animate to it.
    if (snap) setSuppressTransition(true);
    setMetrics(next);
  }, []);

  // Measure once Switzer has loaded so kX/bX are computed from real glyph
  // widths, not the Arial fallback. Until then the statically-centred "K+B"
  // stand-in (see render below) stays up — a fade-in at the wrong offsets
  // reads as "K slides in from the left".
  //
  // Shares `whenFontsReady()` with IntroProvider (which holds the phase
  // machine in `idle` on the same promise) rather than touching
  // `document.fonts` directly, so the measurement and the choreography can
  // never disagree about when the type is ready — and so a stalled font
  // request hits the same cap here instead of leaving the wordmark
  // permanently `visibility: hidden` behind a started intro.
  useLayoutEffect(() => {
    let cancelled = false;
    whenFontsReady().then(() => {
      if (!cancelled) remeasure(false, true);
    });
    return () => {
      cancelled = true;
    };
  }, [remeasure]);

  // Re-measure on resize (font metrics don't change, but the container's
  // available width can) — but ONLY while `canResize`, i.e. while the
  // monogram/wordmark pose can still be shown. Without this guard the
  // listener would live for the rest of the page's session: `mounted` above
  // only short-circuits this component's OWN render, not its effects, and
  // IntroOverlay never unmounts — so every resize for the rest of the visit
  // would otherwise force a getComputedStyle + offsetWidth/offsetLeft read
  // and a `setMetrics` re-render for a component that will never render the
  // wordmark again.
  //
  // ## Why a resize here must never animate
  // This can fire well after `metrics.ready` is already true — e.g. mid-hold
  // during `wordmark`, before `spread` flips (Safari's address-bar collapse
  // fires `resize` on load settle; so does a live desktop resize or a
  // dev-tools toggle). `noTransition` only guards the FIRST, un-measured
  // commit (`!metrics.ready`); by the time a resize can fire, that guard is
  // already off, and `setMetrics` alone would let the browser genuinely
  // animate K/B to the new position over their live transition.
  // `setSuppressTransition(true)` in the SAME handler forces `noTransition`
  // back on for exactly this one commit (React 18 batches both state
  // updates together), so the new position snaps in instead — then the
  // effect below releases it next frame.
  useLayoutEffect(() => {
    if (!canResize) return;
    const handleResize = () => remeasure(true);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [canResize, remeasure]);

  // Releases `suppressTransition` one frame after a resize-triggered
  // re-measure has committed and painted — i.e. after the snap (not a
  // transition) has actually landed on screen — so a LATER, genuinely
  // animated update (e.g. the monogram-hold -> spread beat) isn't
  // accidentally born with transitions still forced off.
  useEffect(() => {
    if (!suppressTransition) return;
    const raf = requestAnimationFrame(() => setSuppressTransition(false));
    return () => cancelAnimationFrame(raf);
  }, [suppressTransition]);

  // Drive the wordmark's internal timeline. Only runs for `wordmark` itself
  // — once the phase has moved on, `settled` (below, in render) takes over
  // showing the finished pose regardless of these flags' last values, so
  // resetting them here on the way out is just hygiene, not load-bearing.
  //
  // ## Why this waits on `metrics.ready`
  // Not an optimisation — it's what stops K from visibly sliding on first
  // appearance. Before measurement, `metrics.kX` is 0, so the K/B spans
  // render at `translateX(0px)`: their NATURAL position, not their monogram
  // one. `measure()` above then reads `getComputedStyle(...).fontSize` and
  // `offsetWidth`, which forces a style/layout recalc — and that recalc
  // COMMITS `translateX(0px)` as the spans' computed value. The `setMetrics`
  // re-render immediately after changes it to `translateX(kX)`, and since a
  // recalc already committed the old value, the browser starts a genuine CSS
  // transition: K travels from its natural spot into the monogram, in full
  // view, before the animation has even begun. Being inside `useLayoutEffect`
  // does NOT prevent this — transitions key off style recalcs, not paints.
  // Two things together close the hole: `noTransition` below forces
  // `transition: none` while `!metrics.ready` (so that first jump can never
  // animate), and this effect doesn't arm the fade-in until the measured
  // pose has been committed as the resting state.
  useEffect(() => {
    if (phase !== "wordmark" || !metrics.ready) {
      setMonoIn(false);
      setPlusOut(false);
      setSpread(false);
      setRevealedWord1(0);
      setRevealedWord2(0);
      return;
    }

    const timers: number[] = [];

    // Flip on the next frame (not this one) so opacity actually has a
    // "before" value to transition from — unless the monogram was already
    // visible during `idle`, in which case re-fading reads as a blink.
    let raf = 0;
    if (monogramVisibleRef.current) {
      setMonoIn(true);
    } else {
      raf = requestAnimationFrame(() => setMonoIn(true));
    }

    // The `+` leaves first, then K/B travel — two beats, two timers.
    timers.push(window.setTimeout(() => setPlusOut(true), MONOGRAM_HOLD_MS));
    timers.push(window.setTimeout(() => setSpread(true), SPREAD_START_MS));

    // "ristina" and "ekher" type in PARALLEL: both start on the same beat
    // (REMAINING_START_MS) and both land their last glyph's fade exactly on
    // REMAINING_WINDOW_END_MS. That means each word needs its OWN stagger,
    // solved from its own glyph count — a shared stagger would make the
    // 7-glyph word finish long after the 5-glyph one. Deriving both from
    // `.length` rather than hardcoding keeps this correct if WORDMARK is
    // ever edited.
    const span = REMAINING_WINDOW_END_MS - REMAINING_START_MS - REMAINING_FADE_MS;
    const schedule = (
      indices: number[],
      setCount: (updater: (c: number) => number) => void
    ) => {
      const stagger = span / Math.max(indices.length - 1, 1);
      indices.forEach((_, order) => {
        const delay = REMAINING_START_MS + order * stagger;
        timers.push(
          window.setTimeout(() => setCount((c) => Math.max(c, order + 1)), delay)
        );
      });
    };
    schedule(WORD1_INDICES, setRevealedWord1);
    schedule(WORD2_INDICES, setRevealedWord2);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [phase, metrics.ready]);

  // Track whether the centred monogram has already been painted so the
  // `idle` -> `wordmark` handoff doesn't re-trigger a fade from invisible.
  useEffect(() => {
    if (phase !== "idle" && phase !== "wordmark") return;
    if (!metrics.ready) {
      // The statically-centred fallback is on screen.
      monogramVisibleRef.current = true;
      return;
    }
    if (phase === "idle" || monoIn) {
      monogramVisibleRef.current = true;
    }
  }, [phase, metrics.ready, monoIn]);

  if (!mounted) return null;

  // Idle rests in the SAME centred pose as `wordmark` (not the header
  // position `nav`/`photo` use) so there's no visible jump/slide the
  // instant hydration flips the phase from `idle` straight to `wordmark` —
  // it's already sitting where the Figma `First_screen` preloader frame
  // wants it, opaque and centred, before any JS has run at all.
  const isIdle = phase === "idle";
  const centered = phase === "wordmark" || isIdle;
  const fadingOut = phase === "photo";
  const showNav = phase === "nav" || phase === "photo";

  // Once `wordmark` has handed off to `nav`/`photo`, the morph is over —
  // render its finished state outright rather than trusting monoIn/spread/
  // the two reveal counters' last values, so a remount or a missed timer can
  // never leave the wordmark stuck mid-morph on every later phase.
  const settled = phase === "nav" || phase === "photo";
  // `monogramVisibleRef` is a one-way latch: once the monogram has been
  // painted visible it must never render at opacity 0 again. Without it in
  // this expression there is one commit — the `idle` -> `wordmark` handoff —
  // where `isIdle` has already gone false but the timer effect hasn't yet run
  // to set `monoIn`, so the glyphs render transparent for however long React
  // takes to flush passive effects. That used to be invisible (the monogram
  // faded in from 0 anyway); now that the entrance fade belongs to the
  // content gate in globals.css it would be a blink in the middle of it, and
  // the glyph-level fade would multiply with the gate's instead of the
  // monogram simply arriving once, on one curve.
  const effectiveMonoIn = isIdle || settled || monoIn || monogramVisibleRef.current;
  const effectivePlusOut = settled || plusOut;
  const effectiveSpread = settled || spread;
  const effectiveWord1 = settled ? WORD1_INDICES.length : revealedWord1;
  const effectiveWord2 = settled ? WORD2_INDICES.length : revealedWord2;
  // `idle` must render with NO transitions at all (it's what the pre-
  // hydration CSS gate paints, straight to rest). `!metrics.ready` must too,
  // and for a subtler reason — see the timer effect's "Why this waits on
  // metrics.ready" note: without it, the un-measured `translateX(0px)` the
  // spans first render at becomes a transition start point, and K visibly
  // slides into the monogram before the animation begins. `suppressTransition`
  // covers the same hazard for a LATER re-measurement — a window resize
  // during the monogram hold — see the resize effect above for why that
  // needs its own guard rather than reusing `!metrics.ready` (which is
  // already `true` by the time a resize can fire).
  const noTransition =
    isIdle || Boolean(reducedMotion) || !metrics.ready || suppressTransition;

  function kbStyle(targetX: number): CSSProperties {
    return {
      opacity: effectiveMonoIn ? 1 : 0,
      transform: `translateX(${effectiveSpread ? 0 : targetX}px)`,
      transition: noTransition
        ? "none"
        : effectiveSpread
          ? `transform ${SPREAD_MS}ms ${EASE}`
          : `opacity ${MONOGRAM_FADE_MS}ms ${EASE}`,
    };
  }

  function remainingStyle(index: number): CSSProperties {
    // The space is the one glyph in neither word. It has no ink, so giving it
    // a reveal beat would just burn a gap in the middle of the typing for
    // nothing — it's simply always "revealed". Its span still has to exist
    // (and stay a U+00A0) to hold the word gap's advance width, which every
    // `offsetLeft` measurement above depends on.
    const isWord1 = WORD1_ORDER.has(index);
    const revealed =
      index === SPACE_INDEX
        ? true
        : isWord1
          ? (WORD1_ORDER.get(index) ?? 0) < effectiveWord1
          : (WORD2_ORDER.get(index) ?? 0) < effectiveWord2;
    return {
      opacity: revealed ? 1 : 0,
      transform: revealed ? "translateY(0)" : "translateY(2px)",
      transition: noTransition
        ? "none"
        : `opacity ${REMAINING_FADE_MS}ms ${EASE}, transform ${REMAINING_FADE_MS}ms ${EASE}`,
    };
  }

  // Keyed off `effectivePlusOut`, not `effectiveSpread` — the whole point of
  // the split is that the `+` is already on its way out by the time K and B
  // start moving.
  const plusOpacity = effectivePlusOut ? 0 : effectiveMonoIn ? 1 : 0;
  const plusTransition = noTransition
    ? "none"
    : `opacity ${effectivePlusOut ? PLUS_FADE_MS : MONOGRAM_FADE_MS}ms ${EASE}`;

  return (
    <div
      aria-hidden="true"
      // NOT `pointer-events-none`. This sheet is opaque and covers the whole
      // viewport, so anything reachable through it is reachable blind: a click
      // over a photo would open the lightbox underneath the preloader, and a
      // scroll would drag the already-gathered deck off the viewport centre
      // that `useDealOut` posed it against. It swallows input for the ~3.7s it
      // is up, then unmounts at `dealOut`.
      className="intro-overlay fixed inset-0 z-[100] bg-white"
      style={{
        opacity: fadingOut ? 0 : 1,
        // The `photo` phase's first OVERLAY_DISSOLVE_MS (see IntroContext's
        // comment) IS this dissolve — the duration below must stay in sync
        // with that budget or the "overlay dissolve, then hold on the
        // centred photo" beat drifts out of alignment with OverviewFeed.
        transition: noTransition ? "none" : `opacity ${OVERLAY_DISSOLVE_MS}ms ${EASE}`,
      }}
    >
      {/*
        `intro-content` is the font gate's target — globals.css holds this
        wrapper at opacity 0 while the intro is playing and fades it in over
        MONOGRAM_FADE_MS once `data-fonts="ready"` lands on <html> (see
        IntroProvider / fontsReady.ts). It is a static class in the
        server-rendered HTML, not an inline style or React state, for the same
        reason `.reveal` is: it has to hold from the very first painted frame,
        long before any JS has run, and it has to stay overridable — the head
        script's dead-man's switch releases it by dropping `data-intro`, and
        the keyframe backstop in globals.css opens it even if React never
        runs at all.

        This is the monogram's entrance: the sheet paints white immediately,
        and the K+B arrives — once, already in Switzer — rather than being
        painted in the Arial fallback and re-drawn a moment later at a
        different size when `font-display: swap` swaps the real face in.
      */}
      <div className="intro-content mx-auto flex w-full max-w-[1280px] flex-col items-center px-[40px]">
        <div className="flex w-full flex-col items-center pt-24">
          <div
            className="relative"
            style={{
              transform: centered
                ? "translateY(calc(50vh - 24px - env(safe-area-inset-top, 0px) - 50%))"
                : "translateY(0)",
              transition: noTransition ? "none" : `transform ${TRAVEL_MS}ms ${EASE}`,
            }}
          >
            {/*
              Pre-measurement stand-in. `metrics.ready` is false in the
              server-rendered HTML and on the client's first render, and the
              per-character wordmark is `visibility: hidden` until the layout
              effect above has run — so without this there would be nothing to
              paint at all until measurement lands. It is rendered identically
              on both sides of the hydration boundary (`metrics.ready` is a
              literal `false` seed, never computed from the DOM).

              It is no longer racing hydration the way it used to: the content
              gate (see `intro-content` above) keeps this whole block
              invisible until fonts are ready AND React has flipped the
              attribute, by which point the measurement has almost always
              already landed. What it still genuinely covers is the CSS
              keyframe backstop — the JS-never-ran path, where this stand-in
              is the only wordmark that will ever be shown.

              The `+`'s margins are the same MONOGRAM_GAP_EM the measured pose
              spaces its glyphs by, and both poses are centred on the same
              point, so the handoff from this to the measured version is a
              sub-pixel settle rather than the visible re-spacing a plain
              "K+B" text node produced.
            */}
            {!metrics.ready ? (
              <span className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap">
                K
                <span
                  className="inline-block"
                  style={{ marginInline: `${MONOGRAM_GAP_EM}em` }}
                >
                  +
                </span>
                B
              </span>
            ) : null}
            <span
              ref={containerRef}
              className="relative inline-block whitespace-nowrap"
              style={{ visibility: metrics.ready ? "visible" : "hidden" }}
            >
              {CHARS.map((ch, i) => {
                const isMono = i === K_INDEX || i === B_INDEX;
                const style = isMono
                  ? kbStyle(i === K_INDEX ? metrics.kX : metrics.bX)
                  : remainingStyle(i);
                return (
                  <span
                    key={i}
                    ref={(el) => {
                      charRefs.current[i] = el;
                    }}
                    className="inline-block"
                    style={style}
                  >
                    {ch === " " ? " " : ch}
                  </span>
                );
              })}
              <span
                ref={plusRef}
                className="absolute top-1/2"
                style={{
                  left: metrics.plusLeft,
                  transform: "translateY(-50%)",
                  opacity: plusOpacity,
                  transition: plusTransition,
                }}
              >
                +
              </span>
            </span>
          </div>

          <div
            className="mt-24 flex items-center justify-center gap-8"
            style={{
              opacity: showNav ? 1 : 0,
              // Held back by TRAVEL_MS so the nav never appears to move
              // alongside (or ahead of) a wordmark still travelling up into
              // its header position — it only starts once that's settled.
              transition: noTransition
                ? "none"
                : `opacity ${NAV_FADE_MS}ms ${EASE} ${showNav ? `${TRAVEL_MS}ms` : "0ms"}`,
            }}
          >
            {NAV_LABELS.map((label) => (
              <span
                key={label}
                className="inline-flex h-[31px] items-center justify-center rounded-pill px-8 py-[6px] text-center"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
