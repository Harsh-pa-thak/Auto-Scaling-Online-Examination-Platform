import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  AlertTriangle,
  Play,
  Lock,
} from 'lucide-react'
import {
  Card,
  Badge,
  Button,
  Modal,
  ErrorState,
} from '../../components/common'
import ExamInstructions from '../../components/student/ExamInstructions'
import { api } from '../../lib/api'
import { useToast } from '../../hooks/useToast'

// Format date nicely
function formatDate(dateStr) {
  if (!dateStr) return 'TBA'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

// Format time
function formatTime(dateStr) {
  if (!dateStr) return 'TBA'
  try {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return dateStr
  }
}

export default function ExamDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [agreementChecked, setAgreementChecked] = useState(false)

  const [exam, setExam] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    api(`/exams/${id}`).then(setExam).catch(() => setExam(null)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="py-12 text-center text-ink-3">Loading examination...</div>
  if (!exam) {
    return (
      <div className="py-12">
        <ErrorState
          title="Examination Not Found"
          message={`The examination with ID "${id}" could not be found or has been archived.`}
          retryLabel="Back to Examinations"
          onRetry={() => navigate('/student/exams')}
        />
      </div>
    )
  }

  const now = Date.now()
  const startsAt = exam.startTime ? new Date(exam.startTime).getTime() : NaN
  const endsAt = exam.endTime ? new Date(exam.endTime).getTime() : NaN
  const isWithinWindow = Number.isFinite(startsAt) && Number.isFinite(endsAt) && now >= startsAt && now <= endsAt
  const isLive = ['active', 'published'].includes(exam.status) && isWithinWindow
  const isUpcoming = ['upcoming', 'published'].includes(exam.status) && Number.isFinite(startsAt) && now < startsAt
  const isCompleted = exam.status === 'completed'
  const isUnavailable = exam.status === 'unavailable' || exam.status === 'draft'

  const handleStartExam = () => {
    setConfirmModalOpen(false)
    toast.success('Exam Started', `Opening proctored examination interface for ${exam.title}`)
    navigate(`/student/exam/${exam.id}`)
  }

  const overview = [
    { label: 'Duration',      value: `${exam.duration} min`, hint: 'Timed session' },
    { label: 'Questions',     value: exam.totalQuestions,     hint: 'Multiple choice' },
    { label: 'Total marks',   value: exam.totalMarks,         hint: `${exam.marksPerQuestion || 2} marks per question` },
    { label: 'Passing marks', value: exam.passMark,           hint: `${Math.round((exam.passMark / exam.totalMarks) * 100)}% minimum` },
  ]

  const schedule = [
    { label: 'Date',     value: formatDate(exam.startTime) },
    { label: 'Time',     value: `${formatTime(exam.startTime)} – ${formatTime(exam.endTime)}` },
    { label: 'Sections', value: Array.isArray(exam.section) ? exam.section.join(', ') : 'All enrolled students' },
    {
      label: 'Negative marking',
      value: exam.negativeMarking
        ? `Yes, ${exam.negativeMarks || 0.5} marks per wrong answer`
        : 'No',
    },
  ]

  return (
    <div className="max-w-6xl space-y-8">
      {/* ── Header ── */}
      <header>
        <Link
          to="/student/exams"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-3 transition-colors hover:text-ink"
        >
          <ArrowLeft size={14} />
          Back to examinations
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-ink-3">
          <span>{exam.subject}</span>
          <span className="text-ink-2">·</span>
          <span className="tabular-nums">{exam.code}</span>
          <span className="ml-2">
            {isLive ? (
              <Badge variant="primary" dot>Live now</Badge>
            ) : isUpcoming ? (
              <Badge dot>Upcoming</Badge>
            ) : isCompleted ? (
              <Badge>Completed</Badge>
            ) : (
              <Badge>Unavailable</Badge>
            )}
          </span>
        </div>

        <h1 className="mt-2 page-title">{exam.title}</h1>
        <p className="page-subtitle">
          Review the timing, marking scheme, and exam rules before you begin.
        </p>
      </header>

      {/* ── Two columns ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: details & instructions */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <h2 className="section-title">Overview</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {overview.map(({ label, value, hint }) => (
                <div key={label} className="rounded-lg border border-line bg-canvas p-4">
                  <dt className="eyebrow">{label}</dt>
                  <dd className="mt-1 text-xl font-semibold tabular-nums text-ink">{value}</dd>
                  <dd className="text-xs text-ink-3">{hint}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card>
            <h2 className="section-title">Schedule</h2>
            <dl className="mt-4 divide-y divide-line text-sm">
              {schedule.map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between gap-4 py-2">
                  <dt className="text-ink-3">{label}</dt>
                  <dd className="text-right font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card>
            <h2 className="section-title">Instructions</h2>
            <div className="mt-4">
              <ExamInstructions customInstructions={exam.instructions} />
            </div>
          </Card>
        </div>

        {/* Right: start action */}
        <div className="space-y-6">
          <Card className={`lg:sticky lg:top-24 ${isLive ? 'border-accent/50' : ''}`}>
            <h2 className="section-title">
              {isLive ? 'Ready when you are' : isCompleted ? 'Exam completed' : 'Start exam'}
            </h2>
            <p className="mt-2 text-sm text-ink-3">
              {isLive
                ? 'The session is live. The timer starts as soon as you begin.'
                : isUpcoming
                ? `Scheduled for ${formatDate(exam.startTime)} at ${formatTime(exam.startTime)}.`
                : isCompleted
                ? 'This assessment was completed and submitted.'
                : 'This examination window is closed or unavailable.'}
            </p>

            <div className="mt-6">
              {isLive ? (
                <Button
                  fullWidth
                  size="lg"
                  onClick={() => setConfirmModalOpen(true)}
                  rightIcon={<Play size={16} className="fill-current" />}
                >
                  Start exam
                </Button>
              ) : isUpcoming ? (
                <Button
                  variant="secondary"
                  fullWidth
                  size="lg"
                  onClick={() => setConfirmModalOpen(true)}
                  rightIcon={<Play size={16} className="fill-current" />}
                >
                  Start test session
                </Button>
              ) : isCompleted ? (
                <Button
                  variant="secondary"
                  fullWidth
                  size="lg"
                  onClick={() => navigate('/student/results')}
                >
                  View results
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  fullWidth
                  size="lg"
                  disabled
                  leftIcon={<Lock size={16} />}
                >
                  Not available
                </Button>
              )}
            </div>
          </Card>

          <Card>
            <h2 className="section-title">Technical support</h2>
            <p className="mt-2 text-sm text-ink-3">
              If your browser crashes or you lose power during the test, sign back in from any
              browser. Your answers are preserved.
            </p>
            <p className="mt-4 border-t border-line pt-4 text-sm text-ink-3">
              Helpline:{' '}
              <a href="mailto:helpdesk@vit.ac.in" className="text-link">
                helpdesk@vit.ac.in
              </a>
            </p>
          </Card>
        </div>
      </div>

      {/* ── Pre-Exam Confirmation Modal ── */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Begin examination?"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!agreementChecked}
              onClick={handleStartExam}
              rightIcon={<Play size={14} className="fill-current" />}
            >
              Start exam
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <dl className="space-y-1 rounded-lg border border-line bg-canvas p-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-3">Exam</dt>
              <dd className="text-right font-medium text-ink">{exam.title}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-3">Duration</dt>
              <dd className="tabular-nums text-ink-2">{exam.duration} minutes</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-3">Questions</dt>
              <dd className="tabular-nums text-ink-2">
                {exam.totalQuestions} ({exam.totalMarks} marks)
              </dd>
            </div>
          </dl>

          <p className="flex items-start gap-2 text-sm text-ink-2">
            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0 text-accent-strong" />
            Once you start, the timer cannot be paused. Tab switches and window minimizing are
            recorded for academic integrity.
          </p>

          <label className="flex cursor-pointer select-none items-start gap-2 border-t border-line pt-4">
            <input
              type="checkbox"
              checked={agreementChecked}
              onChange={(e) => setAgreementChecked(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-line-strong bg-canvas accent-amber-500"
            />
            <span className="text-sm text-ink-2">
              I have read the instructions and agree to follow the university honor code.
            </span>
          </label>
        </div>
      </Modal>
    </div>
  )
}
