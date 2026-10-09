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
      <div className="mb-4 text-zinc-500">
        {icon || <Inbox size={28} />}
      </div>
      <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
      {message && (
        <p className="mt-2 max-w-sm text-sm text-zinc-400">
          {message}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
