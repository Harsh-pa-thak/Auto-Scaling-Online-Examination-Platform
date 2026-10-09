/**
 * Card component — flat surface container
 *
 * @param {string}    title        - optional card title
 * @param {ReactNode} headerAction - optional element in the card header right side
 * @param {string}    padding      - Tailwind padding class (default: 'p-6')
 * @param {boolean}   hoverable    - border highlight on hover
 * @param {string}    className    - additional classes
 */
export default function Card({
  children,
  title,
  headerAction,
  padding = 'p-6',
  hoverable = false,
  className = '',
}) {
  const hasHeader = title || headerAction

  return (
    <div
      className={[
        'card overflow-hidden',
        hoverable ? 'transition-colors duration-150 hover:border-zinc-700 cursor-pointer' : '',
        className,
      ].join(' ')}
    >
      {hasHeader && (
        <div className="flex items-center justify-between gap-4 border-b border-zinc-800 px-6 py-4">
          {title && (
            <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
          )}
          {headerAction && (
            <div className="flex items-center gap-2">{headerAction}</div>
          )}
        </div>
      )}

      <div className={padding}>{children}</div>
    </div>
  )
}
