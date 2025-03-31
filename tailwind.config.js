/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{html,js,jsx,ts,tsx}', './components/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        // 'gradient-animation': {
        //   '0%': { backgroundPosition: '0% 50%' },
        //   '25%': { backgroundPosition: '50% 50%' },
        //   '50%': { backgroundPosition: '100% 50%' },
        //   '75%': { backgroundPosition: '50% 50%' },
        //   '100%': { backgroundPosition: '0% 50%' },
        // },
      },
      maxWidth: {
        '1680': '1680px',
      },
      // animation: {
      //   'gradient-animation': 'gradient-animation ease-in-out infinite',
      // },
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