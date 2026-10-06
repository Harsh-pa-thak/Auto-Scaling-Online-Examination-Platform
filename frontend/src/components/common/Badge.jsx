const variants = {
  default: 'bg-zinc-800 text-zinc-300 border border-zinc-700/60',
  primary: 'bg-amber-950/60 text-amber-300 border border-amber-800/60',
  success: 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60',
  warning: 'bg-amber-950/60 text-amber-300 border border-amber-800/60',
  danger:  'bg-red-950/60 text-red-300 border border-red-800/60',
  info:    'bg-zinc-800 text-zinc-300 border border-zinc-700/60',
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1 text-sm',
}

const dotColors = {
  default: 'bg-zinc-400',
  primary: 'bg-amber-400',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger:  'bg-red-400',
  info:    'bg-zinc-400',
}

/**
 * Badge component — inline label/status indicator
 *
 * @param {string}  variant   - default | primary | success | warning | danger | info
 * @param {string}  size      - sm | md | lg
 * @param {boolean} dot       - show a coloured status dot before the text
 * @param {string}  className - extra classes
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap',
        variants[variant] ?? variants.default,
        sizes[size] ?? sizes.md,
        className,
      ].join(' ')}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={`inline-block h-1.5 w-1.5 rounded-full flex-shrink-0 ${dotColors[variant] ?? dotColors.default}`}
        />
      )}
      {children}
    </span>
  )
}
