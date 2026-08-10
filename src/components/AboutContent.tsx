"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Image from "next/image";
import imageLoader from "@/utils/image-loader";
import TextLink from "@/components/ui/TextLink";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const PORTRAIT_SRC = "/hero.jpg";

const BIO =
  "Hi, I'm Kristina Bekher, a Ukrainian photographer and software engineer based in Germany. " +
  "My shots work about ten percent of the time, and those are the frames I'm proud to share here. " +
  "When I'm not behind the camera, I'm building software or training for my next marathon.";

const DOWNLOAD_LINKS = [
  { label: "Unsplash", href: "https://unsplash.com/@ninjagexly" },
  { label: "Pexels", href: "https://www.pexels.com/@kristina-bekher-1944658582/" },
];

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: EASE } },
};

const textContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.5, staggerChildren: 0.12 },
  },
};

const textItemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function AboutContent() {
  const shouldReduceMotion = useReducedMotion();
  const initialImage = shouldReduceMotion ? false : "hidden";
  const initialText = shouldReduceMotion ? false : "hidden";

  return (
    <div className="flex w-full flex-col items-center">
      <motion.div
        className="mt-[122px]"
        initial={initialImage}
        animate="visible"
        variants={imageVariants}
      >
        <Image
          loader={imageLoader}
          src={PORTRAIT_SRC}
          alt="Kristina Bekher"
          width={374}
          height={540}
          sizes="(max-width: 639px) 92vw, 374px"
          priority
          className="h-auto w-[374px] max-w-[92vw] object-cover"
        />
      </motion.div>

      <motion.div
        className="flex w-full flex-col items-center"
        initial={initialText}
        animate="visible"
        variants={textContainerVariants}
      >
        <motion.section
          variants={textItemVariants}
          className="mt-48 flex flex-col items-center text-center"
        >
          <h2>About</h2>
          <p className="mt-8 max-w-[506px] text-center">{BIO}</p>
        </motion.section>

        <motion.section
          variants={textItemVariants}
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
        </motion.section>

        <motion.section
          variants={textItemVariants}
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
        </motion.section>
      </motion.div>
    </div>
  );
}
