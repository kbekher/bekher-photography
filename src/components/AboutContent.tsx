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
  "I grew up in a small town in the Donetsk region of Ukraine, which has been occupied since 2014. I had to leave my hometown when I was 14, and for a few years I felt somewhat lost. " +
  "In 2019, while volunteering in Lithuania, I found analogue photography. It became a way of escaping for a while, but also looking more closely at what was around me and trying to make sense of what I was experiencing. " +
  "Moving to Europe after the full-scale invasion in 2022 brought another shift. A new place meant new subjects and new possibilities, and my photography changed with it. " + 
  "By day, I’m a software developer. And while AI does most of my coding, it's still me behind my analogue cameras.";

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

/**
 * Hands the portrait back to the document after the fly-in: out of `fixed`,
 * back to a plain in-flow flex item at its final width.
 *
 * Nothing in here centres it horizontally, and nothing in here should. The
 * portrait's final width is an inline pixel value from `portraitTargetWidth()`,
 * which on a phone is usually decided by the height term and so comes out
 * NARROWER than the slot — 274px inside a 295px slot at 375x667. Splitting that
 * leftover 21px is the slot's `justify-center`'s job, and it does it: measured
 * gaps are 10.5px / 10.5px there, and stay equal at every width from 320px up,
 * in the reduced-motion path, after a resize, and in the production build. If
 * this ever looks off-centre again, the thing to check is whether something has
 * put a margin, a `left`, or a leftover transform back on the element — not to
 * add an `mx-auto`, which would only hide a container that had stopped working.
 *
 * Which is why `margin` is in `clearProps`. The fixed phase below writes
 * `margin: 0` inline (it has to — a stray margin would offset a viewport-
 * positioned element), and the previous version never gave it back, so the
 * settled portrait carried a `margin: 0px` inline declaration for the life of
 * the page. That is inert today, because the portrait wears no margin utility.
 * It is a trap tomorrow: an inline shorthand outranks every class, so the next
 * `mt-*`/`mx-*` added here would do nothing, and the reason would be four
 * properties deep in a `gsap.set` on the other side of the file. The fixed
 * phase borrows the margin; settling returns it.
 *
 * Idempotent on purpose: this is the landing of the fly-in AND the handler for
 * every later resize, so calling it twice with the same numbers must be a
 * no-op. The slot's pinned height is released here too — it exists only to
 * hold the column's shape while the portrait is out of flow, and once the
 * portrait is back in flow it sizes the slot itself. Releasing it is what
 * stops a height measured for one viewport outliving it.
 */
function settlePortrait(el: HTMLElement, slot: HTMLElement, width: number) {
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
    clearProps: "transform,zIndex,margin",
  });
  slot.style.height = "";
}

export default function AboutContent() {
  const slotRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  /**
   * Whether the portrait is back in the document's hands. Until it is, the
   * timeline owns its box outright and a resize must not touch it — writing a
   * settled width onto an element that is still `position: fixed` mid-flight
   * would fight the tween for the same properties.
   */
  const settledRef = useRef(false);

  useLayoutEffect(() => {
    const el = portraitRef.current;
    const slot = slotRef.current;
    if (!el || !slot) return;

    // Always re-derived from the CURRENT slot and viewport, never from a
    // value captured at mount. That is the whole of the resize fix: there is
    // no cached size left for a rotation to invalidate.
    const settle = () => {
      settledRef.current = true;
      settlePortrait(el, slot, portraitTargetWidth(slot.clientWidth));
    };

    // The portrait's resting size is a function of the viewport, and until now
    // that function was evaluated exactly once, in this effect, with an empty
    // dep array and no listener. Rotate the phone after landing and the photo
    // kept a width computed for the screen it no longer had — centred, but
    // sized for a viewport that was gone (274px in a 587px slot after a
    // rotation to landscape, when it could have been the full 374px).
    //
    // Coalesced through one rAF because `resize` fires in bursts, and bound to
    // `visualViewport` as well as `window` since on mobile the height term is
    // usually the one that decides the size and only `visualViewport` reports
    // a soft-keyboard or URL-bar change. That the URL bar therefore re-sizes
    // the portrait mid-scroll is harmless: by the time a mobile toolbar
    // collapses, the visitor has scrolled the portrait off the screen.
    let resizeRaf = 0;
    const onViewportChange = () => {
      if (!settledRef.current) return;
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(settle);
    };
    window.addEventListener("resize", onViewportChange);
    window.visualViewport?.addEventListener("resize", onViewportChange);

    const teardown = () => {
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", onViewportChange);
      window.visualViewport?.removeEventListener("resize", onViewportChange);
    };

    // `document.hidden` sits alongside reduced motion because it has the same
    // answer for a different reason: nobody is watching, so skip to the end.
    //
    // Without it this is a way to strand the portrait mid-flight. GSAP's
    // ticker is a `requestAnimationFrame` loop, and browsers pause rAF in a
    // background tab — so a /about opened in a new tab, or left while the
    // 2.5s sequence plays, freezes the timeline at whatever frame it reached.
    // The frozen state is not a neutral one: the fly-in's very first act is to
    // take the portrait `position: fixed` at `opacity: 0`, so the page sits
    // there with an empty slot and no photo at all until the tab is looked at.
    // Measured directly — 4s after a background-tab load the portrait was
    // still `position: fixed; opacity: 0; width: 166px`, out of flow, with the
    // timeline on its first frame.
    //
    // Settling instead means a page opened in the background is simply
    // finished by the time it is first seen, which is what it should have been
    // anyway: an entrance nobody witnessed has nothing left to perform.
    if (prefersReducedMotion() || document.hidden) {
      settle();
      return teardown;
    }

    // Hold the column's shape while the portrait is out of flow. Released
    // again by `settlePortrait`, so it can never go stale.
    slot.style.height = `${portraitTargetWidth(slot.clientWidth) / PORTRAIT_RATIO}px`;
    void slot.offsetHeight;

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

    const tl = gsap.timeline({ onComplete: settle });

    /**
     * The travel, driven through a scalar rather than tweened straight onto
     * the element — because the destination is not a constant.
     *
     * The portrait is `position: fixed`, so its `top` is a VIEWPORT
     * coordinate, while the slot it is flying to is anchored to the DOCUMENT.
     * The old version resolved that once, before the ~1.7s fade and hold:
     * `landTop = slot.getBoundingClientRect().top`, captured at mount. Scroll
     * during the hold and the photo flew to where the slot used to be on
     * screen, then `settlePortrait` dropped it into flow and it snapped the
     * whole scroll distance in a single frame. Measured at 160px of scroll:
     * the last fixed frame sat 159.52px off the slot, the next frame 0.00.
     *
     * `p` is what carries the easing, and the geometry is re-read from the
     * live slot on every frame, so the target tracks scrolling (and resizing)
     * for the whole descent instead of only up to the moment it was sampled.
     * `from` is read at the travel's START, not at mount, for the same reason:
     * 1.7s earlier is the wrong time to ask where anything is.
     */
    const travel = { p: 0 };
    let from = { x: vw / 2, y: vh / 2, w: PORTRAIT_POSE_WIDTH };

    tl.to(el, {
      opacity: 1,
      duration: FADE_MS / 1000,
      ease: GSAP_EASE,
    })
      .to({}, { duration: HOLD_MS / 1000 })
      .to(travel, {
        p: 1,
        duration: LONG_MOVE_MS / 1000,
        // Eased, not linear. This ran on `ease: "none"` and it was the most
        // exposed motion on the site — the only thing moving on the page,
        // travelling at a constant speed and then stopping dead on arrival.
        // GSAP_EASE is the same soft ease-out every other arrival uses. It is
        // applied to `p`, so interpolating linearly against it below gives
        // exactly the curve the properties used to be tweened on.
        ease: GSAP_EASE,
        onStart: () => {
          const r = el.getBoundingClientRect();
          from = { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width };
        },
        onUpdate: () => {
          const r = slot.getBoundingClientRect();
          const { p } = travel;
          // `xPercent/yPercent: -50` are already on the element and stay, so
          // `left`/`top` address its CENTRE — hence the half-width/height.
          gsap.set(el, {
            left: from.x + (r.left + r.width / 2 - from.x) * p,
            top: from.y + (r.top + r.height / 2 - from.y) * p,
            width: from.w + (portraitTargetWidth(slot.clientWidth) - from.w) * p,
          });
        },
      });

    return () => {
      tl.kill();
      teardown();
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
