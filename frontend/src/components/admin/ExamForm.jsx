import { useEffect, useMemo, useState } from 'react'
import {
  Search,
  ArrowUp,
  ArrowDown,
  X,
  ListOrdered,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { Button, Card, Input, Badge, LoadingSpinner, EmptyState, ErrorState } from '../common'
import { api } from '../../lib/api'
import { useToast } from '../../hooks/useToast'

// ISO / Date → value for <input type="datetime-local"> in local time
function toLocalInput(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const emptyForm = {
  title: '',
  subject: '',
  code: '',
  description: '',
  duration: '',
  startTime: '',
  endTime: '',
  totalMarks: '',
  passingMarks: '',
}

/**
 * ExamForm — shared create/edit form for examinations.
 *
 * @param {Object}   exam     - existing exam (edit mode) or null (create mode)
 * @param {Function} onSaved  - called with the saved exam
 * @param {Function} onCancel - optional cancel handler
 */
export default function ExamForm({ exam = null, onSaved, onCancel }) {
  const { toast } = useToast()
  const isEdit = Boolean(exam)

  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)

  // Question bank
  const [questions, setQuestions] = useState([])
  const [questionsLoading, setQuestionsLoading] = useState(true)
  const [questionsError, setQuestionsError] = useState(null)
  const [search, setSearch] = useState('')
  const [assignments, setAssignments] = useState([]) // [{ questionId, ...question }]

  // Load form values from the exam
  useEffect(() => {
    if (!exam) {
      setForm(emptyForm)
      return
    }
    setForm({
      title: exam.title || '',
      subject: exam.subject || '',
      code: exam.code || '',
      description: exam.description || '',
      duration: exam.duration ?? '',
      startTime: toLocalInput(exam.startTime),
      endTime: toLocalInput(exam.endTime),
      totalMarks: exam.totalMarks ?? '',
      passingMarks: exam.passingMarks ?? exam.passMark ?? '',
    })
    const existing = [...(exam.questions || [])]
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((item) => item.question || item)
      .filter(Boolean)
    setAssignments(existing)
  }, [exam])

  // Load the question bank
  useEffect(() => {
    setQuestionsLoading(true)
    setQuestionsError(null)
    api('/questions')
      .then((data) => setQuestions(Array.isArray(data) ? data : []))
      .catch((error) => setQuestionsError(error.message))
      .finally(() => setQuestionsLoading(false))
  }, [])

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
    if (errors[key]) setErrors((current) => ({ ...current, [key]: null }))
  }

  const filteredQuestions = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return questions
    return questions.filter((question) =>
      [question.text, question.category, question.difficulty]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(query))
    )
  }, [questions, search])

  const selectedIds = useMemo(() => assignments.map((q) => q.id), [assignments])

  const toggleQuestion = (question) => {
    setAssignments((current) =>
      current.some((q) => q.id === question.id)
        ? current.filter((q) => q.id !== question.id)
        : [...current, question]
    )
  }

  const moveAssignment = (index, delta) => {
    setAssignments((current) => {
      const next = [...current]
      const target = index + delta
      if (target < 0 || target >= next.length) return current
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const selectedMarks = assignments.reduce((sum, q) => sum + (Number(q.marks) || 0), 0)

  const validate = () => {
    const next = {}
    if (!form.title.trim()) next.title = 'Title is required'
    if (!form.subject.trim()) next.subject = 'Subject is required'
    if (!form.code.trim()) next.code = 'Course code is required'
    if (!form.duration || Number(form.duration) < 1) next.duration = 'Duration must be at least 1 minute'
    if (!form.startTime) next.startTime = 'Start time is required'
    if (!form.endTime) next.endTime = 'End time is required'
    if (form.startTime && form.endTime && new Date(form.endTime) <= new Date(form.startTime)) {
      next.endTime = 'End time must be after start time'
    }
    if (!form.totalMarks || Number(form.totalMarks) < 1) next.totalMarks = 'Total marks must be at least 1'
    if (form.passingMarks === '' || Number(form.passingMarks) < 0) next.passingMarks = 'Passing marks cannot be negative'
    if (form.passingMarks !== '' && form.totalMarks !== '' && Number(form.passingMarks) > Number(form.totalMarks)) {
      next.passingMarks = 'Passing marks cannot exceed total marks'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const payload = () => ({
    title: form.title.trim(),
    subject: form.subject.trim(),
    code: form.code.trim(),
    description: form.description.trim() || undefined,
    duration: Number(form.duration),
    startTime: new Date(form.startTime).toISOString(),
    endTime: new Date(form.endTime).toISOString(),
    totalMarks: Number(form.totalMarks),
    passingMarks: Number(form.passingMarks),
  })

  const assignmentPayload = () => ({
    assignments: assignments.map((question, index) => ({
      questionId: question.id,
      position: index + 1,
    })),
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) {
      toast.error('Check the form', 'Fix the highlighted fields before saving.')
      return
    }

    setSaving(true)
    try {
      let saved
      if (isEdit) {
        saved = await api(`/exams/${exam.id}`, { method: 'PATCH', body: payload() })
      } else {
        saved = await api('/exams', { method: 'POST', body: payload() })
      }

      // Persist question assignments. Locked exams respond with 409 — surface it.
      const examId = saved?.id || exam?.id
      if (examId) {
        try {
          await api(`/exams/${examId}/questions`, { method: 'PUT', body: assignmentPayload() })
        } catch (error) {
          toast.warning('Questions not saved', error.message)
        }
      }

      toast.success(isEdit ? 'Exam updated' : 'Exam created', isEdit
        ? 'Changes were saved.'
        : 'The exam was saved as a draft.')
      onSaved?.(saved)
    } catch (error) {
      toast.error(isEdit ? 'Could not update exam' : 'Could not create exam', error.message)
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    setPublishing(true)
    try {
      const published = await api(`/exams/${exam.id}/publish`, { method: 'POST' })
      toast.success('Exam published', 'Students can now see this examination.')
      onSaved?.(published)
    } catch (error) {
      toast.error('Could not publish exam', error.message)
    } finally {
      setPublishing(false)
    }
  }

  const status = String(exam?.status || 'draft').toLowerCase()
  const questionLocked = ['active', 'completed'].includes(status)

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl space-y-8" noValidate>
      {/* ── Details ── */}
      <Card padding="p-6">
        <h2 className="section-title">Details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            id="exam-title"
            label="Title"
            required
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="e.g. Data Structures — Midterm"
            error={errors.title}
          />
          <Input
            id="exam-subject"
            label="Subject"
            required
            value={form.subject}
            onChange={(e) => update('subject', e.target.value)}
            placeholder="e.g. Computer Science"
            error={errors.subject}
          />
          <Input
            id="exam-code"
            label="Course code"
            required
            value={form.code}
            onChange={(e) => update('code', e.target.value)}
            placeholder="e.g. CSE201"
            error={errors.code}
          />
          <Input
            id="exam-duration"
            label="Duration (minutes)"
            type="number"
            min="1"
            required
            value={form.duration}
            onChange={(e) => update('duration', e.target.value)}
            error={errors.duration}
          />

          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="exam-description" className="form-label">
              Description
            </label>
            <textarea
              id="exam-description"
              rows={3}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Optional context shown to students"
              className="input-base resize-y"
            />
          </div>
        </div>
      </Card>

      {/* ── Schedule & marks ── */}
      <Card padding="p-6">
        <h2 className="section-title">Schedule &amp; marks</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            id="exam-start"
            label="Start time"
            type="datetime-local"
            required
            value={form.startTime}
            onChange={(e) => update('startTime', e.target.value)}
            error={errors.startTime}
          />
          <Input
            id="exam-end"
            label="End time"
            type="datetime-local"
            required
            value={form.endTime}
            onChange={(e) => update('endTime', e.target.value)}
            error={errors.endTime}
          />
          <Input
            id="exam-total-marks"
            label="Total marks"
            type="number"
            min="1"
            required
            value={form.totalMarks}
            onChange={(e) => update('totalMarks', e.target.value)}
            error={errors.totalMarks}
          />
          <Input
            id="exam-passing-marks"
            label="Passing marks"
            type="number"
            min="0"
            required
            value={form.passingMarks}
            onChange={(e) => update('passingMarks', e.target.value)}
            error={errors.passingMarks}
          />
        </div>
      </Card>

      {/* ── Question assignment ── */}
      <Card padding="p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title">Questions</h2>
            <p className="mt-1 text-sm text-ink-3">
              {assignments.length} selected · {selectedMarks} marks
              {form.totalMarks ? ` of ${form.totalMarks} total` : ''}
            </p>
          </div>
          {questionLocked && (
            <Badge variant="warning" dot>
              Locked — exam is {status}
            </Badge>
          )}
        </div>

        {questionsError ? (
          <ErrorState
            title="Could not load the question bank"
            message={questionsError}
            onRetry={() => {
              setQuestionsError(null)
              setQuestionsLoading(true)
              api('/questions')
                .then((data) => setQuestions(Array.isArray(data) ? data : []))
                .catch((error) => setQuestionsError(error.message))
                .finally(() => setQuestionsLoading(false))
            }}
          />
        ) : (
          <div className="mt-5 grid gap-6 lg:grid-cols-2">
            {/* Bank */}
            <div className="space-y-3">
              <Input
                id="exam-question-search"
                placeholder="Search the question bank"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search size={15} />}
              />

              {questionsLoading ? (
                <div className="flex items-center justify-center py-10">
                  <LoadingSpinner size="md" />
                </div>
              ) : filteredQuestions.length === 0 ? (
                <EmptyState
                  title="No questions found"
                  message={search ? 'Try a different search term.' : 'Add questions to the bank first, then assign them here.'}
                />
              ) : (
                <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
                  {filteredQuestions.map((question) => {
                    const checked = selectedIds.includes(question.id)
                    return (
                      <li key={question.id}>
                        <label
                          className={[
                            'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors duration-fast',
                            checked
                              ? 'border-accent/40 bg-accent-soft'
                              : 'border-line hover:border-line-strong hover:bg-sunken/50',
                          ].join(' ')}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleQuestion(question)}
                            className="mt-1 h-4 w-4 accent-accent"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm text-ink">{question.text}</span>
                            <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-3">
                              {question.category && <span>{question.category}</span>}
                              {question.difficulty && <span>· {question.difficulty}</span>}
                              <span>· {question.marks ?? 1} marks</span>
                            </span>
                          </span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {/* Selected, in order */}
            <div className="rounded-lg border border-line bg-sunken/40 p-3">
              <div className="flex items-center gap-2 pb-2 text-xs font-semibold uppercase tracking-wider text-ink-3">
                <ListOrdered size={14} />
                Assigned order
              </div>

              {assignments.length === 0 ? (
                <p className="px-1 py-8 text-center text-sm text-ink-3">
                  No questions assigned yet.
                </p>
              ) : (
                <ol className="max-h-80 space-y-2 overflow-y-auto pr-1">
                  {assignments.map((question, index) => (
                    <li
                      key={question.id}
                      className="flex items-start gap-2 rounded-md border border-line bg-surface p-2.5"
                    >
                      <span className="mt-0.5 w-5 flex-shrink-0 text-right text-xs font-semibold tabular-nums text-ink-4">
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm text-ink-2">{question.text}</span>
                      <span className="flex flex-shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveAssignment(index, -1)}
                          disabled={index === 0}
                          aria-label={`Move question ${index + 1} up`}
                          className="rounded p-1 text-ink-4 transition-colors duration-fast hover:bg-sunken hover:text-ink disabled:opacity-30"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveAssignment(index, 1)}
                          disabled={index === assignments.length - 1}
                          aria-label={`Move question ${index + 1} down`}
                          className="rounded p-1 text-ink-4 transition-colors duration-fast hover:bg-sunken hover:text-ink disabled:opacity-30"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleQuestion(question)}
                          aria-label={`Remove question ${index + 1}`}
                          className="rounded p-1 text-ink-4 transition-colors duration-fast hover:bg-danger-soft hover:text-danger"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    </li>
                  ))}
                </ol>
              )}

              {Boolean(form.totalMarks) && selectedMarks !== Number(form.totalMarks) && (
                <p className="mt-3 flex items-start gap-1.5 border-t border-line px-1 pt-3 text-xs text-ink-3">
                  <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />
                  Assigned questions total {selectedMarks} marks; the exam is set to {form.totalMarks}.
                </p>
              )}
              {Boolean(form.totalMarks) && selectedMarks === Number(form.totalMarks) && selectedMarks > 0 && (
                <p className="mt-3 flex items-center gap-1.5 border-t border-line px-1 pt-3 text-xs text-success">
                  <CheckCircle2 size={13} className="flex-shrink-0" />
                  Assigned marks match the exam total.
                </p>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* ── Actions ── */}
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" loading={saving}>
          {isEdit ? 'Save changes' : 'Save draft'}
        </Button>
        {isEdit && status !== 'published' && (
          <Button
            type="button"
            variant="secondary"
            loading={publishing}
            onClick={handlePublish}
            disabled={assignments.length === 0}
          >
            Publish exam
          </Button>
        )}
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
