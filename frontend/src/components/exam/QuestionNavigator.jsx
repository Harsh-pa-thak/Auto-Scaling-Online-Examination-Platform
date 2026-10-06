import { Bookmark, Check, Flag, X } from 'lucide-react'

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

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Question Palette
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {answeredCount + answeredAndMarkedCount} of {totalQuestions} answered
          </p>
        </div>

        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close question palette"
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-xl bg-slate-50 border border-slate-100">
        <div className="flex items-center gap-1.5 text-slate-700">
          <span className="h-3 w-3 rounded bg-emerald-600 flex-shrink-0" />
          <span>Answered ({answeredCount})</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-700">
          <span className="h-3 w-3 rounded bg-slate-200 border border-slate-300 flex-shrink-0" />
          <span>Unanswered ({unansweredCount})</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-700">
          <span className="h-3 w-3 rounded bg-amber-500 flex-shrink-0" />
          <span>Marked ({markedCount})</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-700">
          <span className="h-3 w-3 rounded bg-purple-600 flex-shrink-0" />
          <span>Ans & Marked ({answeredAndMarkedCount})</span>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-5 gap-2 max-h-[320px] overflow-y-auto p-1">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const isCurrent = i === currentIndex
          const isAnswered = answers[i] != null
          const isMarked = !!marked[i]

          // Derive visual state
          let stateStyle = 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
          let stateLabel = 'Unanswered'

          if (isAnswered && isMarked) {
            stateStyle = 'bg-purple-600 text-white border-purple-700 hover:bg-purple-700'
            stateLabel = 'Answered & Marked for Review'
          } else if (isMarked) {
            stateStyle = 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600'
            stateLabel = 'Marked for Review'
          } else if (isAnswered) {
            stateStyle = 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700'
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
              aria-label={`Question ${i + 1}: ${stateLabel}${isCurrent ? ' (Current)' : ''}`}
              className={[
                'relative flex items-center justify-center h-10 rounded-xl text-xs font-bold border transition-all duration-150',
                stateStyle,
                isCurrent
                  ? 'ring-2 ring-primary-600 ring-offset-2 scale-105 shadow-sm font-extrabold z-10'
                  : '',
              ].join(' ')}
            >
              <span>{i + 1}</span>

              {/* Status Indicator Badges */}
              {isMarked && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-400 text-slate-900 ring-1 ring-white">
                  <Bookmark size={8} className="fill-current" />
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
