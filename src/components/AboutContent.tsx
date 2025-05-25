'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

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
        <div className='flex-1 text-[14px] md:text-2xl xl:text-3xl leading-relaxed space-y-4 lg:pt-5'>
          <p>
            I&apos;m Kristina Bekher, and I shoot on film.
          </p>
          <p>
            In my photography, I mix street, nature, architecture, and many aspects of everyday life. I like shooting anything that seems interesting and experimenting with light and color.
          </p>
          <p>
            By day, I&apos;m a software developer driving on-site experimentation at Douglas.
          </p>
        </div>
        <div className='w-full lg:max-w-[50vw] lg:translate-x-[20px] shrink-0'>
          <Image
            src='https://d14lj85n4pdzvr.cloudfront.net/hero.jpg' // replace with your actual image path
            alt='Kristina Bekher portrait'
            width={500}
            height={600}
            className='w-full h-auto object-cover grayscale'
          />
        </div>
      </div>

      {/* Gear Timeline */}
      <div className="mb-24">
        <h2 className="text-3xl md:text-4xl uppercase mb-6">Gear</h2>
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 text-[14px] md:text-[24px]">

          {/* Animated, Sticky Timeline */}
          <div className="space-y-2 font-mono lg:sticky lg:top-14 lg:self-start">
            {gearItems.map(([year, model], index) => (
              <motion.div
                key={year}
                className="relative py-2"
                initial="hidden"
                whileInView="visible"
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
          <div className="leading-relaxed space-y-4 pt-10 text-balance">
            <p>
              My first ever film camera was an old rangefinder, the FED 5. I started with the hard artillery, so to speak, slowly switching to easier-to-use SLRs.
            </p>
            <p>
              In 2022, a whole new world opened up to me thanks to the Japanese Minolta SR-1s. That was when I realized the older cameras I&apos;d been using did have their limits. That same year, Asahi Optical announced the Pentax 17, and I&apos;d been looking forward to it ever since.
            </p>
            <p>
              When Pentax 17 finally came out, I soon found myself unboxing my first-ever new and half-frame film camera. I was a bit suspicios about it at first, mainly because I prefer full manual control. But Pentax still lets me experiment with exposure steps, modes, and focus, which is quite tricky.
            </p>
            <p>
              Canon AE-1 is the most recent addition to my kit. With its automatic aperture exposure, I worry less about missing moments. It&apos;s paired with a Rolev M.G. 55mm Skylight filter on the lens. I absolutely love the images I get, and I hope you&apos;ll enjoy them as much. :)
            </p>
          </div>
        </div>
      </div>

      {/* // TODO: Selected Galleries */}

    </section>
  );
};

export default AboutContent;
