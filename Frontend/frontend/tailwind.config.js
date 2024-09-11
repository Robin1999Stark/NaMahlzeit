/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
      transitionProperty: {
        'height': 'height'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

