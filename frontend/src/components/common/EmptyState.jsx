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
    <div className={`flex flex-col items-center justify-center px-4 py-12 text-center ${className}`}>
      <div className="mb-4 text-ink-4">
        {icon || <Inbox size={28} />}
      </div>
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      {message && (
        <p className="mt-2 max-w-sm text-sm text-ink-3">
          {message}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
