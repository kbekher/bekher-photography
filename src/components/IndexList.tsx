"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import PillButton from "@/components/ui/PillButton";
import Reveal from "@/components/ui/Reveal";
import imageLoader from "@/utils/image-loader";
import { prefersReducedMotion, useReducedMotion } from "@/utils/useReducedMotion";
import {
  ARRIVE_MS,
  FADE_MS,
  GSAP_EASE,
  HOLD_MS,
  LONG_MOVE_MS,
  RISE_PX,
  STAGGER_TEXT_MS,
} from "@/components/intro/introTimings";
import { galleriesData, keptCollectionSlugs, vertical, type PhotoMetadata } from "@/data";

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
/** The box growing is an arrival; the dim/undim is a pure opacity change. */
const THUMB_RESIZE_DURATION = ARRIVE_MS / 1000;
const THUMB_FADE_DURATION = FADE_MS / 1000;

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

// Pill (31px) + gap-8 (8px) between rows — used as a fallback only.
const ROW_PITCH = 39;

// §5.2: the first name appears at the vertical centre of the finished list,
// travels up into the top slot, then the rest fade in one by one beneath it.
//
// That is the SAME three-beat shape the home page's intro and the About
// page's portrait both play — appear, hold, travel — so it uses the same
// three beats. The hold in particular was 200ms against the intro's 440ms,
// which was the difference between "a blip on the way to the list" and the
// deliberate pause the deal-out takes on its lone centred photo.
const FIRST_FADE_S = FADE_MS / 1000;
const FIRST_HOLD_S = HOLD_MS / 1000;
const FIRST_MOVE_S = LONG_MOVE_MS / 1000;
const OTHERS_STAGGER_S = STAGGER_TEXT_MS / 1000;
const OTHERS_DURATION_S = ARRIVE_MS / 1000;
const OTHERS_Y = RISE_PX;

const OTHERS_SEQUENCE_S =
  COUNT > 1 ? Math.max(0, COUNT - 2) * OTHERS_STAGGER_S + OTHERS_DURATION_S : 0;
const NAMES_DONE_S = FIRST_FADE_S + FIRST_HOLD_S + FIRST_MOVE_S + OTHERS_SEQUENCE_S;
const THUMBS_DELAY = NAMES_DONE_S;
/** A group opacity change on something that does not move — the same gesture
 *  as the grid wrapper's fade, so the same beat. */
const THUMBS_FADE_DURATION = FADE_MS / 1000;

const restTotalHeight =
  collections.reduce((sum, c) => sum + restDims(c.cover.aspectRatio).h, 0) +
  THUMB_GAP * (COUNT - 1);

function listCenterOffset(first: HTMLElement, last: HTMLElement): number {
  const firstRect = first.getBoundingClientRect();
  const lastRect = last.getBoundingClientRect();
  const firstCy = firstRect.top + firstRect.height / 2;
  const lastCy = lastRect.top + lastRect.height / 2;
  const listCenterY = (firstCy + lastCy) / 2;
  return listCenterY - firstCy;
}

function listCenterOffsetFallback(count: number): number {
  return ((count - 1) / 2) * ROW_PITCH;
}

function settleName(el: HTMLElement) {
  gsap.set(el, { opacity: 1, x: 0, y: 0, clearProps: "transform" });
}

export default function IndexList() {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const items = itemRefs.current.filter((el): el is HTMLLIElement => el != null);
    if (items.length === 0) return;

    if (prefersReducedMotion()) {
      items.forEach(settleName);
      return;
    }

    const first = items[0];
    const last = items[items.length - 1];
    const rest = items.slice(1);
    const startY =
      items.length > 1 ? listCenterOffset(first, last) : listCenterOffsetFallback(COUNT);

    gsap.set(first, { opacity: 0, y: startY });
    rest.forEach((el) => gsap.set(el, { opacity: 0, y: OTHERS_Y }));

    const tl = gsap.timeline({
      onComplete: () => items.forEach(settleName),
    });

    tl.to(first, { opacity: 1, duration: FIRST_FADE_S, ease: GSAP_EASE })
      .to({}, { duration: FIRST_HOLD_S })
      .to(first, { y: 0, duration: FIRST_MOVE_S, ease: GSAP_EASE })
      .addLabel("others");

    rest.forEach((el, index) => {
      tl.to(
        el,
        { opacity: 1, y: 0, duration: OTHERS_DURATION_S, ease: GSAP_EASE },
        `others+=${index * OTHERS_STAGGER_S}`
      );
    });

    return () => {
      tl.kill();
    };
  }, []);

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

    return () => {
      tweens.forEach((tween) => tween.kill());
    };
  }, [activeIndex, shouldReduceMotion]);

  return (
    <div className="flex w-full flex-1 items-center justify-center">
      <div className="relative">
        <ul className="flex w-[172px] flex-col items-center gap-8" role="list">
          {collections.map((c, i) => (
            <li
              key={c.slug}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="reveal flex justify-center"
            >
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
            </li>
          ))}
        </ul>

        {/*
          Previews sit to the right of the name list; the list above is what
          gets horizontally centred on the page.
        */}
        <Reveal
          delay={THUMBS_DELAY}
          duration={THUMBS_FADE_DURATION}
          y={0}
          className="absolute left-full top-1/2 ml-[50px] hidden -translate-y-1/2 md:block"
        >
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
