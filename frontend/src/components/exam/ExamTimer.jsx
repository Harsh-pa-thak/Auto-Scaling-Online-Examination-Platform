import { useState, useEffect, useRef } from 'react'
import { Clock, AlertTriangle, AlertCircle } from 'lucide-react'

// Format seconds into HH:MM:SS or MM:SS
function formatTime(seconds) {
  if (seconds <= 0) return '00:00'
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Reusable ExamTimer component
 *
 * @param {number}   initialSeconds - Total duration in seconds
 * @param {Function} onExpire       - Callback fired when time reaches 0
 */
export default function ExamTimer({ initialSeconds = 3600, onExpire, className = '' }) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  const hasExpiredRef = useRef(false)

  useEffect(() => {
    setSecondsLeft(initialSeconds)
    hasExpiredRef.current = false
  }, [initialSeconds])

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (!hasExpiredRef.current) {
        hasExpiredRef.current = true
        if (onExpire) onExpire()
      }
      return
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [secondsLeft, onExpire])

  // Timer states
  const isCritical = secondsLeft <= 120 && secondsLeft > 0 // under 2 mins
  const isWarning = secondsLeft <= 600 && secondsLeft > 120 // under 10 mins
  const isExpired = secondsLeft === 0

  return (
    <div
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      className={[
        'inline-flex items-center gap-2 rounded-lg border px-3 py-1 tabular-nums text-base font-semibold transition-colors select-none',
        isExpired
          ? 'border-red-500 bg-red-600 text-white'
          : isCritical
          ? 'border-red-500/40 text-red-400'
          : isWarning
          ? 'border-amber-500/40 text-amber-400'
          : 'border-zinc-800 text-zinc-100',
        className,
      ].join(' ')}
    >
      {isCritical || isExpired ? (
        <AlertCircle size={16} className="flex-shrink-0" />
      ) : isWarning ? (
        <AlertTriangle size={16} className="flex-shrink-0" />
      ) : (
        <Clock size={16} className="flex-shrink-0 text-zinc-500" />
      )}

      <span>{formatTime(secondsLeft)}</span>
    </div>
  )
}
