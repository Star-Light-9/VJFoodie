/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'food-orange': '#FF6B35',
        'food-green': '#4ECDC4',
        'food-yellow': '#FFE66D',
        'food-dark': '#2C3E50',
      },
    },
  },
  plugins: [],
}

