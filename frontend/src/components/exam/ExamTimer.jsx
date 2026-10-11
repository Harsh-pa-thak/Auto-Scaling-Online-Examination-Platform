import { useState, useEffect, useRef } from 'react'

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

const RING_RADIUS = 8
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

/**
 * Reusable ExamTimer component — countdown with a progress ring that
 * shifts amber under 10 minutes and red under 2 minutes.
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

  const fraction =
    initialSeconds > 0 ? Math.max(0, Math.min(1, secondsLeft / initialSeconds)) : 0

  const ringTone = isExpired
    ? 'text-white'
    : isCritical
    ? 'text-danger'
    : isWarning
    ? 'text-warning'
    : 'text-accent'

  return (
    <div
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`Time remaining ${formatTime(secondsLeft)}`}
      className={[
        'inline-flex select-none items-center gap-2.5 rounded-full border px-3 py-1.5 text-sm font-semibold tabular-nums transition-colors duration-slow',
        isExpired
          ? 'border-danger bg-danger text-white'
          : isCritical
          ? 'border-danger/30 bg-danger-soft text-danger'
          : isWarning
          ? 'border-warning/30 bg-warning-soft text-warning'
          : 'border-line bg-surface text-ink',
        className,
      ].join(' ')}
    >
      <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
        className={`h-4 w-4 flex-shrink-0 -rotate-90 ${ringTone} ${isCritical ? 'animate-pulse' : ''}`}
      >
        <circle
          cx="10"
          cy="10"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="2.5"
          className={isExpired ? 'stroke-white/30' : 'stroke-line'}
        />
        <circle
          cx="10"
          cy="10"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          stroke="currentColor"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={RING_CIRCUMFERENCE * (1 - fraction)}
          className="transition-[stroke-dashoffset] duration-slow ease-standard"
        />
      </svg>

      <span>{formatTime(secondsLeft)}</span>
    </div>
  )
}
