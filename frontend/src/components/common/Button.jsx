import LoadingSpinner from './LoadingSpinner'

const variants = {
  primary:   'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus:ring-primary-500 shadow-sm',
  secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 active:bg-slate-100 focus:ring-primary-500 shadow-sm',
  danger:    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 shadow-sm',
  ghost:     'bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200 focus:ring-slate-300',
  success:   'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 focus:ring-emerald-500 shadow-sm',
  warning:   'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 focus:ring-amber-400 shadow-sm',
  link:      'bg-transparent text-primary-600 hover:text-primary-800 underline-offset-4 hover:underline focus:ring-primary-500 p-0',
}

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs gap-1',
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-base gap-2',
  xl: 'px-6 py-3 text-base gap-2.5',
}

/**
 * Button component
 *
 * @param {string}    variant    - primary | secondary | danger | ghost | success | warning | link
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
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
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
