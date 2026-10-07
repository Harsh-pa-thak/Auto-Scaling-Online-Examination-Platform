import { useState } from 'react'
import { Button, Input, Select } from '../common'

export const DIFFICULTY_OPTIONS = [
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard', label: 'Hard' },
]

export const CATEGORY_OPTIONS = [
  { value: 'DSA', label: 'DSA' },
  { value: 'DBMS', label: 'DBMS' },
  { value: 'OS', label: 'OS' },
  { value: 'Networks', label: 'Networks' },
  { value: 'Cloud', label: 'Cloud' },
]

export const CORRECT_ANSWER_OPTIONS = [
  { value: '0', label: 'Option A' },
  { value: '1', label: 'Option B' },
  { value: '2', label: 'Option C' },
  { value: '3', label: 'Option D' },
]

export const CATEGORY_TO_SUBJECT = {
  'DSA': 'Data Structures',
  'DBMS': 'DBMS',
  'OS': 'Operating Systems',
  'Networks': 'Computer Networks',
  'Cloud': 'Cloud Computing',
}

export const SUBJECT_TO_CATEGORY = {
  'Data Structures': 'DSA',
  'DBMS': 'DBMS',
  'Operating Systems': 'OS',
  'Computer Networks': 'Networks',
  'Cloud Computing': 'Cloud',
  'DSA': 'DSA',
  'OS': 'OS',
  'Networks': 'Networks',
  'Cloud': 'Cloud',
}

export const NORMALIZE_DIFFICULTY = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  Easy: 'Easy',
  Medium: 'Medium',
  Hard: 'Hard',
}

const EMPTY_FORM = {
  text: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctAnswer: '',
  marks: '2',
  difficulty: '',
  category: '',
}

function validate(form) {
  const errors = {}
  if (!form.text.trim()) errors.text = 'Question text is required.'
  if (!form.optionA.trim()) errors.optionA = 'Option A is required.'
  if (!form.optionB.trim()) errors.optionB = 'Option B is required.'
  if (!form.optionC.trim()) errors.optionC = 'Option C is required.'
  if (!form.optionD.trim()) errors.optionD = 'Option D is required.'
  if (form.correctAnswer === '') errors.correctAnswer = 'Please select the correct answer.'
  if (!form.marks || isNaN(Number(form.marks)) || Number(form.marks) <= 0) {
    errors.marks = 'Marks must be a positive number.'
  }
  if (!form.difficulty) errors.difficulty = 'Please select a difficulty level.'
  if (!form.category) errors.category = 'Please select a category.'
  return errors
}

/**
 * Reusable QuestionForm component.
 *
 * Props:
 *   initialData    — pre-filled values when editing (optional)
 *   onSubmit(data) — called with parsed question object on valid submission
 *   onCancel()     — called when Cancel is clicked
 *   loading        — disables submit button while saving
 */
export default function QuestionForm({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [form, setForm] = useState(() => {
    if (!initialData) return EMPTY_FORM
    const rawCategory = initialData.category || initialData.subject || ''
    const rawDiff = initialData.difficulty || ''

    return {
      text: initialData.text ?? '',
      optionA: initialData.options?.[0] ?? '',
      optionB: initialData.options?.[1] ?? '',
      optionC: initialData.options?.[2] ?? '',
      optionD: initialData.options?.[3] ?? '',
      correctAnswer: initialData.correctAnswer !== undefined ? String(initialData.correctAnswer) : '',
      marks: String(initialData.marks ?? '2'),
      difficulty: NORMALIZE_DIFFICULTY[rawDiff] ?? rawDiff,
      category: SUBJECT_TO_CATEGORY[rawCategory] ?? rawCategory,
    }
  })

  const [errors, setErrors] = useState({})

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    const parsed = {
      text: form.text.trim(),
      options: [
        form.optionA.trim(),
        form.optionB.trim(),
        form.optionC.trim(),
        form.optionD.trim(),
      ],
      correctAnswer: parseInt(form.correctAnswer, 10),
      marks: parseInt(form.marks, 10) || 2,
      difficulty: form.difficulty,
      category: form.category,
      subject: CATEGORY_TO_SUBJECT[form.category] || form.category,
    }
    onSubmit(parsed)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 text-left">
      {/* ── Question Text ── */}
      <div className="space-y-1">
        <label htmlFor="question-text" className="form-label">
          Question Text <span className="text-red-500">*</span>
        </label>
        <textarea
          id="question-text"
          rows={3}
          value={form.text}
          onChange={(e) => handleChange('text', e.target.value)}
          placeholder="Enter question statement..."
          className={[
            'input-base w-full resize-none',
            errors.text ? 'input-error' : '',
          ].join(' ')}
        />
        {errors.text && (
          <p role="alert" className="text-xs text-red-500">
            {errors.text}
          </p>
        )}
      </div>

      {/* ── Options (A, B, C, D) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="optionA"
          label="Option A"
          required
          value={form.optionA}
          onChange={(e) => handleChange('optionA', e.target.value)}
          error={errors.optionA}
          placeholder="Enter Option A..."
        />
        <Input
          id="optionB"
          label="Option B"
          required
          value={form.optionB}
          onChange={(e) => handleChange('optionB', e.target.value)}
          error={errors.optionB}
          placeholder="Enter Option B..."
        />
        <Input
          id="optionC"
          label="Option C"
          required
          value={form.optionC}
          onChange={(e) => handleChange('optionC', e.target.value)}
          error={errors.optionC}
          placeholder="Enter Option C..."
        />
        <Input
          id="optionD"
          label="Option D"
          required
          value={form.optionD}
          onChange={(e) => handleChange('optionD', e.target.value)}
          error={errors.optionD}
          placeholder="Enter Option D..."
        />
      </div>

      {/* ── Evaluation & Classification Metadata ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Correct Answer */}
        <Select
          id="correctAnswer"
          label="Correct Answer"
          required
          options={CORRECT_ANSWER_OPTIONS}
          placeholder="Select Answer"
          value={form.correctAnswer}
          onChange={(e) => handleChange('correctAnswer', e.target.value)}
          error={errors.correctAnswer}
        />

        {/* Marks */}
        <Input
          id="marks"
          type="number"
          min="1"
          max="100"
          label="Marks"
          required
          value={form.marks}
          onChange={(e) => handleChange('marks', e.target.value)}
          error={errors.marks}
          placeholder="e.g. 2"
        />

        {/* Difficulty */}
        <Select
          id="difficulty"
          label="Difficulty"
          required
          options={DIFFICULTY_OPTIONS}
          placeholder="Select Difficulty"
          value={form.difficulty}
          onChange={(e) => handleChange('difficulty', e.target.value)}
          error={errors.difficulty}
        />

        {/* Category */}
        <Select
          id="category"
          label="Category"
          required
          options={CATEGORY_OPTIONS}
          placeholder="Select Category"
          value={form.category}
          onChange={(e) => handleChange('category', e.target.value)}
          error={errors.category}
        />
      </div>

      {/* ── Action Buttons ── */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {initialData ? 'Update Question' : 'Add Question'}
        </Button>
      </div>
    </form>
  )
}
