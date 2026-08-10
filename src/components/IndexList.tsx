"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useState } from "react";
import PillButton from "@/components/ui/PillButton";
import imageLoader from "@/utils/image-loader";
import { galleriesData, keptCollectionSlugs, vertical, type PhotoMetadata } from "@/data";

// Shared soft ease-out, per design spec §5.
const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

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
const THUMBS_DELAY =
  NAMES_SETTLE_START + (COUNT - 1) * NAMES_SETTLE_STAGGER + NAMES_SETTLE_DURATION;

const nameVariants: Variants = {
  hidden: (i: number) =>
    i === LAST_INDEX
      ? { opacity: 0, y: centerOffset(i) }
      : { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition:
      i === LAST_INDEX
        ? { duration: 0.7, ease: EASE }
        : {
            duration: NAMES_SETTLE_DURATION,
            ease: EASE,
            delay: NAMES_SETTLE_START + i * NAMES_SETTLE_STAGGER,
          },
  }),
};

const restTotalHeight =
  collections.reduce((sum, c) => sum + restDims(c.cover.aspectRatio).h, 0) +
  THUMB_GAP * (COUNT - 1);

export default function IndexList() {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const namesInitial = shouldReduceMotion ? "visible" : "hidden";
  const thumbsTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.6, ease: EASE, delay: THUMBS_DELAY };

  return (
    <div className="flex w-full justify-center pt-[218px]">
      <div className="flex gap-[50px]">
        <motion.ul
          className="flex w-[172px] flex-col items-center gap-8"
          role="list"
          initial={namesInitial}
          animate="visible"
        >
          {collections.map((c, i) => (
            <motion.li key={c.slug} className="flex justify-center" variants={nameVariants} custom={i}>
              <PillButton
                href={`/index/${c.slug}`}
                className={activeIndex === i ? "!bg-surface" : ""}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                onFocus={() => setActiveIndex(i)}
                onBlur={() => setActiveIndex(null)}
              >
                {c.name}
              </PillButton>
            </motion.li>
          ))}
        </motion.ul>

        {/*
          Fixed-height, `justify-content: center` column: at rest its content
          exactly fills the box, so the resting layout starts flush at the
          218px offset like the names column. When one thumbnail grows past
          that height, the flex box centres the overflow symmetrically above
          and below — a plain-CSS way to get a genuine, real (non-transform)
          push-apart in *both* directions, on top of which each thumb's own
          `layout` prop smooths the position/size change (§5.4).
        */}
        <motion.div
          aria-hidden="true"
          className="flex flex-col items-center"
          style={{ width: 36, height: restTotalHeight, justifyContent: "center", gap: THUMB_GAP }}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={thumbsTransition}
        >
          {collections.map((c, i) => {
            const isActive = activeIndex === i;
            const dims = isActive ? grownDims(c.cover.aspectRatio) : restDims(c.cover.aspectRatio);
            return (
              <motion.div
                key={c.slug}
                layout
                transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: EASE }}
                style={{ width: dims.w, height: dims.h, flexShrink: 0 }}
              >
                <motion.div
                  className="relative h-full w-full"
                  animate={{ opacity: isActive ? 1 : 0.15 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: EASE }}
                >
                  <Image
                    loader={imageLoader}
                    src={`/${c.slug}/${c.cover.path}`}
                    alt=""
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
