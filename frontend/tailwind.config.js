/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      // One typeface for the whole UI (loaded in index.html).
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      // Body sizes sit at 1.5–1.6 line-height; display sizes stay tighter.
      fontSize: {
        xs:   ['0.75rem',  { lineHeight: '1.125rem' }], // 12 / 18  = 1.5
        sm:   ['0.875rem', { lineHeight: '1.375rem' }], // 14 / 22  ≈ 1.57
        base: ['1rem',     { lineHeight: '1.6rem' }],   // 16 / 25.6 = 1.6
        lg:   ['1.125rem', { lineHeight: '1.75rem' }],  // 18 / 28  ≈ 1.56
        xl:   ['1.25rem',  { lineHeight: '1.75rem' }],  // 20 / 28  = 1.4
        '2xl': ['1.5rem',  { lineHeight: '2rem' }],     // 24 / 32  ≈ 1.33
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30 / 36  = 1.2
      },
    },
  },
  plugins: [],
}
