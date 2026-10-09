import { useState, useMemo } from 'react'
import {
  Users,
  Eye,
  UserX,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react'
import {
  Badge,
  Button,
  Table,
  Modal,
  SearchBar,
  Select,
  Avatar,
  EmptyState,
  ProgressBar,
} from '../../components/common'
import { mockStudents } from '../../data/mockData'

const PAGE_SIZE = 8

export default function AdminStudentsPage() {
  const [students, setStudents] = useState(mockStudents)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'active' | 'inactive'
  const [sectionFilter, setSectionFilter] = useState('all') // 'all' | 'A' | 'B' | 'C'
  const [currentPage, setCurrentPage] = useState(1)

  // Modal states
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    student: null,
    action: null, // 'disable' | 'enable'
  })

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Status filter
      if (statusFilter !== 'all' && s.status !== statusFilter) {
        return false
      }

      // Section filter
      if (sectionFilter !== 'all' && s.section !== sectionFilter) {
        return false
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchesId = s.id?.toLowerCase().includes(query)
        const matchesName = s.name?.toLowerCase().includes(query)
        const matchesEmail = s.email?.toLowerCase().includes(query)
        if (!matchesId && !matchesName && !matchesEmail) return false
      }

      return true
    })
  }, [students, statusFilter, sectionFilter, searchQuery])

  // Pagination calculation
  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE) || 1
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    return filteredStudents.slice(startIndex, startIndex + PAGE_SIZE)
  }, [filteredStudents, currentPage])

  // Handlers
  const handleOpenDetails = (student) => {
    setSelectedStudent(student)
    setDetailsModalOpen(true)
  }

  const handleOpenConfirm = (student, action) => {
    setConfirmDialog({
      isOpen: true,
      student,
      action,
    })
  }

  const handleConfirmAction = () => {
    const { student, action } = confirmDialog
    if (!student || !action) return

    const newStatus = action === 'disable' ? 'inactive' : 'active'

    setStudents((prev) =>
      prev.map((s) => (s.id === student.id ? { ...s, status: newStatus } : s))
    )

    // Update selectedStudent if details modal is open
    if (selectedStudent && selectedStudent.id === student.id) {
      setSelectedStudent((prev) => ({ ...prev, status: newStatus }))
    }

    setConfirmDialog({ isOpen: false, student: null, action: null })
  }

  // Counts for tabs
  const activeCount = students.filter((s) => s.status === 'active').length
  const inactiveCount = students.filter((s) => s.status === 'inactive').length

  // Table columns definition
  const columns = [
    {
      key: 'id',
      label: 'Student ID',
      render: (val) => <span className="tabular-nums text-zinc-300">{val}</span>,
    },
    {
      key: 'name',
      label: 'Name',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={val} size="sm" />
          <div>
            <p className="font-medium text-zinc-100">{val}</p>
            <p className="text-xs text-zinc-500">
              Section {row.section} · Semester {row.semester}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (val) => <span className="block max-w-[200px] truncate text-zinc-400">{val}</span>,
    },
    {
      key: 'examsTaken',
      label: 'Exams',
      align: 'right',
      render: (val) => <span className="tabular-nums text-zinc-300">{val ?? 0}</span>,
    },
    {
      key: 'avgScore',
      label: 'Avg. score',
      align: 'right',
      render: (val) => <span className="tabular-nums text-zinc-100">{val ?? 0}%</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <Badge variant="default" dot={val === 'active'} size="sm">
          {val === 'active' ? 'Active' : 'Disabled'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (val, row) => {
        const isActive = row.status === 'active'

        return (
          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="secondary"
              size="xs"
              onClick={() => handleOpenDetails(row)}
              leftIcon={<Eye size={12} />}
            >
              View
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => handleOpenConfirm(row, isActive ? 'disable' : 'enable')}
              leftIcon={isActive ? <UserX size={12} /> : <UserCheck size={12} />}
            >
              {isActive ? 'Disable' : 'Enable'}
            </Button>
          </div>
        )
      },
    },
  ]

  const STATUS_TABS = [
    { id: 'all',      label: 'All',      count: students.length },
    { id: 'active',   label: 'Active',   count: activeCount },
    { id: 'inactive', label: 'Disabled', count: inactiveCount },
  ]

  const filtersActive = searchQuery || statusFilter !== 'all' || sectionFilter !== 'all'

  const resetFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setSectionFilter('all')
    setCurrentPage(1)
  }

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">
            Enrolled candidates, section allocation, exam participation, and access.{' '}
            <span className="text-zinc-200">{students.length} enrolled.</span>
          </p>
        </div>
      </header>

      <div className="space-y-4">
        {/* ── Tabs + filters ── */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <nav aria-label="Student status" className="flex gap-6 border-b border-zinc-800 lg:flex-1">
            {STATUS_TABS.map((tab) => {
              const isActive = statusFilter === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setStatusFilter(tab.id)
                    setCurrentPage(1)
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`-mb-px flex items-center gap-2 border-b-2 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-amber-500 text-zinc-50'
                      : 'border-transparent text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  {tab.label}
                  <span className="tabular-nums text-zinc-500">{tab.count}</span>
                </button>
              )
            })}
          </nav>

          <div className="flex flex-col gap-2 sm:flex-row lg:mb-1">
            <SearchBar
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val)
                setCurrentPage(1)
              }}
              placeholder="Search by ID, name, or email"
              className="sm:w-72"
            />
            <Select
              id="section-filter"
              aria-label="Section"
              value={sectionFilter}
              onChange={(e) => {
                setSectionFilter(e.target.value)
                setCurrentPage(1)
              }}
              placeholder=""
              options={[
                { value: 'all', label: 'All sections' },
                { value: 'A', label: 'Section A' },
                { value: 'B', label: 'Section B' },
                { value: 'C', label: 'Section C' },
              ]}
              className="sm:w-40"
            />
          </div>
        </div>

        {/* ── Table or Empty State ── */}
        {filteredStudents.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={<Users size={28} />}
              title="No students found"
              message={
                filtersActive
                  ? 'No students match your search or filters.'
                  : 'No student accounts are enrolled yet.'
              }
              action={
                filtersActive && (
                  <Button variant="secondary" size="sm" onClick={resetFilters} leftIcon={<RotateCcw size={14} />}>
                    Reset filters
                  </Button>
                )
              }
            />
          </div>
        ) : (
          <>
            <Table columns={columns} data={paginatedStudents} onRowClick={(row) => handleOpenDetails(row)} />

            {/* ── Pagination ── */}
            <div className="flex flex-col items-center justify-between gap-4 text-sm text-zinc-400 sm:flex-row">
              <p>
                Showing{' '}
                <span className="tabular-nums text-zinc-200">
                  {(currentPage - 1) * PAGE_SIZE + 1}–
                  {Math.min(currentPage * PAGE_SIZE, filteredStudents.length)}
                </span>{' '}
                of <span className="tabular-nums text-zinc-200">{filteredStudents.length}</span> students
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="xs"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  leftIcon={<ChevronLeft size={14} />}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      aria-current={currentPage === pageNum ? 'page' : undefined}
                      className={`h-8 w-8 rounded-lg text-sm tabular-nums transition-colors ${
                        currentPage === pageNum
                          ? 'bg-zinc-800 font-semibold text-zinc-50'
                          : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <Button
                  variant="secondary"
                  size="xs"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  rightIcon={<ChevronRight size={14} />}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Student Details Modal ── */}
      {selectedStudent && (
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title="Student profile"
          size="lg"
          footer={
            <div className="flex w-full items-center justify-between">
              {selectedStudent.status === 'active' ? (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleOpenConfirm(selectedStudent, 'disable')}
                  leftIcon={<UserX size={14} />}
                >
                  Disable account
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handleOpenConfirm(selectedStudent, 'enable')}
                  leftIcon={<UserCheck size={14} />}
                >
                  Enable account
                </Button>
              )}
              <Button variant="secondary" size="sm" onClick={() => setDetailsModalOpen(false)}>
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name={selectedStudent.name} size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-zinc-100">{selectedStudent.name}</h3>
                  <Badge dot={selectedStudent.status === 'active'} size="sm">
                    {selectedStudent.status === 'active' ? 'Active' : 'Disabled'}
                  </Badge>
                </div>
                <p className="text-sm text-zinc-400">
                  <span className="tabular-nums">{selectedStudent.id}</span> ·{' '}
                  {selectedStudent.branch || 'CSE'} · Section {selectedStudent.section}
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              {[
                { label: 'Email', value: selectedStudent.email, className: 'break-all' },
                { label: 'Phone', value: selectedStudent.phone || '+91 98765 43210', className: 'tabular-nums' },
                { label: 'CGPA', value: `${selectedStudent.cgpa} / 10.0`, className: 'tabular-nums' },
                { label: 'Enrolled', value: selectedStudent.joinedAt || '2024-08-01', className: 'tabular-nums' },
              ].map(({ label, value, className }) => (
                <div key={label}>
                  <dt className="text-zinc-400">{label}</dt>
                  <dd className={`mt-1 font-medium text-zinc-100 ${className}`}>{value}</dd>
                </div>
              ))}
            </dl>

            <div className="space-y-4 border-t border-zinc-800 pt-6">
              <h4 className="text-sm font-semibold text-zinc-100">Exam performance</h4>
              <dl className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <dt className="text-zinc-400">Exams completed</dt>
                  <dd className="mt-1 font-medium tabular-nums text-zinc-100">
                    {selectedStudent.examsTaken ?? 0}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-400">Average score</dt>
                  <dd className="mt-1 font-medium tabular-nums text-zinc-100">
                    {selectedStudent.avgScore ?? 0}%
                  </dd>
                </div>
              </dl>
              <ProgressBar value={selectedStudent.avgScore ?? 0} max={100} size="xs" />
            </div>
          </div>
        </Modal>
      )}

      {/* ── Confirmation Dialog ── */}
      <Modal
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, student: null, action: null })}
        title={confirmDialog.action === 'disable' ? 'Disable exam access' : 'Enable exam access'}
        size="md"
        footer={
          <div className="flex w-full items-center justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setConfirmDialog({ isOpen: false, student: null, action: null })}
            >
              Cancel
            </Button>
            <Button
              variant={confirmDialog.action === 'disable' ? 'danger' : 'primary'}
              size="sm"
              onClick={handleConfirmAction}
            >
              {confirmDialog.action === 'disable' ? 'Disable' : 'Enable'}
            </Button>
          </div>
        }
      >
        <div className="flex items-start gap-3 text-sm">
          {confirmDialog.action === 'disable' ? (
            <AlertTriangle size={20} className="mt-0.5 flex-shrink-0 text-red-400" />
          ) : (
            <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0 text-zinc-400" />
          )}
          <div>
            <p className="font-semibold text-zinc-100">
              {confirmDialog.action === 'disable'
                ? `Disable ${confirmDialog.student?.name}?`
                : `Re-enable ${confirmDialog.student?.name}?`}
            </p>
            <p className="mt-2 text-zinc-400">
              {confirmDialog.action === 'disable'
                ? `${confirmDialog.student?.id} will no longer be able to sign in or start scheduled examinations.`
                : `${confirmDialog.student?.id} will regain portal access and can take assigned exams.`}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
