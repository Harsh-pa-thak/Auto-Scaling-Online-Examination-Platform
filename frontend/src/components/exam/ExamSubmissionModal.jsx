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
          <p className="flex items-start gap-2 text-sm text-ink-2">
            <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-accent-strong" />
            You have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}. Once
            submitted, you cannot resume this session.
          </p>
        ) : (
          <p className="flex items-start gap-2 text-sm text-ink-2">
            <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-success" />
            You have answered all {totalQuestions} questions.
          </p>
        )}

        <dl className="grid grid-cols-3 divide-x divide-line rounded-lg border border-line text-center">
          {[
            { label: 'Answered', value: answeredCount },
            { label: 'Unanswered', value: unansweredCount },
            { label: 'Marked', value: markedCount },
          ].map(({ label, value }) => (
            <div key={label} className="p-4">
              <dt className="eyebrow">{label}</dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <p className="text-sm text-ink-3">
          Submitting finalizes your score and ends the proctored session immediately.
        </p>
      </div>
    </Modal>
  )
}
