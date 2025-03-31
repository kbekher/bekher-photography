'use client';

import React from 'react';
import { motion, useIsPresent } from "framer-motion";

const TransitionLayer = () => {
  const isPresent = useIsPresent();

  // TODO: fine for now, fix later
  return (
    <motion.div
      initial={{ scaleX: 1 }}
      animate={{ scaleX: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      exit={{ scaleX: 1, transition: { duration: 0.8, ease: "easeInOut" } }}
      style={{ originX: isPresent ? 0 : 1 }}
      className="fixed top-0 left-0 right-0 bottom-0 bg-[var(--accent)] z-50"
    />
  );
};

export default TransitionLayer;
