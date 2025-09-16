/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'confirmed': '#10b981',
        'to-organize': '#f59e0b',
        'cancelled': '#ef4444',
        'searching': '#3b82f6'
      }
    },
  },
  plugins: [],
}