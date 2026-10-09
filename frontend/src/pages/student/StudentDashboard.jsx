import { Link } from 'react-router-dom'
import {
  BookOpen,
  Calendar,
  Award,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { StatsCard, Badge, EmptyState, Table } from '../../components/common'
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
          <p className="font-medium text-zinc-100">{row.examTitle}</p>
          <p className="text-xs text-zinc-400">{row.subject}</p>
        </div>
      ),
    },
    {
      key: 'submittedAt',
      label: 'Date',
      render: (val) => (
        <span className="text-zinc-300">{formatResultDate(val)}</span>
      ),
    },
    {
      key: 'score',
      label: 'Score',
      render: (val, row) => (
        <span className="tabular-nums text-zinc-100">
          {row.score} <span className="text-zinc-500">/ {row.totalMarks}</span>
        </span>
      ),
    },
    {
      key: 'percentage',
      label: 'Percentage',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <span className="tabular-nums text-zinc-100">{val}%</span>
          {row.grade && <Badge size="sm">Grade {row.grade}</Badge>}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      align: 'right',
      render: (val) => (
        <Badge variant={val === 'passed' ? 'success' : 'danger'} dot>
          {val === 'passed' ? 'Passed' : 'Failed'}
        </Badge>
      ),
    },
  ]

  return (
    <div className="space-y-8">
      {/* ── HEADER ── */}
      <header className="page-header">
        <div>
          <h1 className="page-title">
            {getGreeting()}, {firstName}
          </h1>
          <p className="page-subtitle">
            Your live tests, upcoming schedule, and recent results.
          </p>
        </div>
        <p className="text-sm text-zinc-400">
          <span className="tabular-nums text-zinc-200">{student.id}</span>
          {' · '}CGPA <span className="tabular-nums text-zinc-200">{student.cgpa || '8.7'}</span>
        </p>
      </header>

      {/* ── STATISTICS ── */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Student Examination Statistics
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Exams taken"
            value={examsTakenCount}
            icon={<BookOpen size={18} />}
            description="Completed assessments"
          />
          <StatsCard
            title="Upcoming"
            value={upcomingExamsCount}
            icon={<Calendar size={18} />}
            description="Scheduled examinations"
          />
          <StatsCard
            title="Average score"
            value={`${avgScore}%`}
            icon={<Award size={18} />}
            description="Across completed exams"
          />
          <StatsCard
            title="Passed"
            value={passedExamsCount}
            icon={<CheckCircle2 size={18} />}
            description={`of ${examsTakenCount} exams taken`}
          />
        </div>
      </section>

      {/* ── ACTIVE EXAMS (LIVE NOW) ── */}
      {activeExams.length > 0 && (
        <section aria-labelledby="active-exams-heading">
          <div className="section-header">
            <h2 id="active-exams-heading" className="section-title">
              Live now
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} isActive={true} />
            ))}
          </div>
        </section>
      )}

      {/* ── UPCOMING EXAMS ── */}
      <section aria-labelledby="upcoming-exams-heading">
        <div className="section-header">
          <h2 id="upcoming-exams-heading" className="section-title">
            Upcoming examinations
          </h2>
          <Link to="/student/exams" className="text-link">
            View all exams
            <ChevronRight size={14} />
          </Link>
        </div>

        {upcomingExams.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={<Calendar size={28} />}
              title="No upcoming examinations"
              message="You have no scheduled examinations. Check back soon or contact your course faculty."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} isActive={false} />
            ))}
          </div>
        )}
      </section>

      {/* ── RECENT RESULTS ── */}
      <section aria-labelledby="recent-results-heading">
        <div className="section-header">
          <h2 id="recent-results-heading" className="section-title">
            Recent results
          </h2>
          <Link to="/student/results" className="text-link">
            View all results
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
