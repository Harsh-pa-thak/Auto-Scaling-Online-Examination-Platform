import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  History,
  Search,
  Award,
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,
  RotateCcw,
  FileText,
} from 'lucide-react'
import {
  Table,
  Badge,
  Button,
  SearchBar,
  EmptyState,
} from '../../components/common'
import { mockResults } from '../../data/mockData'
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
  { id: 'all',    label: 'All Attempts' },
  { id: 'passed', label: 'Passed' },
  { id: 'failed', label: 'Failed' },
]

export default function StudentHistoryPage() {
  const { user } = useAuth()
  const studentId = user?.id || '24BCE1234'

  const [activeFilter, setActiveFilter] = useState('all') // 'all' | 'passed' | 'failed'
  const [searchQuery, setSearchQuery] = useState('')

  // Student results
  const allStudentResults = useMemo(() => {
    return mockResults.filter((r) => r.studentId === studentId)
  }, [studentId])

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
          <p className="font-semibold text-zinc-100">{row.examTitle}</p>
          <span className="text-xs text-zinc-500 font-mono">Attempt ID: {row.id}</span>
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (val) => (
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700/60 font-mono">
          {val}
        </span>
      ),
    },
    {
      key: 'submittedAt',
      label: 'Date',
      render: (val) => (
        <span className="text-xs text-zinc-300 font-medium">
          {formatDate(val)}
        </span>
      ),
    },
    {
      key: 'score',
      label: 'Score',
      render: (val, row) => (
        <span className="text-xs font-semibold text-zinc-200">
          {row.score} <span className="text-zinc-500 font-normal">/ {row.totalMarks}</span>
        </span>
      ),
    },
    {
      key: 'percentage',
      label: 'Percentage',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-zinc-100 text-xs">{val}%</span>
          {row.grade && (
            <Badge variant="primary" size="sm">
              Grade {row.grade}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <Badge
          variant={val === 'passed' ? 'success' : 'danger'}
          dot
          size="sm"
        >
          {val === 'passed' ? 'Passed' : 'Failed'}
        </Badge>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      align: 'right',
      render: (val, row) => (
        <Link to={`/student/results?id=${row.id}`}>
          <Button variant="secondary" size="xs" rightIcon={<Eye size={12} />}>
            View Result
          </Button>
        </Link>
      ),
    },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* ── Page Header ── */}
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
          Examination History
        </h1>
        <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
          Comprehensive records of completed university examinations, finalized scores, and academic evaluations.
        </p>
      </div>

      {/* ── Filters Row: Tabs + Search Bar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Filter Tabs (All, Passed, Failed) */}
        <div className="flex p-1 bg-zinc-900 rounded-xl border border-zinc-800 max-w-md">
          {TABS.map((tab) => {
            const count = counts[tab.id] ?? 0
            const isActive = activeFilter === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-zinc-100 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/50'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search Bar */}
        <div className="w-full sm:w-72">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by exam or subject…"
          />
        </div>
      </div>

      {/* ── Table or Empty State ── */}
      {filteredResults.length === 0 ? (
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
          <EmptyState
            icon={<History size={30} className="text-zinc-500" />}
            title="No examination records found"
            message={
              searchQuery || activeFilter !== 'all'
                ? 'No past attempts match your current filters. Try resetting the search or status filter.'
                : 'You have not completed any online examinations yet.'
            }
            action={
              (searchQuery || activeFilter !== 'all') && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setActiveFilter('all')
                    setSearchQuery('')
                  }}
                  leftIcon={<RotateCcw size={13} />}
                >
                  Reset Filters
                </Button>
              )
            }
          />
        </div>
      ) : (
        <Table
          columns={columns}
          data={filteredResults}
          emptyTitle="No results found"
        />
      )}
    </div>
  )
}
