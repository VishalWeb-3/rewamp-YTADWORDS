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
          red: '#E53935',
          'red-dark': '#C62828',
          green: '#22C55E',
          'green-light': '#DCFCE7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'dot-pattern': 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-pattern': '20px 20px',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'scroll-infinite': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-25%)' },
        },
      },
      animation: {
        scroll: 'scroll 25s linear infinite',
        'scroll-infinite': 'scroll-infinite 40s linear infinite',
      },
    },
  },
  plugins: [],
}
