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
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-sm sm:text-base font-bold transition-colors select-none',
        isExpired
          ? 'bg-red-600 text-white shadow-sm'
          : isCritical
          ? 'bg-red-50 text-red-600 border border-red-300 ring-2 ring-red-400/20 animate-pulse'
          : isWarning
          ? 'bg-amber-50 text-amber-700 border border-amber-300'
          : 'bg-slate-100 text-slate-800 border border-slate-200',
        className,
      ].join(' ')}
    >
      {isCritical || isExpired ? (
        <AlertCircle size={16} className="text-red-500 flex-shrink-0 animate-bounce" />
      ) : isWarning ? (
        <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
      ) : (
        <Clock size={16} className="text-slate-500 flex-shrink-0" />
      )}

      <span>{formatTime(secondsLeft)}</span>
    </div>
  )
}
