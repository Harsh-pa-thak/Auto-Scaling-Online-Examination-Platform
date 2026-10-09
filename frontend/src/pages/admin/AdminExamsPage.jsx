import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  PlusCircle,
  Eye,
  Edit2,
  Trash2,
  Send,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react'
import {
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

// Live exams get the accent; every other state stays neutral.
const STATUS_CONFIG = {
  draft:     { label: 'Draft',     badgeVariant: 'default', dot: false },
  published: { label: 'Published', badgeVariant: 'default', dot: true },
  active:    { label: 'Live',      badgeVariant: 'primary', dot: true },
  completed: { label: 'Completed', badgeVariant: 'default', dot: false },
  cancelled: { label: 'Cancelled', badgeVariant: 'default', dot: false },
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
    { id: 'all',       label: 'All' },
    { id: 'draft',     label: 'Draft' },
    { id: 'published', label: 'Published' },
    { id: 'active',    label: 'Live' },
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
          <p className="font-medium text-zinc-100">{val}</p>
          <p className="text-xs tabular-nums text-zinc-500">
            {row.code} · {row.id}
          </p>
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (val) => <span className="text-zinc-300">{val}</span>,
    },
    {
      key: 'startTime',
      label: 'Date',
      render: (val) => <span className="tabular-nums text-zinc-300">{formatDateTime(val)}</span>,
    },
    {
      key: 'duration',
      label: 'Duration',
      align: 'right',
      render: (val) => <span className="tabular-nums text-zinc-300">{val} min</span>,
    },
    {
      key: 'totalQuestions',
      label: 'Questions',
      align: 'right',
      render: (val) => <span className="tabular-nums text-zinc-300">{val}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        const config = STATUS_CONFIG[val] || STATUS_CONFIG.draft
        return (
          <Badge variant={config.badgeVariant} dot={config.dot} size="sm">
            {config.label}
          </Badge>
        )
      },
    },
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (val, row) => {
        const isDraft = row.status === 'draft'

        return (
          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
            <Button variant="secondary" size="xs" onClick={() => handleView(row)} leftIcon={<Eye size={12} />}>
              View
            </Button>
            <Button variant="ghost" size="xs" onClick={() => handleOpenEdit(row)} leftIcon={<Edit2 size={12} />}>
              Edit
            </Button>
            {isDraft && (
              <Button variant="ghost" size="xs" onClick={() => handlePublish(row.id)} leftIcon={<Send size={12} />}>
                Publish
              </Button>
            )}
            <Button
              variant="ghost"
              size="xs"
              className="hover:text-red-400"
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

  const filtersActive = searchQuery || statusFilter !== 'all'
  const viewExam = viewModal.exam
  const viewStatus = viewExam ? STATUS_CONFIG[viewExam.status] || STATUS_CONFIG.draft : null

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Exams</h1>
          <p className="page-subtitle">
            Configure papers, review drafts, publish schedules, and control live assessments.
          </p>
        </div>

        <Link to="/admin/exams/create">
          <Button leftIcon={<PlusCircle size={16} />}>Create exam</Button>
        </Link>
      </header>

      <div className="space-y-4">
        {/* ── Tabs + search ── */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <nav aria-label="Exam status" className="flex gap-6 overflow-x-auto border-b border-zinc-800 lg:flex-1">
            {STATUS_TABS.map((tab) => {
              const count = counts[tab.id] ?? 0
              const isActive = statusFilter === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
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

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by title, code, or subject"
            className="w-full lg:mb-1 lg:w-80"
          />
        </div>

        {/* ── Table or Empty State ── */}
        {filteredExams.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={<FileText size={28} />}
              title="No examinations found"
              message={
                filtersActive
                  ? 'No exams match your search or status filter.'
                  : 'No examinations have been created yet.'
              }
              action={
                filtersActive && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('')
                      setStatusFilter('all')
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
          <Table columns={columns} data={filteredExams} onRowClick={(row) => handleView(row)} />
        )}
      </div>

      {/* ── View Exam Modal ── */}
      {viewExam && (
        <Modal
          isOpen={viewModal.isOpen}
          onClose={() => setViewModal({ isOpen: false, exam: null })}
          title="Exam overview"
          size="lg"
          footer={
            <div className="flex w-full items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setViewModal({ isOpen: false, exam: null })
                  handleOpenEdit(viewExam)
                }}
                leftIcon={<Edit2 size={14} />}
              >
                Edit exam
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setViewModal({ isOpen: false, exam: null })}>
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            <div>
              <p className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
                <span className="tabular-nums">{viewExam.code}</span>
                <span className="text-zinc-600">·</span>
                {viewExam.subject}
                <Badge variant={viewStatus.badgeVariant} dot={viewStatus.dot} size="sm">
                  {viewStatus.label}
                </Badge>
              </p>
              <h3 className="mt-2 text-lg font-semibold text-zinc-50">{viewExam.title}</h3>
            </div>

            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: 'Duration', value: `${viewExam.duration} min` },
                { label: 'Total marks', value: viewExam.totalMarks },
                { label: 'Pass mark', value: viewExam.passMark },
                { label: 'Questions', value: viewExam.totalQuestions },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                  <dt className="eyebrow">{label}</dt>
                  <dd className="mt-1 text-lg font-semibold tabular-nums text-zinc-50">{value}</dd>
                </div>
              ))}
            </dl>

            <div>
              <h4 className="text-sm font-semibold text-zinc-100">Schedule</h4>
              <dl className="mt-2 divide-y divide-zinc-800 text-sm">
                {[
                  { label: 'Start', value: formatDateTime(viewExam.startTime) },
                  { label: 'End', value: formatDateTime(viewExam.endTime) },
                  { label: 'Student quota', value: viewExam.allowedStudents },
                  { label: 'Sections', value: viewExam.section ? viewExam.section.join(', ') : 'All' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-4 py-2">
                    <dt className="text-zinc-400">{label}</dt>
                    <dd className="tabular-nums text-zinc-100">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {viewExam.instructions && viewExam.instructions.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-zinc-100">Rules & guidelines</h4>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-300 marker:text-zinc-600">
                  {viewExam.instructions.map((inst, i) => (
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
          title={`Edit exam — ${editModal.exam.code}`}
          size="md"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="edit-title" className="form-label">
                Title
              </label>
              <input
                id="edit-title"
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                className="input-base"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'edit-duration', label: 'Duration (min)', key: 'duration', min: 5, max: 300 },
                { id: 'edit-total-marks', label: 'Total marks', key: 'totalMarks', min: 1 },
                { id: 'edit-pass-mark', label: 'Pass mark', key: 'passMark', min: 1 },
              ].map(({ id, label, key, min, max }) => (
                <div key={id} className="space-y-2">
                  <label htmlFor={id} className="form-label">
                    {label}
                  </label>
                  <input
                    id={id}
                    type="number"
                    min={min}
                    max={max}
                    value={editForm[key]}
                    onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="input-base tabular-nums"
                    required
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-zinc-800 pt-4">
              <Button variant="secondary" size="sm" onClick={() => setEditModal({ isOpen: false, exam: null })}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Delete Confirmation ── */}
      <Modal
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, exam: null })}
        title="Delete exam"
        size="md"
        footer={
          <div className="flex w-full items-center justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setDeleteDialog({ isOpen: false, exam: null })}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        }
      >
        <div className="flex items-start gap-3 text-sm">
          <AlertTriangle size={20} className="mt-0.5 flex-shrink-0 text-red-400" />
          <div>
            <p className="font-semibold text-zinc-100">Delete {deleteDialog.exam?.title}?</p>
            <p className="mt-2 text-zinc-400">
              This cannot be undone. The schedule ({deleteDialog.exam?.code}) and all participant
              sessions will be permanently removed.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
