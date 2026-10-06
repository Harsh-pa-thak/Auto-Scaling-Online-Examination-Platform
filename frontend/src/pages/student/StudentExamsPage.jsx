import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Search,
  Filter,
  LayoutGrid,
  List,
  Calendar,
  Clock,
  Timer,
  Play,
  ArrowRight,
  RotateCcw,
  BookOpen,
} from 'lucide-react'
import { SearchBar, Select, Badge, Button, EmptyState, Table } from '../../components/common'
import ExamCard from '../../components/student/ExamCard'
import { mockExams } from '../../data/mockData'

const TABS = [
  { id: 'all',       label: 'All Examinations' },
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

  // Extract unique subjects for dropdown filter
  const subjects = useMemo(() => {
    const set = new Set(mockExams.map((e) => e.subject).filter(Boolean))
    return Array.from(set).sort()
  }, [])

  // Calculate counts per tab
  const tabCounts = useMemo(() => {
    return {
      all: mockExams.length,
      upcoming: mockExams.filter((e) => e.status === 'upcoming').length,
      active: mockExams.filter((e) => e.status === 'active').length,
      completed: mockExams.filter((e) => e.status === 'completed').length,
    }
  }, [])

  // Filter exams based on tab, search query, and subject filter
  const filteredExams = useMemo(() => {
    return mockExams.filter((exam) => {
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
  }, [activeTab, selectedSubject, searchQuery])

  const handleResetFilters = () => {
    setActiveTab('all')
    setSearchQuery('')
    setSelectedSubject('')
  }

  // Table columns definition for Table View
  const tableColumns = [
    {
      key: 'title',
      label: 'Exam Title & Subject',
      render: (val, row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.title}</p>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
            <span>{row.subject}</span>
            <span className="text-slate-300">•</span>
            <span className="font-mono text-slate-400">{row.code}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'startTime',
      label: 'Date & Time',
      render: (val, row) => (
        <div className="text-xs">
          <p className="font-medium text-slate-800">{formatDate(val)}</p>
          <p className="text-slate-500 mt-0.5">
            {formatTime(val)} {row.endTime && `– ${formatTime(row.endTime)}`}
          </p>
        </div>
      ),
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (val) => (
        <span className="text-xs font-medium text-slate-700">{val} mins</span>
      ),
    },
    {
      key: 'totalQuestions',
      label: 'Questions',
      render: (val, row) => (
        <span className="text-xs text-slate-700">
          {val} Qs <span className="text-slate-400">({row.totalMarks} Marks)</span>
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        if (val === 'active') return <Badge variant="success" dot>Active</Badge>
        if (val === 'upcoming') return <Badge variant="primary" dot>Upcoming</Badge>
        if (val === 'completed') return <Badge variant="default">Completed</Badge>
        return <Badge variant="danger" dot>Unavailable</Badge>
      },
    },
    {
      key: 'action',
      label: 'Action',
      align: 'right',
      render: (val, row) => {
        if (row.status === 'active') {
          return (
            <Link to={`/student/exams/${row.id}`}>
              <Button variant="success" size="xs" rightIcon={<Play size={12} className="fill-current" />}>
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

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Examinations
          </h1>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Browse upcoming assessments, participate in active examination sessions, and review past test records.
          </p>
        </div>

        {/* Live exam pulse badge if active */}
        {tabCounts.active > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-center px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>{tabCounts.active} Active Examination Live</span>
          </div>
        )}
      </div>

      {/* ── Status Tabs ── */}
      <div className="border-b border-slate-200">
        <nav aria-label="Exam status tabs" className="-mb-px flex space-x-2 sm:space-x-4 overflow-x-auto pb-1">
          {TABS.map((tab) => {
            const count = tabCounts[tab.id] ?? 0
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-semibold rounded-t-lg border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-primary-600 text-primary-700 bg-primary-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* ── Search, Filters, and View Switcher ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
        {/* Search bar */}
        <div className="flex-1 min-w-[240px]">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by exam title, subject, or code (e.g. CSE2001)…"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Subject Filter */}
          <div className="min-w-[170px]">
            <Select
              id="subject-filter"
              placeholder="All Subjects"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              options={subjects.map((sub) => ({ value: sub, label: sub }))}
            />
          </div>

          {/* Reset Filters button if any filter active */}
          {(searchQuery || selectedSubject || activeTab !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              leftIcon={<RotateCcw size={13} />}
            >
              Reset
            </Button>
          )}

          {/* View toggle (Grid / Table) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/60 ml-auto md:ml-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-label="Table view"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Active Filter Summary Chip ── */}
      {(searchQuery || selectedSubject || activeTab !== 'all') && (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Filtered by:</span>
          {activeTab !== 'all' && (
            <Badge variant="primary" size="sm">
              Status: {activeTab}
            </Badge>
          )}
          {selectedSubject && (
            <Badge variant="default" size="sm">
              Subject: {selectedSubject}
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="default" size="sm">
              Query: "{searchQuery}"
            </Badge>
          )}
          <span className="text-slate-400">({filteredExams.length} matches found)</span>
        </div>
      )}

      {/* ── Exam Content Display (Grid or Table) ── */}
      {filteredExams.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <EmptyState
            icon={<FileText size={32} className="text-slate-400" />}
            title="No examinations match your criteria"
            message="Try adjusting your search terms, changing the status tab, or clearing the subject filter."
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={handleResetFilters}
                leftIcon={<RotateCcw size={14} />}
              >
                Clear all filters
              </Button>
            }
          />
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              isActive={exam.status === 'active'}
            />
          ))}
        </div>
      ) : (
        <Table
          columns={tableColumns}
          data={filteredExams}
          emptyTitle="No examinations found"
        />
      )}
    </div>
  )
}
