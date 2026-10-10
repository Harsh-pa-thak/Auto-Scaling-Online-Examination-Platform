import { useState, useMemo, useEffect } from 'react'
import {
  Search,
  Edit2,
  Trash2,
  FolderPlus,
  HelpCircle,
  LayoutGrid,
  List,
  CheckCircle2,
  Check,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Award,
  Layers,
} from 'lucide-react'
import {
  Card,
  Badge,
  Button,
  Modal,
  SearchBar,
  EmptyState,
  ConfirmDialog,
  Pagination,
  Select,
} from '../../components/common'
import QuestionForm, {
  SUBJECT_TO_CATEGORY,
  NORMALIZE_DIFFICULTY,
} from '../../components/admin/QuestionForm'
import { api } from '../../lib/api'
import { useToast } from '../../hooks/useToast'

const DIFFICULTY_CONFIG = {
  Easy:   { label: 'Easy',   variant: 'success' },
  Medium: { label: 'Medium', variant: 'warning' },
  Hard:   { label: 'Hard',   variant: 'danger'  },
}

const CATEGORIES = ['All', 'DSA', 'DBMS', 'OS', 'Networks', 'Cloud']
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard']

const PAGE_SIZE = 8

export default function AdminQuestionBankPage() {
  const { toast } = useToast()

  const [questions, setQuestions] = useState([])
  const [exams, setExams] = useState([])
  useEffect(() => {
    Promise.all([api('/questions'), api('/admin/exams')]).then(([loadedQuestions, loadedExams]) => {
      setQuestions(loadedQuestions)
      setExams(loadedExams)
    }).catch((error) => toast.error('Could not load question bank', error.message))
  }, [toast])

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [diffFilter, setDiffFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState('table') // 'table' | 'cards'
  const [expandedId, setExpandedId] = useState(null)

  // Action modal targets
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [addToExamTarget, setAddToExamTarget] = useState(null)
  const [selectedExamId, setSelectedExamId] = useState('')

  // Map of questionId -> Set of examIds it has been added to
  const [examAllocations, setExamAllocations] = useState({})

  // Category counts
  const categoryStats = useMemo(() => {
    const counts = { All: questions.length }
    CATEGORIES.slice(1).forEach((cat) => {
      counts[cat] = questions.filter((q) => q.category === cat).length
    })
    return counts
  }, [questions])

  // Filtered question set
  const filtered = useMemo(() => {
    let list = questions
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (x) =>
          x.text.toLowerCase().includes(q) ||
          x.id.toLowerCase().includes(q) ||
          x.options.some((opt) => opt.toLowerCase().includes(q))
      )
    }
    if (categoryFilter !== 'All') {
      list = list.filter((x) => x.category === categoryFilter)
    }
    if (diffFilter !== 'All') {
      list = list.filter((x) => x.difficulty === diffFilter)
    }
    return list
  }, [questions, search, categoryFilter, diffFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  // Edit handler
  async function handleEdit(data) {
    const updated = await api(`/questions/${editTarget.id}`, { method: 'PATCH', body: data })
    setQuestions((prev) =>
      prev.map((q) => (q.id === editTarget.id ? updated : q))
    )
    setEditTarget(null)
    toast.success('Question Updated', `Question ${editTarget.id} has been updated successfully.`)
  }

  // Delete handler
  async function handleDelete() {
    if (!deleteTarget) return
    const idToDelete = deleteTarget.id
    await api(`/questions/${idToDelete}`, { method: 'DELETE' })
    setQuestions((prev) => prev.filter((q) => q.id !== idToDelete))
    setDeleteTarget(null)
    toast.success('Question Deleted', `Question ${idToDelete} removed from the Question Bank.`)
  }

  // Add to Exam handler
  async function handleConfirmAddToExam() {
    if (!addToExamTarget || !selectedExamId) return
    const targetExam = exams.find((e) => e.id === selectedExamId)
    const examTitle = targetExam ? targetExam.title : selectedExamId
    const current = await api(`/exams/${selectedExamId}/questions`)
    const assignments = current.filter((item) => item.questionId !== addToExamTarget.id)
      .map((item) => ({ questionId: item.questionId, position: item.position }))
    assignments.push({ questionId: addToExamTarget.id, position: assignments.length + 1 })
    await api(`/exams/${selectedExamId}/questions`, { method: 'PUT', body: { assignments } })

    toast.success(
      'Added to Exam',
      `Question ${addToExamTarget.id} added to "${examTitle}".`
    )
    setAddToExamTarget(null)
    setSelectedExamId('')
  }

  // Prepare exam options for select
  const examOptions = useMemo(() => {
    return exams.map((e) => ({
      value: e.id,
      label: `${e.code} — ${e.title} (${e.status})`,
    }))
  }, [exams])

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
              Question Bank Repository
            </h1>
            <Badge variant="primary" size="sm">
              {questions.length} Items
            </Badge>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            Search, filter, categorize, and allocate examination questions into test papers.
          </p>
        </div>

        {/* View mode toggle (Table / Cards) */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-zinc-900 border border-zinc-800 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
              viewMode === 'table'
                ? 'bg-zinc-800 text-amber-400'
                : 'text-zinc-400 hover:text-zinc-200',
            ].join(' ')}
            aria-label="Table View"
          >
            <List size={14} />
            <span>Table</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
              viewMode === 'cards'
                ? 'bg-zinc-800 text-amber-400'
                : 'text-zinc-400 hover:text-zinc-200',
            ].join(' ')}
            aria-label="Cards View"
          >
            <LayoutGrid size={14} />
            <span>Cards</span>
          </button>
        </div>
      </div>

      {/* ── Category Pill Tabs ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = categoryFilter === cat
          const count = categoryStats[cat] || 0
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCategoryFilter(cat)
                setPage(1)
              }}
              className={[
                'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap',
                isActive
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700',
              ].join(' ')}
            >
              <span>{cat === 'All' ? 'All Categories' : cat}</span>
              <span
                className={[
                  'px-1.5 py-0.2 rounded-full text-xs font-semibold',
                  isActive
                    ? 'bg-amber-500/30 text-amber-200'
                    : 'bg-zinc-800 text-zinc-400',
                ].join(' ')}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Search & Filter Controls ── */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search by question text, option or ID..."
            />
          </div>

          <div className="sm:w-48">
            {/* Difficulty Dropdown */}
            <select
              aria-label="Filter by difficulty"
              value={diffFilter}
              onChange={(e) => {
                setDiffFilter(e.target.value)
                setPage(1)
              }}
              className="input-base w-full"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? 'All Difficulties' : d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter status summary */}
        <div className="mt-4 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
          <span>
            Showing <strong className="text-zinc-300">{filtered.length}</strong> of{' '}
            <strong className="text-zinc-300">{questions.length}</strong> repository questions
          </span>
          {(search || categoryFilter !== 'All' || diffFilter !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setCategoryFilter('All')
                setDiffFilter('All')
                setPage(1)
              }}
              className="text-amber-400 hover:text-amber-300 underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </Card>

      {/* ── QUESTION DISPLAY (TABLE OR CARDS) ── */}
      {filtered.length === 0 ? (
        <Card padding="p-12">
          <EmptyState
            icon={<HelpCircle size={36} />}
            title="No questions match your filter criteria"
            description="Try clearing search keywords or choosing different category and difficulty filters."
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearch('')
                  setCategoryFilter('All')
                  setDiffFilter('All')
                }}
              >
                Clear All Filters
              </Button>
            }
          />
        </Card>
      ) : viewMode === 'table' ? (
        /* ── TABLE VIEW ── */
        <Card padding="p-0">
          {/* Table Header */}
          <div className="hidden lg:grid grid-cols-12 px-6 py-4 border-b border-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-400 bg-zinc-900/40">
            <div className="col-span-5">Question</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-1">Difficulty</div>
            <div className="col-span-1 text-center">Marks</div>
            <div className="col-span-2">Correct Answer</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          <div className="divide-y divide-zinc-800">
            {paged.map((q) => {
              const diff = DIFFICULTY_CONFIG[q.difficulty] ?? DIFFICULTY_CONFIG.Easy
              const letter = String.fromCharCode(65 + q.correctAnswer)
              const correctOptionText = q.options[q.correctAnswer] || ''
              const isExpanded = expandedId === q.id
              const allocatedExams = examAllocations[q.id] || new Set()
              const isAllocated = allocatedExams.size > 0

              return (
                <div
                  key={q.id}
                  className="px-5 py-4 lg:grid lg:grid-cols-12 lg:items-center gap-3 hover:bg-zinc-900/30 transition-colors"
                >
                  {/* 1. Question Column */}
                  <div className="lg:col-span-5 min-w-0">
                    <div className="flex items-start gap-2">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : q.id)}
                        className="mt-0.5 p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                        aria-label={isExpanded ? 'Collapse options' : 'Expand options'}
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs tabular-nums px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                            {q.id}
                          </span>
                          {isAllocated && (
                            <Badge variant="success" size="sm">
                              In {allocatedExams.size} {allocatedExams.size === 1 ? 'Exam' : 'Exams'}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium text-zinc-100 line-clamp-2">
                          {q.text}
                        </p>
                      </div>
                    </div>

                    {/* Mobile Only Metadata Tags */}
                    <div className="flex flex-wrap items-center gap-2 mt-2.5 lg:hidden">
                      <Badge variant="default" size="sm">
                        {q.category}
                      </Badge>
                      <Badge variant={diff.variant} size="sm" dot>
                        {q.difficulty}
                      </Badge>
                      <Badge variant="primary" size="sm">
                        {q.marks}M
                      </Badge>
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Ans: {letter}
                      </span>
                    </div>

                    {/* Expanded Options List */}
                    {isExpanded && (
                      <div className="mt-3.5 space-y-1.5 pl-7">
                        {q.options.map((opt, idx) => {
                          const isCorrect = idx === q.correctAnswer
                          const optLetter = String.fromCharCode(65 + idx)
                          return (
                            <div
                              key={idx}
                              className={[
                                'flex items-center gap-2 px-3 py-1.5 rounded-md text-xs border transition-colors',
                                isCorrect
                                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 font-medium'
                                  : 'bg-zinc-900 border-zinc-800/70 text-zinc-400',
                              ].join(' ')}
                            >
                              <span className="font-semibold text-zinc-500">
                                {optLetter}.
                              </span>
                              <span className="flex-1">{opt}</span>
                              {isCorrect && (
                                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                                  <Check size={12} /> Correct
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* 2. Category Column */}
                  <div className="hidden lg:flex lg:col-span-2 items-center">
                    <Badge variant="default" size="sm">
                      {q.category}
                    </Badge>
                  </div>

                  {/* 3. Difficulty Column */}
                  <div className="hidden lg:flex lg:col-span-1 items-center">
                    <Badge variant={diff.variant} size="sm" dot>
                      {q.difficulty}
                    </Badge>
                  </div>

                  {/* 4. Marks Column */}
                  <div className="hidden lg:flex lg:col-span-1 justify-center items-center">
                    <span className="text-sm font-semibold text-zinc-200">
                      {q.marks}
                    </span>
                  </div>

                  {/* 5. Correct Answer Column */}
                  <div className="hidden lg:flex lg:col-span-2 items-center gap-1.5 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium truncate">
                      <span className="flex-shrink-0 flex items-center justify-center h-5 w-5 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 font-bold text-xs">
                        {letter}
                      </span>
                      <span className="truncate text-zinc-300" title={correctOptionText}>
                        {correctOptionText}
                      </span>
                    </div>
                  </div>

                  {/* 6. Actions Column */}
                  <div className="flex items-center justify-end gap-1.5 mt-3 lg:mt-0 lg:col-span-1 flex-shrink-0">
                    {/* Add to Exam */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedExamId(exams[0]?.id || '')
                        setAddToExamTarget(q)
                      }}
                      title="Add to Exam"
                      aria-label="Add question to exam"
                      className={[
                        'p-1.5 rounded-lg border transition-colors',
                        isAllocated
                          ? 'border-emerald-800/60 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/50'
                          : 'border-zinc-700/60 bg-zinc-800 text-zinc-300 hover:text-amber-400 hover:border-amber-600/60',
                      ].join(' ')}
                    >
                      <FolderPlus size={14} />
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => setEditTarget(q)}
                      title="Edit Question"
                      aria-label="Edit question"
                      className="p-1.5 rounded-lg border border-zinc-700/60 bg-zinc-800 text-zinc-300 hover:text-zinc-100 hover:border-zinc-600 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(q)}
                      title="Delete Question"
                      aria-label="Delete question"
                      className="p-1.5 rounded-lg border border-red-900/40 bg-zinc-800 text-red-400 hover:text-red-300 hover:bg-red-950/40 hover:border-red-800/60 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Table Pagination */}
          {filtered.length > PAGE_SIZE && (
            <div className="px-5 py-4 border-t border-zinc-800">
              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                totalItems={filtered.length}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            </div>
          )}
        </Card>
      ) : (
        /* ── CARDS VIEW ── */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paged.map((q) => {
              const diff = DIFFICULTY_CONFIG[q.difficulty] ?? DIFFICULTY_CONFIG.Easy
              const letter = String.fromCharCode(65 + q.correctAnswer)
              const allocatedExams = examAllocations[q.id] || new Set()
              const isAllocated = allocatedExams.size > 0

              return (
                <div
                  key={q.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between hover:border-zinc-700/80 transition-colors space-y-4"
                >
                  {/* Top Bar: ID, Category, Difficulty, Marks */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs tabular-nums px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          {q.id}
                        </span>
                        <Badge variant="default" size="sm">
                          {q.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={diff.variant} size="sm" dot>
                          {q.difficulty}
                        </Badge>
                        <Badge variant="primary" size="sm">
                          {q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}
                        </Badge>
                      </div>
                    </div>

                    {/* Question text */}
                    <h3 className="text-sm font-semibold text-zinc-100 mt-1">
                      {q.text}
                    </h3>
                  </div>

                  {/* Options List */}
                  <div className="space-y-1.5 text-xs">
                    {q.options.map((opt, idx) => {
                      const isCorrect = idx === q.correctAnswer
                      const optLetter = String.fromCharCode(65 + idx)
                      return (
                        <div
                          key={idx}
                          className={[
                            'flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors',
                            isCorrect
                              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 font-medium'
                              : 'bg-zinc-950/40 border-zinc-800/80 text-zinc-400',
                          ].join(' ')}
                        >
                          <span className="font-bold text-zinc-500">
                            {optLetter}.
                          </span>
                          <span className="flex-1">{opt}</span>
                          {isCorrect && (
                            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 size={13} /> Correct Answer
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Card Footer: Status & Actions */}
                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-3">
                    <div>
                      {isAllocated ? (
                        <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                          <Check size={12} /> Allocated to {allocatedExams.size} exam(s)
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-500">Available in Bank</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant={isAllocated ? 'secondary' : 'primary'}
                        size="xs"
                        leftIcon={<FolderPlus size={13} />}
                        onClick={() => {
                          setSelectedExamId(exams[0]?.id || '')
                          setAddToExamTarget(q)
                        }}
                      >
                        {isAllocated ? 'Add to Another' : 'Add to Exam'}
                      </Button>

                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => setEditTarget(q)}
                        aria-label="Edit"
                      >
                        <Edit2 size={13} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => setDeleteTarget(q)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-950/40"
                        aria-label="Delete"
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Cards Pagination */}
          {filtered.length > PAGE_SIZE && (
            <Card>
              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                totalItems={filtered.length}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            </Card>
          )}
        </div>
      )}

      {/* ── Edit Question Modal ── */}
      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit Question"
        size="2xl"
      >
        {editTarget && (
          <QuestionForm
            initialData={editTarget}
            onSubmit={handleEdit}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>

      {/* ── Add to Exam Modal ── */}
      <Modal
        isOpen={!!addToExamTarget}
        onClose={() => {
          setAddToExamTarget(null)
          setSelectedExamId('')
        }}
        title="Add Question to Exam"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button
              variant="secondary"
              onClick={() => {
                setAddToExamTarget(null)
                setSelectedExamId('')
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={!selectedExamId}
              onClick={handleConfirmAddToExam}
              leftIcon={<FolderPlus size={14} />}
            >
              Add to Selected Exam
            </Button>
          </div>
        }
      >
        {addToExamTarget && (
          <div className="space-y-4 text-left">
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs tabular-nums text-zinc-500">{addToExamTarget.id}</span>
                <Badge variant="default" size="sm">{addToExamTarget.category}</Badge>
                <Badge variant="primary" size="sm">{addToExamTarget.marks} Marks</Badge>
              </div>
              <p className="text-xs font-medium text-zinc-200 mt-1 line-clamp-2">
                {addToExamTarget.text}
              </p>
            </div>

            <div>
              <label htmlFor="target-exam" className="form-label">
                Select Examination Paper <span className="text-red-500">*</span>
              </label>
              <Select
                id="target-exam"
                options={examOptions}
                placeholder="Choose an examination..."
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                required
              />
              <p className="text-xs text-zinc-500 mt-1.5">
                The question will be associated with the selected exam paper and assigned {addToExamTarget.marks} marks.
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Delete Question Confirm Dialog ── */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Question"
        message={
          deleteTarget
            ? `Are you sure you want to permanently delete question "${deleteTarget.id}" from the Question Bank? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete Question"
        confirmVariant="danger"
      />
    </div>
  )
}
