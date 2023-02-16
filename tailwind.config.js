/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'oswald': ["Oswald"],
      },
    },
    container: {
      center: true,
      padding: '2rem',
    },
    colors: {
      black: '#020207',
      gray: '#3F4F57',
      beige: '#FFF7E8',
      pink: '#F9548E',
      darkgray: "#282A2D",
      white: '#FFFFFF',
    },
    fontFamily: {
      'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
      'serif': ['ui-serif', 'Georgia'],
      'mono': ['ui-monospace', 'SFMono-Regular'],
    }
  },
  plugins: [],
}
