'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

const gearItems = [
  ['2025', 'Canon AE-1'],
  ['2024', 'Pentax 17'],
  ['2022', 'Minolta SR-1s'],
  ['2021', 'ZENIT 11'],
  ['2019', 'FED 5'],
]

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
}

const AboutContent = () => {
  return (
    <section className='relative pt-[120px] lg:pt-0'>
      {/* Header */}
      <h1 className='w-max absolute z-[49] top-12 md:top-0 left-1/2 -translate-x-1/2 origin-center text-6xl md:text-8xl lg:text-9xl text-center text-white tracking-tighter uppercase'>
        About me
      </h1>

      {/* Intro & Portrait */}
      <div className='flex flex-col-reverse lg:flex-row gap-10 items-center mb-24'>
        <div data-cursor="text" className='flex-1 text-[14px] md:text-2xl xl:text-3xl leading-tight space-y-4 lg:pt-5 lg:sticky lg:top-54 lg:self-start'>
          <p>
            Hey, I&apos;m Kristina Bekher, and I love film photography.
          </p>
          <p>
            Whether it&apos;s a certain light, the feeling of a place, or the simplicity of ordinary objects — if you see it in my frame, it means the moment was too special to resist shooting.
          </p>
          <p>
            By day, I&apos;m a software developer driving on-site experimentation at Douglas.
          </p>
        </div>
        <div className='w-full lg:max-w-[50vw] lg:translate-x-[20px] shrink-0'>
          <Image
            src='https://d14lj85n4pdzvr.cloudfront.net/hero.jpg?w=600&format=webp&cache=31536000' // replace with your actual image path
            alt='Kristina Bekher portrait'
            width={500}
            height={600}
            className='w-full h-auto object-cover grayscale'
          />
        </div>
      </div>

      {/* Gear Timeline */}
      <div className="mb-24">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 text-[14px] md:text-[18px]">

          {/* Animated, Sticky Timeline */}
          <div className="space-y-2 font-mono lg:sticky lg:top-14 lg:self-start lg:pt-[46px] pb-5">
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

                {/* Underlines */}
                <div
                  className={`absolute -bottom-1 h-px bg-[var(--secondary)] ${index === 0 ? 'left-0 right-0' : 'left-[6ch] right-0'
                    }`}
                />
              </motion.div>
            ))}
          </div>

          {/* Gear Story */}
          <div className="leading-relaxed space-y-4 pb-2 text-balance">
            <h2 className="text-3xl md:text-6xl mb-6">Gear</h2>

            <p>
              My first ever film camera was an old rangefinder, the FED 5. I started with the hard artillery, so to speak, slowly switching o, in my opinion, easier-to-use SLRs.
            </p>
            <p>
              In 2022, a whole new world opened up to me thanks to the Japanese Minolta SR-1s. That was when I realized the older cameras I&apos;d been using did have their limits.
            </p>
            <p>
              When Pentax 17 finally came out, I soon found myself unboxing my first-ever new film camera. I was a bit suspicios about it at first, but Pentax does have room for experiment with its exposure steps and modes. Shooting full 35mm after a half frame feels like shooting medium size (which I haven&apos;t tried yet).
            </p>
            <p>
              Canon AE-1 with a Rolev M.G. 55mm Skylight filter on the lens is the most recent addition to my kit. I may worry less now about missing moments thank to the built-in automatic aperture exposure.
            </p>
            <p className='text-[14px] color-[var(--accent)]'>
              Note: All images were developed and scanned at <Link
                href="https://fotovramci.com/?srsltid=AfmBOopLTn3khuFhn_KLyzZV3vapYgKymv51BY5a4aphVes0bVGFeqq5"
                aria-label="Visit Foto v Ramci — a film developing and scanning lab"
                className='font-mono custom-transition hover:text-[var(--accent)]'
                target="blank"
                data-cursor="text"
              >
                Fotovramci
              </Link> and <Link
                href="https://filmspeedlab.com/?srsltid=AfmBOop1F_0ZJmwpr82_93Ie-vRs8FcVmjtJMhgRESK4FCWs0t4_tkCg"
                aria-label="Visit Film Speed Lab — a film developing and scanning lab"
                className='font-mono custom-transition uppercase hover:text-[var(--accent)]'
                target="blank"
                data-cursor="text"
              >
                Film Speed Lab
              </Link>.
            </p>
          </div>
        </div>
      </div>

      {/* // TODO: Selected Galleries */}

    </section>
  );
};

export default AboutContent;
