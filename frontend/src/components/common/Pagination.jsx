import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

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
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 text-sm text-zinc-300 ${className}`}
    >
      {/* Items count summary */}
      <div className="text-xs text-zinc-400 order-2 sm:order-1">
        {totalItems != null && startItem != null && endItem != null ? (
          <span>
            Showing <strong className="font-semibold text-zinc-200">{startItem}</strong> to{' '}
            <strong className="font-semibold text-zinc-200">{endItem}</strong> of{' '}
            <strong className="font-semibold text-zinc-200">{totalItems}</strong> entries
          </span>
        ) : (
          <span>
            Page <strong className="font-semibold text-zinc-200">{currentPage}</strong> of{' '}
            <strong className="font-semibold text-zinc-200">{totalPages}</strong>
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 order-1 sm:order-2">
        {/* Page size selector if enabled */}
        {pageSizeOptions && onPageSizeChange && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              aria-label="Rows per page"
              className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
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
        <nav aria-label="Pagination" className="inline-flex items-center -space-x-px rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
            className="inline-flex items-center px-2.5 py-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          {getPageNumbers().map((p, idx) =>
            p === '...' ? (
              <span
                key={`ellipsis-${idx}`}
                className="inline-flex items-center px-3 py-1.5 text-xs text-zinc-500 select-none"
              >
                ...
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={p === currentPage ? 'page' : undefined}
                className={[
                  'inline-flex items-center px-3 py-1.5 text-xs font-medium transition-colors',
                  p === currentPage
                    ? 'bg-amber-500/10 text-amber-400 font-semibold'
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100',
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
            className="inline-flex items-center px-2.5 py-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </nav>
      </div>
    </div>
  )
}
