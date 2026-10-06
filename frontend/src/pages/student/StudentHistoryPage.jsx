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
        if (!matchesTitle && !matchesSubject) return false
      }

      return true
    })
  }, [allStudentResults, activeFilter, searchQuery])

  // Table columns
  const columns = [
    {
      key: 'examTitle',
      label: 'Exam',
      render: (val, row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.examTitle}</p>
          <span className="text-xs text-slate-400 font-mono">Attempt ID: {row.id}</span>
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (val) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
          {val}
        </span>
      ),
    },
    {
      key: 'submittedAt',
      label: 'Date',
      render: (val) => (
        <span className="text-xs text-slate-600 font-medium">
          {formatDate(val)}
        </span>
      ),
    },
    {
      key: 'score',
      label: 'Score',
      render: (val, row) => (
        <span className="text-xs font-semibold text-slate-800">
          {row.score} <span className="text-slate-400 font-normal">/ {row.totalMarks}</span>
        </span>
      ),
    },
    {
      key: 'percentage',
      label: 'Percentage',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 text-xs">{val}%</span>
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
            Scorecard
          </Button>
        </Link>
      ),
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ── Page Header ── */}
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Examination History
        </h1>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          Historical records of your past online examinations, finalized scores, and academic evaluations.
        </p>
      </div>

      {/* ── Status Tabs & Search Bar Row ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Filter Tabs (All, Passed, Failed) */}
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/60 max-w-md">
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
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-primary-50 text-primary-700' : 'bg-slate-200 text-slate-600'
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
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <EmptyState
            icon={<History size={30} className="text-slate-400" />}
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
