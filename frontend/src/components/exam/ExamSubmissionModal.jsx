import { AlertTriangle, CheckCircle2 } from 'lucide-react'
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
      title="Submit examination?"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Return to exam
          </Button>
          <Button
            variant={hasUnanswered ? 'danger' : 'primary'}
            onClick={onConfirmSubmit}
          >
            Submit examination
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {hasUnanswered ? (
          <p className="flex items-start gap-2 text-sm text-zinc-300">
            <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-amber-400" />
            You have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}. Once
            submitted, you cannot resume this session.
          </p>
        ) : (
          <p className="flex items-start gap-2 text-sm text-zinc-300">
            <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-emerald-400" />
            You have answered all {totalQuestions} questions.
          </p>
        )}

        <dl className="grid grid-cols-3 divide-x divide-zinc-800 rounded-lg border border-zinc-800 text-center">
          {[
            { label: 'Answered', value: answeredCount },
            { label: 'Unanswered', value: unansweredCount },
            { label: 'Marked', value: markedCount },
          ].map(({ label, value }) => (
            <div key={label} className="p-4">
              <dt className="eyebrow">{label}</dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums text-zinc-50">{value}</dd>
            </div>
          ))}
        </dl>

        <p className="text-sm text-zinc-400">
          Submitting finalizes your score and ends the proctored session immediately.
        </p>
      </div>
    </Modal>
  )
}
