"use client";

import React, { useState, useEffect } from "react";
import { TransitionLink } from "./TransitionLink";
import ContactLinks from './ContactLinks';
import { navLinks } from "@/constants/constants";
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';

const Footer = () => {
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    setIsMounted(true);
  }, []);


  return (
    <footer
      className="bg-[var(--secondary)] text-[var(--branding)] w-full p-5 md:pb-2 text-[16px] md:text-2xl md:leading-auto tracking-tighter overflow-hidden"
      aria-label="Site footer"
    >
      <div className="flex flex-col-reverse md:grid gap-5 grid-cols-4 grid-rows-3 md:grid-rows-2 md:pt-[80px]">

        <div className="row-start-3 md:row-start-1 col-span-full md:col-span-2">
          <p className='text-sm md:text-2xl w-max' data-cursor="text">
            ©2026 Kristina Bekher
          </p>
        </div>

        <div className='flex gap-4 md:gap-20 md:col-span-2 md:row-start-1'>
          <div className="flex flex-col w-[50%]">
            {navLinks.map(({ name, href }) => (
              <TransitionLink
                key={name}
                href={href}
                className='w-max custom-transition'
                dataCursor="text"
              >{name}</TransitionLink>
            ))}
          </div>

          <ContactLinks isFooter={true} />
        </div>

        <div className="col-span-full row-start-1 md:row-start-2 md:pt-4 overflow-hidden">
          {isMounted && (
            <motion.div
              initial={isMobile ? { y: 0 } : { y: 100 }}
              whileInView={{ y: 0 }}
              transition={isMobile ? { duration: 0 } : {
                duration: 0.3,
                ease: [0.33, 1, 0.68, 1]
              }}
              viewport={{ once: true, amount: 0.1 }}
            >
              <p className="uppercase bold leading-[100%] custom-text" data-cursor="text">RUN. SHOOT. DEVELOP.</p>
            </motion.div>
          )}
          {!isMounted && (
            <p className="uppercase bold leading-[100%] custom-text" data-cursor="text">RUN. SHOOT. DEVELOP.</p>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;