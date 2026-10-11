import LoadingSpinner from './LoadingSpinner'

// Amber is the only accent. `success` and `warning` are kept as aliases so
// existing call sites keep working, but they render as the standard buttons.
const variants = {
  primary:   'bg-accent text-accent-ink font-semibold shadow-xs hover:bg-accent/90 active:bg-accent/80',
  secondary: 'bg-surface text-ink-2 border border-line shadow-xs hover:border-line-strong hover:bg-sunken hover:text-ink active:bg-sunken/80',
  danger:    'bg-danger text-white font-medium shadow-xs hover:bg-danger/90 active:bg-danger/80',
  ghost:     'bg-transparent text-ink-3 hover:bg-sunken hover:text-ink active:bg-sunken/80',
  link:      'bg-transparent text-accent-strong hover:text-accent-strong/75 underline-offset-4 hover:underline p-0',
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
        'inline-flex items-center justify-center font-medium rounded-md',
        'transition duration-fast ease-standard active:scale-[0.98]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
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
