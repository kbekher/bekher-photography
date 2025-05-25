'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isGalleryPage = pathname.startsWith('/galleries/');

  return (
    <motion.div
      initial={{ y: isGalleryPage ? 0 : 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ ease: 'easeIn', duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
}