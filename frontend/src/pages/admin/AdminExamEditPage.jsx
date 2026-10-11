import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ExamForm from '../../components/admin/ExamForm'
import { Badge, ErrorState, Skeleton } from '../../components/common'
import { api } from '../../lib/api'

const statusVariant = {
  draft: 'default',
  published: 'success',
  active: 'primary',
  completed: 'info',
  cancelled: 'danger',
}

export default function AdminExamEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [exam, setExam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    api(`/exams/${id}`)
      .then(setExam)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <div className="max-w-5xl space-y-8">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-80" />
        <div className="card space-y-5 p-6">
          <Skeleton className="h-4 w-40" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton variant="block" className="h-10" />
            <Skeleton variant="block" className="h-10" />
            <Skeleton variant="block" className="h-10" />
            <Skeleton variant="block" className="h-10" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !exam) {
    return (
      <div className="max-w-5xl">
        <ErrorState
          title="Could not load this examination"
          message={error || 'The examination may have been removed.'}
          onRetry={load}
        />
      </div>
    )
  }

  const status = String(exam.status || 'draft').toLowerCase()

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <Link
          to="/admin/exams"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-3 transition-colors duration-fast hover:text-ink"
        >
          <ArrowLeft size={14} />
          Back to examinations
        </Link>

        <div className="page-header">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={statusVariant[status] || 'default'} dot>
                {status}
              </Badge>
              {exam.code && <span className="text-sm tabular-nums text-ink-3">{exam.code}</span>}
            </div>
            <h1 className="mt-2 page-title">{exam.title}</h1>
            <p className="page-subtitle">
              {exam.subject} · {exam.totalQuestions ?? (exam.questions?.length || 0)} questions
            </p>
          </div>
        </div>
      </header>

      <ExamForm
        exam={exam}
        onSaved={(updated) => {
          if (updated) setExam((current) => ({ ...current, ...updated }))
          load()
        }}
        onCancel={() => navigate('/admin/exams')}
      />
    </div>
  )
}
