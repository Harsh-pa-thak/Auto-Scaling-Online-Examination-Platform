import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'

const config = {
  success: { icon: CheckCircle2,  iconColor: 'text-success' },
  error:   { icon: AlertCircle,   iconColor: 'text-danger' },
  warning: { icon: AlertTriangle, iconColor: 'text-warning' },
  info:    { icon: Info,          iconColor: 'text-ink-3' },
}

/**
 * Toast notification item
 *
 * @param {string}   title   - Notification title
 * @param {string}   message - Optional detail message
 * @param {string}   type    - success | error | warning | info
 * @param {Function} onClose - Dismiss handler
 */
export default function Toast({ title, message, type = 'info', onClose }) {
  const current = config[type] || config.info
  const IconComponent = current.icon

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className="pointer-events-auto flex w-80 max-w-sm items-start gap-3 rounded-xl border border-line bg-surface p-4 shadow-lg animate-toast-in"
    >
      <IconComponent size={18} className={`mt-0.5 flex-shrink-0 ${current.iconColor}`} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink">{title}</p>
        {message && <p className="mt-1 text-xs text-ink-3">{message}</p>}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="-mr-1 -mt-1 rounded-md p-1 text-ink-4 transition-colors duration-fast hover:bg-sunken hover:text-ink-2"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
