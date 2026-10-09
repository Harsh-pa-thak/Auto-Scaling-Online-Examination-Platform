// Reusable loading spinner with size variants
const sizes = {
  xs:  'h-3 w-3 border',
  sm:  'h-4 w-4 border-2',
  md:  'h-6 w-6 border-2',
  lg:  'h-8 w-8 border-[3px]',
  xl:  'h-12 w-12 border-4',
}

export default function LoadingSpinner({ size = 'md', className = '' }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block rounded-full border-zinc-700 border-t-amber-500 animate-spin ${sizes[size]} ${className}`}
    />
  )
}
