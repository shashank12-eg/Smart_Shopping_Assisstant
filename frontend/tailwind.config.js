/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#090d16',
          card: 'rgba(15, 23, 42, 0.75)',
          border: 'rgba(255, 255, 255, 0.08)',
          accent: '#06b6d4',
          highlight: '#6366f1',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
        }
      }
    },
  },
  plugins: [],
}
