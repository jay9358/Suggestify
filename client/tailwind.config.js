/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0EA5A4',
          dark: '#0D9488',
          light: '#14B8A6'
        }
      }
    },
  },
  plugins: [],
}

