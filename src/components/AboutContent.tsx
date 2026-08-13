"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import imageLoader from "@/utils/image-loader";
import TextLink from "@/components/ui/TextLink";
import Reveal from "@/components/ui/Reveal";
import {
  ARRIVE_MS,
  FADE_MS,
  GSAP_EASE,
  HOLD_MS,
  LONG_MOVE_MS,
  STAGGER_TEXT_MS,
} from "@/components/intro/introTimings";
import { prefersReducedMotion } from "@/utils/useReducedMotion";

const PORTRAIT_SRC = "/hero.jpg";

const BIO =
  "Hi, I'm Kristina Bekher, a Ukrainian photographer and software engineer based in Germany. " +
  "My shots work about ten percent of the time, and those are the frames I'm proud to share here. " +
  "When I'm not behind the camera, I'm building software or training for my next marathon.";

const DOWNLOAD_LINKS = [
  { label: "Unsplash", href: "https://unsplash.com/@ninjagexly" },
  { label: "Pexels", href: "https://www.pexels.com/@kristina-bekher-1944658582/" },
];

const PORTRAIT_RATIO = 374 / 540;
const PORTRAIT_POSE_WIDTH = 166;
const PORTRAIT_MAX_WIDTH = 374;

/** Room for the site header + About heading + first bio line below the portrait. */
const PORTRAIT_MAX_HEIGHT_CSS =
  "calc(100dvh - env(safe-area-inset-top, 0px) - 17rem)";

/**
 * The portrait's whole sequence, and deliberately the same three beats the
 * home page's intro plays before its grid appears: FADE it up, HOLD on it
 * centred, then travel. Same numbers, so the two pages read as one site.
 */
const PORTRAIT_DONE_S = (FADE_MS + HOLD_MS + LONG_MOVE_MS) / 1000;

const TEXT_DURATION = ARRIVE_MS / 1000;
const TEXT_STAGGER = STAGGER_TEXT_MS / 1000;

function viewportSize() {
  return {
    w: window.visualViewport?.width ?? window.innerWidth,
    h: window.visualViewport?.height ?? window.innerHeight,
  };
}

function portraitTargetWidth(contentWidth: number): number {
  const reserved = 17 * 16;
  const maxH = Math.max(0, viewportSize().h - reserved);
  const byHeight = maxH * PORTRAIT_RATIO;
  return Math.min(PORTRAIT_MAX_WIDTH, contentWidth, byHeight);
}

function settlePortrait(el: HTMLElement, width: number) {
  gsap.set(el, {
    position: "relative",
    left: "auto",
    top: "auto",
    width,
    x: 0,
    y: 0,
    xPercent: 0,
    yPercent: 0,
    opacity: 1,
    clearProps: "transform,zIndex",
  });
}

export default function AboutContent() {
  const slotRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = portraitRef.current;
    const slot = slotRef.current;
    if (!el || !slot) return;

    const contentWidth = slot.clientWidth;
    const targetWidth = portraitTargetWidth(contentWidth);
    const targetHeight = targetWidth / PORTRAIT_RATIO;
    slot.style.height = `${targetHeight}px`;

    if (prefersReducedMotion()) {
      settlePortrait(el, targetWidth);
      return;
    }

    void slot.offsetHeight;
    const slotRect = slot.getBoundingClientRect();
    const landLeft = slotRect.left + slotRect.width / 2;
    const landTop = slotRect.top;
    const { w: vw, h: vh } = viewportSize();

    gsap.set(el, {
      position: "fixed",
      left: vw / 2,
      top: vh / 2,
      xPercent: -50,
      yPercent: -50,
      width: PORTRAIT_POSE_WIDTH,
      margin: 0,
      opacity: 0,
      zIndex: 1,
    });

    const tl = gsap.timeline({
      onComplete: () => settlePortrait(el, targetWidth),
    });

    tl.to(el, {
      opacity: 1,
      duration: FADE_MS / 1000,
      ease: GSAP_EASE,
    })
      .to({}, { duration: HOLD_MS / 1000 })
      .to(el, {
        left: landLeft,
        top: landTop + targetHeight / 2,
        xPercent: -50,
        yPercent: -50,
        width: targetWidth,
        duration: LONG_MOVE_MS / 1000,
        // Eased, not linear. This ran on `ease: "none"` and it was the most
        // exposed motion on the site — the only thing moving on the page,
        // travelling at a constant speed and then stopping dead on arrival.
        // GSAP_EASE is the same soft ease-out every other arrival uses.
        ease: GSAP_EASE,
      });

    return () => {
      tl.kill();
    };
  }, []);

  const aboutDelay = PORTRAIT_DONE_S + 0.04;
  const contactDelay = aboutDelay + TEXT_STAGGER;
  const downloadDelay = aboutDelay + TEXT_STAGGER * 2;

  return (
    <div className="flex w-full flex-col items-center">
      <div
        ref={slotRef}
        className="mt-24 flex w-full shrink-0 justify-center"
      >
        <div
          ref={portraitRef}
          className="reveal relative aspect-[374/540] w-[166px] max-w-full overflow-hidden will-change-transform"
          style={{ maxHeight: PORTRAIT_MAX_HEIGHT_CSS }}
        >
          <Image
            loader={imageLoader}
            src={PORTRAIT_SRC}
            alt="Kristina Bekher"
            fill
            sizes="(max-width: 639px) 100vw, 374px"
            priority
            className="object-cover"
          />
        </div>
      </div>

      {/* Text sits in the document flow from the first paint — only opacity
          animates in, so the portrait slot never shifts when copy appears. */}
      <div className="mt-48 flex w-full shrink-0 flex-col items-center">
        <Reveal as="section" delay={aboutDelay} duration={TEXT_DURATION} y={0} className="flex flex-col items-center text-center">
          <h2>About</h2>
          <p className="mt-8 max-w-[506px] text-center">{BIO}</p>
        </Reveal>

        <Reveal
          as="section"
          delay={contactDelay}
          duration={TEXT_DURATION}
          y={0}
          className="mt-[40px] flex flex-col items-center text-center"
        >
          <h2>Contact</h2>
          <TextLink href="mailto:krbekher@gmail.com" className="mt-8">
            krbekher@gmail.com
          </TextLink>
          <TextLink
            href="https://instagram.com/ninjagexly"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8"
          >
            @ninjagexly
          </TextLink>
        </Reveal>

        <Reveal
          as="section"
          delay={downloadDelay}
          duration={TEXT_DURATION}
          y={0}
          className="mb-96 mt-[40px] flex flex-col items-center text-center"
        >
          <h2>Download images on</h2>
          {DOWNLOAD_LINKS.map((link) => (
            <TextLink
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8"
            >
              {link.label}
            </TextLink>
          ))}
        </Reveal>
      </div>
    </div>
  );
}
