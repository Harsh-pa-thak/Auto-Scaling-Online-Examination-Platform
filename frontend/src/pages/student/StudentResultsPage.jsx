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
  X,
  Sparkles,
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
      <div className="py-12 text-center">
        <p className="text-slate-500">No examination results found.</p>
        <Link to="/student/dashboard" className="mt-4 inline-block">
          <Button variant="secondary" size="sm">Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  const isPassed = activeResult.status === 'passed'
  const unansweredCount =
    activeResult.totalQuestions - (activeResult.attempted ?? (activeResult.correct + activeResult.wrong))

  const accuracyRate = activeResult.attempted
    ? Math.round((activeResult.correct / activeResult.attempted) * 100)
    : 0

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* ── Top Bar with Back Link & Exam Switcher ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          to="/student/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </Link>

        {/* Dropdown to switch between completed exams */}
        {studentResults.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Select Result:</span>
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
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
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

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeResult.examTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Submitted on {formatDate(activeResult.submittedAt)} • Time Taken: {activeResult.timeTaken} minutes
            </p>
          </div>

          {/* Large Circular / Score Badge */}
          <div className="flex items-center gap-3 sm:flex-col sm:items-end flex-shrink-0">
            <div className="text-left sm:text-right">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Total Score
              </span>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                {activeResult.score}{' '}
                <span className="text-base sm:text-lg font-normal text-slate-400">
                  / {activeResult.totalMarks}
                </span>
              </p>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-primary-600">
              {activeResult.percentage}%
            </div>
          </div>
        </div>

        {/* ── Visual Metric Statistics Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Card 1: Overall Percentage */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Score Rate</span>
              <Award size={16} className="text-primary-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">
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
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-emerald-700">
              <span className="text-xs font-bold uppercase tracking-wider">Correct</span>
              <CheckCircle2 size={16} className="text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-700">
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
          <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-red-700">
              <span className="text-xs font-bold uppercase tracking-wider">Incorrect</span>
              <XCircle size={16} className="text-red-600" />
            </div>
            <p className="text-2xl font-extrabold text-red-700">
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
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-amber-700">
              <span className="text-xs font-bold uppercase tracking-wider">Unanswered</span>
              <HelpCircle size={16} className="text-amber-600" />
            </div>
            <p className="text-2xl font-extrabold text-amber-700">
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

        {/* ── Buttons Row ── */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => setReviewModalOpen(true)}
              leftIcon={<Eye size={16} />}
            >
              View Answers & Explanations
            </Button>
            <Link to="/student/history">
              <Button variant="secondary" size="md">
                Exam History
              </Button>
            </Link>
          </div>

          <Link to="/student/dashboard">
            <Button variant="ghost" size="md">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Detailed Breakdown & Information Section ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Summary */}
        <Card padding="p-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Award size={16} className="text-amber-600" />
            Performance & Analytics
          </h2>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Attempt Accuracy</span>
              <span className="font-bold text-slate-900">{accuracyRate}%</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Total Questions Attempted</span>
              <span className="font-semibold text-slate-800">
                {activeResult.attempted || activeResult.correct + activeResult.wrong} of {activeResult.totalQuestions}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Average Pace</span>
              <span className="font-semibold text-slate-800">
                {((activeResult.timeTaken * 60) / activeResult.totalQuestions).toFixed(0)} seconds / question
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500">Performance Assessment</span>
              <span className="font-bold text-emerald-600">
                {isPassed ? 'Meets Course Competency Standard' : 'Requires Syllabus Revision'}
              </span>
            </div>
          </div>
        </Card>

        {/* Exam & Candidate Information */}
        <Card padding="p-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <ShieldCheck size={16} className="text-primary-600" />
            Candidate & Audit Verification
          </h2>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Candidate Student ID</span>
              <span className="font-mono font-bold text-slate-900">{activeResult.studentId}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Result Reference Token</span>
              <span className="font-mono text-slate-600">{activeResult.id}-VIT2025</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Submission Timestamp</span>
              <span className="font-medium text-slate-800">{activeResult.submittedAt.replace('T', ' ')}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500">Proctoring Audit</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                <CheckCircle2 size={13} />
                Integrity Verified
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
        <div className="space-y-5">
          <p className="text-xs text-slate-500">
            Review of recorded answers against faculty answer keys.
          </p>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {reviewQuestions.map((q, idx) => {
              const isCorrect = idx % 3 !== 1 // simulated realistic correctness
              const selectedIdx = isCorrect ? q.correctAnswer : (q.correctAnswer + 1) % 4

              return (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-900">
                      Q{idx + 1}. {q.text}
                    </span>
                    <Badge variant={isCorrect ? 'success' : 'danger'} size="sm">
                      {isCorrect ? '+2 Marks' : '0 Marks'}
                    </Badge>
                  </div>

                  <div className="space-y-1.5 pl-2 border-l-2 border-slate-200">
                    {q.options.map((opt, oIdx) => {
                      const isOptionCorrect = oIdx === q.correctAnswer
                      const isOptionSelected = oIdx === selectedIdx

                      return (
                        <div
                          key={oIdx}
                          className={[
                            'p-2 rounded-lg flex items-center justify-between',
                            isOptionCorrect
                              ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200'
                              : isOptionSelected
                              ? 'bg-red-50 text-red-800 font-semibold border border-red-200'
                              : 'text-slate-600',
                          ].join(' ')}
                        >
                          <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                          {isOptionCorrect && (
                            <span className="text-[10px] uppercase font-bold text-emerald-700">
                              Correct Key
                            </span>
                          )}
                          {!isCorrect && isOptionSelected && (
                            <span className="text-[10px] uppercase font-bold text-red-600">
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
