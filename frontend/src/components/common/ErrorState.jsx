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
    <div className={`flex flex-col items-center justify-center px-4 py-12 text-center ${className}`}>
      <div className="mb-4 text-danger">
        {icon || <AlertCircle size={28} />}
      </div>
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      {message && (
        <p className="mt-2 max-w-sm text-sm text-ink-3">
          {message}
        </p>
      )}
      {onRetry && (
        <div className="mt-6">
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
