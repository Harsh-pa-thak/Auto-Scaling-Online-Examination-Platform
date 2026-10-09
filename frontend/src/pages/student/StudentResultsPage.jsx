import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Eye } from 'lucide-react'
import {
  Card,
  Badge,
  Button,
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
      <div className="space-y-4 py-16 text-center">
        <p className="text-zinc-400">No examination results found.</p>
        <Link to="/student/dashboard" className="inline-block">
          <Button variant="secondary" size="sm">Back to dashboard</Button>
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

  const breakdown = [
    { label: 'Correct',    value: activeResult.correct, pct: correctPct,    color: 'bg-emerald-500', text: 'text-emerald-400' },
    { label: 'Wrong',      value: activeResult.wrong,   pct: wrongPct,      color: 'bg-red-500',     text: 'text-red-400' },
    { label: 'Unanswered', value: unansweredCount,      pct: unansweredPct, color: 'bg-zinc-600',    text: 'text-zinc-300' },
  ]

  const summary = [
    { label: 'Attempt accuracy',     value: `${accuracyRate}%` },
    { label: 'Questions attempted',  value: `${attemptedCount} of ${activeResult.totalQuestions}` },
    { label: 'Average pace',         value: `${((activeResult.timeTaken * 60) / activeResult.totalQuestions).toFixed(0)} s per question` },
    { label: 'Time taken',           value: `${activeResult.timeTaken} min` },
  ]

  const info = [
    { label: 'Student ID',   value: activeResult.studentId },
    { label: 'Result ID',    value: activeResult.id },
    { label: 'Submitted at', value: activeResult.submittedAt.replace('T', ' ') },
  ]

  return (
    <div className="max-w-5xl space-y-8">
      {/* ── Header ── */}
      <header className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/student/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
          >
            <ArrowLeft size={14} />
            Back to dashboard
          </Link>

          {studentResults.length > 1 && (
            <Select
              id="result-selector"
              aria-label="Choose a result"
              value={activeResult.id}
              onChange={(e) => setSearchParams({ id: e.target.value })}
              options={studentResults.map((r) => ({
                value: r.id,
                label: `${r.examTitle} (${r.percentage}%)`,
              }))}
              className="w-full sm:w-96"
            />
          )}
        </div>

        <div className="page-header">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
              <span>{activeResult.subject}</span>
              <Badge variant={isPassed ? 'success' : 'danger'} dot>
                {isPassed ? 'Passed' : 'Failed'}
              </Badge>
              {activeResult.grade && <Badge>Grade {activeResult.grade}</Badge>}
            </div>
            <h1 className="mt-2 page-title">{activeResult.examTitle}</h1>
            <p className="page-subtitle">Submitted {formatDate(activeResult.submittedAt)}</p>
          </div>

          <div className="sm:text-right">
            <p className="eyebrow">Final score</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-zinc-50">
              {activeResult.score}
              <span className="text-base font-normal text-zinc-500"> / {activeResult.totalMarks}</span>
            </p>
            <p className="text-sm tabular-nums text-zinc-400">{activeResult.percentage}%</p>
          </div>
        </div>
      </header>

      {/* ── Question breakdown ── */}
      <Card>
        <div className="flex items-center justify-between gap-4">
          <h2 className="section-title">Question breakdown</h2>
          <span className="text-sm tabular-nums text-zinc-400">
            {activeResult.totalQuestions} questions
          </span>
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-4">
          {breakdown.map(({ label, value, text }) => (
            <div key={label}>
              <dt className="eyebrow">{label}</dt>
              <dd className={`mt-1 text-2xl font-semibold tabular-nums ${text}`}>{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex h-2 w-full overflow-hidden rounded-full bg-zinc-800">
          {breakdown.map(({ label, value, pct, color }) => (
            <div
              key={label}
              style={{ width: `${pct}%` }}
              className={`h-full ${color}`}
              title={`${label}: ${value} (${pct}%)`}
            />
          ))}
        </div>
        <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-zinc-400">
          {breakdown.map(({ label, pct, color }) => (
            <li key={label} className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${color}`} />
              {label} ({pct}%)
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-zinc-800 pt-6">
          <Button onClick={() => setReviewModalOpen(true)} leftIcon={<Eye size={16} />}>
            View answers
          </Button>
          <Link to="/student/history">
            <Button variant="secondary">Exam history</Button>
          </Link>
        </div>
      </Card>

      {/* ── Details ── */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <h2 className="section-title">Performance</h2>
          <dl className="mt-4 divide-y divide-zinc-800 text-sm">
            {summary.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between gap-4 py-2">
                <dt className="text-zinc-400">{label}</dt>
                <dd className="font-medium tabular-nums text-zinc-100">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card>
          <h2 className="section-title">Exam information</h2>
          <dl className="mt-4 divide-y divide-zinc-800 text-sm">
            {info.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between gap-4 py-2">
                <dt className="text-zinc-400">{label}</dt>
                <dd className="font-medium tabular-nums text-zinc-100">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>

      {/* ── View Answers Review Modal ── */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title={`Answer key — ${activeResult.subject}`}
        size="xl"
        footer={
          <Button variant="secondary" onClick={() => setReviewModalOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">
            Your recorded answers compared with the official answer key.
          </p>

          <ol className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
            {reviewQuestions.map((q, idx) => {
              const isCorrect = idx % 3 !== 1 // simulated correctness for mock data
              const selectedIdx = isCorrect ? q.correctAnswer : (q.correctAnswer + 1) % 4

              return (
                <li key={q.id} className="space-y-4 rounded-lg border border-zinc-800 p-4 text-sm">
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-medium text-zinc-100">
                      {idx + 1}. {q.text}
                    </p>
                    <Badge variant={isCorrect ? 'success' : 'danger'} size="sm">
                      {isCorrect ? `+${q.marks}` : '0'} marks
                    </Badge>
                  </div>

                  <ul className="space-y-2">
                    {q.options.map((opt, oIdx) => {
                      const isOptionCorrect = oIdx === q.correctAnswer
                      const isOptionSelected = oIdx === selectedIdx

                      return (
                        <li
                          key={oIdx}
                          className={[
                            'flex items-center justify-between gap-4 rounded-lg border px-3 py-2',
                            isOptionCorrect
                              ? 'border-emerald-500/40 text-emerald-300'
                              : isOptionSelected
                              ? 'border-red-500/40 text-red-300'
                              : 'border-zinc-800 text-zinc-400',
                          ].join(' ')}
                        >
                          <span>
                            {String.fromCharCode(65 + oIdx)}. {opt}
                          </span>
                          {isOptionCorrect && <span className="text-xs font-medium">Correct answer</span>}
                          {!isCorrect && isOptionSelected && (
                            <span className="text-xs font-medium">Your answer</span>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </li>
              )
            })}
          </ol>
        </div>
      </Modal>
    </div>
  )
}
