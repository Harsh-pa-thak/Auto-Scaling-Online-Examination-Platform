import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'

/**
 * StatsCard component — KPI display card for dashboards and summaries
 *
 * @param {string}        title        - Metric title (e.g. 'Active Exams')
 * @param {string|number} value        - Metric value (e.g. '24' or '83.2%')
 * @param {string}        change       - Optional trend value backed by real data (e.g. '+12.5%')
 * @param {string}        changeType   - 'positive' | 'negative' | 'neutral'
 * @param {string}        changeLabel  - Text after the change (e.g. 'vs last month')
 * @param {ReactNode}     icon         - Lucide icon element (rendered muted)
 * @param {string}        description  - Optional one-line context under the value
 */
export default function StatsCard({
  title,
  value,
  change,
  changeType,
  changeLabel = 'vs last month',
  icon,
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

  const TrendIcon = trend === 'positive' ? ArrowUpRight : trend === 'negative' ? ArrowDownRight : Minus
  const trendColor =
    trend === 'positive' ? 'text-emerald-400' : trend === 'negative' ? 'text-red-400' : 'text-zinc-400'

  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow">{title}</p>
        {icon && <span className="flex-shrink-0 text-zinc-500">{icon}</span>}
      </div>

      <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums text-zinc-50">
        {value}
      </p>

      {description && (
        <p className="mt-1 text-sm text-zinc-400">{description}</p>
      )}

      {change && (
        <p className="mt-4 flex items-center gap-1 text-xs text-zinc-400">
          <span className={`inline-flex items-center gap-0.5 font-medium ${trendColor}`}>
            <TrendIcon size={14} />
            {change}
          </span>
          {changeLabel && <span>{changeLabel}</span>}
        </p>
      )}
    </div>
  )
}
