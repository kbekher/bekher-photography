export const textVariants = {
  open: {
    color: "#444251",
    opacity: 1,
    transition: { duration: 0.3 },
  },
  closed: {
    color: "#ffffff",
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

export const getImageMotionScale = (scale = 1.05, delay = 0.2, duration = 0.8) => ({
  initial: { opacity: 0.6, scale },
  whileInView: { opacity: 1, scale: 1 },
  transition: { duration, delay, ease: 'easeOut' },
  // viewport: { once: true },
});

export const imageHoverMotion = {
  whileHover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};
