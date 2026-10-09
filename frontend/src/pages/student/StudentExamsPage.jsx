import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  LayoutGrid,
  List,
  Play,
  ArrowRight,
  RotateCcw,
} from 'lucide-react'
import { SearchBar, Select, Badge, Button, EmptyState, Table } from '../../components/common'
import ExamCard from '../../components/student/ExamCard'
import { api } from '../../lib/api'

const TABS = [
  { id: 'all',       label: 'All' },
  { id: 'upcoming',  label: 'Upcoming' },
  { id: 'active',    label: 'Active' },
  { id: 'completed', label: 'Completed' },
]

// Date/Time helper formatters
function formatDate(dateStr) {
  if (!dateStr) return 'TBA'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return dateStr
  }
}

function formatTime(dateStr) {
  if (!dateStr) return 'TBA'
  try {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
  } catch {
    return dateStr
  }
}

export default function StudentExamsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'table'
  const [exams, setExams] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    api('/exams').then(setExams).catch((err) => setError(err.message))
  }, [])

  // Extract unique subjects for dropdown filter
  const subjects = useMemo(() => {
    const set = new Set(exams.map((e) => e.subject).filter(Boolean))
    return Array.from(set).sort()
  }, [exams])

  // Calculate counts per tab
  const tabCounts = useMemo(() => {
    return {
      all: exams.length,
      upcoming: exams.filter((e) => e.status === 'upcoming').length,
      active: exams.filter((e) => e.status === 'active').length,
      completed: exams.filter((e) => e.status === 'completed').length,
    }
  }, [exams])

  // Filter exams based on tab, search query, and subject filter
  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      // 1. Tab filter
      if (activeTab !== 'all' && exam.status !== activeTab) {
        return false
      }

      // 2. Subject dropdown filter
      if (selectedSubject && exam.subject !== selectedSubject) {
        return false
      }

      // 3. Search query filter (by title, subject, or course code)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchesTitle = exam.title?.toLowerCase().includes(query)
        const matchesSubject = exam.subject?.toLowerCase().includes(query)
        const matchesCode = exam.code?.toLowerCase().includes(query)
        if (!matchesTitle && !matchesSubject && !matchesCode) {
          return false
        }
      }

      return true
    })
  }, [exams, activeTab, selectedSubject, searchQuery])

  const handleResetFilters = () => {
    setActiveTab('all')
    setSearchQuery('')
    setSelectedSubject('')
  }

  // Table columns definition for Table View
  const tableColumns = [
    {
      key: 'title',
      label: 'Exam',
      render: (val, row) => (
        <div>
          <p className="font-medium text-zinc-100">{row.title}</p>
          <p className="text-xs text-zinc-400">
            {row.subject} · <span className="tabular-nums">{row.code}</span>
          </p>
        </div>
      ),
    },
    {
      key: 'startTime',
      label: 'Date & time',
      render: (val, row) => (
        <div>
          <p className="text-zinc-100">{formatDate(val)}</p>
          <p className="text-xs tabular-nums text-zinc-400">
            {formatTime(val)} {row.endTime && `– ${formatTime(row.endTime)}`}
          </p>
        </div>
      ),
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (val) => <span className="tabular-nums text-zinc-200">{val} min</span>,
    },
    {
      key: 'totalQuestions',
      label: 'Questions',
      render: (val, row) => (
        <span className="tabular-nums text-zinc-200">
          {val} <span className="text-zinc-500">({row.totalMarks} marks)</span>
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        if (val === 'active') return <Badge variant="primary" dot>Live</Badge>
        if (val === 'upcoming') return <Badge dot>Upcoming</Badge>
        if (val === 'completed') return <Badge>Completed</Badge>
        return <Badge>Unavailable</Badge>
      },
    },
    {
      key: 'action',
      label: '',
      align: 'right',
      render: (val, row) => {
        if (row.status === 'active') {
          return (
            <Link to={`/student/exams/${row.id}`}>
              <Button size="xs" rightIcon={<Play size={12} className="fill-current" />}>
                Start
              </Button>
            </Link>
          )
        }
        if (row.status === 'upcoming') {
          return (
            <Link to={`/student/exams/${row.id}`}>
              <Button variant="secondary" size="xs" rightIcon={<ArrowRight size={12} />}>
                Details
              </Button>
            </Link>
          )
        }
        if (row.status === 'completed') {
          return (
            <Link to="/student/results">
              <Button variant="ghost" size="xs">
                Results
              </Button>
            </Link>
          )
        }
        return (
          <Button variant="secondary" size="xs" disabled>
            Unavailable
          </Button>
        )
      },
    },
  ]

  const filtersActive = searchQuery || selectedSubject || activeTab !== 'all'

  const viewButton = (mode) =>
    `rounded-md p-2 transition-colors ${
      viewMode === mode ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-200'
    }`

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Examinations</h1>
          <p className="page-subtitle">
            Upcoming assessments, live sessions, and past test records.
          </p>
        </div>
      </header>

      <div className="space-y-4">
        {/* ── Status Tabs ── */}
        <nav aria-label="Exam status" className="flex gap-6 overflow-x-auto border-b border-zinc-800">
          {TABS.map((tab) => {
            const count = tabCounts[tab.id] ?? 0
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`-mb-px flex items-center gap-2 whitespace-nowrap border-b-2 py-3 text-sm font-medium transition-colors ${
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

        {/* ── Search, Filters, View Switcher ── */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by title, subject, or code"
            className="flex-1"
          />

          <div className="flex items-center gap-2">
            <Select
              id="subject-filter"
              placeholder="All subjects"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              options={subjects.map((sub) => ({ value: sub, label: sub }))}
              className="min-w-[180px]"
            />

            {filtersActive && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                leftIcon={<RotateCcw size={14} />}
              >
                Reset
              </Button>
            )}

            <div className="ml-auto flex items-center gap-1 rounded-lg border border-zinc-800 p-1 md:ml-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
                className={viewButton('grid')}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                aria-label="Table view"
                aria-pressed={viewMode === 'table'}
                className={viewButton('table')}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {filtersActive && (
          <p className="text-sm text-zinc-400">
            {filteredExams.length} {filteredExams.length === 1 ? 'match' : 'matches'}
          </p>
        )}
      </div>

      {/* ── Results (Grid or Table) ── */}
      {filteredExams.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<FileText size={28} />}
            title="No examinations match your filters"
            message="Try a different search, status, or subject."
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={handleResetFilters}
                leftIcon={<RotateCcw size={14} />}
              >
                Clear filters
              </Button>
            }
          />
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} isActive={exam.status === 'active'} />
          ))}
        </div>
      ) : (
        <Table columns={tableColumns} data={filteredExams} emptyTitle="No examinations found" />
      )}
    </div>
  )
}
