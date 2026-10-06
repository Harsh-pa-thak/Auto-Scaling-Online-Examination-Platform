import { AlertCircle, RefreshCw } from 'lucide-react'
import Button from './Button'

/**
 * ErrorState component — displays clear feedback when a request or component fails
 *
 * @param {string}    title      - Error title
 * @param {string}    message    - Detailed description
 * @param {Function}  onRetry    - Optional retry handler
 * @param {string}    retryLabel - Label for the retry button
 * @param {ReactNode} icon       - Custom icon override
 */
export default function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this section. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
  icon,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 mb-4 border border-red-100 shadow-sm">
        {icon || <AlertCircle size={26} className="text-red-500" />}
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      {message && (
        <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
          {message}
        </p>
      )}
      {onRetry && (
        <div className="mt-5">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            leftIcon={<RefreshCw size={14} />}
          >
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  )
}
