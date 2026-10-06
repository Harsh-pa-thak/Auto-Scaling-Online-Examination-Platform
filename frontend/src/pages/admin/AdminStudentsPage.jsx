import { useState, useMemo } from 'react'
import {
  Users,
  Search,
  Filter,
  Eye,
  UserX,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Hash,
  X,
} from 'lucide-react'
import {
  Card,
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
      render: (val, row) => (
        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60">
          {val}
        </span>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      render: (val, row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={val} size="sm" status={row.status === 'active' ? 'online' : 'offline'} />
          <div>
            <p className="font-semibold text-zinc-100">{val}</p>
            <p className="text-[11px] text-zinc-500 font-mono">Sec {row.section} • Sem {row.semester}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (val) => (
        <span className="text-zinc-400 text-xs truncate block max-w-[180px]">
          {val}
        </span>
      ),
    },
    {
      key: 'examsTaken',
      label: 'Exams Taken',
      align: 'center',
      render: (val) => (
        <span className="text-xs font-medium text-zinc-300">
          {val ?? 0}
        </span>
      ),
    },
    {
      key: 'avgScore',
      label: 'Average Score',
      align: 'center',
      render: (val) => {
        const score = val ?? 0
        const isHigh = score >= 75
        const isMid = score >= 60

        return (
          <div className="flex items-center justify-center gap-1.5">
            <span
              className={`font-semibold text-xs ${
                isHigh ? 'text-emerald-400' : isMid ? 'text-amber-400' : 'text-red-400'
              }`}
            >
              {score}%
            </span>
          </div>
        )
      },
    },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      render: (val) => (
        <Badge
          variant={val === 'active' ? 'success' : 'default'}
          dot
          size="sm"
        >
          {val === 'active' ? 'Active' : 'Disabled'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (val, row) => {
        const isActive = row.status === 'active'

        return (
          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="secondary"
              size="xs"
              onClick={() => handleOpenDetails(row)}
              leftIcon={<Eye size={12} />}
            >
              View
            </Button>

            {isActive ? (
              <Button
                variant="ghost"
                size="xs"
                className="text-red-400 hover:text-red-300 hover:bg-red-950/40"
                onClick={() => handleOpenConfirm(row, 'disable')}
                leftIcon={<UserX size={12} />}
              >
                Disable
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="xs"
                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40"
                onClick={() => handleOpenConfirm(row, 'enable')}
                leftIcon={<UserCheck size={12} />}
              >
                Enable
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ── Page Header ── */}
      <div className="pb-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
            Student Management
          </h1>
          <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
            Directory of enrolled candidates, batch allocation, examination participation, and access permissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="primary" size="md">
            {students.length} Enrolled Students
          </Badge>
        </div>
      </div>

      {/* ── Filters & Search Row ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="w-full md:w-80">
          <SearchBar
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val)
              setCurrentPage(1)
            }}
            placeholder="Search by ID, name, or email…"
          />
        </div>

        {/* Filters Group: Status & Section */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Tabs */}
          <div className="flex p-1 bg-zinc-900 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setStatusFilter('all')
                setCurrentPage(1)
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'all'
                  ? 'bg-zinc-800 text-zinc-100 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/50'
              }`}
            >
              All ({students.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter('active')
                setCurrentPage(1)
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'active'
                  ? 'bg-zinc-800 text-emerald-400 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/50'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter('inactive')
                setCurrentPage(1)
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'inactive'
                  ? 'bg-zinc-800 text-zinc-300 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/50'
              }`}
            >
              Disabled ({inactiveCount})
            </button>
          </div>

          {/* Section Filter Dropdown */}
          <div className="w-36">
            <Select
              id="section-filter"
              value={sectionFilter}
              onChange={(e) => {
                setSectionFilter(e.target.value)
                setCurrentPage(1)
              }}
              options={[
                { value: 'all', label: 'All Sections' },
                { value: 'A', label: 'Section A' },
                { value: 'B', label: 'Section B' },
                { value: 'C', label: 'Section C' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* ── Student Table or Empty State ── */}
      {filteredStudents.length === 0 ? (
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
          <EmptyState
            icon={<Users size={30} className="text-zinc-500" />}
            title="No students match criteria"
            message={
              searchQuery || statusFilter !== 'all' || sectionFilter !== 'all'
                ? 'No students found matching your search query or applied filters. Try adjusting your search keywords.'
                : 'No student accounts are currently enrolled.'
            }
            action={
              (searchQuery || statusFilter !== 'all' || sectionFilter !== 'all') && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('')
                    setStatusFilter('all')
                    setSectionFilter('all')
                    setCurrentPage(1)
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
        <div className="space-y-4">
          <Table
            columns={columns}
            data={paginatedStudents}
            onRowClick={(row) => handleOpenDetails(row)}
          />

          {/* ── Pagination Bar ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-xs text-zinc-400">
            <div>
              Showing{' '}
              <span className="font-semibold text-zinc-200">
                {(currentPage - 1) * PAGE_SIZE + 1}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-zinc-200">
                {Math.min(currentPage * PAGE_SIZE, filteredStudents.length)}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-zinc-200">
                {filteredStudents.length}
              </span>{' '}
              students
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="secondary"
                size="xs"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                leftIcon={<ChevronLeft size={14} />}
              >
                Previous
              </Button>

              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-7 w-7 rounded-lg text-xs font-semibold transition-all ${
                      currentPage === pageNum
                        ? 'bg-amber-500 text-zinc-950 font-bold'
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
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
        </div>
      )}

      {/* ── Student Details Modal ── */}
      {selectedStudent && (
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title={`Candidate Profile — ${selectedStudent.id}`}
          size="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <div>
                {selectedStudent.status === 'active' ? (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      handleOpenConfirm(selectedStudent, 'disable')
                    }}
                    leftIcon={<UserX size={14} />}
                  >
                    Disable Student Account
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => {
                      handleOpenConfirm(selectedStudent, 'enable')
                    }}
                    leftIcon={<UserCheck size={14} />}
                  >
                    Enable Student Account
                  </Button>
                )}
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setDetailsModalOpen(false)}
              >
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Header Identity Summary */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-850/70 border border-zinc-800">
              <Avatar
                name={selectedStudent.name}
                size="lg"
                status={selectedStudent.status === 'active' ? 'online' : 'offline'}
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-zinc-100">
                    {selectedStudent.name}
                  </h3>
                  <Badge
                    variant={selectedStudent.status === 'active' ? 'success' : 'default'}
                    size="sm"
                    dot
                  >
                    {selectedStudent.status === 'active' ? 'Active' : 'Disabled'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="font-mono text-zinc-300 font-semibold">
                    {selectedStudent.id}
                  </span>
                  <span>•</span>
                  <span>{selectedStudent.branch || 'CSE'}</span>
                  <span>•</span>
                  <span>Sec {selectedStudent.section}</span>
                </div>
              </div>
            </div>

            {/* Academic Information Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-850/50 border border-zinc-800 space-y-1">
                <span className="text-zinc-500 font-medium">Institutional Email</span>
                <p className="text-zinc-200 font-medium break-all">{selectedStudent.email}</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-850/50 border border-zinc-800 space-y-1">
                <span className="text-zinc-500 font-medium">Contact Phone</span>
                <p className="text-zinc-200 font-medium">{selectedStudent.phone || '+91 98765 43210'}</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-850/50 border border-zinc-800 space-y-1">
                <span className="text-zinc-500 font-medium">Cumulative GPA (CGPA)</span>
                <p className="text-amber-400 font-bold text-sm">
                  {selectedStudent.cgpa} <span className="text-zinc-500 font-normal text-xs">/ 10.0</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-850/50 border border-zinc-800 space-y-1">
                <span className="text-zinc-500 font-medium">Enrolled Since</span>
                <p className="text-zinc-200 font-medium">{selectedStudent.joinedAt || '2024-08-01'}</p>
              </div>
            </div>

            {/* Examination Track Record */}
            <div className="p-4 rounded-xl bg-zinc-850/50 border border-zinc-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Award size={15} className="text-amber-400" />
                Examination Performance Track
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-zinc-500">Total Exams Completed</span>
                  <p className="text-sm font-bold text-zinc-100">{selectedStudent.examsTaken ?? 0} Exams</p>
                </div>
                <div>
                  <span className="text-zinc-500">Average Performance</span>
                  <p className="text-sm font-bold text-emerald-400">{selectedStudent.avgScore ?? 0}%</p>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[11px] text-zinc-400 block mb-1">Score Average Metric:</span>
                <ProgressBar
                  value={selectedStudent.avgScore ?? 0}
                  max={100}
                  size="xs"
                  variant={selectedStudent.avgScore >= 75 ? 'success' : selectedStudent.avgScore >= 60 ? 'warning' : 'danger'}
                />
              </div>
            </div>

            {/* Proctoring Verification Banner */}
            <div className="p-3.5 rounded-xl bg-zinc-850/70 border border-zinc-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-zinc-200">Exam Proctoring Clearance</p>
                  <p className="text-zinc-500 text-[11px]">Identity verified for active semester examinations.</p>
                </div>
              </div>
              <Badge variant="success" size="sm">Verified</Badge>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Confirmation Dialog Modal ── */}
      <Modal
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, student: null, action: null })}
        title={
          confirmDialog.action === 'disable'
            ? 'Disable Student Examination Access'
            : 'Enable Student Examination Access'
        }
        size="md"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
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
              {confirmDialog.action === 'disable' ? 'Confirm Disable' : 'Confirm Enable'}
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs leading-relaxed">
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-xl flex-shrink-0 ${
                confirmDialog.action === 'disable'
                  ? 'bg-red-950/60 text-red-400 border border-red-800/60'
                  : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
              }`}
            >
              {confirmDialog.action === 'disable' ? (
                <AlertTriangle size={20} />
              ) : (
                <CheckCircle2 size={20} />
              )}
            </div>
            <div>
              <p className="font-semibold text-zinc-100 text-sm">
                {confirmDialog.action === 'disable'
                  ? `Are you sure you want to disable ${confirmDialog.student?.name}?`
                  : `Are you sure you want to re-enable ${confirmDialog.student?.name}?`}
              </p>
              <p className="text-zinc-400 mt-1">
                {confirmDialog.action === 'disable'
                  ? `Disabling this candidate (${confirmDialog.student?.id}) will revoke their permission to login and start any scheduled online examinations.`
                  : `Enabling this candidate (${confirmDialog.student?.id}) will immediately restore their portal access and allow them to take assigned exams.`}
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
