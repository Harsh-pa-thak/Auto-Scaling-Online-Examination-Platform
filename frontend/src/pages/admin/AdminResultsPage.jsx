import { useState, useMemo } from 'react'
import {
  FileText,
  Search,
  Eye,
  X,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Calendar,
  Clock,
  Check,
  RotateCcw,
  BookOpen,
  Filter,
  GraduationCap,
  Award,
  ChevronRight,
  User,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react'
import {
  Card,
  Badge,
  Button,
  Modal,
  SearchBar,
  EmptyState,
  Pagination,
  ProgressBar,
} from '../../components/common'
import { mockStudents, mockExams, mockResults, mockQuestions } from '../../data/mockData'

// ── Enrich results with student + exam metadata ────────────────
const EXAMS_MAP = Object.fromEntries(mockExams.map((e) => [e.id, e]))
const STUDENTS_MAP = Object.fromEntries(mockStudents.map((s) => [s.id, s]))

// Comprehensive mock results dataset with diverse scores, exams, and students
const BASE_RESULTS = [
  ...mockResults,
  {
    id: 'R006',
    studentId: '24BCE1001',
    examId: 'EX005',
    examTitle: 'Cloud Computing — Internal Assessment 1',
    subject: 'Cloud Computing',
    score: 46,
    totalMarks: 50,
    percentage: 92,
    grade: 'S',
    timeTaken: 40,
    totalQuestions: 25,
    attempted: 25,
    correct: 23,
    wrong: 2,
    submittedAt: '2025-09-12T10:40:00',
    status: 'passed',
  },
  {
    id: 'R007',
    studentId: '24BCE1002',
    examId: 'EX004',
    examTitle: 'Computer Networks — End Semester',
    subject: 'Computer Networks',
    score: 72,
    totalMarks: 100,
    percentage: 72,
    grade: 'B+',
    timeTaken: 105,
    totalQuestions: 50,
    attempted: 48,
    correct: 36,
    wrong: 12,
    submittedAt: '2025-09-30T10:45:00',
    status: 'passed',
  },
  {
    id: 'R008',
    studentId: '24BCE1004',
    examId: 'EX004',
    examTitle: 'Computer Networks — End Semester',
    subject: 'Computer Networks',
    score: 55,
    totalMarks: 100,
    percentage: 55,
    grade: 'C',
    timeTaken: 118,
    totalQuestions: 50,
    attempted: 50,
    correct: 28,
    wrong: 22,
    submittedAt: '2025-09-30T10:58:00',
    status: 'passed',
  },
  {
    id: 'R009',
    studentId: '24BCE1006',
    examId: 'EX004',
    examTitle: 'Computer Networks — End Semester',
    subject: 'Computer Networks',
    score: 94,
    totalMarks: 100,
    percentage: 94,
    grade: 'S',
    timeTaken: 95,
    totalQuestions: 50,
    attempted: 50,
    correct: 47,
    wrong: 3,
    submittedAt: '2025-09-30T10:35:00',
    status: 'passed',
  },
  {
    id: 'R010',
    studentId: '24BCE1011',
    examId: 'EX005',
    examTitle: 'Cloud Computing — Internal Assessment 1',
    subject: 'Cloud Computing',
    score: 28,
    totalMarks: 50,
    percentage: 56,
    grade: 'C',
    timeTaken: 43,
    totalQuestions: 25,
    attempted: 24,
    correct: 14,
    wrong: 10,
    submittedAt: '2025-09-12T10:43:00',
    status: 'passed',
  },
  {
    id: 'R011',
    studentId: '24BCE1003',
    examId: 'EX005',
    examTitle: 'Cloud Computing — Internal Assessment 1',
    subject: 'Cloud Computing',
    score: 16,
    totalMarks: 50,
    percentage: 32,
    grade: 'F',
    timeTaken: 44,
    totalQuestions: 25,
    attempted: 23,
    correct: 8,
    wrong: 15,
    submittedAt: '2025-09-12T10:44:00',
    status: 'failed',
  },
  {
    id: 'R012',
    studentId: '24BCE1007',
    examId: 'EX004',
    examTitle: 'Computer Networks — End Semester',
    subject: 'Computer Networks',
    score: 62,
    totalMarks: 100,
    percentage: 62,
    grade: 'B',
    timeTaken: 112,
    totalQuestions: 50,
    attempted: 49,
    correct: 31,
    wrong: 18,
    submittedAt: '2025-09-30T10:52:00',
    status: 'passed',
  },
  {
    id: 'R013',
    studentId: '24BCE1010',
    examId: 'EX002',
    examTitle: 'Database Management Systems — Internal Assessment 2',
    subject: 'DBMS',
    score: 42,
    totalMarks: 50,
    percentage: 84,
    grade: 'A',
    timeTaken: 51,
    totalQuestions: 25,
    attempted: 25,
    correct: 21,
    wrong: 4,
    submittedAt: '2025-10-04T15:02:00',
    status: 'passed',
  },
  {
    id: 'R014',
    studentId: '24BCE1005',
    examId: 'EX002',
    examTitle: 'Database Management Systems — Internal Assessment 2',
    subject: 'DBMS',
    score: 18,
    totalMarks: 50,
    percentage: 36,
    grade: 'F',
    timeTaken: 58,
    totalQuestions: 25,
    attempted: 20,
    correct: 9,
    wrong: 11,
    submittedAt: '2025-10-04T15:10:00',
    status: 'failed',
  },
  {
    id: 'R015',
    studentId: '24BCE1012',
    examId: 'EX001',
    examTitle: 'Data Structures & Algorithms — Mid Semester',
    subject: 'Data Structures',
    score: 88,
    totalMarks: 100,
    percentage: 88,
    grade: 'A+',
    timeTaken: 82,
    totalQuestions: 50,
    attempted: 50,
    correct: 44,
    wrong: 6,
    submittedAt: '2025-10-15T10:22:00',
    status: 'passed',
  },
]

const ALL_RESULTS = BASE_RESULTS.map((r) => {
  const student = STUDENTS_MAP[r.studentId]
  const exam = EXAMS_MAP[r.examId]
  return {
    ...r,
    studentName: student?.name ?? r.studentId,
    studentEmail: student?.email ?? `${r.studentId.toLowerCase()}@vit.ac.in`,
    studentBranch: student?.branch ?? 'CSE',
    studentSemester: student?.semester ?? 4,
    studentSection: student?.section ?? 'A',
    examCode: exam?.code ?? 'CSE2000',
  }
})

// Extract unique exam options for filter
const EXAM_OPTIONS = [
  { id: 'All', title: 'All Exams' },
  ...Array.from(new Set(ALL_RESULTS.map((r) => r.examId))).map((id) => {
    const exam = EXAMS_MAP[id]
    const fallbackTitle = ALL_RESULTS.find((r) => r.examId === id)?.examTitle || id
    return {
      id,
      title: exam?.title || fallbackTitle,
    }
  }),
]

const STATUS_OPTIONS = [
  { value: 'All', label: 'All Status' },
  { value: 'passed', label: 'Passed' },
  { value: 'failed', label: 'Failed' },
]

const PAGE_SIZE = 8

// Helper: Format date & time nicely (e.g., "30 Sep 2025, 10:50 AM")
function formatSubmissionTime(dateStr) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return dateStr
  }
}

// ── Helper to generate questions & student responses for View Answers ──
function getEvaluatedAnswers(result) {
  if (!result) return []

  // Subject matching questions from mock bank
  const subjectQuestions = mockQuestions.filter(
    (q) => q.subject.toLowerCase() === result.subject.toLowerCase()
  )

  const pool = subjectQuestions.length >= 5 ? subjectQuestions : mockQuestions

  // Number of questions to show (up to 8 for rich review)
  const questionCount = Math.min(8, pool.length)
  const totalAttempted = result.attempted ?? result.totalQuestions
  const correctCount = result.correct ?? Math.round((result.percentage / 100) * questionCount)

  // Determine correct indexes deterministically based on result score percentage
  return pool.slice(0, questionCount).map((q, idx) => {
    // Generate realistic student answer pattern
    const isUnattempted = idx >= totalAttempted && totalAttempted < questionCount
    const isCorrect = !isUnattempted && (idx < Math.ceil((correctCount / questionCount) * questionCount))
    
    let chosenOptionIndex = null
    if (!isUnattempted) {
      chosenOptionIndex = isCorrect ? q.correctAnswer : (q.correctAnswer + 1) % 4
    }

    const marksEarned = isCorrect ? q.marks : 0

    return {
      id: q.id,
      number: idx + 1,
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
      chosenOptionIndex,
      isCorrect,
      isUnattempted,
      marks: q.marks,
      marksEarned,
      difficulty: q.difficulty,
      topic: q.topic,
      subject: q.subject,
    }
  })
}

// ── View Result Modal ──────────────────────────────────────────
function ResultDetailModal({ result, onClose, onOpenAnswers }) {
  if (!result) return null

  const isPassed = result.status === 'passed'
  const attempted = result.attempted ?? (result.correct + result.wrong)
  const unattempted = Math.max(0, result.totalQuestions - attempted)
  const accuracy = attempted > 0 ? Math.round((result.correct / attempted) * 100) : 0

  return (
    <Modal
      isOpen={!!result}
      onClose={onClose}
      title="Examination Result Overview"
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              onClose()
              onOpenAnswers(result)
            }}
            leftIcon={<BookOpen size={14} />}
          >
            View Evaluated Answers
          </Button>
          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Top Header Card */}
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
              {result.studentName.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">{result.studentName}</h3>
              <p className="text-xs font-mono text-zinc-400">
                {result.studentId} • {result.studentBranch} • Sem {result.studentSemester}-{result.studentSection}
              </p>
            </div>
          </div>
          <Badge
            variant={isPassed ? 'success' : 'danger'}
            size="md"
            dot
            className="self-start sm:self-auto"
          >
            {isPassed ? 'PASSED' : 'FAILED'}
          </Badge>
        </div>

        {/* Quick Performance Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60">
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Total Score</p>
            <p className="mt-1 text-xl font-bold text-zinc-100">
              {result.score} <span className="text-xs font-normal text-zinc-500">/ {result.totalMarks}</span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60">
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Percentage</p>
            <p className={`mt-1 text-xl font-bold ${isPassed ? 'text-emerald-400' : 'text-red-400'}`}>
              {result.percentage}%
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60">
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Grade Awarded</p>
            <p className="mt-1 text-xl font-bold text-amber-400">
              {result.grade}
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60">
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Accuracy</p>
            <p className="mt-1 text-xl font-bold text-zinc-200">
              {accuracy}%
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40">
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Score Attainment</span>
            <span className="font-semibold text-zinc-200">{result.percentage}% of maximum</span>
          </div>
          <ProgressBar
            value={result.percentage}
            max={100}
            color={isPassed ? 'emerald' : 'red'}
            size="md"
          />
        </div>

        {/* Exam & Audit Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2.5 p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/40">
            <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap size={14} className="text-amber-400" />
              Examination Details
            </h4>
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-500">Title:</span>
              <span className="font-medium text-zinc-200 text-right line-clamp-1">{result.examTitle}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-500">Subject:</span>
              <span className="font-medium text-zinc-200">{result.subject} ({result.examCode})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-500">Total Questions:</span>
              <span className="font-medium text-zinc-200">{result.totalQuestions} questions</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-500">Time Taken:</span>
              <span className="font-medium text-zinc-200">{result.timeTaken} minutes</span>
            </div>
          </div>

          <div className="space-y-2.5 p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/40">
            <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              Questions Evaluation
            </h4>
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-500">Attempted:</span>
              <span className="font-medium text-zinc-200">{attempted} / {result.totalQuestions}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-500">Correct Answers:</span>
              <span className="font-bold text-emerald-400">{result.correct}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-500">Incorrect Answers:</span>
              <span className="font-bold text-red-400">{result.wrong}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-500">Submission Time:</span>
              <span className="font-medium text-zinc-300">{formatSubmissionTime(result.submittedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

// ── View Answers Modal ─────────────────────────────────────────
function AnswersDetailModal({ result, onClose }) {
  if (!result) return null

  const answers = useMemo(() => getEvaluatedAnswers(result), [result])
  const [filterType, setFilterType] = useState('all') // 'all' | 'correct' | 'incorrect' | 'skipped'

  const filteredAnswers = useMemo(() => {
    if (filterType === 'correct') return answers.filter((a) => a.isCorrect)
    if (filterType === 'incorrect') return answers.filter((a) => !a.isCorrect && !a.isUnattempted)
    if (filterType === 'skipped') return answers.filter((a) => a.isUnattempted)
    return answers
  }, [answers, filterType])

  const correctCount = answers.filter((a) => a.isCorrect).length
  const wrongCount = answers.filter((a) => !a.isCorrect && !a.isUnattempted).length
  const skippedCount = answers.filter((a) => a.isUnattempted).length

  return (
    <Modal
      isOpen={!!result}
      onClose={onClose}
      title="Evaluated Answer Key & Student Submissions"
      size="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <p className="text-xs text-zinc-500">
            Showing {filteredAnswers.length} of {answers.length} evaluation questions
          </p>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Candidate & Exam Summary */}
        <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-zinc-500">Candidate: </span>
            <strong className="text-zinc-200">{result.studentName}</strong>
            <span className="text-zinc-500 font-mono ml-1.5">({result.studentId})</span>
          </div>
          <div>
            <span className="text-zinc-500">Exam: </span>
            <span className="text-zinc-200 font-medium">{result.examTitle}</span>
          </div>
          <div>
            <span className="text-zinc-500">Score: </span>
            <strong className="text-amber-400 font-bold">{result.score}/{result.totalMarks}</strong>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-2">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/60'
            }`}
          >
            All Questions ({answers.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('correct')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              filterType === 'correct'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-emerald-400 hover:text-emerald-300 bg-emerald-950/20 border border-emerald-900/30'
            }`}
          >
            <CheckCircle2 size={13} />
            Correct ({correctCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('incorrect')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              filterType === 'incorrect'
                ? 'bg-red-600 text-white font-bold'
                : 'text-red-400 hover:text-red-300 bg-red-950/20 border border-red-900/30'
            }`}
          >
            <XCircle size={13} />
            Incorrect ({wrongCount})
          </button>
          {skippedCount > 0 && (
            <button
              type="button"
              onClick={() => setFilterType('skipped')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                filterType === 'skipped'
                  ? 'bg-zinc-700 text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-300 bg-zinc-900/60'
              }`}
            >
              <HelpCircle size={13} />
              Skipped ({skippedCount})
            </button>
          )}
        </div>

        {/* Answers List */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {filteredAnswers.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              No questions found for this evaluation filter.
            </div>
          ) : (
            filteredAnswers.map((q) => {
              const diffBadge = {
                easy: { variant: 'success', label: 'Easy' },
                medium: { variant: 'warning', label: 'Medium' },
                hard: { variant: 'danger', label: 'Hard' },
              }[q.difficulty?.toLowerCase()] || { variant: 'default', label: q.difficulty }

              return (
                <div
                  key={q.id || q.number}
                  className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-3 text-xs"
                >
                  {/* Question Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-400">Q{q.number}.</span>
                        <Badge variant={diffBadge.variant} size="xs">{diffBadge.label}</Badge>
                        {q.topic && (
                          <span className="text-[11px] text-zinc-500 font-medium">
                            • {q.topic}
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-zinc-100 text-sm leading-relaxed mt-1">
                        {q.text}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start">
                      {q.isUnattempted ? (
                        <Badge variant="default" size="sm">Unanswered</Badge>
                      ) : q.isCorrect ? (
                        <Badge variant="success" size="sm" dot>
                          +{q.marksEarned} Marks (Correct)
                        </Badge>
                      ) : (
                        <Badge variant="danger" size="sm" dot>
                          0 Marks (Wrong)
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 pt-1">
                    {q.options.map((option, optIdx) => {
                      const isCorrectKey = optIdx === q.correctAnswer
                      const isStudentSelected = optIdx === q.chosenOptionIndex

                      let optClass = 'border-zinc-800 bg-zinc-900/40 text-zinc-400'
                      let statusBadge = null

                      if (isCorrectKey && isStudentSelected) {
                        // Student chose correctly
                        optClass = 'border-emerald-700/80 bg-emerald-950/40 text-emerald-200 ring-1 ring-emerald-500/30'
                        statusBadge = (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                            <Check size={11} /> Correct & Selected
                          </span>
                        )
                      } else if (isCorrectKey) {
                        // Correct answer key (student missed or skipped)
                        optClass = 'border-emerald-700/80 bg-emerald-950/30 text-emerald-200'
                        statusBadge = (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                            <Check size={11} /> Correct Answer Key
                          </span>
                        )
                      } else if (isStudentSelected) {
                        // Student selected wrong answer
                        optClass = 'border-red-700/80 bg-red-950/40 text-red-200 ring-1 ring-red-500/30'
                        statusBadge = (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 uppercase tracking-wider bg-red-950 px-2 py-0.5 rounded border border-red-800">
                            <X size={11} /> Student Selected
                          </span>
                        )
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 transition-colors ${optClass}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] bg-zinc-800 text-zinc-300">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="text-xs">{option}</span>
                          </div>
                          {statusBadge}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </Modal>
  )
}

// ── Main Admin Results Page ───────────────────────────────────
export default function AdminResultsPage() {
  const [search, setSearch] = useState('')
  const [examFilter, setExamFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [scoreRange, setScoreRange] = useState({ min: 0, max: 100 })
  const [page, setPage] = useState(1)

  // Modals state
  const [viewResultTarget, setViewResultTarget] = useState(null)
  const [viewAnswersTarget, setViewAnswersTarget] = useState(null)

  // Filter evaluation
  const filtered = useMemo(() => {
    return ALL_RESULTS.filter((r) => {
      // Student search: name or student ID
      if (search.trim()) {
        const query = search.toLowerCase()
        const matchesStudent =
          r.studentName.toLowerCase().includes(query) ||
          r.studentId.toLowerCase().includes(query) ||
          r.studentEmail.toLowerCase().includes(query)
        if (!matchesStudent) return false
      }

      // Exam filter
      if (examFilter !== 'All' && r.examId !== examFilter) {
        return false
      }

      // Pass/Fail filter
      if (statusFilter !== 'All' && r.status !== statusFilter) {
        return false
      }

      // Score range filter (based on percentage)
      const min = Number(scoreRange.min) || 0
      const max = Number(scoreRange.max) || 100
      if (r.percentage < min || r.percentage > max) {
        return false
      }

      return true
    })
  }, [search, examFilter, statusFilter, scoreRange])

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, safePage])

  // Aggregate stats
  const totalRecords = ALL_RESULTS.length
  const passedCount = filtered.filter((r) => r.status === 'passed').length
  const failedCount = filtered.filter((r) => r.status === 'failed').length
  const averagePercentage = filtered.length > 0
    ? Math.round(filtered.reduce((sum, r) => sum + r.percentage, 0) / filtered.length)
    : 0

  // Reset filters helper
  const handleResetFilters = () => {
    setSearch('')
    setExamFilter('All')
    setStatusFilter('All')
    setScoreRange({ min: 0, max: 100 })
    setPage(1)
  }

  const isFiltered =
    search.trim() !== '' ||
    examFilter !== 'All' ||
    statusFilter !== 'All' ||
    scoreRange.min !== 0 ||
    scoreRange.max !== 100

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Award className="text-amber-500" size={24} />
            Student Examination Results
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Monitor scores, evaluate student answer sheets, and analyse passing standards.
          </p>
        </div>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            leftIcon={<RotateCcw size={14} />}
          >
            Reset Filters
          </Button>
        )}
      </div>

      {/* ── Metrics Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card padding="p-4">
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Total Submissions</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-zinc-100">{totalRecords}</span>
            <span className="text-xs text-zinc-400">{filtered.length} showing</span>
          </div>
        </Card>

        <Card padding="p-4">
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Passed Count</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-400">{passedCount}</span>
            <span className="text-xs text-emerald-500/80">
              {filtered.length ? `${Math.round((passedCount / filtered.length) * 100)}%` : '0%'}
            </span>
          </div>
        </Card>

        <Card padding="p-4">
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Failed Count</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-red-400">{failedCount}</span>
            <span className="text-xs text-red-500/80">
              {filtered.length ? `${Math.round((failedCount / filtered.length) * 100)}%` : '0%'}
            </span>
          </div>
        </Card>

        <Card padding="p-4">
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Average Score</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-400">{averagePercentage}%</span>
            <span className="text-xs text-zinc-400">Class aggregate</span>
          </div>
        </Card>
      </div>

      {/* ── Filter Controls ── */}
      <Card padding="p-4">
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Student Search */}
            <div className="md:col-span-5">
              <SearchBar
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                placeholder="Search student by name or ID (e.g., Aarav, 24BCE1001)..."
              />
            </div>

            {/* Exam Filter */}
            <div className="md:col-span-4">
              <select
                value={examFilter}
                onChange={(e) => {
                  setExamFilter(e.target.value)
                  setPage(1)
                }}
                className="input-base py-2 text-sm w-full bg-zinc-900 border-zinc-800 text-zinc-200"
              >
                {EXAM_OPTIONS.map((e) => (
                  <option key={e.id} value={e.id} className="bg-zinc-900 text-zinc-200">
                    {e.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Pass/Fail Filter */}
            <div className="md:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setPage(1)
                }}
                className="input-base py-2 text-sm w-full bg-zinc-900 border-zinc-800 text-zinc-200"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value} className="bg-zinc-900 text-zinc-200">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Score Range Filter Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800/80 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-medium text-zinc-400 flex items-center gap-1.5">
                <Filter size={13} className="text-amber-400" />
                Score Range Filter (%):
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={scoreRange.min}
                  onChange={(e) => {
                    setScoreRange((prev) => ({ ...prev, min: e.target.value }))
                    setPage(1)
                  }}
                  className="input-base py-1 px-2.5 text-xs w-18 text-center bg-zinc-900 border-zinc-800 text-zinc-200"
                />
                <span className="text-zinc-600 font-bold">–</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="100"
                  value={scoreRange.max}
                  onChange={(e) => {
                    setScoreRange((prev) => ({ ...prev, max: e.target.value }))
                    setPage(1)
                  }}
                  className="input-base py-1 px-2.5 text-xs w-18 text-center bg-zinc-900 border-zinc-800 text-zinc-200"
                />
                <span className="text-zinc-500">%</span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="hidden sm:flex items-center gap-1.5 ml-2">
                <button
                  type="button"
                  onClick={() => { setScoreRange({ min: 75, max: 100 }); setPage(1) }}
                  className="px-2 py-0.5 rounded text-[11px] bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300"
                >
                  Distinction (≥75%)
                </button>
                <button
                  type="button"
                  onClick={() => { setScoreRange({ min: 40, max: 74 }); setPage(1) }}
                  className="px-2 py-0.5 rounded text-[11px] bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300"
                >
                  Pass (40-74%)
                </button>
                <button
                  type="button"
                  onClick={() => { setScoreRange({ min: 0, max: 39 }); setPage(1) }}
                  className="px-2 py-0.5 rounded text-[11px] bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-900/40"
                >
                  Fail (&lt;40%)
                </button>
              </div>
            </div>

            {(scoreRange.min !== 0 || scoreRange.max !== 100) && (
              <button
                type="button"
                onClick={() => {
                  setScoreRange({ min: 0, max: 100 })
                  setPage(1)
                }}
                className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
              >
                <X size={12} /> Clear Range
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* ── Results Table ── */}
      <Card padding="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900/80 border-b border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Exam</th>
                <th className="px-5 py-3.5 text-center">Score</th>
                <th className="px-5 py-3.5 text-center">Percentage</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5">Submission Time</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <EmptyState
                      icon={<FileText size={36} />}
                      title="No exam results found"
                      description="No records matched your search queries and filter parameters."
                      action={
                        isFiltered && (
                          <Button size="xs" variant="secondary" onClick={handleResetFilters}>
                            Reset All Filters
                          </Button>
                        )
                      }
                    />
                  </td>
                </tr>
              ) : (
                paged.map((r) => {
                  const isPassed = r.status === 'passed'
                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-zinc-900/50 transition-colors"
                    >
                      {/* Column: Student */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 text-zinc-300 font-bold text-xs flex items-center justify-center shrink-0">
                            {r.studentName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-zinc-200 leading-tight">
                              {r.studentName}
                            </p>
                            <p className="text-xs font-mono text-zinc-400 mt-0.5">
                              {r.studentId}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Column: Exam */}
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-zinc-200 line-clamp-1">
                            {r.examTitle}
                          </p>
                          <span className="inline-block mt-0.5 text-xs text-zinc-400 font-mono">
                            {r.subject}
                          </span>
                        </div>
                      </td>

                      {/* Column: Score */}
                      <td className="px-5 py-4 text-center">
                        <span className="font-bold text-zinc-100 text-sm">
                          {r.score}
                        </span>
                        <span className="text-xs text-zinc-500 font-normal">
                          {' '}/ {r.totalMarks}
                        </span>
                      </td>

                      {/* Column: Percentage */}
                      <td className="px-5 py-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`font-bold text-sm ${
                              isPassed ? 'text-emerald-400' : 'text-red-400'
                            }`}
                          >
                            {r.percentage}%
                          </span>
                          <span className="text-[10px] text-zinc-400 font-medium">
                            Grade: {r.grade}
                          </span>
                        </div>
                      </td>

                      {/* Column: Status */}
                      <td className="px-5 py-4 text-center">
                        <Badge
                          variant={isPassed ? 'success' : 'danger'}
                          size="sm"
                          dot
                        >
                          {isPassed ? 'Passed' : 'Failed'}
                        </Badge>
                      </td>

                      {/* Column: Submission Time */}
                      <td className="px-5 py-4 text-xs text-zinc-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-zinc-500 shrink-0" />
                          <span>{formatSubmissionTime(r.submittedAt)}</span>
                        </div>
                      </td>

                      {/* Actions: View Result, View Answers */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="xs"
                            onClick={() => setViewResultTarget(r)}
                            leftIcon={<Eye size={13} />}
                            title="View student result breakdown"
                          >
                            View Result
                          </Button>
                          <Button
                            variant="secondary"
                            size="xs"
                            onClick={() => setViewAnswersTarget(r)}
                            leftIcon={<BookOpen size={13} />}
                            title="View question-by-question responses"
                          >
                            View Answers
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {filtered.length > PAGE_SIZE && (
          <div className="px-5 py-4 border-t border-zinc-800">
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </div>
        )}
      </Card>

      {/* ── View Result Modal ── */}
      <ResultDetailModal
        result={viewResultTarget}
        onClose={() => setViewResultTarget(null)}
        onOpenAnswers={(res) => setViewAnswersTarget(res)}
      />

      {/* ── View Answers Modal ── */}
      <AnswersDetailModal
        result={viewAnswersTarget}
        onClose={() => setViewAnswersTarget(null)}
      />
    </div>
  )
}
