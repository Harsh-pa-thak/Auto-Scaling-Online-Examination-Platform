import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  PlusCircle,
  Search,
  Eye,
  Edit2,
  Trash2,
  Send,
  Calendar,
  Clock,
  BookOpen,
  Award,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Check,
  X,
  Users,
  ShieldCheck,
} from 'lucide-react'
import {
  Card,
  Badge,
  Button,
  Table,
  Modal,
  SearchBar,
  EmptyState,
} from '../../components/common'
import { mockExams } from '../../data/mockData'

// Date format helper
function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

const STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    badgeVariant: 'default',
    dotColor: 'bg-zinc-400',
  },
  published: {
    label: 'Published',
    badgeVariant: 'warning',
    dotColor: 'bg-amber-400',
  },
  active: {
    label: 'Active',
    badgeVariant: 'success',
    dotColor: 'bg-emerald-400',
  },
  completed: {
    label: 'Completed',
    badgeVariant: 'default',
    dotColor: 'bg-zinc-500',
  },
  cancelled: {
    label: 'Cancelled',
    badgeVariant: 'danger',
    dotColor: 'bg-red-400',
  },
}

export default function AdminExamsPage() {
  const [exams, setExams] = useState(mockExams)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'draft' | 'published' | 'active' | 'completed' | 'cancelled'

  // Modals state
  const [viewModal, setViewModal] = useState({ isOpen: false, exam: null })
  const [editModal, setEditModal] = useState({ isOpen: false, exam: null })
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, exam: null })

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: '',
    duration: 60,
    totalMarks: 100,
    passMark: 40,
  })

  // Filtered exams
  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      // Status filter
      if (statusFilter !== 'all' && exam.status !== statusFilter) {
        return false
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchesTitle = exam.title?.toLowerCase().includes(query)
        const matchesCode = exam.code?.toLowerCase().includes(query)
        const matchesSubject = exam.subject?.toLowerCase().includes(query)
        if (!matchesTitle && !matchesCode && !matchesSubject) return false
      }

      return true
    })
  }, [exams, statusFilter, searchQuery])

  // Status counts
  const counts = useMemo(() => {
    return {
      all: exams.length,
      draft: exams.filter((e) => e.status === 'draft').length,
      published: exams.filter((e) => e.status === 'published').length,
      active: exams.filter((e) => e.status === 'active').length,
      completed: exams.filter((e) => e.status === 'completed').length,
      cancelled: exams.filter((e) => e.status === 'cancelled').length,
    }
  }, [exams])

  // Actions
  const handleView = (exam) => {
    setViewModal({ isOpen: true, exam })
  }

  const handleOpenEdit = (exam) => {
    setEditForm({
      title: exam.title,
      duration: exam.duration,
      totalMarks: exam.totalMarks,
      passMark: exam.passMark,
    })
    setEditModal({ isOpen: true, exam })
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    if (!editModal.exam) return

    setExams((prev) =>
      prev.map((item) =>
        item.id === editModal.exam.id
          ? {
              ...item,
              title: editForm.title,
              duration: Number(editForm.duration),
              totalMarks: Number(editForm.totalMarks),
              passMark: Number(editForm.passMark),
            }
          : item
      )
    )

    setEditModal({ isOpen: false, exam: null })
  }

  const handlePublish = (examId) => {
    setExams((prev) =>
      prev.map((item) =>
        item.id === examId ? { ...item, status: 'published' } : item
      )
    )
  }

  const handleDeleteConfirm = () => {
    if (!deleteDialog.exam) return

    setExams((prev) => prev.filter((item) => item.id !== deleteDialog.exam.id))
    setDeleteDialog({ isOpen: false, exam: null })
  }

  const STATUS_TABS = [
    { id: 'all',       label: 'All Exams' },
    { id: 'draft',     label: 'Draft' },
    { id: 'published', label: 'Published' },
    { id: 'active',    label: 'Active' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ]

  // Table columns definition
  const columns = [
    {
      key: 'title',
      label: 'Exam',
      render: (val, row) => (
        <div>
          <p className="font-semibold text-zinc-100">{val}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono text-[11px] text-zinc-400 font-medium">
              {row.code}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-[11px] text-zinc-500 font-mono">
              ID: {row.id}
            </span>
          </div>
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
      key: 'startTime',
      label: 'Date',
      render: (val) => (
        <span className="text-xs text-zinc-300 font-medium">
          {formatDateTime(val)}
        </span>
      ),
    },
    {
      key: 'duration',
      label: 'Duration',
      align: 'center',
      render: (val) => (
        <span className="text-xs text-zinc-300 font-medium">
          {val} mins
        </span>
      ),
    },
    {
      key: 'totalQuestions',
      label: 'Questions',
      align: 'center',
      render: (val) => (
        <span className="text-xs font-semibold text-zinc-200">
          {val} Qs
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      render: (val) => {
        const config = STATUS_CONFIG[val] || STATUS_CONFIG.draft
        const isActive = val === 'active'

        return (
          <Badge
            variant={config.badgeVariant}
            dot
            size="sm"
          >
            {config.label}
          </Badge>
        )
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (val, row) => {
        const isDraft = row.status === 'draft'

        return (
          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="secondary"
              size="xs"
              onClick={() => handleView(row)}
              leftIcon={<Eye size={12} />}
            >
              View
            </Button>

            <Button
              variant="ghost"
              size="xs"
              onClick={() => handleOpenEdit(row)}
              leftIcon={<Edit2 size={12} />}
            >
              Edit
            </Button>

            {isDraft && (
              <Button
                variant="ghost"
                size="xs"
                className="text-amber-400 hover:text-amber-300 hover:bg-amber-950/40"
                onClick={() => handlePublish(row.id)}
                leftIcon={<Send size={12} />}
              >
                Publish
              </Button>
            )}

            <Button
              variant="ghost"
              size="xs"
              className="text-red-400 hover:text-red-300 hover:bg-red-950/40"
              onClick={() => setDeleteDialog({ isOpen: true, exam: row })}
              leftIcon={<Trash2 size={12} />}
            >
              Delete
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ── Page Header & Create Exam Button ── */}
      <div className="pb-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
            Examination Management
          </h1>
          <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
            Configure examination papers, review draft states, publish schedules, and control live assessments.
          </p>
        </div>

        {/* Create Exam Button */}
        <Link to="/admin/exams/create">
          <Button
            variant="primary"
            size="md"
            leftIcon={<PlusCircle size={16} />}
          >
            Create Exam
          </Button>
        </Link>
      </div>

      {/* ── Search & Status Filters ── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="w-full lg:w-80">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by exam title, code, or subject…"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {STATUS_TABS.map((tab) => {
            const count = counts[tab.id] ?? 0
            const isActive = statusFilter === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-amber-400 border border-zinc-700/80 shadow-xs'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200 hover:bg-zinc-850'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-amber-950/70 text-amber-300'
                      : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Exam Table or Empty State ── */}
      {filteredExams.length === 0 ? (
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
          <EmptyState
            icon={<FileText size={30} className="text-zinc-500" />}
            title="No examinations found"
            message={
              searchQuery || statusFilter !== 'all'
                ? 'No exams match your search query or selected status filter. Try resetting filters.'
                : 'No examinations have been created yet.'
            }
            action={
              (searchQuery || statusFilter !== 'all') && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('')
                    setStatusFilter('all')
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
          data={filteredExams}
          onRowClick={(row) => handleView(row)}
        />
      )}

      {/* ── View Exam Details Modal ── */}
      {viewModal.exam && (
        <Modal
          isOpen={viewModal.isOpen}
          onClose={() => setViewModal({ isOpen: false, exam: null })}
          title={`Exam Overview — ${viewModal.exam.code}`}
          size="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const examToEdit = viewModal.exam
                  setViewModal({ isOpen: false, exam: null })
                  handleOpenEdit(examToEdit)
                }}
                leftIcon={<Edit2 size={13} />}
              >
                Edit Exam
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setViewModal({ isOpen: false, exam: null })}
              >
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-5">
            {/* Header info banner */}
            <div className="p-4 rounded-xl bg-zinc-850/70 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                  {viewModal.exam.code}
                </span>
                <Badge
                  variant={STATUS_CONFIG[viewModal.exam.status]?.badgeVariant || 'default'}
                  size="sm"
                  dot
                >
                  {STATUS_CONFIG[viewModal.exam.status]?.label || viewModal.exam.status}
                </Badge>
                <span className="text-xs text-zinc-400 font-medium">
                  {viewModal.exam.subject}
                </span>
              </div>
              <h3 className="text-lg font-bold text-zinc-100">
                {viewModal.exam.title}
              </h3>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-850/50 border border-zinc-800">
                <span className="text-zinc-500 block mb-1">Duration</span>
                <span className="text-sm font-bold text-zinc-100">{viewModal.exam.duration} Minutes</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-850/50 border border-zinc-800">
                <span className="text-zinc-500 block mb-1">Total Marks</span>
                <span className="text-sm font-bold text-zinc-100">{viewModal.exam.totalMarks} Marks</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-850/50 border border-zinc-800">
                <span className="text-zinc-500 block mb-1">Pass Mark</span>
                <span className="text-sm font-bold text-amber-400">{viewModal.exam.passMark} Marks</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-850/50 border border-zinc-800">
                <span className="text-zinc-500 block mb-1">Questions</span>
                <span className="text-sm font-bold text-zinc-100">{viewModal.exam.totalQuestions} Questions</span>
              </div>
            </div>

            {/* Schedule & Timing Info */}
            <div className="p-4 rounded-xl bg-zinc-850/50 border border-zinc-800 space-y-2 text-xs">
              <h4 className="font-bold text-zinc-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Calendar size={14} className="text-amber-400" />
                Schedule & Attendance
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300">
                <div>
                  <span className="text-zinc-500">Scheduled Start:</span>{' '}
                  <span className="font-semibold">{formatDateTime(viewModal.exam.startTime)}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Scheduled End:</span>{' '}
                  <span className="font-semibold">{formatDateTime(viewModal.exam.endTime)}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Enrolled Quota:</span>{' '}
                  <span className="font-semibold">{viewModal.exam.allowedStudents} Students</span>
                </div>
                <div>
                  <span className="text-zinc-500">Allocated Sections:</span>{' '}
                  <span className="font-semibold font-mono">
                    {viewModal.exam.section ? viewModal.exam.section.join(', ') : 'All'}
                  </span>
                </div>
              </div>
            </div>

            {/* Candidate Instructions */}
            {viewModal.exam.instructions && viewModal.exam.instructions.length > 0 && (
              <div className="p-4 rounded-xl bg-zinc-850/50 border border-zinc-800 space-y-2 text-xs">
                <h4 className="font-bold text-zinc-200 uppercase tracking-wider text-[11px]">
                  Examination Rules & Guidelines
                </h4>
                <ul className="space-y-1 text-zinc-400 list-disc list-inside">
                  {viewModal.exam.instructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ── Edit Exam Modal ── */}
      {editModal.exam && (
        <Modal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, exam: null })}
          title={`Edit Examination — ${editModal.exam.code}`}
          size="md"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div>
              <label htmlFor="edit-title" className="block text-zinc-300 font-medium mb-1.5">
                Exam Title
              </label>
              <input
                id="edit-title"
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                className="input-base w-full"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label htmlFor="edit-duration" className="block text-zinc-300 font-medium mb-1.5">
                  Duration (mins)
                </label>
                <input
                  id="edit-duration"
                  type="number"
                  min="5"
                  max="300"
                  value={editForm.duration}
                  onChange={(e) => setEditForm((f) => ({ ...f, duration: e.target.value }))}
                  className="input-base w-full"
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-total-marks" className="block text-zinc-300 font-medium mb-1.5">
                  Total Marks
                </label>
                <input
                  id="edit-total-marks"
                  type="number"
                  min="1"
                  value={editForm.totalMarks}
                  onChange={(e) => setEditForm((f) => ({ ...f, totalMarks: e.target.value }))}
                  className="input-base w-full"
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-pass-mark" className="block text-zinc-300 font-medium mb-1.5">
                  Pass Mark
                </label>
                <input
                  id="edit-pass-mark"
                  type="number"
                  min="1"
                  value={editForm.passMark}
                  onChange={(e) => setEditForm((f) => ({ ...f, passMark: e.target.value }))}
                  className="input-base w-full"
                  required
                />
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2.5">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEditModal({ isOpen: false, exam: null })}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Delete Confirmation Dialog ── */}
      <Modal
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, exam: null })}
        title="Delete Examination Paper"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeleteDialog({ isOpen: false, exam: null })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteConfirm}
            >
              Confirm Delete
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs leading-relaxed">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-red-950/60 text-red-400 border border-red-800/60 flex-shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="font-semibold text-zinc-100 text-sm">
                Are you sure you want to delete {deleteDialog.exam?.title}?
              </p>
              <p className="text-zinc-400 mt-1">
                This action is irreversible. The examination schedule ({deleteDialog.exam?.code}) and all allocated participant sessions will be permanently purged.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
