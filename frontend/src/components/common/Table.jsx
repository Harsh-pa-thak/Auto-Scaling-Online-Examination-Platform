import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'
import EmptyState from './EmptyState'

/**
 * Table component
 *
 * @param {Array}   columns   - [{ key, label, sortable?, render?, width?, align? }]
 * @param {Array}   data      - array of row objects
 * @param {boolean} loading   - shows loading overlay
 * @param {string}  emptyTitle   - empty state title
 * @param {string}  emptyMessage - empty state message
 * @param {string}  rowKey    - field to use as React key (default: 'id')
 * @param {Function} onRowClick - called with row when row is clicked
 */
export default function Table({
  columns = [],
  data = [],
  loading = false,
  emptyTitle = 'No data found',
  emptyMessage = '',
  rowKey = 'id',
  onRowClick,
  className = '',
}) {
  const [sortKey, setSortKey]   = useState(null)
  const [sortDir, setSortDir]   = useState('asc') // 'asc' | 'desc'

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const va = a[sortKey] ?? ''
    const vb = b[sortKey] ?? ''
    const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true })
    return sortDir === 'asc' ? cmp : -cmp
  })

  const alignClass = (align) => {
    if (align === 'right')  return 'text-right'
    if (align === 'center') return 'text-center'
    return 'text-left'
  }

  return (
    <div className={`relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 ${className}`}>
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-950/70 backdrop-blur-[1px]">
          <LoadingSpinner size="lg" />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/90">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  style={col.width ? { width: col.width } : undefined}
                  className={[
                    'px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400',
                    alignClass(col.align),
                    col.sortable ? 'cursor-pointer select-none hover:text-zinc-200 hover:bg-zinc-800/60' : '',
                  ].join(' ')}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <span className="text-zinc-500">
                        {sortKey === col.key
                          ? sortDir === 'asc'
                            ? <ChevronUp size={13} />
                            : <ChevronDown size={13} />
                          : <ChevronDown size={13} className="opacity-40" />}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800">
            {!loading && sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12">
                  <EmptyState title={emptyTitle} message={emptyMessage} />
                </td>
              </tr>
            ) : (
              sorted.map((row) => (
                <tr
                  key={row[rowKey]}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={[
                    'transition-colors duration-100',
                    onRowClick ? 'cursor-pointer hover:bg-zinc-800/60' : 'hover:bg-zinc-800/30',
                  ].join(' ')}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={[
                        'px-4 py-3 text-zinc-200',
                        alignClass(col.align),
                      ].join(' ')}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
