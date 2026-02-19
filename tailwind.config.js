/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ed: {
          bg: '#f7f5f2',
          surface: '#f0ede8',
          card: '#ffffff',
          elevated: '#ece9e4',
          tp: '#1c1917',
          ts: '#6b6460',
          tm: '#a8a09a',
          accent: '#1e40af',
          ah: '#1e3a8a',
          ad: '#dbeafe',
          border: '#e4e0da',
          bl: '#d6d0c8',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        ui: ['Syne', 'sans-serif'],
        body: ['Lora', 'Georgia', 'serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out both',
        'fade-in': 'fadeIn 0.5s ease-out both',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
