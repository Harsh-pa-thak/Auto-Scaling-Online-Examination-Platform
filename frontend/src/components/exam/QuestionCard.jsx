import { XCircle } from 'lucide-react'
import AnswerOption from './AnswerOption'
import { Badge } from '../common'

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
 */
export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelectOption,
  onClearAnswer,
  isMarked = false,
}) {
  if (!question) return null

  return (
    <div className="card space-y-6 p-6 sm:p-8">
      {/* Question meta */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="flex items-center gap-2">
          <span className="font-semibold text-zinc-100">Question {questionNumber}</span>
          <span className="text-zinc-500">of {totalQuestions}</span>
          {isMarked && (
            <Badge variant="primary" size="sm" dot>
              Marked for review
            </Badge>
          )}
        </p>
        <p className="text-zinc-400">
          {question.topic && <span>{question.topic} · </span>}
          <span className="tabular-nums">{question.marks || 2} marks</span>
        </p>
      </div>

      {/* Question Text */}
      <h2 className="text-lg font-medium text-zinc-50">{question.text}</h2>

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
          />
        ))}
      </div>

      {/* Footer Info & Clear Action */}
      <div className="flex min-h-[2rem] items-center justify-between gap-4 border-t border-zinc-800 pt-4 text-sm text-zinc-500">
        <span className="hidden sm:inline">
          Choose the single best answer. Your selection is saved automatically.
        </span>

        {selectedOption != null && (
          <button
            type="button"
            onClick={onClearAnswer}
            className="ml-auto inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
          >
            <XCircle size={14} />
            Clear answer
          </button>
        )}
      </div>
    </div>
  )
}
