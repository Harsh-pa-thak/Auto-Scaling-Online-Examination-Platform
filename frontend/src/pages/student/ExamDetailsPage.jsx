import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Timer,
  HelpCircle,
  Award,
  CheckCircle2,
  AlertTriangle,
  Play,
  Lock,
  ShieldCheck,
  FileText,
  User,
  Info,
  ExternalLink,
} from 'lucide-react'
import {
  Card,
  Badge,
  Button,
  Modal,
  ErrorState,
} from '../../components/common'
import ExamInstructions from '../../components/student/ExamInstructions'
import { mockExams } from '../../data/mockData'
import { useToast } from '../../hooks/useToast'

// Format date nicely
function formatDate(dateStr) {
  if (!dateStr) return 'TBA'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

// Format time
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

export default function ExamDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [agreementChecked, setAgreementChecked] = useState(false)

  // Find exam by ID from mockExams
  const exam = mockExams.find((e) => e.id === id)

  if (!exam) {
    return (
      <div className="py-12">
        <ErrorState
          title="Examination Not Found"
          message={`The examination with ID "${id}" could not be found or has been archived.`}
          retryLabel="Back to Examinations"
          onRetry={() => navigate('/student/exams')}
        />
      </div>
    )
  }

  const isLive = exam.status === 'active'
  const isUpcoming = exam.status === 'upcoming'
  const isCompleted = exam.status === 'completed'
  const isUnavailable = exam.status === 'unavailable' || exam.status === 'draft'

  const handleStartExam = () => {
    setConfirmModalOpen(false)
    toast.success('Exam Started', `Opening proctored examination interface for ${exam.title}`)
    navigate(`/student/exam/${exam.id}`)
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* ── Top Back Navigation ── */}
      <div>
        <Link
          to="/student/exams"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors py-1"
        >
          <ArrowLeft size={14} />
          <span>Back to Examinations</span>
        </Link>
      </div>

      {/* ── Header Banner ── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-200/60">
              {exam.subject}
            </span>
            <span className="font-mono text-xs font-semibold text-slate-400">
              {exam.code}
            </span>
          </div>

          <div>
            {isLive ? (
              <Badge variant="success" dot size="lg">
                Active & In Session
              </Badge>
            ) : isUpcoming ? (
              <Badge variant="primary" dot size="lg">
                Upcoming Examination
              </Badge>
            ) : isCompleted ? (
              <Badge variant="default" size="lg">Completed</Badge>
            ) : (
              <Badge variant="danger" dot size="lg">Unavailable</Badge>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {exam.title}
          </h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-3xl">
            Official semester assessment. Please review all timing parameters, syllabus coverage, and proctored examination rules prior to entering.
          </p>
        </div>
      </div>

      {/* ── Main Layout: Two Columns ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Details & Instructions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Exam Summary Grid Card */}
          <Card padding="p-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText size={16} className="text-primary-600" />
              Examination Overview & Structure
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                  Duration
                </span>
                <p className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <Timer size={18} className="text-primary-600" />
                  {exam.duration}m
                </p>
                <span className="text-[11px] text-slate-500">Timed session</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                  Questions
                </span>
                <p className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <HelpCircle size={18} className="text-blue-600" />
                  {exam.totalQuestions}
                </p>
                <span className="text-[11px] text-slate-500">Multiple choice</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                  Total Marks
                </span>
                <p className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <Award size={18} className="text-amber-600" />
                  {exam.totalMarks}
                </p>
                <span className="text-[11px] text-slate-500">{exam.marksPerQuestion || 2} marks / Q</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                  Passing Marks
                </span>
                <p className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  {exam.passMark}
                </p>
                <span className="text-[11px] text-slate-500">{Math.round((exam.passMark / exam.totalMarks) * 100)}% minimum</span>
              </div>
            </div>

            {/* Negative Marking Alert */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Negative Marking:</span>
              {exam.negativeMarking ? (
                <Badge variant="warning" size="sm">
                  Yes ({exam.negativeMarks || 0.5} marks deducted per wrong answer)
                </Badge>
              ) : (
                <Badge variant="success" size="sm">
                  No Negative Marking
                </Badge>
              )}
            </div>
          </Card>

          {/* Schedule & Timing Card */}
          <Card padding="p-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-primary-600" />
              Schedule & Assessment Window
            </h2>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-2">
                  <Calendar size={15} className="text-slate-400" />
                  Examination Date
                </span>
                <span className="font-semibold text-slate-900">
                  {formatDate(exam.startTime)}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-2">
                  <Clock size={15} className="text-slate-400" />
                  Session Time Window
                </span>
                <span className="font-semibold text-slate-900">
                  {formatTime(exam.startTime)} to {formatTime(exam.endTime)}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-slate-500 flex items-center gap-2">
                  <User size={15} className="text-slate-400" />
                  Eligible Sections
                </span>
                <span className="font-semibold text-slate-900">
                  {Array.isArray(exam.section) ? exam.section.join(', ') : 'All Enrolled Students'}
                </span>
              </div>
            </div>
          </Card>

          {/* Instructions Section */}
          <Card padding="p-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary-600" />
              Candidate Instructions & Guidelines
            </h2>

            <ExamInstructions customInstructions={exam.instructions} />
          </Card>
        </div>

        {/* Right Column (1 Col): Pre-Exam Action Gate */}
        <div className="space-y-6">
          {/* Action Card */}
          <Card padding="p-6" className="sticky top-20 border-primary-200/80 shadow-md">
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 mb-3 border border-primary-100">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Examination Gate
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Verify requirements before launching
              </p>
            </div>

            {/* Checklist */}
            <div className="py-4 space-y-2.5 text-xs text-slate-600 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />
                <span>Student Identity Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />
                <span>Timer Auto-sync Enabled</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />
                <span>Autosave Engine Ready</span>
              </div>
            </div>

            {/* Start Button & Status Warning */}
            <div className="pt-4 space-y-3">
              {isLive ? (
                <>
                  <Button
                    variant="success"
                    fullWidth
                    size="lg"
                    onClick={() => setConfirmModalOpen(true)}
                    rightIcon={<Play size={16} className="fill-current" />}
                  >
                    Start Exam Now
                  </Button>
                  <p className="text-[11px] text-center text-slate-400">
                    Live session in progress. Once started, the timer will begin.
                  </p>
                </>
              ) : isUpcoming ? (
                <>
                  <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    onClick={() => setConfirmModalOpen(true)}
                    rightIcon={<Play size={16} className="fill-current" />}
                  >
                    Start Exam (Test Session)
                  </Button>
                  <p className="text-[11px] text-center text-slate-400">
                    Officially scheduled for {formatDate(exam.startTime)} at {formatTime(exam.startTime)}.
                  </p>
                </>
              ) : isCompleted ? (
                <>
                  <Button
                    variant="secondary"
                    fullWidth
                    size="lg"
                    onClick={() => navigate('/student/results')}
                  >
                    View Examination Results
                  </Button>
                  <p className="text-[11px] text-center text-slate-400">
                    This assessment was completed and submitted.
                  </p>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    fullWidth
                    size="lg"
                    disabled
                    leftIcon={<Lock size={15} />}
                  >
                    Start Exam (Unavailable)
                  </Button>
                  <p className="text-[11px] text-center text-red-500 font-medium">
                    This examination window is currently closed or unavailable.
                  </p>
                </>
              )}
            </div>
          </Card>

          {/* Faculty / Help Card */}
          <Card padding="p-5" className="bg-slate-50/50">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Info size={14} className="text-slate-500" />
              Technical Support
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              If you experience unexpected browser crashes or power loss during the test, log back in immediately from any browser. Your answers are preserved.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-200/60 text-[11px] text-slate-400">
              Department Helpline: helpdesk@vit.ac.in
            </div>
          </Card>
        </div>
      </div>

      {/* ── Pre-Exam Confirmation Modal ── */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Ready to Begin Examination?"
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setConfirmModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              disabled={!agreementChecked}
              onClick={handleStartExam}
              rightIcon={<Play size={14} className="fill-current" />}
            >
              Confirm & Start Exam
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between font-medium text-slate-800">
              <span>Exam:</span>
              <strong className="text-slate-900">{exam.title}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Duration:</span>
              <span>{exam.duration} minutes</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Questions:</span>
              <span>{exam.totalQuestions} questions ({exam.totalMarks} marks)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <p className="font-semibold flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-amber-600" />
              Important Notice:
            </p>
            <p className="leading-relaxed text-[11px]">
              Once you start, the timer cannot be paused. Tab switches and window minimizations are tracked for academic integrity.
            </p>
          </div>

          <label className="flex items-start gap-2.5 pt-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreementChecked}
              onChange={(e) => setAgreementChecked(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-xs text-slate-700 leading-normal">
              I have read the examination instructions and agree to adhere to the university honor code.
            </span>
          </label>
        </div>
      </Modal>
    </div>
  )
}
