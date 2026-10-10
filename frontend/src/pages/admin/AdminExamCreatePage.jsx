import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Card } from '../../components/common'
import { api } from '../../lib/api'
import { useToast } from '../../hooks/useToast'

export default function AdminExamCreatePage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [questions, setQuestions] = useState([])
  const [selected, setSelected] = useState([])
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '', subject: '', code: '', description: '', duration: 30,
    startTime: '', endTime: '', totalMarks: 0, passingMarks: 0,
  })

  useEffect(() => {
    api('/questions').then(setQuestions).catch((error) => toast.error('Questions unavailable', error.message))
  }, [toast])

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const toggleQuestion = (id) => setSelected((current) => current.includes(id)
    ? current.filter((item) => item !== id)
    : [...current, id])

  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    try {
      const exam = await api('/exams', {
        method: 'POST',
        body: { ...form, duration: Number(form.duration), totalMarks: Number(form.totalMarks), passingMarks: Number(form.passingMarks) },
      })
      if (selected.length) {
        await api(`/exams/${exam.id}/questions`, {
          method: 'PUT',
          body: { assignments: selected.map((questionId, index) => ({ questionId, position: index + 1 })) },
        })
      }
      toast.success('Exam created', 'The exam was saved as a draft.')
      navigate('/admin/exams')
    } catch (error) {
      toast.error('Could not create exam', error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="max-w-4xl space-y-6">
      <header className="page-header">
        <div><h1 className="page-title">Create examination</h1><p className="page-subtitle">Configure the schedule and assign questions.</p></div>
        <Button type="submit" loading={saving}>Save draft</Button>
      </header>
      <Card className="grid gap-4 p-6 sm:grid-cols-2">
        {[
          ['title', 'Title'], ['subject', 'Subject'], ['code', 'Course code'],
          ['duration', 'Duration (minutes)'], ['totalMarks', 'Total marks'], ['passingMarks', 'Passing marks'],
          ['startTime', 'Start time'], ['endTime', 'End time'],
        ].map(([key, label]) => (
          <Input key={key} label={label} type={key.includes('Time') ? 'datetime-local' : key === 'duration' || key.includes('Marks') ? 'number' : 'text'} required value={form[key]} onChange={(event) => update(key, event.target.value)} />
        ))}
        <Input label="Description" value={form.description} onChange={(event) => update('description', event.target.value)} className="sm:col-span-2" />
      </Card>
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">Assign questions</h2>
        <div className="space-y-2">
          {questions.map((question) => (
            <label key={question.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-800 p-3 hover:border-zinc-600">
              <input type="checkbox" checked={selected.includes(question.id)} onChange={() => toggleQuestion(question.id)} />
              <span className="text-sm text-zinc-200">{question.text}</span>
            </label>
          ))}
          {!questions.length && <p className="text-sm text-zinc-500">No questions in the question bank yet.</p>}
        </div>
      </Card>
    </form>
  )
}
