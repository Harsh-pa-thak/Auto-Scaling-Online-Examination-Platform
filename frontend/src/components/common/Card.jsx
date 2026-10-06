/**
 * Card component — generic white rounded container
 *
 * @param {string}    title        - optional card title
 * @param {ReactNode} headerAction - optional element in the card header right side
 * @param {string}    padding      - Tailwind padding class (default: 'p-5')
 * @param {boolean}   hoverable    - adds hover shadow transition
 * @param {string}    className    - additional classes
 */
export default function Card({
  children,
  title,
  headerAction,
  padding = 'p-5',
  hoverable = false,
  className = '',
}) {
  const hasHeader = title || headerAction

  return (
    <div
      className={[
        'card overflow-hidden',
        hoverable ? 'transition-shadow duration-150 hover:shadow-card-md cursor-pointer' : '',
        className,
      ].join(' ')}
    >
      {hasHeader && (
        <div
          className={[
            'flex items-center justify-between border-b border-zinc-800',
            padding,
            'pb-4',
          ].join(' ')}
        >
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
