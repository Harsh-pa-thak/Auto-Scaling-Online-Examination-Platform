import { Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  HelpCircle,
  ArrowRight,
  Play,
  Timer,
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

  const details = [
    { icon: Calendar,   label: 'Date',      value: formatDate(exam.startTime) },
    { icon: Clock,      label: 'Time',      value: `${formatTime(exam.startTime)}${exam.endTime ? ` – ${formatTime(exam.endTime)}` : ''}` },
    { icon: Timer,      label: 'Duration',  value: `${exam.duration} minutes` },
    { icon: HelpCircle, label: 'Questions', value: `${exam.totalQuestions} questions · ${exam.totalMarks} marks` },
  ]

  return (
    <div
      className={[
        'card flex flex-col p-6',
        isLive ? 'border-amber-500/50' : '',
        isUnavailable ? 'opacity-70' : '',
        className,
      ].join(' ')}
    >
      {/* Subject & Status */}
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm text-zinc-400">
          {exam.subject}
          {exam.code && <span className="tabular-nums text-zinc-500"> · {exam.code}</span>}
        </p>

        {isLive ? (
          <Badge variant="primary" dot>
            Live
          </Badge>
        ) : isUpcoming ? (
          <Badge dot>Upcoming</Badge>
        ) : isCompleted ? (
          <Badge>Completed</Badge>
        ) : isUnavailable ? (
          <Badge>Unavailable</Badge>
        ) : (
          <Badge className="capitalize">{exam.status}</Badge>
        )}
      </div>

      {/* Title */}
      <h3 className="mt-2 text-base font-semibold text-zinc-100">{exam.title}</h3>

      {/* Details */}
      <dl className="mt-4 flex-1 space-y-2 border-t border-zinc-800 pt-4 text-sm">
        {details.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center justify-between gap-4">
            <dt className="flex items-center gap-2 text-zinc-400">
              <Icon size={14} className="text-zinc-500" />
              {label}
            </dt>
            <dd className="text-right tabular-nums text-zinc-200">{value}</dd>
          </div>
        ))}
      </dl>

      {/* Action */}
      <div className="mt-6">
        {isLive ? (
          <Link to={`/student/exams/${exam.id}`}>
            <Button fullWidth rightIcon={<Play size={14} className="fill-current" />}>
              Start exam
            </Button>
          </Link>
        ) : isUpcoming ? (
          <Link to={`/student/exams/${exam.id}`}>
            <Button variant="secondary" fullWidth rightIcon={<ArrowRight size={14} />}>
              View details
            </Button>
          </Link>
        ) : isCompleted ? (
          <Link to="/student/results">
            <Button variant="secondary" fullWidth>
              View results
            </Button>
          </Link>
        ) : (
          <Button variant="secondary" fullWidth disabled leftIcon={<Lock size={14} />}>
            Not available
          </Button>
        )}
      </div>
    </div>
  )
}
