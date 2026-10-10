import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { History, Eye, RotateCcw } from 'lucide-react'
import {
  Table,
  Badge,
  Button,
  SearchBar,
  EmptyState,
} from '../../components/common'
import { api } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'

// Date format helper
function formatDate(dateStr) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

const TABS = [
  { id: 'all',    label: 'All' },
  { id: 'passed', label: 'Passed' },
  { id: 'failed', label: 'Failed' },
]

export default function StudentHistoryPage() {
  const { user } = useAuth()
  const studentId = user?.id
  const [attempts, setAttempts] = useState([])
  useEffect(() => { api('/student/history').then(setAttempts).catch(() => {}) }, [])

  const [activeFilter, setActiveFilter] = useState('all') // 'all' | 'passed' | 'failed'
  const [searchQuery, setSearchQuery] = useState('')

  // Student results
  const allStudentResults = useMemo(() => {
    return attempts.map((attempt) => ({
      ...attempt,
      id: attempt.id,
      examTitle: attempt.exam?.title,
      subject: attempt.exam?.subject,
      score: attempt.score || 0,
      totalMarks: attempt.exam?.totalMarks || 0,
      percentage: attempt.exam?.totalMarks ? Math.round((attempt.score / attempt.exam.totalMarks) * 100) : 0,
      status: attempt.score >= (attempt.exam?.passingMarks || 0) ? 'passed' : 'failed',
      submittedAt: attempt.submittedAt,
    }))
  }, [attempts, studentId])

  // Tab counts
  const counts = useMemo(() => {
    return {
      all: allStudentResults.length,
      passed: allStudentResults.filter((r) => r.status === 'passed').length,
      failed: allStudentResults.filter((r) => r.status === 'failed').length,
    }
  }, [allStudentResults])

  // Filtered results
  const filteredResults = useMemo(() => {
    return allStudentResults.filter((res) => {
      // Status filter
      if (activeFilter !== 'all' && res.status !== activeFilter) {
        return false
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchesTitle = res.examTitle?.toLowerCase().includes(query)
        const matchesSubject = res.subject?.toLowerCase().includes(query)
        const matchesId = res.id?.toLowerCase().includes(query)
        if (!matchesTitle && !matchesSubject && !matchesId) return false
      }

      return true
    })
  }, [allStudentResults, activeFilter, searchQuery])

  // Table columns: Exam, Subject, Date, Score, Percentage, Status
  const columns = [
    {
      key: 'examTitle',
      label: 'Exam',
      render: (val, row) => (
        <div>
          <p className="font-medium text-zinc-100">{row.examTitle}</p>
          <p className="text-xs tabular-nums text-zinc-500">Attempt {row.id}</p>
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (val) => <span className="text-zinc-300">{val}</span>,
    },
    {
      key: 'submittedAt',
      label: 'Date',
      render: (val) => <span className="text-zinc-300">{formatDate(val)}</span>,
    },
    {
      key: 'score',
      label: 'Score',
      render: (val, row) => (
        <span className="tabular-nums text-zinc-100">
          {row.score} <span className="text-zinc-500">/ {row.totalMarks}</span>
        </span>
      ),
    },
    {
      key: 'percentage',
      label: 'Percentage',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <span className="tabular-nums text-zinc-100">{val}%</span>
          {row.grade && <Badge size="sm">Grade {row.grade}</Badge>}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <Badge variant={val === 'passed' ? 'success' : 'danger'} dot size="sm">
          {val === 'passed' ? 'Passed' : 'Failed'}
        </Badge>
      ),
    },
    {
      key: 'action',
      label: '',
      align: 'right',
      render: (val, row) => (
        <Link to={`/student/results?id=${row.id}`}>
          <Button variant="secondary" size="xs" rightIcon={<Eye size={12} />}>
            View
          </Button>
        </Link>
      ),
    },
  ]

  const filtersActive = searchQuery || activeFilter !== 'all'

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Examination history</h1>
          <p className="page-subtitle">
            Completed examinations, final scores, and grades.
          </p>
        </div>
      </header>

      <div className="space-y-4">
        {/* ── Tabs + Search ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <nav aria-label="Result status" className="flex gap-6 border-b border-zinc-800 sm:flex-1">
            {TABS.map((tab) => {
              const count = counts[tab.id] ?? 0
              const isActive = activeFilter === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`-mb-px flex items-center gap-2 border-b-2 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-amber-500 text-zinc-50'
                      : 'border-transparent text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  {tab.label}
                  <span className="tabular-nums text-zinc-500">{count}</span>
                </button>
              )
            })}
          </nav>

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by exam or subject"
            className="w-full sm:mb-1 sm:w-72"
          />
        </div>

        {/* ── Table or Empty State ── */}
        {filteredResults.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={<History size={28} />}
              title="No examination records found"
              message={
                filtersActive
                  ? 'No past attempts match your filters.'
                  : 'You have not completed any online examinations yet.'
              }
              action={
                filtersActive && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setActiveFilter('all')
                      setSearchQuery('')
                    }}
                    leftIcon={<RotateCcw size={14} />}
                  >
                    Reset filters
                  </Button>
                )
              }
            />
          </div>
        ) : (
          <Table columns={columns} data={filteredResults} emptyTitle="No results found" />
        )}
      </div>
    </div>
  )
}
