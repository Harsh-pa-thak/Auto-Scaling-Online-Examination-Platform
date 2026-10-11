/** @type {import('tailwindcss').Config} */

/*
 * Token layer — ExamPortal
 *
 * Every colour below resolves to a CSS variable defined in src/index.css
 * (`--canvas`, `--ink`, …). Pages must use these semantic names
 * (bg-surface, border-line, text-ink-2 …) instead of raw zinc values, so the
 * palette lives in exactly one place.
 *
 * Rhythm: 8px base grid (4px half-steps) — sections space-y-8, cards p-6,
 * in-card groups space-y-4/gap-4, label → control space-y-2.
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Surfaces
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        raised: 'rgb(var(--raised) / <alpha-value>)',
        sunken: 'rgb(var(--sunken) / <alpha-value>)',

        // Hairlines
        line: {
          DEFAULT: 'rgb(var(--line) / <alpha-value>)',
          strong: 'rgb(var(--line-strong) / <alpha-value>)',
        },

        // Text
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          2: 'rgb(var(--ink-2) / <alpha-value>)',
          3: 'rgb(var(--ink-3) / <alpha-value>)',
          4: 'rgb(var(--ink-4) / <alpha-value>)',
        },

        // The single accent — amber/copper. `ink` is the legible text colour
        // that sits on top of the solid accent fill.
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          strong: 'rgb(var(--accent-strong) / <alpha-value>)',
          soft: 'rgb(var(--accent-soft) / <alpha-value>)',
          ink: 'rgb(var(--accent-ink) / <alpha-value>)',
        },

        // Semantics — reserved for state, never decoration.
        success: {
          DEFAULT: 'rgb(var(--success) / <alpha-value>)',
          soft: 'rgb(var(--success-soft) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'rgb(var(--warning) / <alpha-value>)',
          soft: 'rgb(var(--warning-soft) / <alpha-value>)',
        },
        danger: {
          DEFAULT: 'rgb(var(--danger) / <alpha-value>)',
          soft: 'rgb(var(--danger-soft) / <alpha-value>)',
        },
        info: {
          DEFAULT: 'rgb(var(--info) / <alpha-value>)',
          soft: 'rgb(var(--info-soft) / <alpha-value>)',
        },
      },

      // A bare `border` / `ring-offset-*` now inherits the light theme.
      borderColor: { DEFAULT: 'rgb(var(--line) / <alpha-value>)' },
      ringOffsetColor: { DEFAULT: 'rgb(var(--canvas) / <alpha-value>)' },

      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },

      // Tightened line-heights for UI copy; display sizes get negative tracking
      // via the `tracking-*` utilities.
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],   // 11 / 16
        xs: ['0.75rem', { lineHeight: '1.125rem' }],    // 12 / 18
        sm: ['0.875rem', { lineHeight: '1.375rem' }],   // 14 / 22
        base: ['1rem', { lineHeight: '1.625rem' }],     // 16 / 26
        lg: ['1.125rem', { lineHeight: '1.75rem' }],    // 18 / 28
        xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.011em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.014em' }],
        '3xl': ['1.875rem', { lineHeight: '2.375rem', letterSpacing: '-0.018em' }],
        '4xl': ['2.375rem', { lineHeight: '2.75rem', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '3.375rem', letterSpacing: '-0.024em' }],
      },

      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '14px',
        xl: '18px',
        '2xl': '22px',
      },

      // Warm-tinted, low-opacity elevation. In light mode shadows stay quiet —
      // hairlines do most of the work.
      boxShadow: {
        xs: '0 1px 2px 0 rgb(28 25 23 / 0.05)',
        sm: '0 1px 3px 0 rgb(28 25 23 / 0.07), 0 1px 2px -1px rgb(28 25 23 / 0.05)',
        md: '0 4px 12px -2px rgb(28 25 23 / 0.08), 0 2px 4px -2px rgb(28 25 23 / 0.05)',
        lg: '0 12px 32px -8px rgb(28 25 23 / 0.14), 0 4px 8px -4px rgb(28 25 23 / 0.06)',
        xl: '0 24px 56px -16px rgb(28 25 23 / 0.2)',
      },

      // Motion — 150–250ms is the working range (Step 4).
      transitionDuration: {
        instant: '90ms',
        fast: '120ms',
        base: '180ms',
        slow: '240ms',
        slower: '320ms',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.2, 0.6, 0.2, 1)',
        emphasized: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'panel-in': {
          from: { opacity: '0', transform: 'translateY(4px) scale(0.985)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
        'fade-in': 'fade-in 180ms cubic-bezier(0.2, 0.6, 0.2, 1) both',
        'panel-in': 'panel-in 200ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'toast-in': 'toast-in 200ms cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
}
