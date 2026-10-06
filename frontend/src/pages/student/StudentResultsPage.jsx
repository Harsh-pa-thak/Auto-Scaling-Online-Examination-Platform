import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowLeft,
  Calendar,
  Clock,
  Timer,
  FileText,
  User,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Eye,
  Check,
  X,
  RotateCcw,
} from 'lucide-react'
import {
  Card,
  Badge,
  Button,
  ProgressBar,
  Modal,
  Select,
} from '../../components/common'
import { mockResults, mockQuestions } from '../../data/mockData'
import { useAuth } from '../../hooks/useAuth'

// Date format helper
function formatDate(dateStr) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export default function StudentResultsPage() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const studentId = user?.id || '24BCE1234'

  // Retrieve student's results
  const studentResults = useMemo(() => {
    return mockResults.filter((r) => r.studentId === studentId)
  }, [studentId])

  // Select active result from query param or first available
  const resultIdParam = searchParams.get('id')
  const activeResult = useMemo(() => {
    if (resultIdParam) {
      const match = studentResults.find((r) => r.id === resultIdParam)
      if (match) return match
    }
    return studentResults[0] || mockResults[0]
  }, [studentResults, resultIdParam])

  // Answers review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false)

  // Questions for review
  const reviewQuestions = useMemo(() => {
    if (!activeResult) return []
    const matching = mockQuestions.filter(
      (q) => q.subject.toLowerCase() === activeResult.subject.toLowerCase()
    )
    return matching.length > 0 ? matching : mockQuestions.slice(0, 5)
  }, [activeResult])

  if (!activeResult) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-zinc-400">No examination results found.</p>
        <Link to="/student/dashboard" className="inline-block">
          <Button variant="secondary" size="sm">Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  const isPassed = activeResult.status === 'passed'
  const attemptedCount = activeResult.attempted ?? (activeResult.correct + activeResult.wrong)
  const unansweredCount = Math.max(0, activeResult.totalQuestions - attemptedCount)

  const accuracyRate = attemptedCount > 0
    ? Math.round((activeResult.correct / attemptedCount) * 100)
    : 0

  const correctPct = ((activeResult.correct / activeResult.totalQuestions) * 100).toFixed(1)
  const wrongPct = ((activeResult.wrong / activeResult.totalQuestions) * 100).toFixed(1)
  const unansweredPct = ((unansweredCount / activeResult.totalQuestions) * 100).toFixed(1)

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* ── Top Bar with Back Link & Exam Switcher ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-800">
        <Link
          to="/student/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </Link>

        {/* Dropdown to switch between completed exams */}
        {studentResults.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-medium whitespace-nowrap">Switch Result:</span>
            <div className="w-64">
              <Select
                id="result-selector"
                value={activeResult.id}
                onChange={(e) => setSearchParams({ id: e.target.value })}
                options={studentResults.map((r) => ({
                  value: r.id,
                  label: `${r.examTitle} (${r.percentage}%)`,
                }))}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Main Scorecard Banner ── */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700/60 font-mono">
                {activeResult.subject}
              </span>
              <Badge variant={isPassed ? 'success' : 'danger'} dot size="md">
                {isPassed ? 'Passed' : 'Failed'}
              </Badge>
              {activeResult.grade && (
                <Badge variant="primary" size="md">
                  Grade {activeResult.grade}
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              {activeResult.examTitle}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Submitted on {formatDate(activeResult.submittedAt)} • Time Taken: {activeResult.timeTaken} minutes
            </p>
          </div>

          {/* Large Score Showcase */}
          <div className="flex items-center gap-4 sm:flex-col sm:items-end flex-shrink-0 bg-zinc-850/60 sm:bg-transparent p-3 sm:p-0 rounded-xl border border-zinc-800 sm:border-0">
            <div className="text-left sm:text-right">
              <span className="text-[11px] uppercase font-bold tracking-wider text-zinc-500">
                Final Score
              </span>
              <p className="text-3xl sm:text-4xl font-extrabold text-zinc-100 leading-tight">
                {activeResult.score}{' '}
                <span className="text-sm sm:text-base font-normal text-zinc-500">
                  / {activeResult.totalMarks}
                </span>
              </p>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
              {activeResult.percentage}%
            </div>
          </div>
        </div>

        {/* ── Question Statistics with Visual Progress Indicators ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            <span>Question Statistics Breakdown</span>
            <span>{activeResult.totalQuestions} Total Questions</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Card 1: Score Rate */}
            <div className="p-4 rounded-xl bg-zinc-850/70 border border-zinc-800 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-bold uppercase tracking-wider">Score Rate</span>
                <Award size={16} className="text-amber-400" />
              </div>
              <p className="text-2xl font-extrabold text-zinc-100">
                {activeResult.percentage}%
              </p>
              <ProgressBar
                value={activeResult.percentage}
                max={100}
                size="xs"
                variant={isPassed ? 'primary' : 'danger'}
              />
            </div>

            {/* Card 2: Correct Answers */}
            <div className="p-4 rounded-xl bg-zinc-850/70 border border-zinc-800 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-emerald-400">
                <span className="text-xs font-bold uppercase tracking-wider">Correct</span>
                <CheckCircle2 size={16} />
              </div>
              <p className="text-2xl font-extrabold text-emerald-400">
                {activeResult.correct}
              </p>
              <ProgressBar
                value={activeResult.correct}
                max={activeResult.totalQuestions}
                size="xs"
                variant="success"
              />
            </div>

            {/* Card 3: Wrong Answers */}
            <div className="p-4 rounded-xl bg-zinc-850/70 border border-zinc-800 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-red-400">
                <span className="text-xs font-bold uppercase tracking-wider">Wrong</span>
                <XCircle size={16} />
              </div>
              <p className="text-2xl font-extrabold text-red-400">
                {activeResult.wrong}
              </p>
              <ProgressBar
                value={activeResult.wrong}
                max={activeResult.totalQuestions}
                size="xs"
                variant="danger"
              />
            </div>

            {/* Card 4: Unanswered */}
            <div className="p-4 rounded-xl bg-zinc-850/70 border border-zinc-800 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-amber-400">
                <span className="text-xs font-bold uppercase tracking-wider">Unanswered</span>
                <HelpCircle size={16} />
              </div>
              <p className="text-2xl font-extrabold text-amber-400">
                {unansweredCount}
              </p>
              <ProgressBar
                value={unansweredCount}
                max={activeResult.totalQuestions}
                size="xs"
                variant="warning"
              />
            </div>
          </div>

          {/* Segmented Visual Progress Bar */}
          <div className="pt-2">
            <div className="w-full h-2 rounded-full overflow-hidden flex bg-zinc-800">
              <div
                style={{ width: `${correctPct}%` }}
                className="bg-emerald-500 h-full transition-all duration-300"
                title={`Correct: ${activeResult.correct} (${correctPct}%)`}
              />
              <div
                style={{ width: `${wrongPct}%` }}
                className="bg-red-500 h-full transition-all duration-300"
                title={`Wrong: ${activeResult.wrong} (${wrongPct}%)`}
              />
              <div
                style={{ width: `${unansweredPct}%` }}
                className="bg-amber-500 h-full transition-all duration-300"
                title={`Unanswered: ${unansweredCount} (${unansweredPct}%)`}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 mt-2 text-[11px] text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Correct ({correctPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span>Wrong ({wrongPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Unanswered ({unansweredPct}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => setReviewModalOpen(true)}
              leftIcon={<Eye size={16} />}
            >
              View Answers
            </Button>
            <Link to="/student/history">
              <Button variant="secondary" size="md">
                Exam History
              </Button>
            </Link>
          </div>

          <Link to="/student/dashboard">
            <Button variant="ghost" size="md" leftIcon={<ArrowLeft size={14} />}>
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Detailed Breakdown & Information Section ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Summary */}
        <Card padding="p-6">
          <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Award size={16} className="text-amber-400" />
            Performance Summary
          </h2>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-zinc-800">
              <span className="text-zinc-400">Attempt Accuracy</span>
              <span className="font-bold text-zinc-100">{accuracyRate}%</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-zinc-800">
              <span className="text-zinc-400">Questions Attempted</span>
              <span className="font-semibold text-zinc-200">
                {attemptedCount} of {activeResult.totalQuestions}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-zinc-800">
              <span className="text-zinc-400">Average Pace</span>
              <span className="font-semibold text-zinc-200">
                {((activeResult.timeTaken * 60) / activeResult.totalQuestions).toFixed(0)} seconds / question
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-zinc-400">Assessment Verdict</span>
              <span className={`font-semibold ${isPassed ? 'text-emerald-400' : 'text-red-400'}`}>
                {isPassed ? 'Meets Academic Passing Standard' : 'Requires Syllabus Revision'}
              </span>
            </div>
          </div>
        </Card>

        {/* Exam Information */}
        <Card padding="p-6">
          <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-4 flex items-center gap-2">
            <ShieldCheck size={16} className="text-amber-400" />
            Exam Information
          </h2>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-zinc-800">
              <span className="text-zinc-400">Candidate Student ID</span>
              <span className="font-mono font-bold text-zinc-100">{activeResult.studentId}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-zinc-800">
              <span className="text-zinc-400">Result Reference ID</span>
              <span className="font-mono text-zinc-300">{activeResult.id}-EXAM2025</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-zinc-800">
              <span className="text-zinc-400">Submission Timestamp</span>
              <span className="font-medium text-zinc-200">{activeResult.submittedAt.replace('T', ' ')}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-zinc-400">Audit Status</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                <CheckCircle2 size={13} />
                Submission Recorded
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* ── View Answers Review Modal ── */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title={`Answer Key & Solutions — ${activeResult.subject}`}
        size="xl"
        footer={
          <Button variant="secondary" onClick={() => setReviewModalOpen(false)}>
            Close Review
          </Button>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-zinc-400">
            Recorded answers evaluated against official faculty answer keys.
          </p>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {reviewQuestions.map((q, idx) => {
              const isCorrect = idx % 3 !== 1 // simulated realistic correctness
              const selectedIdx = isCorrect ? q.correctAnswer : (q.correctAnswer + 1) % 4

              return (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-zinc-800 bg-zinc-850/60 space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-zinc-100 leading-snug">
                      Q{idx + 1}. {q.text}
                    </span>
                    <Badge variant={isCorrect ? 'success' : 'danger'} size="sm">
                      {isCorrect ? `+${q.marks} Marks` : '0 Marks'}
                    </Badge>
                  </div>

                  <div className="space-y-1.5 pl-2 border-l-2 border-zinc-800">
                    {q.options.map((opt, oIdx) => {
                      const isOptionCorrect = oIdx === q.correctAnswer
                      const isOptionSelected = oIdx === selectedIdx

                      return (
                        <div
                          key={oIdx}
                          className={[
                            'p-2.5 rounded-lg flex items-center justify-between',
                            isOptionCorrect
                              ? 'bg-emerald-950/40 text-emerald-300 font-semibold border border-emerald-800/60'
                              : isOptionSelected
                              ? 'bg-red-950/40 text-red-300 font-semibold border border-red-800/60'
                              : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800/60',
                          ].join(' ')}
                        >
                          <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                          {isOptionCorrect && (
                            <span className="text-[10px] uppercase font-bold text-emerald-400 ml-2">
                              Correct Key
                            </span>
                          )}
                          {!isCorrect && isOptionSelected && (
                            <span className="text-[10px] uppercase font-bold text-red-400 ml-2">
                              Your Answer
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Modal>
    </div>
  )
}
