"use client";

import ContactLinks from './ContactLinks';
import TransitionLink from './TransitionLink';
import { navLinks } from "@/constants/constants";

const Footer = () => {
  return (
    <footer className="bg-[var(--branding)] text-[var(--secondary)] w-full p-5 md:pb-2 text-[24px] font-bold leading-[28px] overflow-hidden">
      <div className="grid gap-5 grid-cols-4 grid-rows-2 md:pt-[80px] flex-col justify-center">

        <div className="row-start-3 md:row-start-1 col-span-2">
          <p className='text-[14px] md:text-[24px]'>©2025 Kristina Bekher</p>
        </div>

        <div className='flex gap-20 col-span-4 md:col-span-2 row-start-2 md:row-start-1'>
          <div className="flex flex-col w-[50%]">
            {navLinks.map(({ name, href }) => (
              <TransitionLink 
                key={name}
                href={href}
                className='w-max custom-transition hover:text-[var(--accent)]'
              >{name}</TransitionLink>
            ))}
          </div>

          <ContactLinks isFooter={true} />
        </div>

        <div className="w-auto h-full flex items-end col-span-full row-start-1 md:row-start-3">
          <p className="uppercase bold leading-[100%] custom-text">RUN. SHOOT. DEVELOP.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;