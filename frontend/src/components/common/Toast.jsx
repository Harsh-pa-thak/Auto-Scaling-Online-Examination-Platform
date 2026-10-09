import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'

const config = {
  success: { icon: CheckCircle2,  iconColor: 'text-emerald-400' },
  error:   { icon: AlertCircle,   iconColor: 'text-red-400' },
  warning: { icon: AlertTriangle, iconColor: 'text-amber-400' },
  info:    { icon: Info,          iconColor: 'text-zinc-400' },
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
      className="pointer-events-auto flex w-80 max-w-sm items-start gap-3 rounded-xl border border-zinc-700 bg-zinc-900 p-4"
    >
      <IconComponent size={18} className={`mt-0.5 flex-shrink-0 ${current.iconColor}`} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-100">{title}</p>
        {message && <p className="mt-1 text-xs text-zinc-400">{message}</p>}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="-mr-1 -mt-1 rounded-lg p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
