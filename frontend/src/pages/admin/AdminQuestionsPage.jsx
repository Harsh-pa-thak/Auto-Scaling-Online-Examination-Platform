import { useState, useMemo } from 'react'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  HelpCircle,
  Filter,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
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
} from '../../components/common'
import QuestionForm, {
  CATEGORY_OPTIONS,
  DIFFICULTY_OPTIONS,
  SUBJECT_TO_CATEGORY,
  NORMALIZE_DIFFICULTY,
} from '../../components/admin/QuestionForm'
import { mockQuestions } from '../../data/mockData'
import { useToast } from '../../hooks/useToast'

const DIFFICULTY_CONFIG = {
  Easy:   { label: 'Easy',   variant: 'success' },
  Medium: { label: 'Medium', variant: 'warning' },
  Hard:   { label: 'Hard',   variant: 'danger'  },
}

const CATEGORIES = ['All', 'DSA', 'DBMS', 'OS', 'Networks', 'Cloud']
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard']

let nextId = 500

function genId() {
  return `Q${String(nextId++).padStart(3, '0')}`
}

const PAGE_SIZE = 10

export default function AdminQuestionsPage() {
  const { toast } = useToast()

  const [questions, setQuestions] = useState(() =>
    mockQuestions.map((q) => {
      const rawCat = q.category || q.subject || ''
      const rawDiff = q.difficulty || ''
      return {
        ...q,
        category: SUBJECT_TO_CATEGORY[rawCat] ?? rawCat,
        difficulty: NORMALIZE_DIFFICULTY[rawDiff] ?? rawDiff,
      }
    })
  )
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [diffFilter, setDiffFilter] = useState('All')
  const [page, setPage] = useState(1)

  // Modal states
  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)     // question object to edit
  const [deleteTarget, setDeleteTarget] = useState(null) // question object to delete

  // Expanded row state
  const [expandedId, setExpandedId] = useState(null)

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

  function handleAdd(data) {
    const newQuestion = {
      id: genId(),
      ...data,
      category: SUBJECT_TO_CATEGORY[data.category] ?? data.category,
      difficulty: NORMALIZE_DIFFICULTY[data.difficulty] ?? data.difficulty,
    }
    setQuestions((prev) => [newQuestion, ...prev])
    setAddOpen(false)
    toast.success('Question Added', `Question ${newQuestion.id} has been added successfully.`)
  }

  function handleEdit(data) {
    const updatedQuestion = {
      ...editTarget,
      ...data,
      category: SUBJECT_TO_CATEGORY[data.category] ?? data.category,
      difficulty: NORMALIZE_DIFFICULTY[data.difficulty] ?? data.difficulty,
    }
    setQuestions((prev) =>
      prev.map((q) => (q.id === editTarget.id ? updatedQuestion : q))
    )
    setEditTarget(null)
    toast.success('Question Updated', `Question ${editTarget.id} has been updated successfully.`)
  }

  function handleDelete() {
    if (!deleteTarget) return
    const idToDelete = deleteTarget.id
    setQuestions((prev) => prev.filter((q) => q.id !== idToDelete))
    setDeleteTarget(null)
    toast.success('Question Deleted', `Question ${idToDelete} has been removed.`)
  }

  const stats = useMemo(
    () => ({
      total: questions.length,
      easy: questions.filter((q) => q.difficulty === 'Easy').length,
      medium: questions.filter((q) => q.difficulty === 'Medium').length,
      hard: questions.filter((q) => q.difficulty === 'Hard').length,
    }),
    [questions]
  )

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100">Question Management</h1>
          <p className="mt-0.5 text-sm text-zinc-400">
            Add, edit, and remove examination questions across all subjects.
          </p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
          Add Question
        </Button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Questions', value: stats.total, variant: 'default' },
          { label: 'Easy', value: stats.easy, variant: 'success' },
          { label: 'Medium', value: stats.medium, variant: 'warning' },
          { label: 'Hard', value: stats.hard, variant: 'danger' },
        ].map(({ label, value, variant }) => (
          <Card key={label} padding="p-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium">{label}</p>
            <p className="mt-1 text-2xl font-bold text-zinc-100">{value}</p>
            <div className="mt-1">
              <Badge variant={variant} size="sm" dot>{label}</Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Filters ── */}
      <Card padding="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search questions..."
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {/* Category Filter */}
            <div className="flex items-center gap-1">
              <Filter size={14} className="text-zinc-500" />
              <select
                aria-label="Filter by category"
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value)
                  setPage(1)
                }}
                className="input-base py-1.5 text-sm pr-8"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Categories' : c}
                  </option>
                ))}
              </select>
            </div>
            {/* Difficulty Filter */}
            <select
              aria-label="Filter by difficulty"
              value={diffFilter}
              onChange={(e) => {
                setDiffFilter(e.target.value)
                setPage(1)
              }}
              className="input-base py-1.5 text-sm pr-8"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? 'All Difficulties' : d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* ── Question List ── */}
      <Card padding="p-0">
        {paged.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<HelpCircle size={32} />}
              title="No questions found"
              description="Try adjusting your filters or add a new question."
              action={
                <Button size="sm" onClick={() => setAddOpen(true)}>
                  Add Question
                </Button>
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {paged.map((q) => {
              const diff = DIFFICULTY_CONFIG[q.difficulty] ?? DIFFICULTY_CONFIG.Easy
              const isExpanded = expandedId === q.id
              return (
                <div key={q.id} className="px-5 py-4">
                  {/* Row */}
                  <div className="flex items-start gap-3">
                    {/* Question ID + Expand toggle */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : q.id)}
                      className="flex-shrink-0 mt-0.5 p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-mono text-zinc-500 mr-2">{q.id}</span>
                          <span className="text-sm font-medium text-zinc-100 leading-snug">
                            {q.text}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant={diff.variant} size="sm" dot>
                            {q.difficulty}
                          </Badge>
                          <Badge variant="default" size="sm">
                            {q.category}
                          </Badge>
                          <Badge variant="primary" size="sm">
                            {q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}
                          </Badge>
                        </div>
                      </div>

                      {/* Expanded Options */}
                      {isExpanded && (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, idx) => {
                            const isCorrect = idx === q.correctAnswer
                            const letter = String.fromCharCode(65 + idx)
                            return (
                              <div
                                key={idx}
                                className={[
                                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm border',
                                  isCorrect
                                    ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300 font-medium'
                                    : 'bg-zinc-800/50 border-zinc-700/40 text-zinc-300',
                                ].join(' ')}
                              >
                                <span className="font-semibold text-xs text-zinc-400">
                                  Option {letter}:
                                </span>
                                <span>{opt}</span>
                                {isCorrect && (
                                  <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-emerald-400">
                                    <CheckCircle2 size={13} />
                                    Correct Answer
                                  </span>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => setEditTarget(q)}
                        aria-label="Edit question"
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => setDeleteTarget(q)}
                        aria-label="Delete question"
                        className="text-red-400 hover:text-red-300 hover:bg-red-950/40"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
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

      {/* ── Add Question Modal ── */}
      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New Question"
        size="2xl"
      >
        <QuestionForm
          onSubmit={handleAdd}
          onCancel={() => setAddOpen(false)}
        />
      </Modal>

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

      {/* ── Delete Confirm ── */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Question"
        message={
          deleteTarget
            ? `Are you sure you want to delete question "${deleteTarget.id}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        confirmVariant="danger"
      />
    </div>
  )
}
