"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import PillButton from "@/components/ui/PillButton";
import Reveal from "@/components/ui/Reveal";
import imageLoader from "@/utils/image-loader";
import { useReducedMotion } from "@/utils/useReducedMotion";
import { GSAP_EASE } from "@/components/intro/introTimings";
import { galleriesData, keptCollectionSlugs, vertical, type PhotoMetadata } from "@/data";

// Pill (31px) + 8px gap between names, per spec §4.2.
const ROW_PITCH = 39;

// Index_Small_Vertical / Index_Small_Horizontal, per spec §3.
const REST_VERTICAL = { w: 22, h: 32 };
const REST_HORIZONTAL = { w: 36, h: 24 };
const THUMB_GAP = 12;

// How much the hovered/focused thumbnail grows. The spec doesn't give an
// exact enlarged size ("grows"), so a tasteful multiple of the resting
// silhouette size was chosen, preserving aspect ratio.
const GROW_SCALE = 2.5;

// Dimmed at rest, full strength when hovered/focused.
const THUMB_REST_OPACITY = 0.15;
const THUMB_RESIZE_DURATION = 0.45;
const THUMB_FADE_DURATION = 0.35;

function restDims(aspectRatio: string) {
  return aspectRatio === vertical ? REST_VERTICAL : REST_HORIZONTAL;
}

function grownDims(aspectRatio: string) {
  const base = restDims(aspectRatio);
  return { w: Math.round(base.w * GROW_SCALE), h: Math.round(base.h * GROW_SCALE) };
}

const collections = keptCollectionSlugs.map((slug) => {
  const gallery = galleriesData[slug];
  return {
    slug,
    name: gallery.name,
    cover: gallery.photos[0] as PhotoMetadata,
  };
});

const COUNT = collections.length;
const LAST_INDEX = COUNT - 1;

// The block's vertical centre coincides with the middle item's natural slot
// (row (COUNT-1)/2). See §5.2: the last collection's name first appears
// there, then rises into its own slot; the rest fade/settle in a downward
// stagger "out of" that same beat.
const CENTER_SLOT_Y = ((COUNT - 1) / 2) * ROW_PITCH;
function centerOffset(i: number) {
  return CENTER_SLOT_Y - i * ROW_PITCH;
}

const NAMES_SETTLE_START = 0.55;
const NAMES_SETTLE_STAGGER = 0.09;
const NAMES_SETTLE_DURATION = 0.5;
const NAMES_SETTLE_Y = 10;
/** The last name is the hero of the beat: it travels the whole way from the
 *  block's centre, so it gets its own longer duration and no delay. */
const NAMES_HERO_DURATION = 0.7;
const THUMBS_DELAY =
  NAMES_SETTLE_START + (COUNT - 1) * NAMES_SETTLE_STAGGER + NAMES_SETTLE_DURATION;
const THUMBS_FADE_DURATION = 0.6;

/**
 * Per-name reveal timing. This used to be a single index-aware animation
 * variant with two branches; as plain `Reveal` props it is the same two-track
 * sequence, just resolved at render time instead of inside a variant resolver.
 */
function nameReveal(i: number) {
  return i === LAST_INDEX
    ? { y: centerOffset(i), duration: NAMES_HERO_DURATION, delay: 0 }
    : {
        y: NAMES_SETTLE_Y,
        duration: NAMES_SETTLE_DURATION,
        delay: NAMES_SETTLE_START + i * NAMES_SETTLE_STAGGER,
      };
}

const restTotalHeight =
  collections.reduce((sum, c) => sum + restDims(c.cover.aspectRatio).h, 0) +
  THUMB_GAP * (COUNT - 1);

export default function IndexList() {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  /*
    Hover/focus response (§5.4). This used to be a FLIP-style `layout`
    animation — measure the before/after boxes, transform between them — but
    here the growth IS a real layout change (the flex column re-centres around
    the enlarged thumb), so tweening the box's own `width`/`height`
    reproduces it directly without the measuring pass: every
    frame is a genuine layout pass, and the siblings get pushed apart
    progressively rather than being transformed to fake it.

    Kept out of React state: the sizes below are written straight to the DOM,
    so a hover never re-renders the list. The resting dims/opacity are also
    the inline values React server-rendered, which means the very first run of
    this effect tweens each element to where it already is — a no-op — and
    nothing moves until `activeIndex` actually changes.
  */
  useEffect(() => {
    const tweens: gsap.core.Tween[] = [];

    collections.forEach((c, i) => {
      const box = boxRefs.current[i];
      const image = imageRefs.current[i];
      if (!box || !image) return;

      const isActive = activeIndex === i;
      const dims = isActive ? grownDims(c.cover.aspectRatio) : restDims(c.cover.aspectRatio);

      tweens.push(
        gsap.to(box, {
          width: dims.w,
          height: dims.h,
          duration: shouldReduceMotion ? 0 : THUMB_RESIZE_DURATION,
          ease: GSAP_EASE,
          overwrite: "auto",
        }),
        gsap.to(image, {
          opacity: isActive ? 1 : THUMB_REST_OPACITY,
          duration: shouldReduceMotion ? 0 : THUMB_FADE_DURATION,
          ease: GSAP_EASE,
          overwrite: "auto",
        })
      );
    });

    // Killing on re-run is what makes a fast hover-off-hover-on read as one
    // continuous move: the in-flight tweens stop where they are and the next
    // pass starts from those current values.
    return () => {
      tweens.forEach((tween) => tween.kill());
    };
  }, [activeIndex, shouldReduceMotion]);

  return (
    <div className="flex w-full justify-center pt-[218px]">
      <div className="flex gap-[50px]">
        <ul className="flex w-[172px] flex-col items-center gap-8" role="list">
          {collections.map((c, i) => (
            <Reveal as="li" key={c.slug} className="flex justify-center" {...nameReveal(i)}>
              <PillButton
                href={`/collections/${c.slug}`}
                className={activeIndex === i ? "!bg-surface" : ""}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                onFocus={() => setActiveIndex(i)}
                onBlur={() => setActiveIndex(null)}
              >
                {c.name}
              </PillButton>
            </Reveal>
          ))}
        </ul>

        {/*
          The column only fades in (y = 0) once the names have finished
          settling, hence the plain `Reveal` wrapper around — rather than on —
          the sized box below: `Reveal` styles via `className` only, and this
          box's height is computed from the data at module scope.

          Fixed-height, `justify-content: center` column: at rest its content
          exactly fills the box, so the resting layout starts flush at the
          218px offset like the names column. When one thumbnail grows past
          that height, the flex box centres the overflow symmetrically above
          and below — a plain-CSS way to get a genuine, real (non-transform)
          push-apart in *both* directions, on top of which the width/height
          tween in the effect above smooths the size change itself (§5.4).
        */}
        <Reveal delay={THUMBS_DELAY} duration={THUMBS_FADE_DURATION} y={0}>
          <div
            aria-hidden="true"
            className="flex flex-col items-center"
            style={{
              width: 36,
              height: restTotalHeight,
              justifyContent: "center",
              gap: THUMB_GAP,
            }}
          >
            {collections.map((c, i) => {
              const dims = restDims(c.cover.aspectRatio);
              return (
                <div
                  key={c.slug}
                  ref={(el) => {
                    boxRefs.current[i] = el;
                  }}
                  style={{ width: dims.w, height: dims.h, flexShrink: 0 }}
                >
                  <div
                    ref={(el) => {
                      imageRefs.current[i] = el;
                    }}
                    className="relative h-full w-full"
                    style={{ opacity: THUMB_REST_OPACITY }}
                  >
                    <Image
                      loader={imageLoader}
                      src={`/${c.slug}/${c.cover.path}`}
                      alt=""
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
