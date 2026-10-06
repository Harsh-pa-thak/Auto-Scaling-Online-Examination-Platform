import { Inbox } from 'lucide-react'

/**
 * EmptyState component — displays friendly empty state when list or table has no items
 *
 * @param {ReactNode} icon        - custom icon component
 * @param {string}    title       - main heading
 * @param {string}    message     - descriptive subtitle
 * @param {ReactNode} action      - optional action button or link
 * @param {string}    className   - extra styling
 */
export default function EmptyState({
  icon,
  title = 'No items found',
  message,
  action,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800/80 text-zinc-400 mb-4 border border-zinc-700/60 shadow-sm">
        {icon || <Inbox size={26} className="text-zinc-500" />}
      </div>
      <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
      {message && (
        <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed">
          {message}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
