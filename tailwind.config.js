/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'sire-midnight': '#030712',
        'sire-ink': '#0f172a',
        'neon-blue': '#00f0ff',
        'neon-purple': '#bc13fe',
        'neon-green': '#0aff68',
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 240, 255, 0.3)',
        'glow-purple': '0 0 20px rgba(188, 19, 254, 0.3)',
      },
      backgroundImage: {
        'scifi-gradient': 'linear-gradient(to right, #00f0ff, #bc13fe)',
      }
    },
  },
  plugins: [],
};
