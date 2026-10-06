import { AlertTriangle, CheckCircle2, FileQuestion, Bookmark } from 'lucide-react'
import { Modal, Button } from '../common'

/**
 * ExamSubmissionModal component — Confirmation dialog displaying answered, unanswered, and marked counts
 */
export default function ExamSubmissionModal({
  isOpen,
  onClose,
  onConfirmSubmit,
  totalQuestions = 0,
  answeredCount = 0,
  unansweredCount = 0,
  markedCount = 0,
}) {
  const hasUnanswered = unansweredCount > 0

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Examination?"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Return to Exam
          </Button>
          <Button
            variant={hasUnanswered ? 'danger' : 'primary'}
            onClick={onConfirmSubmit}
          >
            Yes, Submit Examination
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {hasUnanswered ? (
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Unanswered Questions Remaining</p>
              <p className="mt-0.5 text-amber-800 leading-relaxed">
                You have {unansweredCount} question{unansweredCount > 1 ? 's' : ''} left unanswered. Once submitted, you cannot resume this session.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
            <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">All Questions Answered</p>
              <p className="mt-0.5 text-emerald-800 leading-relaxed">
                Great job! You have answered all {totalQuestions} questions in this examination.
              </p>
            </div>
          </div>
        )}

        {/* Breakdown Summary Grid */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Answered
            </span>
            <p className="text-xl font-extrabold text-emerald-600 mt-0.5">
              {answeredCount}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Unanswered
            </span>
            <p className="text-xl font-extrabold text-amber-600 mt-0.5">
              {unansweredCount}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Marked
            </span>
            <p className="text-xl font-extrabold text-purple-600 mt-0.5">
              {markedCount}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed text-center pt-2">
          Clicking "Yes, Submit Examination" will finalize your score and end the proctored session immediately.
        </p>
      </div>
    </Modal>
  )
}
