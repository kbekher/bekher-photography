'use client';

import { motion} from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isGalleryPage = pathname.indexOf('/galleries/') !== -1;
  const isDesktop = useMediaQuery({ minWidth: 1280 });

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
      <motion.div
        key={pathname}
        initial={{
          y: isDesktop && isGalleryPage ? 0 : 20,
          x: isDesktop && isGalleryPage ? 20 : 0,
          opacity: 0
        }}
        animate={{ y: 0, x: 0, opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ ease: 'easeIn', duration: 0.8, delay: isDesktop && isGalleryPage ? 0.2 : 0 }}
      >
        {children}
      </motion.div>
  );
}