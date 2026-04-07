/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'food-orange': '#F97316', // Deep Orange
        'food-green': '#10B981', // Professional Emerald instead of pastel
        'food-yellow': '#F59E0B', // Muted Amber
        'food-dark': '#1E293B', // Dark Slate
        'food-surface': '#F8FAFC',
        'food-surface-alt': '#F1F5F9',
      },
    },
  },
  plugins: [],
}

