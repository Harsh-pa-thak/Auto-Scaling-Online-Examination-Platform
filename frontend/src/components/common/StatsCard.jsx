import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'

/**
 * StatsCard component — KPI display card for dashboards and summaries
 *
 * @param {string}        title        - Metric title (e.g. 'Active Exams')
 * @param {string|number} value        - Metric value (e.g. '24' or '83.2%')
 * @param {string}        change       - Trend value (e.g. '+12.5%')
 * @param {string}        changeType   - 'positive' | 'negative' | 'neutral'
 * @param {string}        changeLabel  - Subtitle next to change (e.g. 'vs last month')
 * @param {ReactNode}     icon         - Lucide icon element
 * @param {string}        iconBg       - Tailwind background color for icon container
 * @param {string}        iconColor    - Tailwind color for icon
 * @param {string}        description  - Optional descriptive footer
 */
export default function StatsCard({
  title,
  value,
  change,
  changeType,
  changeLabel = 'vs last month',
  icon,
  iconBg = 'bg-primary-50',
  iconColor = 'text-primary-600',
  description,
  className = '',
}) {
  // Infer trend type if not explicitly passed
  const trend =
    changeType ||
    (typeof change === 'string' && change.startsWith('+')
      ? 'positive'
      : typeof change === 'string' && change.startsWith('-')
      ? 'negative'
      : 'neutral')

  return (
    <div
      className={`card p-5 transition-shadow duration-150 hover:shadow-card-md ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        {icon && (
          <div
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor} shadow-sm border border-black/5`}
          >
            {icon}
          </div>
        )}
      </div>

      {(change || description) && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {change && (
            <div className="flex items-center gap-1.5 font-medium">
              <span
                className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-semibold ${
                  trend === 'positive'
                    ? 'bg-emerald-50 text-emerald-700'
                    : trend === 'negative'
                    ? 'bg-red-50 text-red-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {trend === 'positive' && <ArrowUpRight size={13} />}
                {trend === 'negative' && <ArrowDownRight size={13} />}
                {trend === 'neutral' && <Minus size={13} />}
                {change}
              </span>
              {changeLabel && <span className="text-slate-400">{changeLabel}</span>}
            </div>
          )}

          {description && (
            <span className="text-slate-500 truncate">{description}</span>
          )}
        </div>
      )}
    </div>
  )
}
