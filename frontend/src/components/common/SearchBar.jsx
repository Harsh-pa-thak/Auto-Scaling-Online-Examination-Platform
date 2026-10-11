import { Search, X } from 'lucide-react'

/**
 * SearchBar component
 *
 * @param {string}   value       - controlled value
 * @param {Function} onChange    - (value: string) => void
 * @param {string}   placeholder - input placeholder
 * @param {string}   className   - extra wrapper classes
 */
export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search…',
  className = '',
}) {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={15}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-4"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="input-base w-full pl-9 pr-8"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-4 transition-colors duration-fast hover:text-ink-2"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
