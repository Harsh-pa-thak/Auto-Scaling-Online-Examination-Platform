import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  FileText,
  Activity,
  CheckCircle2,
  PlusCircle,
  Plus,
  Award,
  Calendar,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Database,
  BarChart3,
  ShieldCheck,
  UserCheck,
} from 'lucide-react'
import {
  Card,
  Badge,
  Button,
  ProgressBar,
} from '../../components/common'
import {
  mockAnalytics,
  mockExams,
  mockAdminActivities,
} from '../../data/mockData'

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
  const { overview } = mockAnalytics

  // Active exams list
  const activeExams = useMemo(() => {
    return mockExams.filter((e) => e.status === 'active')
  }, [])

  // Recent exams list (latest 5)
  const recentExams = useMemo(() => {
    return mockExams.slice(0, 5)
  }, [])

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ── Page Header & Quick Actions Bar ── */}
      <div className="pb-4 border-b border-zinc-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
            Administration Dashboard
          </h1>
          <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
            Real-time university examination operations, proctored sessions, and candidate evaluations.
          </p>
        </div>

        {/* Quick Actions Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/admin/exams/create">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PlusCircle size={15} />}
            >
              Create Exam
            </Button>
          </Link>

          <Link to="/admin/question-bank">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Plus size={15} />}
            >
              Add Question
            </Button>
          </Link>

          <Link to="/admin/results">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Award size={15} />}
            >
              View Results
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Key Statistics Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total Students */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Total Students
            </span>
            <div className="h-8 w-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-amber-400">
              <Users size={16} />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
              {overview.totalStudents.toLocaleString()}
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Enrolled candidates across batches
            </p>
          </div>
        </div>

        {/* Stat 2: Total Exams */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Total Exams
            </span>
            <div className="h-8 w-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-300">
              <FileText size={16} />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
              {overview.totalExams}
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {overview.completedExams} evaluated, {overview.totalExams - overview.completedExams - overview.activeExams} scheduled
            </p>
          </div>
        </div>

        {/* Stat 3: Active Exams */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Active Exams
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="h-8 w-8 rounded-lg bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <Activity size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                {overview.activeExams}
              </p>
              <span className="text-xs font-semibold text-emerald-500">Live now</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Real-time concurrent examination sessions
            </p>
          </div>
        </div>

        {/* Stat 4: Total Attempts */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Total Attempts
            </span>
            <div className="h-8 w-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-amber-400">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
              {overview.totalAttempts.toLocaleString()}
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {overview.examPassRate}% institutional pass rate
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Dashboard Layout: 2 Columns on Desktop ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Active Exams + Recent Exams */}
        <div className="lg:col-span-2 space-y-6">
          {/* ── Active Exams Section ── */}
          <Card padding="p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
                  Active Exams
                </h2>
                <Badge variant="success" size="sm">
                  Live
                </Badge>
              </div>

              <Link
                to="/admin/monitoring"
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 transition-colors"
              >
                <span>Live Monitoring Console</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {activeExams.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-xs">
                No examinations are actively in session right now.
              </div>
            ) : (
              <div className="space-y-4">
                {activeExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="p-5 rounded-xl bg-zinc-850/60 border border-zinc-800 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                            {exam.code}
                          </span>
                          <span className="text-xs text-zinc-400 font-medium">
                            {exam.subject}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-zinc-100">
                          {exam.title}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Duration: {exam.duration} mins • Total Marks: {exam.totalMarks} • Pass Mark: {exam.passMark}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <Link to="/admin/monitoring">
                          <Button
                            variant="primary"
                            size="sm"
                            leftIcon={<Activity size={14} />}
                          >
                            Live Monitor
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Participation progress */}
                    <div className="pt-2 border-t border-zinc-800/80">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-zinc-400">Examinee Attendance & Submissions</span>
                        <span className="font-semibold text-zinc-200">
                          142 of {exam.allowedStudents} Students Active (71%)
                        </span>
                      </div>
                      <ProgressBar value={142} max={exam.allowedStudents} size="xs" variant="success" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* ── Recent Exams Section ── */}
          <Card padding="p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-amber-400" />
                <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
                  Recent Exams
                </h2>
              </div>

              <Link
                to="/admin/exams"
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 transition-colors"
              >
                <span>View All Exams</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 font-semibold uppercase tracking-wider">
                    <th className="pb-3 pr-4">Exam / Code</th>
                    <th className="pb-3 px-4">Subject</th>
                    <th className="pb-3 px-4">Date</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 pl-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {recentExams.map((exam) => {
                    const isLive = exam.status === 'active'
                    const isUpcoming = exam.status === 'upcoming'
                    const isCompleted = exam.status === 'completed'

                    return (
                      <tr key={exam.id} className="hover:bg-zinc-850/40 transition-colors">
                        <td className="py-3.5 pr-4">
                          <p className="font-semibold text-zinc-200">{exam.title}</p>
                          <span className="font-mono text-[11px] text-zinc-500">{exam.code}</span>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-300 font-medium">
                          {exam.subject}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400">
                          {formatExamDate(exam.startTime)}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge
                            variant={
                              isLive
                                ? 'success'
                                : isUpcoming
                                ? 'warning'
                                : 'default'
                            }
                            dot
                            size="sm"
                          >
                            {isLive ? 'Active' : isUpcoming ? 'Upcoming' : 'Completed'}
                          </Badge>
                        </td>
                        <td className="py-3.5 pl-4 text-right">
                          <Link to={`/admin/exams`}>
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

        {/* Right Column (1 Col): Recent Activity & Fast Links */}
        <div className="space-y-6">
          {/* ── Recent Activity Section ── */}
          <Card padding="p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
              <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
                Recent Activity
              </h2>
              <span className="text-[11px] text-zinc-500 font-medium">Live Feed</span>
            </div>

            <div className="space-y-4">
              {mockAdminActivities.map((act) => {
                let badgeVariant = 'default'
                if (act.type === 'submission') badgeVariant = 'success'
                if (act.type === 'live_session') badgeVariant = 'danger'
                if (act.type === 'schedule') badgeVariant = 'warning'
                if (act.type === 'result') badgeVariant = 'primary'

                return (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-xl bg-zinc-850/50 border border-zinc-800 space-y-1.5 text-xs transition-colors hover:border-zinc-700/60"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-zinc-200 truncate">
                        {act.title}
                      </span>
                      <span className="text-[10px] text-zinc-500 whitespace-nowrap">
                        {act.timestamp}
                      </span>
                    </div>

                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      {act.description}
                    </p>

                    {act.score && (
                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[11px] text-zinc-500">Recorded Score:</span>
                        <span className="font-bold text-emerald-400 font-mono text-[11px]">
                          {act.score}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>

          {/* ── Platform Summary Snapshot ── */}
          <Card padding="p-6">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldCheck size={16} className="text-amber-400" />
              Academic Operations Summary
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-zinc-800">
                <span className="text-zinc-400">Total Question Repository</span>
                <span className="font-semibold text-zinc-200">
                  {overview.questionsInBank} Questions
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-zinc-800">
                <span className="text-zinc-400">Average Subject Score</span>
                <span className="font-bold text-amber-400">
                  {overview.avgScore}%
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-zinc-800">
                <span className="text-zinc-400">Faculty Administrators</span>
                <span className="font-semibold text-zinc-200">
                  4 Active Staff
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-zinc-400">Automated Proctoring</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Online & Active
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
