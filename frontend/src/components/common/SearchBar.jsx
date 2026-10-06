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
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="input-base pl-9 pr-8 w-full"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
