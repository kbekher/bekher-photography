/**
 * Every timing constant the intro, the deal-out and the collection-page
 * reveal share, in ms. One file, because these numbers are not independent:
 * IntroContext's phase durations are *derived* from the beats IntroOverlay
 * and useDealOut actually animate, so a beat retuned in isolation would
 * silently desync the phase machine from the animation it exists to hold
 * open. Derive, don't duplicate.
 *
 * ## The whole first-load intro, end to end (~4.4s)
 *   0      wordmark  K+B fades in, holds, `+` fades out, K/B spread apart,
 *                    "ristina" + "ekher" type in parallel        (2176ms)
 *   2176   nav       the wordmark travels up into its real header slot; the
 *                    nav echo fades in behind it                  (580ms)
 *   2756   photo     the white sheet dissolves, revealing the feed's first
 *                    photo alone, centred; then a hold on it      (790ms)
 *   3546   dealOut   the deck peels off card by card into the grid (900ms)
 *   4431   done
 *
 * Those offsets are the only hand-maintained numbers in this file and exist
 * purely to make the shape readable at a glance — every constant below is
 * either a primitive or derived from one, so the code cannot drift even if
 * this comment does.
 */

/** Shared soft ease-out (design spec §5), in both syntaxes. */
export const EASE = "cubic-bezier(0.25, 0.1, 0.25, 1)";
export const GSAP_EASE = "power2.out";

// --- Wordmark morph (IntroOverlay) -----------------------------------------
// The beats run in strict sequence and each one's start is derived from the
// previous one's end, so retiming any single beat shifts everything after it
// instead of overlapping it. The one intentional exception is
// SPREAD_OVERLAP_MS below.

/** K+B fades in at the centred monogram pose. */
export const MONOGRAM_FADE_MS = 200;
/** How long the finished K+B monogram simply sits there. */
export const MONOGRAM_HOLD_MS = 1080;
/** `+` fades out — on its own beat, BEFORE K/B start moving. */
export const PLUS_FADE_MS = 180;
/**
 * How much of the `+`'s fade the K/B spread is allowed to overlap. The brief
 * is "the plus disappears, THEN K moves left", so this is deliberately small
 * — just enough that the two beats read as one continuous gesture rather
 * than a stall between them. Set it to 0 for a hard sequential read.
 */
export const SPREAD_OVERLAP_MS = 60;
/** K slides left / B slides right, from the monogram pose to their natural
 *  in-word positions. */
export const SPREAD_START_MS = MONOGRAM_HOLD_MS + PLUS_FADE_MS - SPREAD_OVERLAP_MS; // 1200
export const SPREAD_MS = 460;

/**
 * How much of the spread has to be done before the typing joins in. Not a
 * stylistic choice — it is what stops the wordmark reading as "shifts left,
 * then re-centres".
 *
 * The glyph box is the FULL width of "Kristina Bekher" and it is centred, so
 * while only K and B are inked the visible ink is not: K has travelled to the
 * far left edge of that box and B sits just left of the middle, putting the
 * centre of mass well left of centre. Park there for a beat and the eye reads
 * a lurch, then a correction, as the other glyphs fill the space back in.
 * Starting the typing before K has finished arriving means the box fills in
 * as it empties out, and the optical centre never visibly leaves the middle.
 */
export const SPREAD_TYPE_OVERLAP = 0.4;
/** "ristina" and "ekher" start typing — in parallel, each left to right — as
 *  K and B are still settling. */
export const REMAINING_START_MS = Math.round(
  SPREAD_START_MS + SPREAD_MS * (1 - SPREAD_TYPE_OVERLAP)
); // 1476
/** Per-glyph fade. */
export const REMAINING_FADE_MS = 120;
/** The typing window: every glyph of BOTH words lands inside it. */
export const REMAINING_TYPE_MS = 500;
export const REMAINING_WINDOW_END_MS = REMAINING_START_MS + REMAINING_TYPE_MS; // 1976

/** Beat of stillness on the finished wordmark before it travels up. */
export const WORDMARK_HOLD_MS = 200;
export const WORDMARK_DURATION_MS = REMAINING_WINDOW_END_MS + WORDMARK_HOLD_MS; // 2176

/**
 * Hard ceiling on the first-row asset preload.
 *
 * Must be LONGER than WORDMARK_DURATION_MS, or the preloader cannot preload.
 * IntroContext arms both clocks in the same commit and requires both before
 * leaving `wordmark`, so a ceiling equal to the animation's own length means
 * the asset gate always settles first and contributes exactly nothing — the
 * deck would deal out onto shimmer placeholders on a slow connection, which
 * is the single failure this machinery exists to prevent.
 *
 * The extra budget is the most a slow connection can hold the wordmark open
 * past its animation; the gate still runs CONCURRENTLY with that animation,
 * so this is only ever an extension, never a wait stacked in front.
 */
export const MAX_PRELOAD_WAIT = WORDMARK_DURATION_MS + 2500;

// --- Wordmark travel + nav echo (IntroOverlay) -----------------------------

/** The wordmark rises from viewport-centre to its real header position. */
export const TRAVEL_MS = 500;
/** The nav echo fades in only once that travel has settled (IntroOverlay
 *  gives it a matching transition-delay of TRAVEL_MS). */
export const NAV_FADE_MS = 300;
/**
 * The `nav` phase ends shortly after the TRAVEL is done rather than waiting
 * out the echo's full fade. The echo finishing during the overlay's dissolve
 * is harmless — the real NavBar is already sitting underneath at full
 * opacity, pixel-aligned with the echo, so the two are indistinguishable as
 * the sheet comes down.
 */
export const NAV_DURATION_MS = TRAVEL_MS + 80; // 580

// --- Photo reveal ----------------------------------------------------------

export const OVERLAY_DISSOLVE_MS = 350;
/**
 * Hold on the lone centred photo before the deck deals out. Taken from the
 * reference GIF, which pauses ~440ms on that single card — long enough to
 * read as a deliberate beat, short enough not to feel like a stall.
 */
export const PHOTO_HOLD_MS = 440;
export const PHOTO_DURATION_MS = OVERLAY_DISSOLVE_MS + PHOTO_HOLD_MS; // 790

// --- Deal out (shared by home + collection) --------------------------------
// Matched to the reference GIF: its first card leaves the deck at ~720ms and
// its last one lands at ~1600ms, i.e. an ~880ms window for ~24 cards. That
// works out to a ~25ms stagger over a ~320ms per-tile flight, which is what
// gives it the rapid "dealing cards" read rather than a slow drift.

/** Stagger between consecutive dealt tiles. */
export const STAGGER_PER_INDEX_MS = 25;
/** Cap, so a tall first viewport can't stretch the cascade past its budget. */
export const MAX_STAGGER_MS = 480;
/** One non-anchor tile's flight from the deck to its slot. */
export const SETTLE_TRANSFORM_MS = 300;
/** Last non-anchor tile lands here. */
const LAST_TILE_LANDING_MS = MAX_STAGGER_MS + SETTLE_TRANSFORM_MS; // 780

/**
 * The anchor's start delay. KEEP THIS AT 0.
 *
 * The anchor leaves at the exact same instant as everything else and is last
 * to ARRIVE purely because ANCHOR_MOVE_MS below is longer than any other
 * card's total — never because it is held back. Any non-zero value here, even
 * one derived from the stagger ramp so that it is "continuous", reads as the
 * front card being stuck: the deck empties out around a card that just sits
 * there, and then it moves. Landing last is the emphasis; waiting is a stall.
 */
export const ANCHOR_START_MS = 0;
/**
 * The anchor's flight. Longer than LAST_TILE_LANDING_MS by a clear margin, so
 * it is unambiguously the last to settle while still having been in motion
 * the whole time. This is also what makes it read as the deliberate one: it
 * has the furthest to travel (viewport centre to the grid's first slot) and
 * it covers that distance slowly while the rest snap past it.
 */
export const ANCHOR_MOVE_MS = 880;

/** When the last card finishes moving. Derived from both tracks so it can
 *  never drift from them. */
export const DEAL_LANDING_MS = Math.max(
  LAST_TILE_LANDING_MS,
  ANCHOR_START_MS + ANCHOR_MOVE_MS
); // 880
/**
 * The phase budget the deal must fit inside. Must be >= DEAL_LANDING_MS: if
 * it were shorter, IntroContext would advance to `done` mid-flight and
 * useDealOut's cleanup would snap every tile to its resting transform — a
 * visible cut.
 */
export const DEAL_BUDGET_MS = DEAL_LANDING_MS + 20; // 885

/** Group fade of the grid wrapper once `gather` has posed the deck. */
export const CONTAINER_FADE_MS = 260;

// --- Collection page ------------------------------------------------------
// The collection page runs the exact same gather -> hold -> deal sequence,
// just triggered by its own mount instead of by the intro phase machine
// (there is no white sheet to hide the gather behind, hence the CSS gate in
// GridReveal.module.css). The hold below is the same PHOTO_HOLD_MS beat the
// home page gets, so both pages read identically.

/** Wrapper fade-in, once `gather` has already posed the deck behind it. */
export const COLLECTION_GATE_DELAY_MS = 200;
/** Deal start — gate fade, then the same hold on the lone centred card. */
export const COLLECTION_DEAL_START_MS = COLLECTION_GATE_DELAY_MS + PHOTO_HOLD_MS; // 640
