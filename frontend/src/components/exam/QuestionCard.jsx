import { XCircle, Check, RotateCcw } from 'lucide-react'
import AnswerOption from './AnswerOption'
import { Badge, LoadingSpinner } from '../common'

const letters = ['A', 'B', 'C', 'D']

/**
 * QuestionCard component — Displays current question and options
 *
 * @param {Object}   question        - Question object
 * @param {number}   questionNumber  - 1-based question number
 * @param {number}   totalQuestions  - Total questions count
 * @param {number}   selectedOption  - Currently chosen option index (0..3) or null
 * @param {Function} onSelectOption  - (optionIndex) => void
 * @param {Function} onClearAnswer   - () => void
 * @param {boolean}  isMarked        - Whether marked for review
 * @param {string}   saveStatus      - 'saving' | 'saved' | 'error' (per-question autosave state)
 * @param {Function} onRetrySave     - Re-sends the last answer when a save failed
 */
export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelectOption,
  onClearAnswer,
  isMarked = false,
  saveStatus,
  onRetrySave,
}) {
  if (!question) return null

  return (
    <div className="card space-y-6 p-6 sm:p-8">
      {/* Question meta */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="flex items-center gap-2">
          <span className="font-semibold text-ink">Question {questionNumber}</span>
          <span className="text-ink-3">of {totalQuestions}</span>
          {isMarked && (
            <Badge variant="primary" size="sm" dot>
              Marked for review
            </Badge>
          )}
        </p>
        <p className="text-ink-3">
          {question.topic && <span>{question.topic} · </span>}
          <span className="tabular-nums">{question.marks || 2} marks</span>
        </p>
      </div>

      {/* Question Text */}
      <h2 className="text-lg font-medium text-ink">{question.text}</h2>

      {/* Answer Options Grid (A, B, C, D) */}
      <div
        role="radiogroup"
        aria-label={`Options for Question ${questionNumber}`}
        className="space-y-2"
      >
        {question.options.map((optText, idx) => (
          <AnswerOption
            key={idx}
            letter={letters[idx] || String.fromCharCode(65 + idx)}
            text={optText}
            selected={selectedOption === idx}
            onSelect={() => onSelectOption(idx)}
            shortcut={idx + 1}
          />
        ))}
      </div>

      {/* Footer Info & Clear Action */}
      <div className="flex min-h-[2rem] items-center justify-between gap-4 border-t border-line pt-4 text-sm text-ink-3">
        <span className="inline-flex items-center gap-1.5" role="status" aria-live="polite">
          {saveStatus === 'saving' && (
            <>
              <LoadingSpinner size="xs" />
              Saving…
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <Check size={14} className="text-success" />
              Saved
            </>
          )}
          {saveStatus === 'error' && (
            <button
              type="button"
              onClick={onRetrySave}
              className="inline-flex items-center gap-1.5 font-medium text-danger underline-offset-4 hover:underline"
            >
              <RotateCcw size={13} />
              Save failed — retry
            </button>
          )}
          {!saveStatus && (
            <span className="hidden sm:inline">
              Press 1–4 to choose an answer · ←/→ to move between questions
            </span>
          )}
        </span>

        {selectedOption != null && (
          <button
            type="button"
            onClick={onClearAnswer}
            className="ml-auto inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-ink-3 transition-colors duration-fast hover:bg-sunken hover:text-ink"
          >
            <XCircle size={14} />
            Clear answer
          </button>
        )}
      </div>
    </div>
  )
}
