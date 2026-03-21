'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { galleriesData, horizontal } from '@/data';
import imageLoader from '@/utils/image-loader';
import { TransitionLink } from './TransitionLink';

const gearItems = [
  ['2025', 'Canon AE-1'],
  ['2024', 'Pentax 17'],
  ['2022', 'Minolta SR-1s'],
  ['2021', 'ZENIT 11'],
  ['2020', 'Polariod OneStep+'],
  ['2019', 'FED 5'],
]

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  }),
}

const AboutContent = () => {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [previewsLoaded, setPreviewsLoaded] = useState<Record<string, boolean>>({});

  const handlePreviewLoad = (path: string) => {
    setPreviewsLoaded(prev => ({ ...prev, [path]: true }));
  };

  const allCollections = useMemo(() => Object.values(galleriesData).map((gallery) => ({
    id: gallery.id,
    name: gallery.name,
    photo: gallery.photos.find(photo => photo.aspectRatio === horizontal) || gallery.photos[2],
  })), []);

  return (
    <section className='relative pt-[120px] lg:pt-0'>
      {/* Header */}
      <h1 className='w-max absolute z-[1] top-12 md:top-0 left-1/2 -translate-x-1/2 text-6xl md:text-8xl lg:text-9xl text-white tracking-tighter uppercase text-center'>
        About me
      </h1>

      {/* Intro & Portrait */}
      <div className="flex flex-col-reverse lg:flex-row gap-10 items-center mb-16 md:mb-[140px]">
        <div data-cursor="text" className="flex-1 text-sm md:text-2xl xl:text-3xl leading-tight space-y-4 lg:pt-5 lg:sticky lg:top-54 lg:self-start">
          <p>Hi, I&apos;m Kristina Bekher, a Ukrainian photographer and software engineer based in Germany.</p>
          <p>I always say my shots work about 10% of the time, and those are the frames I&apos;m proud to share here.</p>
          <p>When I&apos;m not behind the camera, I&apos;m building software or training for my next marathon.</p>
        </div>

        <div className={`w-full h-full lg:max-w-[50vw] lg:translate-x-5 relative overflow-hidden transition-colors duration-500 ${!heroLoaded ? 'image-placeholder' : ''}`}>
          <Image
            src="/hero.jpg"
            alt="Kristina Bekher portrait"
            width={600}
            height={800}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 80vw"
            className={`w-full h-auto object-cover transition-all duration-1000 ease-in-out ${heroLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-1xl'}`}
            onLoad={() => setHeroLoaded(true)}
            loader={imageLoader}
            priority
          />
        </div>
      </div>

      {/* Collections Marquee Slider */}
      <div className='mb-16 md:mb-24 overflow-hidden relative'>
        <div className="w-full h-px bg-[var(--secondary)] mb-12" />

        <div className="relative w-full">
          <motion.div
            className="flex gap-4 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 60,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {[...allCollections, ...allCollections].map(({ id, name, photo }, index) => (
              <TransitionLink
                key={`${id}-${index}`}
                href={`/galleries/${id}`}
                ariaLabel={`Go to ${name} gallery`}
                className="group w-[300px] md:w-[450px] shrink-0"
                dataCursor="view"
              >
                <div className={`relative aspect-[3/2] overflow-hidden transition-colors duration-500 ${!previewsLoaded[photo.path] ? 'image-placeholder' : ''}`}>
                  <Image
                    src={`/${id}/${photo.path}`}
                    alt={`Preview of ${name}`}
                    fill
                    className={`object-cover w-full h-full transition-all duration-1000 ease-in-out group-hover:scale-105 ${previewsLoaded[photo.path] ? 'opacity-100 blur-0' : 'opacity-0 blur-1xl'}`}
                    sizes="(max-width: 500px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    draggable={false}
                    loader={imageLoader}
                    quality={90}
                    onLoad={() => handlePreviewLoad(photo.path)}
                  />
                </div>
                <div className="mt-2 text-sm font-semibold select-none">{name}</div>
              </TransitionLink>
            ))}
          </motion.div>
        </div>

        <div className="w-full h-px bg-[var(--secondary)] mt-12" />

        <p className='text-[12px] md:text-sm mt-4'>
          Note: All images were developed and scanned by <motion.a
            href="https://fotovramci.com/?srsltid=AfmBOopLTn3khuFhn_KLyzZV3vapYgKymv51BY5a4aphVes0bVGFeqq5"
            aria-label="Visit Foto v Ramci — a film developing and scanning lab"
            whileTap={{ scale: 0.95 }}
            className="font-mono custom-transition hover:text-[var(--accent)]"
            target="_blank"
            data-cursor="text"
          >
            Fotovramci
          </motion.a> and <motion.a
            href="https://filmspeedlab.com/?srsltid=AfmBOop1F_0ZJmwpr82_93Ie-vRs8FcVmjtJMhgRESK4FCWs0t4_tkCg"
            aria-label="Visit Film Speed Lab — a film developing and scanning lab"
            whileTap={{ scale: 0.95 }}
            className="font-mono custom-transition uppercase hover:text-[var(--accent)]"
            target="_blank"
            data-cursor="text"
          >
            Film Speed Lab
          </motion.a>.
        </p>
      </div>

      {/* Gear Timeline */}
      <div className="md:mb-24">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 text-sm md:text-xl">
          <div className="space-y-2 font-mono lg:sticky lg:top-14 lg:self-start lg:pt-12 pb-5">
            {gearItems.map(([year, model], index) => (
              <motion.div
                key={year}
                className="relative py-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index}
                variants={itemVariants}
              >
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="min-w-[6ch] shrink-0">{year}</span>
                  <span className="w-full">{model}</span>
                </div>
                <div className={`absolute -bottom-1 h-px bg-[var(--secondary)] ${index === 0 ? 'left-0 right-0' : 'left-[6ch] right-0'}`} />
              </motion.div>
            ))}
          </div>

          <div className="leading-relaxed space-y-4 pb-2">
            <h2 className="text-3xl md:text-6xl mb-6">Gear</h2>
            <p>
              My first film camera was an old rangefinder, the FED 5. I started with the hard artillery, so to speak, slowly switching to SLRs, which I found easier to use.
            </p>
            <p>
              In 2022, a whole new world opened up to me thanks to the Japanese Minolta SR-1s — that&apos;s when I realized my previous cameras did have their limits.
            </p>
            <p>
              When Pentax 17 finally came out, I soon found myself unboxing my first-ever brand-new film camera. Even though I prefer full manual control, Pentax still gives me plenty of room to experiment through its exposure steps and various modes. Switching from half-frame back to standard 35mm feels almost like stepping into medium format, which I haven&apos;t tried yet.
            </p>
            <p>
              Canon AE-1 with a 50mm f/1.8 FD S.C. lens, is the most recent addition to my kit. Its shutter-priority auto exposure helps me worry less about missing moments.
            </p>
            <p>
              While SLRs have undeniably made my life easier, I&apos;ve realized that the rangefinder is where I truly belong. I&apos;ve never been one for the easy path, so I guess it&apos;s time to go back to where it all started.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutContent;
