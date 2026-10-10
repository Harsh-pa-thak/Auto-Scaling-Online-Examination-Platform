import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Send,
  LayoutGrid,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { Button, ProgressBar } from '../../components/common'
import ExamTimer from '../../components/exam/ExamTimer'
import QuestionCard from '../../components/exam/QuestionCard'
import QuestionNavigator from '../../components/exam/QuestionNavigator'
import ExamSubmissionModal from '../../components/exam/ExamSubmissionModal'
import { api } from '../../lib/api'
import { useToast } from '../../hooks/useToast'

export default function LiveExamPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [exam, setExam] = useState(null)
  const [attempt, setAttempt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const questions = attempt?.questions || []

  useEffect(() => {
    api(`/exams/${id}/attempts`)
      .then(setAttempt)
      .catch((error) => { setLoadError(error.message) })
      .finally(() => setLoading(false))
    api(`/exams/${id}`).then(setExam).catch(() => {})
  }, [id])

  const totalQuestions = questions.length

  // Exam state
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({}) // { [qIndex]: optionIndex }
  const [marked, setMarked] = useState({}) // { [qIndex]: boolean }
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [autoSubmitted, setAutoSubmitted] = useState(false)
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false)
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false)
  const [startTime] = useState(Date.now())

  // Prevent accidental tab closure or browser reload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isSubmitted) {
        e.preventDefault()
        e.returnValue = 'An examination session is currently active. Are you sure you want to leave?'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isSubmitted])

  // Current question data
  const currentQuestion = questions[currentIndex]
  const currentAnswer = answers[currentIndex] ?? null
  const isCurrentMarked = !!marked[currentIndex]

  // Handlers for question actions
  const handleSelectOption = (optIndex) => {
    const question = questions[currentIndex]
    setAnswers((prev) => ({ ...prev, [currentIndex]: optIndex }))
    if (attempt && question) {
      api(`/attempts/${attempt.id}/answers/${question.id}`, {
        method: 'PUT', body: { selectedOption: optIndex },
      }).catch((error) => toast.error('Answer not saved', error.message))
    }
  }

  const handleClearAnswer = () => {
    setAnswers((prev) => {
      const copy = { ...prev }
      delete copy[currentIndex]
      return copy
    })
  }

  const handleToggleMark = () => {
    setMarked((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex],
    }))
  }

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  // Answered / marked counts
  const answeredCount = Object.keys(answers).length
  const unansweredCount = totalQuestions - answeredCount
  const markedCount = Object.values(marked).filter(Boolean).length

  // Final submission handler
  const handleConfirmSubmit = useCallback(async () => {
    try {
      await api(`/attempts/${attempt.id}/submit`, { method: 'POST' })
      setSubmissionModalOpen(false)
      setIsSubmitted(true)
      toast.success('Exam Submitted', 'Your examination has been successfully submitted.')
    } catch (error) {
      toast.error('Submission failed', error.message)
    }
  }, [attempt, toast])

  // Timer auto-submit handler
  const handleTimerExpire = useCallback(() => {
    if (!isSubmitted) {
      api(`/attempts/${attempt.id}/submit`, { method: 'POST' })
        .finally(() => {
          setAutoSubmitted(true)
          setIsSubmitted(true)
          toast.warning('Time Expired', 'The timer expired. Your exam was automatically submitted.')
        })
    }
  }, [attempt, isSubmitted, toast])

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">Starting examination...</div>
  if (loadError || !attempt) return <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-red-400">{loadError || 'Unable to start examination.'}</div>

  // ── SUBMITTED STATE SCREEN ──
  if (isSubmitted) {
    const timeSpentMinutes = Math.max(1, Math.round((Date.now() - startTime) / 60000))

    const stats = [
      { label: 'Attempted',  value: `${answeredCount} / ${totalQuestions}` },
      { label: 'Unanswered', value: unansweredCount },
      { label: 'Time taken', value: `${timeSpentMinutes} min` },
    ]

    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
        <div className="card w-full max-w-lg space-y-6 p-8 text-center">
          <CheckCircle2 size={32} className="mx-auto text-emerald-400" />

          <div>
            <p className="eyebrow">
              {autoSubmitted ? 'Submitted automatically when time ran out' : 'Submitted'}
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-zinc-50">Examination completed</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Your responses for <span className="text-zinc-100">{exam.title}</span> have been
              recorded.
            </p>
          </div>

          <dl className="grid grid-cols-3 divide-x divide-zinc-800 rounded-lg border border-zinc-800">
            {stats.map(({ label, value }) => (
              <div key={label} className="p-4">
                <dt className="eyebrow">{label}</dt>
                <dd className="mt-1 text-lg font-semibold tabular-nums text-zinc-50">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link to="/student/dashboard" className="flex-1">
              <Button variant="secondary" fullWidth>
                Dashboard
              </Button>
            </Link>
            <Link to="/student/results" className="flex-1">
              <Button fullWidth rightIcon={<ArrowRight size={16} />}>
                View results
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const progressPct = Math.round((answeredCount / totalQuestions) * 100)

  // ── ACTIVE DISTRACTION-FREE EXAM INTERFACE ──
  return (
    <div className="no-select flex min-h-screen select-none flex-col bg-zinc-950 font-sans">
      {/* ── TOP HEADER ── */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-zinc-800 bg-zinc-950 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500 text-zinc-950">
            <GraduationCap size={18} />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold text-zinc-100">{exam.title}</h1>
            <p className="hidden truncate text-xs text-zinc-500 sm:block">
              {exam.subject} · <span className="tabular-nums">{exam.code}</span>
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="hidden w-48 md:block">
          <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
            <span>Progress</span>
            <span className="tabular-nums">
              {answeredCount}/{totalQuestions} ({progressPct}%)
            </span>
          </div>
          <ProgressBar value={answeredCount} max={totalQuestions} size="xs" />
        </div>

        <div className="flex flex-shrink-0 items-center gap-2 sm:gap-4">
          <ExamTimer
            initialSeconds={exam.duration ? exam.duration * 60 : 3600}
            onExpire={handleTimerExpire}
          />

          <button
            type="button"
            onClick={() => setMobilePaletteOpen(true)}
            aria-label="Open question navigator"
            className="rounded-lg border border-zinc-800 p-2 text-zinc-300 hover:bg-zinc-800 lg:hidden"
          >
            <LayoutGrid size={18} />
          </button>

          <Button size="sm" onClick={() => setSubmissionModalOpen(true)} rightIcon={<Send size={14} />}>
            Submit
          </Button>
        </div>
      </header>

      {/* ── MAIN: question + navigator ── */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
        <div className="min-w-0 flex-1">
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={totalQuestions}
            selectedOption={currentAnswer}
            onSelectOption={handleSelectOption}
            onClearAnswer={handleClearAnswer}
            isMarked={isCurrentMarked}
          />
        </div>

        <div className="hidden w-80 flex-shrink-0 lg:block">
          <div className="sticky top-24">
            <QuestionNavigator
              totalQuestions={totalQuestions}
              currentIndex={currentIndex}
              answers={answers}
              marked={marked}
              onSelectQuestion={(idx) => setCurrentIndex(idx)}
            />
          </div>
        </div>
      </div>

      {/* ── MOBILE QUESTION PALETTE DRAWER ── */}
      {mobilePaletteOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobilePaletteOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-xs overflow-y-auto border-l border-zinc-800 bg-zinc-950 p-4">
            <QuestionNavigator
              totalQuestions={totalQuestions}
              currentIndex={currentIndex}
              answers={answers}
              marked={marked}
              onSelectQuestion={(idx) => setCurrentIndex(idx)}
              onCloseMobile={() => setMobilePaletteOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ── BOTTOM NAVIGATION BAR ── */}
      <footer className="sticky bottom-0 z-20 border-t border-zinc-800 bg-zinc-950 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 lg:px-2">
          <Button
            variant="secondary"
            disabled={currentIndex === 0}
            onClick={handlePrev}
            leftIcon={<ChevronLeft size={16} />}
          >
            Previous
          </Button>

          <button
            type="button"
            onClick={handleToggleMark}
            aria-pressed={isCurrentMarked}
            className={[
              'inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
              isCurrentMarked
                ? 'border-amber-500/50 text-amber-400'
                : 'border-zinc-700 text-zinc-200 hover:bg-zinc-800',
            ].join(' ')}
          >
            <Bookmark size={14} className={isCurrentMarked ? 'fill-current' : ''} />
            {isCurrentMarked ? 'Marked for review' : 'Mark for review'}
          </button>

          {currentIndex < totalQuestions - 1 ? (
            <Button onClick={handleNext} rightIcon={<ChevronRight size={16} />}>
              Next
            </Button>
          ) : (
            <Button onClick={() => setSubmissionModalOpen(true)} rightIcon={<Send size={14} />}>
              Submit exam
            </Button>
          )}
        </div>
      </footer>

      {/* ── SUBMISSION CONFIRMATION MODAL ── */}
      <ExamSubmissionModal
        isOpen={submissionModalOpen}
        onClose={() => setSubmissionModalOpen(false)}
        onConfirmSubmit={handleConfirmSubmit}
        totalQuestions={totalQuestions}
        answeredCount={answeredCount}
        unansweredCount={unansweredCount}
        markedCount={markedCount}
      />
    </div>
  )
}
