/**
 * Every timing constant the intro, the deal-out and the collection-page
 * reveal share, in ms. One file, because these numbers are not independent:
 * IntroContext's phase durations are *derived* from the beats IntroOverlay
 * and useDealOut actually animate, so a beat retuned in isolation would
 * silently desync the phase machine from the animation it exists to hold
 * open. Derive, don't duplicate.
 *
 * ## The whole first-load intro, end to end (~4.6s)
 *   0      wordmark  K+B fades in, holds, `+` fades out, K/B spread apart,
 *                    "ristina" + "ekher" type in parallel        (2176ms)
 *   2176   nav       the wordmark travels up into its real header slot; the
 *                    nav echo fades in behind it                  (580ms)
 *   2756   photo     the white sheet dissolves, revealing the feed's first
 *                    photo alone, centred; then a hold on it      (790ms)
 *   3546   dealOut   the deck peels off card by card into the grid (1020ms)
 *   4566   done
 *
 * Those offsets are the only hand-maintained numbers in this file and exist
 * purely to make the shape readable at a glance — every constant below is
 * either a primitive or derived from one, so the code cannot drift even if
 * this comment does.
 */

/** Shared soft ease-out (design spec §5), in both syntaxes. */
export const EASE = "cubic-bezier(0.25, 0.1, 0.25, 1)";
export const GSAP_EASE = "power2.out";
/**
 * A stacked card's flight. Hard deceleration, because that is what the
 * reference does: tracking one card across the GIF's frames, it covers ~75%
 * of its travel in the first ~35ms of a ~200ms flight and spends the rest
 * easing into the slot. Anything softer reads as sliding, not dealing — this
 * curve is what keeps the deal snappy even though SETTLE_TRANSFORM_MS runs
 * longer than the reference's own flight.
 */
export const DEAL_EASE = "power4.out";
/**
 * The cover card's flight. Softer than DEAL_EASE but still an ease-OUT, and
 * that distinction is the whole point.
 *
 * This was `power2.inOut` for a while, taken from the reference's symmetric
 * cover curve. It does not survive the retime. The reference's cover flew
 * ~200ms, where an ease-in is a couple of slow frames nobody registers; ours
 * flies ANCHOR_MOVE_MS, and at that length the same curve leaves the cover
 * covering ~12% of its distance in its first half while DEAL_EASE has already
 * thrown every other card ~75% of the way in its first ~15%. Same start beat,
 * opposite acceleration — so the cover reads as hesitating, not gliding.
 *
 * `power3.out` leaves the deck on the same snap as the rest and spends the
 * difference decelerating instead. What makes the last card read as
 * deliberate is its LONGER flight (ANCHOR_MOVE_MS) and gentler tail, never a
 * later or slower departure.
 */
export const ANCHOR_EASE = "power3.out";

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
 * Hard ceiling on the wait for Switzer to load before the intro starts.
 *
 * The wordmark IS the intro — showing it in the metric-adjusted Arial
 * fallback and letting `font-display: swap` re-render it a moment later is a
 * visible glyph-shape-and-width jump on the one element the whole sequence is
 * built around. So the overlay's content is held invisible (globals.css keys
 * it off `data-fonts="ready"`) and the phase machine is held in `idle` until
 * the real face is available — see IntroContext's decide-once effect and
 * `fontsReady.ts`. The white sheet is already up the entire time; only the
 * K+B inside it waits.
 *
 * The cap is what stops a dead font request trapping anyone on that blank
 * sheet: past it we simply start, fallback face and all. A brief swap is a
 * far better failure than no intro at all.
 */
export const FONT_WAIT_CAP_MS = 1500;
/**
 * CSS-only backstop for the same reveal. Everything that clears
 * `data-fonts` is JS, and JS is not guaranteed to run (a chunk 404, a throw
 * in any module evaluated before IntroProvider) — same hazard, and the same
 * rule, as `.reveal` and GridReveal's gate: `opacity: 0` must never be a
 * TERMINAL state. globals.css runs the identical fade off a delayed
 * `animation` so the wordmark appears even if React never hydrates.
 *
 * Derived from — and deliberately later than — the JS cap above, so on every
 * load where React *is* alive this never gets the chance to fire.
 */
export const INTRO_CONTENT_FAILSAFE_MS = FONT_WAIT_CAP_MS + 500; // 2000

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
// Every number below is read off the reference GIF frame by frame (30 frames
// at 20-30ms, 24 tiles), so the shape it encodes is not a taste call:
//
//   t+0     the deck sits at viewport centre as ONE card — the tiles behind
//           the cover are stacked flush, not fanned and not shrunk, which is
//           why the pile measures exactly one card wide until it starts to
//           empty.
//   t+0     cards leave in REVERSE index order, ~18ms apart: last tile of the
//           feed first, cover card (index 0) last. On a row-major grid that
//           reads as bottom row first, right to left within each row, working
//           up to the top-left slot — the same order a dealer's thumb takes
//           off the top of a deck.
//   ~t+590  the cover lands. Because the stagger is a fraction of one flight,
//           ~10 cards are in the air at once — that overlap IS the effect.
//           Widen the stagger past the flight and it becomes a queue of
//           single cards instead.
//
// The one deliberate departure: the whole deal runs 300ms LONGER than the
// reference's ~590ms, because at the reference's tempo it reads as a flinch
// on a real screen. Every duration below is scaled to spend that 300ms in
// proportion — stagger, flight and cover move together — so the overlap
// ratio that produces the fan is preserved and only the tempo eases off.
// Scale them as a set, never one at a time.

/** Stagger between consecutive cards leaving the deck, in deal order. */
export const DEAL_STAGGER_MS = 24;
/** @deprecated Use DEAL_STAGGER_MS — kept for any external imports. */
export const STAGGER_PER_INDEX_MS = DEAL_STAGGER_MS;
/**
 * Cap on the longest start delay. Only bites if the dealt-tile count ever
 * rises past useDealOut's MAX_DEAL_TILES (24 tiles = a 552ms ramp); it exists
 * so a taller viewport compresses the tempo rather than stretching the deal
 * past its budget. Order is preserved either way.
 */
export const MAX_STAGGER_MS = 600;
/** One stacked tile's flight from the deck to its slot (includes scale-up). */
export const SETTLE_TRANSFORM_MS = 300;
/** Last stacked tile finishes its flight here. */
export const LAST_NON_ANCHOR_LANDING_MS = MAX_STAGGER_MS + SETTLE_TRANSFORM_MS; // 900

/**
 * Budget figure for the cover card's start — matches the last stacked tile's
 * stagger cap. useDealOut reads the live max delay at runtime so a scaled
 * ramp still starts the cover on the same beat as the last peel.
 */
export const ANCHOR_START_MS = MAX_STAGGER_MS;
/**
 * Longer than SETTLE_TRANSFORM_MS so the cover lands after the last stacked
 * tile even though both start on the same beat — and slower-eased (see
 * ANCHOR_EASE), which is what makes the last card read as deliberate rather
 * than merely late.
 */
export const ANCHOR_MOVE_MS = 420;

/** When the last card (the cover) finishes moving. */
export const DEAL_LANDING_MS = ANCHOR_START_MS + ANCHOR_MOVE_MS; // 1020
/**
 * The phase budget the deal must fit inside. Must be >= DEAL_LANDING_MS: if
 * it were shorter, IntroContext would advance to `done` mid-flight and
 * useDealOut's cleanup would snap every tile to its resting transform — a
 * visible cut.
 */
export const DEAL_BUDGET_MS = DEAL_LANDING_MS + 20; // 1040

/** Group fade of the grid wrapper once `gather` has posed the deck. */
export const CONTAINER_FADE_MS = 260;

// --- The shared motion scale ----------------------------------------------
// Everything above this line describes the deal-out. Everything below is the
// rest of the site expressed IN it.
//
// The deal is the site's signature gesture, so it is the guard: any other
// animation either quotes one of its beats or has a written reason not to.
// Before this block existed, "fade something in" had seven different
// durations across Reveal, AboutContent, CollectionContent, IndexList and
// Lightbox (260/320/350/400/450/500/600ms), four different sibling staggers
// and four different rise offsets — none of them disagreeing on purpose, just
// each tuned in isolation. Consumers import from here now; a component that
// hardcodes a duration is the bug.
//
// Six beats, and the rule for picking one is what the motion IS, not where it
// happens:

/** Something getting OUT OF THE WAY — closing chrome, a hover dimming. Fast
 *  enough to feel like a response rather than an animation. */
export const SNAP_MS = Math.round(SETTLE_TRANSFORM_MS / 2); // 150
/** A pure opacity change on something that does not move: a backdrop, a
 *  chrome group, a container. Shares CONTAINER_FADE_MS because the grid
 *  wrapper's group fade is exactly this gesture. */
export const FADE_MS = CONTAINER_FADE_MS; // 260
/** A short move: one card's flight, a crossfade, a hero fading in place. */
export const FLIGHT_MS = SETTLE_TRANSFORM_MS; // 300
/** Something ARRIVING and staying — a text block's fade + rise. The cover
 *  card's beat, because that is the same gesture: the considered one that
 *  lands last and is meant to be read. */
export const ARRIVE_MS = ANCHOR_MOVE_MS; // 420
/** A beat of stillness before the next thing happens. */
export const HOLD_MS = PHOTO_HOLD_MS; // 440
/**
 * A lone element crossing the viewport into its slot — the About portrait,
 * the Index page's first collection name. Shared by both because it is one
 * gesture: the page's single hero element travelling to where it belongs,
 * with nothing else moving to set a tempo against it.
 *
 * A root primitive, not derived. TRAVEL_MS is the wordmark's much shorter
 * hop into a header slot, and ARRIVE_MS is a beat inside a deck of 24 cards;
 * neither scales to a lone element crossing most of a screen. Tuned against
 * the Index pill (the smaller, more exposed of the two) and adopted by the
 * portrait, which also more than doubles in width on the way.
 */
export const LONG_MOVE_MS = 700;

/** Sibling text beats — a cascade, which must read as a SEQUENCE.
 *
 *  Deliberately not derived from DEAL_STAGGER_MS. The deal's 24ms against a
 *  300ms flight puts ~10 cards in the air at once, and that overlap is the
 *  fan; the same 8% ratio against ARRIVE_MS would be ~34ms, which on text
 *  reads as one blurred simultaneous event rather than beats. Opposite
 *  intent, so a separate primitive. */
export const STAGGER_TEXT_MS = 120;

/** How far a `Reveal` rises into place. One value, so a heading, a paragraph
 *  and a button row cannot travel different distances for no reason. */
export const RISE_PX = 12;

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
