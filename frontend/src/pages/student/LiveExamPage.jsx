import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Send,
  XCircle,
  LayoutGrid,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react'
import { Button, Badge, ProgressBar } from '../../components/common'
import ExamTimer from '../../components/exam/ExamTimer'
import QuestionCard from '../../components/exam/QuestionCard'
import QuestionNavigator from '../../components/exam/QuestionNavigator'
import ExamSubmissionModal from '../../components/exam/ExamSubmissionModal'
import { mockExams, mockQuestions } from '../../data/mockData'
import { useToast } from '../../hooks/useToast'

export default function LiveExamPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  // Find exam
  const exam = mockExams.find((e) => e.id === id) || mockExams[0]

  // Retrieve matching questions or fallback to entire bank
  const questions = useMemo(() => {
    const subjectQuestions = mockQuestions.filter(
      (q) => q.subject.toLowerCase() === exam.subject.toLowerCase()
    )
    if (subjectQuestions.length >= 8) return subjectQuestions
    // Augment with other questions so exam is full and realistic
    const others = mockQuestions.filter(
      (q) => q.subject.toLowerCase() !== exam.subject.toLowerCase()
    )
    return [...subjectQuestions, ...others].slice(0, 15)
  }, [exam.subject])

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
    setAnswers((prev) => ({ ...prev, [currentIndex]: optIndex }))
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
  const handleConfirmSubmit = useCallback(() => {
    setSubmissionModalOpen(false)
    setIsSubmitted(true)
    toast.success('Exam Submitted', 'Your examination has been successfully submitted.')
  }, [toast])

  // Timer auto-submit handler
  const handleTimerExpire = useCallback(() => {
    if (!isSubmitted) {
      setAutoSubmitted(true)
      setIsSubmitted(true)
      toast.warning('Time Expired', 'The timer expired. Your exam was automatically submitted.')
    }
  }, [isSubmitted, toast])

  // ── SUBMITTED STATE SCREEN ──
  if (isSubmitted) {
    const timeSpentMinutes = Math.max(1, Math.round((Date.now() - startTime) / 60000))

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl max-w-lg w-full p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
            <CheckCircle2 size={36} />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {autoSubmitted ? 'Auto-Submitted on Time Expiry' : 'Successfully Submitted'}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Examination Completed
            </h1>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
              Your responses for <strong className="text-slate-800">{exam.title}</strong> have been recorded securely.
            </p>
          </div>

          {/* Submission Statistics Card */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Attempted</span>
              <p className="text-xl font-bold text-slate-900 mt-0.5">
                {answeredCount} <span className="text-xs text-slate-400 font-normal">/ {totalQuestions}</span>
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Unanswered</span>
              <p className="text-xl font-bold text-amber-600 mt-0.5">
                {unansweredCount}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Time Taken</span>
              <p className="text-xl font-bold text-slate-900 mt-0.5">
                {timeSpentMinutes}m
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link to="/student/dashboard" className="flex-1">
              <Button variant="secondary" fullWidth>
                Student Dashboard
              </Button>
            </Link>
            <Link to="/student/results" className="flex-1">
              <Button fullWidth rightIcon={<ArrowRight size={15} />}>
                View My Results
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── ACTIVE DISTRACTION-FREE EXAM INTERFACE ──
  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans select-none no-select">
      {/* ── TOP HEADER ── */}
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between shadow-xs">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white flex-shrink-0 shadow-sm">
            <GraduationCap size={20} />
          </div>
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              {exam.title}
            </h1>
            <p className="text-[11px] text-slate-400 truncate hidden sm:block">
              {exam.subject} • {exam.code}
            </p>
          </div>
        </div>

        {/* Center: Question Progress */}
        <div className="hidden md:flex flex-col items-center gap-1 w-48">
          <div className="flex items-center justify-between w-full text-xs font-semibold text-slate-700">
            <span>Progress</span>
            <span>
              {answeredCount}/{totalQuestions} ({Math.round((answeredCount / totalQuestions) * 100)}%)
            </span>
          </div>
          <ProgressBar
            value={answeredCount}
            max={totalQuestions}
            size="xs"
            variant="primary"
          />
        </div>

        {/* Right: Timer, Palette Button (mobile), Submit Button */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
          {/* Countdown Timer */}
          <ExamTimer
            initialSeconds={exam.duration ? exam.duration * 60 : 3600}
            onExpire={handleTimerExpire}
          />

          {/* Mobile Question Palette Toggle */}
          <button
            type="button"
            onClick={() => setMobilePaletteOpen(true)}
            aria-label="Open question navigator palette"
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200"
          >
            <LayoutGrid size={18} />
          </button>

          {/* Quick Submit Exam Header Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => setSubmissionModalOpen(true)}
            rightIcon={<Send size={14} />}
          >
            Submit Exam
          </Button>
        </div>
      </header>

      {/* ── MAIN CONTENT AREA (Left: Question, Right: Navigator) ── */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* Left/Center: Question Card */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
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

        {/* Right: Question Navigator Palette (Desktop) */}
        <div className="hidden lg:block w-80 flex-shrink-0">
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
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobilePaletteOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="absolute inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-4 overflow-y-auto animate-in slide-in-from-right duration-200">
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

      {/* ── BOTTOM STICKY NAVIGATION BAR ── */}
      <footer className="sticky bottom-0 z-20 bg-white border-t border-slate-200/90 py-3 px-4 sm:px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Previous Button */}
          <Button
            variant="secondary"
            size="md"
            disabled={currentIndex === 0}
            onClick={handlePrev}
            leftIcon={<ChevronLeft size={16} />}
          >
            Previous
          </Button>

          {/* Center: Mark for Review & Clear Answer */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleMark}
              className={[
                'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all',
                isCurrentMarked
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
              ].join(' ')}
            >
              <Bookmark size={14} className={isCurrentMarked ? 'fill-current' : ''} />
              <span>{isCurrentMarked ? 'Marked for Review' : 'Mark for Review'}</span>
            </button>
          </div>

          {/* Right: Next or Submit */}
          <div className="flex items-center gap-2">
            {currentIndex < totalQuestions - 1 ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                rightIcon={<ChevronRight size={16} />}
              >
                Next Question
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => setSubmissionModalOpen(true)}
                rightIcon={<Send size={15} />}
              >
                Submit Exam
              </Button>
            )}
          </div>
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
