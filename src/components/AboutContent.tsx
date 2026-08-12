"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import imageLoader from "@/utils/image-loader";
import TextLink from "@/components/ui/TextLink";
import Reveal from "@/components/ui/Reveal";
import { useReducedMotion } from "@/utils/useReducedMotion";
import { GSAP_EASE } from "@/components/intro/introTimings";

const PORTRAIT_SRC = "/hero.jpg";

const BIO =
  "Hi, I'm Kristina Bekher, a Ukrainian photographer and software engineer based in Germany. " +
  "My shots work about ten percent of the time, and those are the frames I'm proud to share here. " +
  "When I'm not behind the camera, I'm building software or training for my next marathon.";

const DOWNLOAD_LINKS = [
  { label: "Unsplash", href: "https://unsplash.com/@ninjagexly" },
  { label: "Pexels", href: "https://www.pexels.com/@kristina-bekher-1944658582/" },
];

// Portrait: a slow scale-up out of a small pose, not a rise. It is the one
// element on the page that doesn't use the shared `Reveal` primitive, because
// `Reveal` only offers a y-offset.
const PORTRAIT_DURATION = 0.8;
const PORTRAIT_FROM_SCALE = 0.6;

// The three text sections cascade in behind the portrait. This used to be a
// parent element owning `delayChildren`/`staggerChildren` for the group; with
// a `Reveal` per child the same shape is just an arithmetic delay per index,
// and no element has to exist purely to own the stagger.
const TEXT_DELAY_CHILDREN = 0.5;
const TEXT_STAGGER = 0.12;
const TEXT_DURATION = 0.5;
const TEXT_Y = 8;
const textDelay = (i: number) => TEXT_DELAY_CHILDREN + i * TEXT_STAGGER;

export default function AboutContent() {
  const portraitRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const el = portraitRef.current;
    if (!el) return;

    // Reduced motion still has to clear `.reveal`'s `opacity: 0` — see the
    // note on that class in globals.css. Bailing out early would leave the
    // portrait permanently invisible for anyone whose CSS escape hatch
    // didn't apply.
    if (shouldReduceMotion) {
      gsap.set(el, { opacity: 1, scale: 1, clearProps: "transform" });
      return;
    }

    const tween = gsap.fromTo(
      el,
      { opacity: 0, scale: PORTRAIT_FROM_SCALE },
      {
        opacity: 1,
        scale: 1,
        duration: PORTRAIT_DURATION,
        ease: GSAP_EASE,
        onComplete: () => gsap.set(el, { clearProps: "transform" }),
      }
    );

    return () => {
      tween.kill();
    };
  }, [shouldReduceMotion]);

  return (
    <div className="flex w-full flex-col items-center">
      <div ref={portraitRef} className="reveal mt-[122px]">
        <Image
          loader={imageLoader}
          src={PORTRAIT_SRC}
          alt="Kristina Bekher"
          width={374}
          height={540}
          sizes="(max-width: 639px) 92vw, 374px"
          priority
          className="h-auto w-[374px] max-w-[92vw] aspect-[374/540] object-cover"
        />
      </div>

      <div className="flex w-full flex-col items-center">
        <Reveal
          as="section"
          delay={textDelay(0)}
          duration={TEXT_DURATION}
          y={TEXT_Y}
          className="mt-48 flex flex-col items-center text-center"
        >
          <h2>About</h2>
          <p className="mt-8 max-w-[506px] text-center">{BIO}</p>
        </Reveal>

        <Reveal
          as="section"
          delay={textDelay(1)}
          duration={TEXT_DURATION}
          y={TEXT_Y}
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
          delay={textDelay(2)}
          duration={TEXT_DURATION}
          y={TEXT_Y}
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
