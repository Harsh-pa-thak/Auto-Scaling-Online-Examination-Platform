import { HelpCircle, Award, Bookmark, XCircle } from 'lucide-react'
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8 flex flex-col justify-between space-y-6">
      {/* Top Question Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-slate-900 tracking-tight">
              Question {questionNumber}
            </span>
            <span className="text-xs text-slate-400">of {totalQuestions}</span>

            {isMarked && (
              <Badge variant="warning" size="sm" dot>
                Marked for Review
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {question.topic && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                {question.topic}
              </span>
            )}
            <Badge variant="primary" size="sm">
              +{question.marks || 2} Marks
            </Badge>
          </div>
        </div>

        {/* Question Text */}
        <div className="pt-4">
          <h2 className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed tracking-tight">
            {question.text}
          </h2>
        </div>
      </div>

      {/* Answer Options Grid (A, B, C, D) */}
      <div
        role="radiogroup"
        aria-label={`Options for Question ${questionNumber}`}
        className="space-y-3"
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
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span className="hidden sm:inline">
          Choose the single best answer. Selection is saved automatically.
        </span>

        {selectedOption != null && (
          <button
            type="button"
            onClick={onClearAnswer}
            className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors"
          >
            <XCircle size={14} />
            <span>Clear Answer</span>
          </button>
        )}
      </div>
    </div>
  )
}
