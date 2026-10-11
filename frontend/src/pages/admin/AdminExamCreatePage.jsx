import { useNavigate } from 'react-router-dom'
import ExamForm from '../../components/admin/ExamForm'

export default function AdminExamCreatePage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-8">
      <header className="page-header">
        <div>
          <h1 className="page-title">Create examination</h1>
          <p className="page-subtitle">
            Configure the schedule, marks, and question assignment. New examinations are saved as
            drafts until published.
          </p>
        </div>
      </header>

      <ExamForm onSaved={() => navigate('/admin/exams')} onCancel={() => navigate('/admin/exams')} />
    </div>
  )
}
