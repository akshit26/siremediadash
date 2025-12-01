/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'sire-midnight': '#060b18',
        'sire-ink': '#0a1324',
      },
      boxShadow: {
        glow: '0 28px 120px rgba(64,123,255,0.28)',
      },
    },
  },
  plugins: [],
};
