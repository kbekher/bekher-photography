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

export const getImageMotionScale = (scale = 1.05, once = false) => ({
  initial: { opacity: 0.6, scale },
  whileInView: { opacity: 1, scale: 1 },
  transition: { duration: 0.8, delay:0.2, ease: 'easeOut' },
  viewport: { once },
});
