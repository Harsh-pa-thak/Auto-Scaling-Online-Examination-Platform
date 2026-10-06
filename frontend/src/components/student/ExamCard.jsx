import { Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  HelpCircle,
  ArrowRight,
  Play,
  Timer,
  AlertCircle,
  Lock,
} from 'lucide-react'
import { Badge, Button } from '../common'

// Format date nicely (e.g., Nov 15, 2025)
function formatDate(dateStr) {
  if (!dateStr) return 'TBA'
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

// Format time (e.g., 09:00 AM)
function formatTime(dateStr) {
  if (!dateStr) return 'TBA'
  try {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return dateStr
  }
}

/**
 * Reusable ExamCard component
 *
 * @param {Object}  exam      - Exam data object
 * @param {boolean} isActive  - Highlight as currently active/live exam
 * @param {string}  className - Extra container styling
 */
export default function ExamCard({ exam, isActive = false, className = '' }) {
  if (!exam) return null

  const isLive = isActive || exam.status === 'active'
  const isUpcoming = exam.status === 'upcoming'
  const isCompleted = exam.status === 'completed'
  const isUnavailable = exam.status === 'unavailable' || exam.status === 'draft'

  return (
    <div
      className={[
        'bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden',
        isLive
          ? 'border-emerald-300 ring-2 ring-emerald-500/20 shadow-md hover:shadow-lg'
          : isUnavailable
          ? 'border-slate-200 bg-slate-50/50 opacity-90'
          : 'border-slate-200/90 shadow-card hover:shadow-card-md hover:border-slate-300',
        className,
      ].join(' ')}
    >
      {/* Top Banner if Live */}
      {isLive && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-white animate-ping" />
            <span className="h-2 w-2 rounded-full bg-white absolute" />
            Examination Live Now
          </span>
          <span className="text-[11px] text-emerald-100 font-mono">
            Ends at {formatTime(exam.endTime)}
          </span>
        </div>
      )}

      {/* Card Content Area */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Subject & Status Row */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {exam.subject}
            </span>
            {exam.code && (
              <span className="text-[11px] font-mono text-slate-400 font-medium">
                {exam.code}
              </span>
            )}
          </div>

          <div>
            {isLive ? (
              <Badge variant="success" dot>
                Active
              </Badge>
            ) : isUpcoming ? (
              <Badge variant="primary" dot>
                Upcoming
              </Badge>
            ) : isCompleted ? (
              <Badge variant="default">Completed</Badge>
            ) : isUnavailable ? (
              <Badge variant="danger" dot>Unavailable</Badge>
            ) : (
              <Badge variant="warning">{exam.status}</Badge>
            )}
          </div>
        </div>

        {/* Exam Title */}
        <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug mb-3">
          {exam.title}
        </h3>

        {/* Meta details list */}
        <div className="mt-auto space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Calendar size={13} className="text-slate-400" />
              Date
            </span>
            <span className="font-medium text-slate-800">
              {formatDate(exam.startTime)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Clock size={13} className="text-slate-400" />
              Start Time
            </span>
            <span className="font-medium text-slate-800">
              {formatTime(exam.startTime)} {exam.endTime && `– ${formatTime(exam.endTime)}`}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Timer size={13} className="text-slate-400" />
              Duration
            </span>
            <span className="font-medium text-slate-800">
              {exam.duration} minutes
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <HelpCircle size={13} className="text-slate-400" />
              Questions
            </span>
            <span className="font-medium text-slate-800">
              {exam.totalQuestions} Questions • {exam.totalMarks} Marks
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-4 pt-0">
        {isLive ? (
          <Link to={`/student/exams/${exam.id}`}>
            <Button
              variant="success"
              fullWidth
              size="md"
              rightIcon={<Play size={15} className="fill-current" />}
            >
              Start Exam Now
            </Button>
          </Link>
        ) : isUpcoming ? (
          <Link to={`/student/exams/${exam.id}`}>
            <Button
              variant="secondary"
              fullWidth
              size="sm"
              rightIcon={<ArrowRight size={14} />}
            >
              View Exam Details
            </Button>
          </Link>
        ) : isCompleted ? (
          <Link to="/student/results">
            <Button variant="ghost" fullWidth size="sm">
              View Results
            </Button>
          </Link>
        ) : (
          <Button
            variant="secondary"
            fullWidth
            size="sm"
            disabled
            leftIcon={<Lock size={13} />}
          >
            Exam Unavailable
          </Button>
        )}
      </div>
    </div>
  )
}
