import type { CSSProperties, ReactNode } from "react";

/**
 * GridFrame — the 12-column layout primitive that governs every page
 * (DESIGN_SPEC §1). It is deliberately presentational and unopinionated: it
 * only establishes the column tracks and gutter. Children decide their own
 * placement and sizing.
 *
 * Breakpoints (this primitive itself only has two tiers — consumers add
 * their own extra `lg:` overrides on *children* for anything finer, e.g.
 * PhotoGrid's inset only applying at the desktop tier):
 *   - `< 1024px`  → 4 columns  (phone + tablet)
 *   - `>= 1024px` → 12 columns (desktop)
 *
 * The switch happens at 1024px, not the more common 640px `sm:` tier,
 * because the gutter is fixed at 40px (never fluid) — 12 columns need
 * 11×40 = 440px of gutter alone, which only leaves a usable per-column
 * width at wider viewports. At 640px, 12 columns would work out to ~10px
 * each (440px of the 560px content box eaten by gutter); at 1024px it's a
 * workable ~42px/column, matching the design's floor. Below 1024px, the
 * 4-column phone/tablet frame is used instead — its 40px gutter is
 * genuinely proportionate there (4 cols = 50.5px each at the 402px phone
 * frame in the spec).
 *
 * Gutter is always 40px at every tier (per spec §1's grid table).
 *
 * ## Placement convention for children — pick one:
 *
 * 1. **Static/known spans** (the common case): use Tailwind's built-in
 *    `col-span-{n}` / `col-start-{n}` utilities directly in your JSX.
 *    These are plain integer utilities, unrelated to the remapped spacing
 *    scale in globals.css, so they're safe to use as-is:
 *      `<div className="col-span-2 lg:col-start-3 lg:col-span-8">`
 *
 * 2. **Dynamic spans** computed at runtime (e.g. per array index): use the
 *    `gridSpan(span, start?)` helper exported below and pass it as a
 *    `style` prop. Do NOT build a Tailwind class name at runtime (e.g.
 *    `` `col-span-${n}` ``) — Tailwind's compiler only generates CSS for
 *    class names it can see as literal strings in your source, so a
 *    runtime-interpolated class name silently produces no styles at all.
 *
 * ## Nesting inside PageShell
 *
 * `frame` controls whether GridFrame renders its own outer
 * `max-w-[1280px] mx-auto px-[40px]` frame:
 *   - `frame` (default `true`) — use this when GridFrame is the outermost
 *     layout element on a page or section that is NOT already inside a
 *     1280/40px frame.
 *   - `frame={false}` — use this when GridFrame is nested inside an
 *     ancestor that has *already* established that exact frame. Most
 *     notably, `PageShell`'s `<main>` already applies the 1280/40px frame
 *     to everything it renders (header, main, and footer all share one
 *     outer `max-w-[1280px] px-[40px]` box). Applying GridFrame's own frame
 *     a second time inside `PageShell` would pad the content twice —
 *     shrinking the usable content width from 1200px to 1120px — and throw
 *     off every exact measurement in §3/§4 (which assume a 1200px content
 *     width). Pass `frame={false}` in that case.
 */
export interface GridFrameProps {
  children: ReactNode;
  /** Extra classes for the grid element itself (e.g. `items-center`). */
  className?: string;
  /** See "Nesting inside PageShell" above. Default `true`. */
  frame?: boolean;
}

export default function GridFrame({ children, className = "", frame = true }: GridFrameProps) {
  const grid = (
    <div className={`grid w-full grid-cols-4 gap-[40px] lg:grid-cols-12 ${className}`.trim()}>
      {children}
    </div>
  );

  if (!frame) return grid;

  return <div className="mx-auto w-full max-w-[1280px] px-[40px]">{grid}</div>;
}

/**
 * Inline-style helper for placing a grid child whose span/start is computed
 * at runtime (placement convention #2 above). `start` is 1-indexed, matching
 * CSS grid line numbers.
 *
 *   gridSpan(4)     -> { gridColumn: "span 4 / span 4" }   (auto-placed)
 *   gridSpan(2, 5)  -> { gridColumn: "5 / span 2" }         (cols 5-6)
 */
export function gridSpan(span: number, start?: number): CSSProperties {
  return {
    gridColumn: start ? `${start} / span ${span}` : `span ${span} / span ${span}`,
  };
}
