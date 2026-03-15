'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // Hydration-safe media query
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // If not mounted yet, render without motion to avoid hydration mismatch
  if (!isMounted) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={{
        y: 30,
        opacity: 0
      }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        ease: [0.33, 1, 0.68, 1], // Custom cubic-bezier for a smoother 'slide up' feel
        duration: 0.6
      }}
    >
      {children}
    </motion.div>
  );
}