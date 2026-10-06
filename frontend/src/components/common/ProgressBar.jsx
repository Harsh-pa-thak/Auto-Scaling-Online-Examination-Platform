const heights = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

const variants = {
  primary: 'bg-primary-600',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger:  'bg-red-500',
  slate:   'bg-slate-500',
}

/**
 * ProgressBar component
 *
 * @param {number}  value          - Current value
 * @param {number}  max            - Maximum value (default: 100)
 * @param {string}  label          - Optional label displayed above the bar
 * @param {boolean} showPercentage - Show percentage text next to label or bar
 * @param {string}  size           - xs | sm | md | lg (default: 'md')
 * @param {string}  variant        - primary | success | warning | danger | slate
 */
export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  showPercentage = false,
  size = 'md',
  variant = 'primary',
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)))

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1.5">
          {label && <span>{label}</span>}
          {showPercentage && (
            <span className="text-slate-500 ml-auto">{percentage}%</span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={`w-full bg-slate-100 rounded-full overflow-hidden ${heights[size] || heights.md}`}
      >
        <div
          style={{ width: `${percentage}%` }}
          className={`h-full rounded-full transition-all duration-300 ease-out ${
            variants[variant] || variants.primary
          }`}
        />
      </div>
    </div>
  )
}
