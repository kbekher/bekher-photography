'use client';

import Image from 'next/image';
import React from 'react';

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
            I{"'"}m Kristina Bekher, a Ukrainian film photographer.
          </p>
          <p>
            In my photography I mix street, travel, architecture and lots of aspects of a day-to-day life. I like to find beauty, feel and celebrate every little thing I encounter.
          </p>
          <p>
            By day, I am a software developer driving onsite-experimentation at Douglas.
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

      {/* // TODO: Selected Galleries */}

      {/* Gear Timeline */}
      <div className='mb-24'>
        <h2 className='text-3xl md:text-4xl uppercase mb-6'>Gear</h2>
        <div className='flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 text-[14px] md:text-[24px]'>

          {/* Timeline */}
          <div className="space-y-2 font-mono">
            {[
              ['2025', 'Canon AE-1'],
              ['2024', 'Pentax T7'],
              ['2022', 'Minolta SR-T 16'],
              ['2021', 'ZENIT 11'],
              ['2019', 'FED 5'],
            ].map(([year, model], index) => (
              <div key={year} className="relative py-2">
                <div className="flex items-center gap-2 sm:gap-4">
                  {/* Responsive year column, ~6ch = space for 4-digit year plus dash */}
                  <span className="min-w-[6ch] shrink-0">{year}</span>
                  <span className="w-full">{model}</span>
                </div>

                {/* Underlines */}
                {index === 0 ? (
                  <div className="absolute left-0 right-0 -bottom-1 h-px bg-[var(--secondary)]" />
                ) : (
                  <div className="absolute left-[6ch] right-0 -bottom-1 h-px bg-[var(--secondary)]" />
                )}
              </div>
            ))}
          </div>



          {/* Gear Story */}
          <div className='leading-relaxed space-y-4'>
            <p>
              I started my film photography journey with a 1€ copy — an old USSR restored rangefinder camera called FED 5. Took me a whole summer to get it all to work. I rode it until the gears broke, using nothing but 50mm with their rangefinder, rather than with a 35mm SLR ZENIT 11.
            </p>
            <p>
              In 2022, the whole new story began with a 35mm lens of Minolta SR-T. I was impressed by their image sharpness and realization that the gear really shapes how you see. Eventually the Pentax T7 followed, and then Canon AE-1 for color experiments.
            </p>
            <p>
              And a recent update – Canon AE-1 – an electronic SLR using the aperture vs. automatic exposure. Something new to me, looking forward to the first roll developed and scanned.
            </p>
          </div>
        </div>
      </div>


    </section>
  );
};

export default AboutContent;
