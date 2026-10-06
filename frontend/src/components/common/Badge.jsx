const variants = {
  default: 'bg-slate-100 text-slate-700',
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger:  'bg-red-100 text-red-700',
  info:    'bg-blue-100 text-blue-700',
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1 text-sm',
}

const dotColors = {
  default: 'bg-slate-500',
  primary: 'bg-primary-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger:  'bg-red-500',
  info:    'bg-blue-500',
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
