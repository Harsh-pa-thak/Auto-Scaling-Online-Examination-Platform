/**
 * Skeleton — shimmering placeholder for loading states.
 *
 * @param {string}  variant   - text | circle | block (default: text)
 * @param {string}  className - sizing classes, e.g. 'h-4 w-32'
 */
export default function Skeleton({ variant = 'text', className = '' }) {
  const shape =
    variant === 'circle' ? 'rounded-full' : variant === 'block' ? 'rounded-lg' : 'rounded-md'

  return (
    <span
      aria-hidden="true"
      className={`relative block overflow-hidden bg-sunken skeleton-shimmer ${shape} ${className}`}
    />
  )
}
