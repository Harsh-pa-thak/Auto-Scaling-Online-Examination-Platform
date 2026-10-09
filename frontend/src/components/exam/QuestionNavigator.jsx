import { X } from 'lucide-react'

/**
 * QuestionNavigator component — Palette grid of all questions with status states
 *
 * @param {number}   totalQuestions    - Number of questions
 * @param {number}   currentIndex      - 0-based current question index
 * @param {Object}   answers           - Map of { [index]: selectedOption }
 * @param {Object}   marked            - Map of { [index]: boolean }
 * @param {Function} onSelectQuestion  - (index) => void
 * @param {Function} onCloseMobile     - Optional callback to close mobile drawer
 */
export default function QuestionNavigator({
  totalQuestions,
  currentIndex,
  answers = {},
  marked = {},
  onSelectQuestion,
  onCloseMobile,
}) {
  // Compute counts
  let answeredCount = 0
  let markedCount = 0
  let answeredAndMarkedCount = 0
  let unansweredCount = 0

  for (let i = 0; i < totalQuestions; i++) {
    const isAnswered = answers[i] != null
    const isMarked = !!marked[i]

    if (isAnswered && isMarked) {
      answeredAndMarkedCount++
    } else if (isMarked) {
      markedCount++
    } else if (isAnswered) {
      answeredCount++
    } else {
      unansweredCount++
    }
  }

  const legend = [
    { label: 'Answered',          count: answeredCount,          swatch: 'border-zinc-200 bg-zinc-200' },
    { label: 'Not answered',      count: unansweredCount,        swatch: 'border-zinc-600' },
    { label: 'Marked',            count: markedCount,            swatch: 'border-amber-500' },
    { label: 'Answered & marked', count: answeredAndMarkedCount, swatch: 'border-amber-500 bg-amber-500' },
  ]

  return (
    <div className="card space-y-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">Questions</h3>
          <p className="text-xs tabular-nums text-zinc-400">
            {answeredCount + answeredAndMarkedCount} of {totalQuestions} answered
          </p>
        </div>

        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close question palette"
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 lg:hidden"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Questions Grid */}
      <div className="grid max-h-[320px] grid-cols-5 gap-2 overflow-y-auto p-1">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const isCurrent = i === currentIndex
          const isAnswered = answers[i] != null
          const isMarked = !!marked[i]

          let stateStyle = 'border-zinc-700 text-zinc-300 hover:border-zinc-500'
          let stateLabel = 'Not answered'

          if (isAnswered && isMarked) {
            stateStyle = 'border-amber-500 bg-amber-500 text-zinc-950'
            stateLabel = 'Answered and marked for review'
          } else if (isMarked) {
            stateStyle = 'border-amber-500 text-amber-400'
            stateLabel = 'Marked for review'
          } else if (isAnswered) {
            stateStyle = 'border-zinc-200 bg-zinc-200 text-zinc-950'
            stateLabel = 'Answered'
          }

          return (
            <button
              key={i}
              type="button"
              onClick={() => {
                onSelectQuestion(i)
                if (onCloseMobile) onCloseMobile()
              }}
              aria-label={`Question ${i + 1}: ${stateLabel}${isCurrent ? ' (current)' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
              className={[
                'flex h-10 items-center justify-center rounded-lg border text-sm font-semibold tabular-nums transition-colors',
                stateStyle,
                isCurrent ? 'ring-2 ring-zinc-50 ring-offset-2 ring-offset-zinc-900' : '',
              ].join(' ')}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <ul className="grid grid-cols-2 gap-2 border-t border-zinc-800 pt-4 text-xs text-zinc-400">
        {legend.map(({ label, count, swatch }) => (
          <li key={label} className="flex items-center gap-2">
            <span className={`h-3 w-3 flex-shrink-0 rounded border ${swatch}`} />
            <span>
              {label} <span className="tabular-nums text-zinc-500">({count})</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
