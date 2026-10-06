/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        // Primary non-blue accent: Warm Amber
        primary: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Dark neutral hierarchy
        dark: {
          bg: '#09090b',        // main dark background (zinc-950)
          surface: '#121215',   // slightly lighter surface
          card: '#18181b',      // card surface (zinc-900)
          elevated: '#27272a',  // elevated surface (zinc-800)
          border: '#27272a',    // border color
          muted: '#a1a1aa',     // text muted
        },
      },
      boxShadow: {
        card: 'none',
        'card-md': 'none',
      },
    },
  },
  plugins: [],
}
