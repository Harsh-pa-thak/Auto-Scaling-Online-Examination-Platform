import { useMemo, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  FileText,
  Activity,
  CheckCircle2,
  PlusCircle,
  Plus,
  Award,
  ChevronRight,
} from 'lucide-react'
import {
  Card,
  Badge,
  Button,
  ProgressBar,
  StatsCard,
} from '../../components/common'
import { api } from '../../lib/api'

// Date format helper
function formatExamDate(dateStr) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState({ students: 0, exams: 0, activeAttempts: 0, recentActivity: [] })
  const [exams, setExams] = useState([])
  useEffect(() => {
    Promise.all([api('/admin/dashboard'), api('/admin/exams')])
      .then(([data, loadedExams]) => { setDashboard(data); setExams(loadedExams) })
      .catch(() => {})
  }, [])
  const overview = { totalStudents: dashboard.students, totalExams: dashboard.exams, activeExams: dashboard.activeAttempts, totalAttempts: dashboard.recentActivity.length, completedExams: 0, examPassRate: 0 }

  // Active exams list
  const activeExams = useMemo(() => {
    return exams.filter((e) => e.status === 'active')
  }, [exams])

  // Recent exams list (latest 5)
  const recentExams = useMemo(() => {
    return exams.slice(0, 5)
  }, [exams])

  const scheduledCount = overview.totalExams - overview.completedExams - overview.activeExams

  return (
    <div className="space-y-8">
      {/* ── Page Header & Quick Actions ── */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Examination operations, proctored sessions, and candidate evaluations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/admin/exams/create">
            <Button size="sm" leftIcon={<PlusCircle size={16} />}>
              Create exam
            </Button>
          </Link>
          <Link to="/admin/question-bank">
            <Button variant="secondary" size="sm" leftIcon={<Plus size={16} />}>
              Add question
            </Button>
          </Link>
          <Link to="/admin/results">
            <Button variant="secondary" size="sm" leftIcon={<Award size={16} />}>
              View results
            </Button>
          </Link>
        </div>
      </header>

      {/* ── Key Statistics ── */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Students"
          value={overview.totalStudents.toLocaleString()}
          icon={<Users size={18} />}
          description="Enrolled across batches"
        />
        <StatsCard
          title="Exams"
          value={overview.totalExams}
          icon={<FileText size={18} />}
          description={`${overview.completedExams} evaluated, ${scheduledCount} scheduled`}
        />
        <StatsCard
          title="Live now"
          value={overview.activeExams}
          icon={<Activity size={18} />}
          description="Exams currently in session"
        />
        <StatsCard
          title="Attempts"
          value={overview.totalAttempts.toLocaleString()}
          icon={<CheckCircle2 size={18} />}
          description={`${overview.examPassRate}% pass rate`}
        />
      </section>

      {/* ── Two columns ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* ── Live exams ── */}
          <Card>
            <div className="section-header">
              <h2 className="section-title">Live exams</h2>
              <Link to="/admin/monitoring" className="text-link">
                Open monitoring
                <ChevronRight size={14} />
              </Link>
            </div>

            {activeExams.length === 0 ? (
              <p className="py-8 text-center text-sm text-zinc-500">
                No examinations are in session right now.
              </p>
            ) : (
              <ul className="space-y-4">
                {activeExams.map((exam) => (
                  <li key={exam.id} className="space-y-4 rounded-lg border border-zinc-800 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-zinc-400">
                          {exam.subject} · <span className="tabular-nums">{exam.code}</span>
                        </p>
                        <h3 className="mt-1 text-base font-semibold text-zinc-100">{exam.title}</h3>
                        <p className="mt-1 text-sm text-zinc-400">
                          {exam.duration} min · {exam.totalMarks} marks · pass mark {exam.passMark}
                        </p>
                      </div>
                      <Link to="/admin/monitoring" className="self-start sm:self-center">
                        <Button size="sm" leftIcon={<Activity size={14} />}>
                          Monitor
                        </Button>
                      </Link>
                    </div>

                    <div className="border-t border-zinc-800 pt-4">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-zinc-400">Students active</span>
                        <span className="tabular-nums text-zinc-200">
                          142 of {exam.allowedStudents} (71%)
                        </span>
                      </div>
                      <ProgressBar value={142} max={exam.allowedStudents} size="xs" />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* ── Recent exams ── */}
          <Card padding="p-0">
            <div className="section-header mb-0 border-b border-zinc-800 px-6 py-4">
              <h2 className="section-title">Recent exams</h2>
              <Link to="/admin/exams" className="text-link">
                View all
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500">
                    <th className="px-6 py-3 font-medium">Exam</th>
                    <th className="px-4 py-3 font-medium">Subject</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {recentExams.map((exam) => {
                    const isLive = exam.status === 'active'
                    const isUpcoming = exam.status === 'upcoming'

                    return (
                      <tr key={exam.id}>
                        <td className="px-6 py-4">
                          <p className="font-medium text-zinc-100">{exam.title}</p>
                          <p className="text-xs tabular-nums text-zinc-500">{exam.code}</p>
                        </td>
                        <td className="px-4 py-4 text-zinc-300">{exam.subject}</td>
                        <td className="px-4 py-4 text-zinc-400">{formatExamDate(exam.startTime)}</td>
                        <td className="px-4 py-4">
                          <Badge variant={isLive ? 'primary' : 'default'} dot size="sm">
                            {isLive ? 'Live' : isUpcoming ? 'Upcoming' : 'Completed'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link to="/admin/exams">
                            <Button variant="ghost" size="xs">
                              Details
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* ── Recent activity ── */}
        <Card className="self-start" padding="p-0">
          <div className="border-b border-zinc-800 px-6 py-4">
            <h2 className="section-title">Recent activity</h2>
          </div>

          <ul className="divide-y divide-zinc-800">
            {dashboard.recentActivity.map((act) => (
              <li key={act.id} className="space-y-1 px-6 py-4 text-sm">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate font-medium text-zinc-100">{act.title}</p>
                  <span className="whitespace-nowrap text-xs text-zinc-500">{act.timestamp}</span>
                </div>
                <p className="text-zinc-400">{act.description}</p>
                {act.score && (
                  <p className="text-xs text-zinc-500">
                    Score <span className="tabular-nums text-zinc-200">{act.score}</span>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
