// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // For your main HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // For all JS, TS, JSX, TSX files in the src folder
  ],
  theme: {
    extend: {
      colors: {
        'scratchie-orange': '#F97115',
        'scratchie-green': '#4DB360',
        'scratchie-bright-green': '#10B981',
        'scratchie-text-dark': '#170E0A',
        'scratchie-text-gray': '#4A5568',
        'scratchie-text-light-gray': '#718096',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}