import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'

const config = {
  success: {
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    borderColor: 'border-emerald-200',
    bgBadge: 'bg-emerald-50',
  },
  error: {
    icon: AlertCircle,
    iconColor: 'text-red-500',
    borderColor: 'border-red-200',
    bgBadge: 'bg-red-50',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    borderColor: 'border-amber-200',
    bgBadge: 'bg-amber-50',
  },
  info: {
    icon: Info,
    iconColor: 'text-primary-500',
    borderColor: 'border-primary-200',
    bgBadge: 'bg-primary-50',
  },
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
      className={`pointer-events-auto flex w-80 max-w-sm items-start gap-3 rounded-xl border ${current.borderColor} bg-white p-3.5 shadow-lg shadow-slate-200/50 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2`}
    >
      <div className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${current.bgBadge}`}>
        <IconComponent size={16} className={current.iconColor} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        {message && <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{message}</p>}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="ml-auto -mr-1 -mt-1 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
