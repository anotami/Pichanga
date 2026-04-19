/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        peru: { 50: '#fff1f1', 100: '#ffe1e1', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 900: '#7f1d1d' }
      }
    }
  },
  plugins: []
}
