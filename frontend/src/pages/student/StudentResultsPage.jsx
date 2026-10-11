import { useState, useMemo, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Eye, RefreshCw, ClipboardList } from 'lucide-react'
import {
  Card,
  Badge,
  Button,
  Modal,
  Select,
  Skeleton,
  EmptyState,
  ErrorState,
} from '../../components/common'
import { api } from '../../lib/api'

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

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return dateStr
  }
}

/**
 * ScoreRing — SVG progress ring around the final score.
 */
function ScoreRing({ percentage, passed, score, totalMarks }) {
  const radius = 34
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, percentage || 0))

  return (
    <div className="relative h-24 w-24 flex-shrink-0 animate-panel-in">
      <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90" aria-hidden="true">
        <circle cx="40" cy="40" r={radius} fill="none" strokeWidth="6" className="stroke-sunken" />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped / 100)}
          className={passed ? 'stroke-success' : 'stroke-danger'}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-semibold tabular-nums text-ink">
          {score}
          <span className="text-sm font-normal text-ink-3">/{totalMarks}</span>
        </span>
        <span className="text-xs tabular-nums text-ink-3">{clamped}%</span>
      </div>
    </div>
  )
}

export default function StudentResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    setLoadError(null)
    api('/student/results')
      .then((data) => setAttempts(Array.isArray(data) ? data : []))
      .catch((error) => setLoadError(error.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Derive display rows from the fields the API actually returns.
  const studentResults = useMemo(() => {
    return attempts.map((attempt) => {
      const answers = attempt.answers || []
      const correct = answers.filter((answer) => answer.awardedMarks > 0).length
      const incorrect = answers.length - correct
      const totalMarks = attempt.exam?.totalMarks || 0
      const score = attempt.score ?? 0
      const percentage = totalMarks ? Math.round((score / totalMarks) * 100) : 0
      const durationMinutes =
        attempt.startedAt && attempt.submittedAt
          ? Math.max(1, Math.round((new Date(attempt.submittedAt) - new Date(attempt.startedAt)) / 60000))
          : null

      return {
        ...attempt,
        examTitle: attempt.exam?.title || 'Examination',
        subject: attempt.exam?.subject || '',
        totalMarks,
        score,
        percentage,
        attempted: answers.length,
        correct,
        incorrect,
        accuracy: answers.length ? Math.round((correct / answers.length) * 100) : 0,
        durationMinutes,
        passed: score >= (attempt.exam?.passingMarks || 0),
      }
    })
  }, [attempts])

  // Select active result from query param or first available
  const resultIdParam = searchParams.get('id')
  const activeResult = useMemo(() => {
    if (resultIdParam) {
      const match = studentResults.find((r) => r.id === resultIdParam)
      if (match) return match
    }
    return studentResults[0]
  }, [studentResults, resultIdParam])

  // ── Loading ──
  if (loading) {
    return (
      <div className="max-w-5xl space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="card space-y-6 p-6">
          <Skeleton variant="block" className="h-24 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    )
  }

  // ── Error ──
  if (loadError) {
    return (
      <div className="max-w-5xl">
        <ErrorState
          title="Could not load your results"
          message={loadError}
          onRetry={load}
          retryLabel="Retry"
        />
      </div>
    )
  }

  // ── Empty ──
  if (!activeResult) {
    return (
      <div className="max-w-5xl">
        <div className="card">
          <EmptyState
            icon={<ClipboardList size={28} />}
            title="No examination results yet"
            message="Results appear here once you complete a published examination."
            action={
              <Link to="/student/exams">
                <Button size="sm">Browse examinations</Button>
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  const isPassed = activeResult.passed
  const breakdown = [
    { label: 'Correct',    value: activeResult.correct,   color: 'bg-success', text: 'text-success' },
    { label: 'Incorrect',  value: activeResult.incorrect, color: 'bg-danger',  text: 'text-danger' },
  ]
  const attemptedTotal = activeResult.attempted || 1

  const summary = [
    { label: 'Attempt accuracy',    value: `${activeResult.accuracy}%` },
    { label: 'Questions attempted', value: `${activeResult.attempted}` },
    { label: 'Marks awarded',       value: `${activeResult.score} of ${activeResult.totalMarks}` },
    { label: 'Time taken',          value: activeResult.durationMinutes != null ? `${activeResult.durationMinutes} min` : '-' },
  ]

  const info = [
    { label: 'Subject',      value: activeResult.subject || '-' },
    { label: 'Result ID',    value: activeResult.id },
    { label: 'Submitted at', value: formatDateTime(activeResult.submittedAt) },
    { label: 'Status',       value: activeResult.status },
  ]

  return (
    <div className="max-w-5xl space-y-8">
      {/* ── Header ── */}
      <header className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/student/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-3 transition-colors duration-fast hover:text-ink"
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
            <div className="flex flex-wrap items-center gap-2 text-sm text-ink-3">
              {activeResult.subject && <span>{activeResult.subject}</span>}
              <Badge variant={isPassed ? 'success' : 'danger'} dot>
                {isPassed ? 'Passed' : 'Failed'}
              </Badge>
            </div>
            <h1 className="mt-2 page-title">{activeResult.examTitle}</h1>
            <p className="page-subtitle">Submitted {formatDate(activeResult.submittedAt)}</p>
          </div>
        </div>
      </header>

      {/* ── Score + breakdown ── */}
      <Card>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <ScoreRing
            percentage={activeResult.percentage}
            passed={isPassed}
            score={activeResult.score}
            totalMarks={activeResult.totalMarks}
          />

          <div className="min-w-0 flex-1">
            <h2 className="section-title">Question breakdown</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4">
              {breakdown.map(({ label, value, text }) => (
                <div key={label}>
                  <dt className="eyebrow">{label}</dt>
                  <dd className={`mt-1 text-2xl font-semibold tabular-nums ${text}`}>{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 flex h-2 w-full overflow-hidden rounded-full bg-sunken">
              <div
                style={{ width: `${(activeResult.correct / attemptedTotal) * 100}%` }}
                className="h-full bg-success transition-[width] duration-slow ease-emphasized"
              />
              <div
                style={{ width: `${(activeResult.incorrect / attemptedTotal) * 100}%` }}
                className="h-full bg-danger transition-[width] duration-slow ease-emphasized"
              />
            </div>
            <p className="mt-2 text-xs text-ink-3">
              Based on the {activeResult.attempted} question{activeResult.attempted === 1 ? '' : 's'} you attempted.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-6">
          <Button
            onClick={() => setReviewModalOpen(true)}
            leftIcon={<Eye size={16} />}
            disabled={activeResult.attempted === 0}
          >
            Review responses
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
          <dl className="mt-4 divide-y divide-line text-sm">
            {summary.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between gap-4 py-2">
                <dt className="text-ink-3">{label}</dt>
                <dd className="font-medium tabular-nums text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card>
          <h2 className="section-title">Result information</h2>
          <dl className="mt-4 divide-y divide-line text-sm">
            {info.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between gap-4 py-2">
                <dt className="text-ink-3">{label}</dt>
                <dd className="max-w-[60%] truncate font-medium tabular-nums text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>

      {/* ── Recorded responses modal ── */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title={`Recorded responses — ${activeResult.subject || activeResult.examTitle}`}
        size="lg"
        footer={
          <Button variant="secondary" onClick={() => setReviewModalOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-ink-3">
            Each saved response with the marks awarded. Question text and the answer key are not
            returned by the results API.
          </p>

          {activeResult.attempted === 0 ? (
            <EmptyState
              title="No recorded responses"
              message="No answers were saved before this attempt was submitted."
            />
          ) : (
            <ol className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
              {activeResult.answers.map((answer, idx) => {
                const isCorrect = answer.awardedMarks > 0
                const letter = String.fromCharCode(65 + (answer.selectedOption ?? 0))
                return (
                  <li
                    key={answer.id || answer.questionId || idx}
                    className="flex items-center justify-between gap-4 rounded-lg border border-line px-4 py-3 text-sm"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-ink-3 tabular-nums">Q{idx + 1}</span>
                      <span className="font-medium text-ink">Option {letter}</span>
                    </span>
                    <Badge variant={isCorrect ? 'success' : 'danger'} size="sm">
                      {isCorrect ? `+${answer.awardedMarks} marks` : 'No marks'}
                    </Badge>
                  </li>
                )
              })}
            </ol>
          )}

          <p className="flex items-center gap-2 border-t border-line pt-4 text-xs text-ink-4">
            <RefreshCw size={12} />
            Scores are recalculated from your saved responses on the server.
          </p>
        </div>
      </Modal>
    </div>
  )
}
