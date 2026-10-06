import { Link } from 'react-router-dom'
import {
  BookOpen,
  Calendar,
  Award,
  CheckCircle2,
  ArrowRight,
  Radio,
  Clock,
  Sparkles,
  ChevronRight,
  GraduationCap,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { StatsCard, Badge, EmptyState, Button, Table } from '../../components/common'
import ExamCard from '../../components/student/ExamCard'
import { mockExams, mockResults } from '../../data/mockData'

// Get appropriate greeting based on local time
function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

// Format submission date
function formatResultDate(dateStr) {
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

export default function StudentDashboard() {
  const { user } = useAuth()

  const student = user || {
    name: 'Harsh Pathak',
    id: '24BCE1234',
    branch: 'B.Tech CSE',
    cgpa: 8.7,
  }

  // Extract first name for greeting
  const firstName = student.name ? student.name.split(' ')[0] : 'Harsh'

  // Categorize exams from mockData
  const activeExams = mockExams.filter((exam) => exam.status === 'active')
  const upcomingExams = mockExams.filter((exam) => exam.status === 'upcoming')

  // Filter student's results
  const studentResults = mockResults.filter(
    (res) => res.studentId === student.id || res.studentId === '24BCE1234'
  )

  // Compute statistics
  const examsTakenCount = studentResults.length
  const upcomingExamsCount = upcomingExams.length

  const avgScore =
    studentResults.length > 0
      ? (
          studentResults.reduce((acc, curr) => acc + curr.percentage, 0) /
          studentResults.length
        ).toFixed(1)
      : '0'

  const passedExamsCount = studentResults.filter(
    (res) => res.status === 'passed'
  ).length

  // Table columns definition for recent results
  const resultColumns = [
    {
      key: 'examTitle',
      label: 'Exam',
      render: (val, row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.examTitle}</p>
          <span className="text-xs text-slate-500">{row.subject}</span>
        </div>
      ),
    },
    {
      key: 'submittedAt',
      label: 'Date',
      render: (val) => (
        <span className="text-xs font-medium text-slate-600">
          {formatResultDate(val)}
        </span>
      ),
    },
    {
      key: 'score',
      label: 'Score',
      render: (val, row) => (
        <span className="font-semibold text-slate-800">
          {row.score} <span className="text-xs font-normal text-slate-400">/ {row.totalMarks}</span>
        </span>
      ),
    },
    {
      key: 'percentage',
      label: 'Percentage',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 text-xs">{val}%</span>
          {row.grade && (
            <Badge variant="primary" size="sm">
              Grade {row.grade}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      align: 'right',
      render: (val) => (
        <Badge
          variant={val === 'passed' ? 'success' : 'danger'}
          dot
        >
          {val === 'passed' ? 'Passed' : 'Failed'}
        </Badge>
      ),
    },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {getGreeting()}, {firstName} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Welcome to your examination dashboard. Review your live tests, upcoming schedules, and performance metrics.
          </p>
        </div>

        {/* Student Quick Meta Tag */}
        <div className="flex items-center gap-2 sm:self-center bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
          <GraduationCap size={18} className="text-primary-600" />
          <div className="text-xs">
            <span className="font-semibold text-slate-800 font-mono">{student.id}</span>
            <span className="text-slate-300 mx-1.5">•</span>
            <span className="text-slate-500">CGPA: <strong>{student.cgpa || '8.7'}</strong></span>
          </div>
        </div>
      </div>

      {/* ── STATISTICS CARDS ── */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Student Examination Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatsCard
            title="Exams Taken"
            value={examsTakenCount}
            change="+2 this semester"
            changeType="positive"
            changeLabel=""
            icon={<BookOpen size={20} />}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            description="Total completed assessments"
          />

          <StatsCard
            title="Upcoming Exams"
            value={upcomingExamsCount}
            change={upcomingExamsCount > 0 ? `${upcomingExamsCount} scheduled` : 'None'}
            changeType="neutral"
            changeLabel=""
            icon={<Calendar size={20} />}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
            description="Pending examinations"
          />

          <StatsCard
            title="Average Score"
            value={`${avgScore}%`}
            change="+4.2%"
            changeType="positive"
            changeLabel="vs class avg"
            icon={<Award size={20} />}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            description="Overall performance"
          />

          <StatsCard
            title="Passed Exams"
            value={passedExamsCount}
            change="100% Pass Rate"
            changeType="positive"
            changeLabel=""
            icon={<CheckCircle2 size={20} />}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            description="Cleared course tests"
          />
        </div>
      </section>

      {/* ── ACTIVE EXAMS (LIVE NOW) ── */}
      {activeExams.length > 0 && (
        <section aria-labelledby="active-exams-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <h2 id="active-exams-heading" className="text-lg font-bold text-slate-900 tracking-tight">
                Live Examination Available
              </h2>
            </div>
            <Badge variant="success" dot size="sm">
              In Session
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} isActive={true} />
            ))}
          </div>
        </section>
      )}

      {/* ── UPCOMING EXAMS ── */}
      <section aria-labelledby="upcoming-exams-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-primary-600" />
            <h2 id="upcoming-exams-heading" className="text-lg font-bold text-slate-900 tracking-tight">
              Upcoming Examinations
            </h2>
          </div>
          <Link
            to="/student/exams"
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline inline-flex items-center gap-1 transition-colors"
          >
            <span>View All Exams</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {upcomingExams.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <EmptyState
              icon={<Calendar size={28} className="text-slate-400" />}
              title="No upcoming examinations"
              message="You currently have no scheduled examinations. Check back soon or contact your course faculty."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcomingExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} isActive={false} />
            ))}
          </div>
        )}
      </section>

      {/* ── RECENT RESULTS ── */}
      <section aria-labelledby="recent-results-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-amber-600" />
            <h2 id="recent-results-heading" className="text-lg font-bold text-slate-900 tracking-tight">
              Recent Results & Grades
            </h2>
          </div>
          <Link
            to="/student/results"
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline inline-flex items-center gap-1 transition-colors"
          >
            <span>View All Scorecards</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <Table
          columns={resultColumns}
          data={studentResults}
          emptyTitle="No exam results available"
          emptyMessage="You have not completed any online examinations yet."
        />
      </section>
    </div>
  )
}
