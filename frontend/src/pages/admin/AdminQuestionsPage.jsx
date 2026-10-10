import { useState, useMemo, useEffect } from 'react'
import {
  Plus,
  Edit2,
  Trash2,
  HelpCircle,
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
  StatsCard,
} from '../../components/common'
import QuestionForm, {
  CATEGORY_OPTIONS,
  DIFFICULTY_OPTIONS,
  SUBJECT_TO_CATEGORY,
  NORMALIZE_DIFFICULTY,
} from '../../components/admin/QuestionForm'
import { api } from '../../lib/api'
import { useToast } from '../../hooks/useToast'

const CATEGORIES = ['All', 'DSA', 'DBMS', 'OS', 'Networks', 'Cloud']
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard']

let nextId = 500

function genId() {
  return `Q${String(nextId++).padStart(3, '0')}`
}

const PAGE_SIZE = 10

export default function AdminQuestionsPage() {
  const { toast } = useToast()

  const [questions, setQuestions] = useState([])
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

  useEffect(() => {
    api('/questions').then(setQuestions).catch((error) => toast.error('Could not load questions', error.message))
  }, [toast])

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

  async function handleAdd(data) {
    try {
      const newQuestion = await api('/questions', { method: 'POST', body: data })
      setQuestions((prev) => [newQuestion, ...prev])
      setAddOpen(false)
      toast.success('Question Added', 'Question added successfully.')
    } catch (error) { toast.error('Question failed', error.message) }
  }

  async function handleEdit(data) {
    try {
      const updatedQuestion = await api(`/questions/${editTarget.id}`, { method: 'PATCH', body: data })
      setQuestions((prev) => prev.map((q) => (q.id === editTarget.id ? updatedQuestion : q)))
      setEditTarget(null)
      toast.success('Question Updated', 'Question updated successfully.')
    } catch (error) { toast.error('Question failed', error.message) }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const idToDelete = deleteTarget.id
    try {
      await api(`/questions/${idToDelete}`, { method: 'DELETE' })
      setQuestions((prev) => prev.filter((q) => q.id !== idToDelete))
      setDeleteTarget(null)
      toast.success('Question Deleted', 'Question removed successfully.')
    } catch (error) { toast.error('Question failed', error.message) }
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
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Questions</h1>
          <p className="page-subtitle">
            Add, edit, and remove examination questions across all subjects.
          </p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
          Add question
        </Button>
      </header>

      {/* ── Stats ── */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard title="Total" value={stats.total} description="Questions in rotation" />
        <StatsCard title="Easy" value={stats.easy} description="Difficulty: easy" />
        <StatsCard title="Medium" value={stats.medium} description="Difficulty: medium" />
        <StatsCard title="Hard" value={stats.hard} description="Difficulty: hard" />
      </section>

      <div className="space-y-4">
        {/* ── Filters ── */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <SearchBar
            value={search}
            onChange={(val) => {
              setSearch(val)
              setPage(1)
            }}
            placeholder="Search questions"
            className="flex-1"
          />
          <select
            aria-label="Filter by category"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value)
              setPage(1)
            }}
            className="input-base sm:w-44"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All categories' : c}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by difficulty"
            value={diffFilter}
            onChange={(e) => {
              setDiffFilter(e.target.value)
              setPage(1)
            }}
            className="input-base sm:w-44"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All difficulties' : d}
              </option>
            ))}
          </select>
        </div>

        {/* ── Question List ── */}
        <Card padding="p-0">
          {paged.length === 0 ? (
            <EmptyState
              icon={<HelpCircle size={28} />}
              title="No questions found"
              message="Try adjusting your filters or add a new question."
              action={
                <Button size="sm" onClick={() => setAddOpen(true)}>
                  Add question
                </Button>
              }
            />
          ) : (
            <ul className="divide-y divide-zinc-800">
              {paged.map((q) => {
                const isExpanded = expandedId === q.id
                return (
                  <li key={q.id} className="px-6 py-4">
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : q.id)}
                        className="mt-0.5 flex-shrink-0 rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <p className="min-w-0 flex-1 text-sm text-zinc-100">
                            <span className="mr-2 tabular-nums text-zinc-500">{q.id}</span>
                            {q.text}
                          </p>
                          <div className="flex flex-shrink-0 items-center gap-2">
                            <Badge size="sm">{q.difficulty}</Badge>
                            <Badge size="sm">{q.category}</Badge>
                            <span className="text-xs tabular-nums text-zinc-400">
                              {q.marks} {q.marks === 1 ? 'mark' : 'marks'}
                            </span>
                          </div>
                        </div>

                        {isExpanded && (
                          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {q.options.map((opt, idx) => {
                              const isCorrect = idx === q.correctAnswer
                              const letter = String.fromCharCode(65 + idx)
                              return (
                                <li
                                  key={idx}
                                  className={[
                                    'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm',
                                    isCorrect
                                      ? 'border-emerald-500/40 text-emerald-300'
                                      : 'border-zinc-800 text-zinc-300',
                                  ].join(' ')}
                                >
                                  <span className="text-zinc-500">{letter}.</span>
                                  <span>{opt}</span>
                                  {isCorrect && (
                                    <span className="ml-auto flex items-center gap-1 text-xs font-medium text-emerald-400">
                                      <CheckCircle2 size={14} />
                                      Correct
                                    </span>
                                  )}
                                </li>
                              )
                            })}
                          </ul>
                        )}
                      </div>

                      <div className="flex flex-shrink-0 items-center gap-1">
                        <Button variant="ghost" size="xs" onClick={() => setEditTarget(q)} aria-label="Edit question">
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setDeleteTarget(q)}
                          aria-label="Delete question"
                          className="hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}

          {filtered.length > PAGE_SIZE && (
            <div className="border-t border-zinc-800 px-6">
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
      </div>

      {/* ── Add Question Modal ── */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add question" size="2xl">
        <QuestionForm onSubmit={handleAdd} onCancel={() => setAddOpen(false)} />
      </Modal>

      {/* ── Edit Question Modal ── */}
      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit question" size="2xl">
        {editTarget && (
          <QuestionForm initialData={editTarget} onSubmit={handleEdit} onCancel={() => setEditTarget(null)} />
        )}
      </Modal>

      {/* ── Delete Confirm ── */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete question"
        message={
          deleteTarget
            ? `Delete question "${deleteTarget.id}"? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        confirmVariant="danger"
      />
    </div>
  )
}
