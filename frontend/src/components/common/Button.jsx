import LoadingSpinner from './LoadingSpinner'

// Amber is the only accent. `success` and `warning` are kept as aliases so
// existing call sites keep working, but they render as the standard buttons.
const variants = {
  primary:   'bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400 active:bg-amber-600 focus:ring-amber-500',
  secondary: 'bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700 hover:text-zinc-100 focus:ring-amber-500',
  danger:    'bg-red-600 text-white hover:bg-red-500 active:bg-red-700 focus:ring-red-500',
  ghost:     'bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 active:bg-zinc-700 focus:ring-zinc-600',
  link:      'bg-transparent text-amber-400 hover:text-amber-300 underline-offset-4 hover:underline focus:ring-amber-500 p-0',
}
variants.success = variants.primary
variants.warning = variants.primary

const sizes = {
  xs: 'px-2.5 py-1 text-xs gap-1',
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-base gap-2',
  xl: 'px-6 py-3 text-base gap-2',
}

/**
 * Button component
 *
 * @param {string}    variant    - primary | secondary | danger | ghost | link (success/warning alias primary)
 * @param {string}    size       - xs | sm | md | lg | xl
 * @param {boolean}   loading    - shows spinner and disables the button
 * @param {boolean}   disabled   - disables the button
 * @param {boolean}   fullWidth  - makes button 100% wide
 * @param {ReactNode} leftIcon   - icon to show on the left
 * @param {ReactNode} rightIcon  - icon to show on the right
 * @param {string}    type       - HTML button type (button | submit | reset)
 * @param {string}    className  - additional Tailwind classes
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  type = 'button',
  onClick,
  className = '',
}) {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-medium rounded-lg',
        'transition-colors duration-150',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 ring-offset-zinc-950',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant] ?? variants.primary,
        variant === 'link' ? '' : sizes[size] ?? sizes.md,
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
    >
      {loading ? (
        <LoadingSpinner size="sm" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}

      {children}

      {rightIcon && !loading && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  )
}
