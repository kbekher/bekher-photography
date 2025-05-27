"use client";

import Link from 'next/link';
import ContactLinks from './ContactLinks';
import { navLinks } from "@/constants/constants";
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';

const Footer = () => {
  const pathname = usePathname();

  const isMobile = useMediaQuery({ maxWidth: 767 });

  if (pathname.startsWith('/galleries/')) return null;

  return (
    <footer className="bg-[var(--secondary)] text-[var(--branding)] w-full p-5 md:pb-2 text-[24px] leading-[28px] tracking-tighter overflow-hidden">
      <div className="grid gap-5 grid-cols-4 grid-rows-2 md:pt-[80px] flex-col justify-center">

        <div className="row-start-3 md:row-start-1 col-span-full md:col-span-2">
          <p className='text-[14px] md:text-[24px] w-max' data-cursor="text">©2025 Kristina Bekher</p>
        </div>

        <div className='flex gap-20 col-span-4 md:col-span-2 row-start-2 md:row-start-1'>
          <div className="flex flex-col w-[50%]">
            {navLinks.map(({ name, href }) => (
              <Link
                key={name}
                href={href}
                className='w-max custom-transition hover:text-[var(--accent)]'
                data-cursor="text"
              >{name}</Link>
            ))}
          </div>

          <ContactLinks isFooter={true} />
        </div>

        <motion.div
          className="w-auto h-full flex items-end col-span-full row-start-1 md:row-start-3"
          initial={{ opacity: 1, y: isMobile ? 0 : 50, x: isMobile ? -100 : 0 }}
          whileInView={{ opacity: 1, y: 0, x: 0}}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <p className="uppercase bold leading-[100%] custom-text">RUN. SHOOT. DEVELOP.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;