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
            I&apos;m Kristina Bekher, a Ukrainian film photographer.
          </p>
          <p>
            I mix street, nature, architecture and many aspects of everyday life. I like shooting anything that seems interesting and experimenting with light, gear, and color.
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

      {/* // TODO: Selected Galleries */}

      {/* Gear Timeline */}
      <div className='mb-24'>
        <h2 className='text-3xl md:text-4xl uppercase mb-6'>Gear</h2>
        <div className='flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 text-[14px] md:text-[24px]'>

          {/* Timeline TODO: sticky on Desktop*/}
          <div className="space-y-2 font-mono">
            {[
              ['2025', 'Canon AE-1'],
              ['2024', 'Pentax 17'],
              ['2022', 'Minolta SR-1s'],
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
              My first ever film camera was an old rangefinder, the FED 5. It took me some time to get used to it, but eventually, I was shooting with it up until 2022, and I did much better with the rangefinder than with SLRs.
            </p>
            <p>
              In 2022, a new chapter began with the Japanese Minolta SR-1s. I was really impressed by the shots I got and realized that the older gear I&apos;d been using does have its limits. That same year, the Pentax 17 was announced by Asahi Optical, and I&apos;d been looking forward to it ever since.
            </p>
            <p>
              When the Pentax 17 finally came out, I soon found myself unboxing my first &lsquo;new&rsquo; camera. I loved its small size and cool design. And even though I like setting the aperture manually, Pentax still lets me experiment with exposure, modes, and focus — which takes some getting used to.
            </p>
            <p>
              Recently, my friends added a Canon AE-1 to my kit. With its automatic aperture exposure, I worry less about missing moments. Paired with a Rolev M.G. 55mm Skylight filter on the lens, the images I&apos;m getting are absolutely incredible. Still exploring...            </p>
          </div>
        </div>
      </div>


    </section>
  );
};

export default AboutContent;
