import { useState } from 'react'

const sizes = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-9 w-9 text-xs',
  lg: 'h-11 w-11 text-sm',
  xl: 'h-14 w-14 text-base',
}

const statusColors = {
  online: 'bg-emerald-500',
  offline: 'bg-zinc-600',
  busy: 'bg-red-500',
  away: 'bg-amber-500',
}

const statusSizes = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-3.5 w-3.5',
}

// Generate consistent background tint from initials/name
function getInitialsColor(name = '') {
  return 'bg-zinc-800 text-amber-400 border border-zinc-700/80'
}

function getInitials(name = '') {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Avatar component — displays user avatar with initials fallback
 *
 * @param {string} name      - User's name
 * @param {string} src       - Image URL
 * @param {string} size      - xs | sm | md | lg | xl (default: 'md')
 * @param {string} status    - online | offline | busy | away
 */
export default function Avatar({
  name = '',
  src,
  size = 'md',
  status,
  className = '',
}) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = src && !imageFailed

  return (
    <div className={`relative inline-flex flex-shrink-0 select-none ${className}`}>
      {showImage ? (
        <img
          src={src}
          alt={name}
          onError={() => setImageFailed(true)}
          className={`rounded-full object-cover ring-2 ring-zinc-800 ${sizes[size]}`}
        />
      ) : (
        <div
          className={`inline-flex items-center justify-center rounded-full font-semibold ring-2 ring-zinc-800 ${
            sizes[size]
          } ${getInitialsColor(name)}`}
          aria-label={name}
        >
          {getInitials(name)}
        </div>
      )}

      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-2 ring-zinc-950 ${
            statusSizes[size]
          } ${statusColors[status] || statusColors.offline}`}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  )
}
