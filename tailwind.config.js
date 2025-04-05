/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{html,js,jsx,ts,tsx}', './components/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      },
      maxWidth: {
        '1680': '1680px',
      },
      animation: {
        'fadeOut': 'fadeOut ease-out',
      },
      // zIndex: {
      //   '-1': '-1',
      // },
      // translate: {
      //   '-1/2': '-50%',
      // },
      transitionProperty: {
        'smooth': 'color, background-color, border-color, opacity, transform',
      },
      transitionTimingFunction: {
        'smooth': 'ease-in-out',
      },
      transitionDuration: {
        'smooth': '300ms',
      },
    },
  },
  plugins: [],
};