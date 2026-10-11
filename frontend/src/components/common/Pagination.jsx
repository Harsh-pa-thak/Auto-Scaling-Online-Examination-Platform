import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Pagination component
 *
 * @param {number}   currentPage      - 1-based current page
 * @param {number}   totalPages       - Total number of pages
 * @param {Function} onPageChange     - (page) => void
 * @param {number}   totalItems       - Total items count (optional)
 * @param {number}   pageSize         - Items per page (optional)
 * @param {Array}    pageSizeOptions  - e.g. [10, 20, 50] (optional)
 * @param {Function} onPageSizeChange - (size) => void (optional)
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  className = '',
}) {
  if (totalPages <= 1 && !totalItems) return null

  // Calculate range of page numbers to show
  const getPageNumbers = () => {
    const pages = []
    const delta = 1 // adjacent pages

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...')
      }
    }
    return pages
  }

  const startItem = totalItems != null && pageSize != null ? (currentPage - 1) * pageSize + 1 : null
  const endItem =
    totalItems != null && pageSize != null
      ? Math.min(currentPage * pageSize, totalItems)
      : null

  return (
    <div
      className={`flex flex-col items-center justify-between gap-4 py-4 text-sm text-ink-2 sm:flex-row ${className}`}
    >
      {/* Items count summary */}
      <div className="order-2 text-xs text-ink-3 sm:order-1">
        {totalItems != null && startItem != null && endItem != null ? (
          <span>
            Showing <strong className="font-semibold tabular-nums text-ink">{startItem}</strong> to{' '}
            <strong className="font-semibold tabular-nums text-ink">{endItem}</strong> of{' '}
            <strong className="font-semibold tabular-nums text-ink">{totalItems}</strong> entries
          </span>
        ) : (
          <span>
            Page <strong className="font-semibold tabular-nums text-ink">{currentPage}</strong> of{' '}
            <strong className="font-semibold tabular-nums text-ink">{totalPages}</strong>
          </span>
        )}
      </div>

      <div className="order-1 flex items-center gap-3 sm:order-2">
        {/* Page size selector if enabled */}
        {pageSizeOptions && onPageSizeChange && (
          <div className="flex items-center gap-1.5 text-xs text-ink-3">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              aria-label="Rows per page"
              className="input-base w-auto px-2 py-1 text-xs"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Navigation buttons */}
        <nav aria-label="Pagination" className="inline-flex items-center overflow-hidden rounded-md border border-line bg-surface">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
            className="inline-flex items-center border-r border-line px-2.5 py-1.5 text-ink-3 transition-colors duration-fast hover:bg-sunken hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>

          {getPageNumbers().map((p, idx) =>
            p === '...' ? (
              <span
                key={`ellipsis-${idx}`}
                className="inline-flex select-none items-center px-3 py-1.5 text-xs text-ink-4"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={p === currentPage ? 'page' : undefined}
                className={[
                  'inline-flex items-center border-r border-line px-3 py-1.5 text-xs font-medium tabular-nums transition-colors duration-fast',
                  p === currentPage
                    ? 'bg-accent-soft font-semibold text-accent-strong'
                    : 'text-ink-2 hover:bg-sunken hover:text-ink',
                ].join(' ')}
              >
                {p}
              </button>
            )
          )}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
            className="inline-flex items-center px-2.5 py-1.5 text-ink-3 transition-colors duration-fast hover:bg-sunken hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </nav>
      </div>
    </div>
  )
}
