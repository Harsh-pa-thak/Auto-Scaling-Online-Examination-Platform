import { useState, useEffect, useMemo } from 'react'
import {
  Activity,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Wifi,
  WifiOff,
  RefreshCw,
  PlayCircle,
  Radio,
  Search,
  ShieldCheck,
  Send,
  Timer,
  UserCheck,
  UserX,
  Sparkles,
} from 'lucide-react'
import { Card, Badge, Button, SearchBar } from '../../components/common'
import { useToast } from '../../hooks/useToast'

// ── Mock Data ──────────────────────────────────────────────────
const ACTIVE_EXAM = {
  id: 'EX003',
  title: 'Operating Systems — Quiz 3',
  subject: 'Operating Systems',
  code: 'CSE3001',
  startTime: '11:00 AM',
  endTime: '11:30 AM',
  durationMinutes: 30,
  initialElapsedMinutes: 18,
}

const INITIAL_SUMMARY = {
  registered: 200,
  started: 186,
  inProgress: 142,
  submitted: 44,
  disconnected: 4,
}

const INITIAL_STUDENTS = [
  { id: '24BCE1001', name: 'Aarav Kumar',    status: 'In Progress',  startedAt: '11:00:12 AM', remainingMinutes: 12, remainingSeconds: 15 },
  { id: '24BCE1002', name: 'Sneha Reddy',    status: 'Submitted',    startedAt: '11:00:18 AM', remainingMinutes: 0,  remainingSeconds: 0  },
  { id: '24BCE1003', name: 'Rohan Mehta',    status: 'In Progress',  startedAt: '11:01:05 AM', remainingMinutes: 11, remainingSeconds: 40 },
  { id: '24BCE1004', name: 'Priya Nair',     status: 'In Progress',  startedAt: '11:00:33 AM', remainingMinutes: 12, remainingSeconds: 0  },
  { id: '24BCE1005', name: 'Vikram Singh',   status: 'Not Started',  startedAt: '—',           remainingMinutes: 30, remainingSeconds: 0  },
  { id: '24BCE1006', name: 'Ananya Sharma',  status: 'Submitted',    startedAt: '11:00:05 AM', remainingMinutes: 0,  remainingSeconds: 0  },
  { id: '24BCE1007', name: 'Karthik Iyer',   status: 'In Progress',  startedAt: '11:01:20 AM', remainingMinutes: 11, remainingSeconds: 10 },
  { id: '24BCE1008', name: 'Divya Menon',    status: 'Disconnected', startedAt: '11:00:44 AM', remainingMinutes: 9,  remainingSeconds: 22 },
  { id: '24BCE1009', name: 'Rahul Joshi',    status: 'In Progress',  startedAt: '11:00:55 AM', remainingMinutes: 11, remainingSeconds: 50 },
  { id: '24BCE1010', name: 'Pooja Gupta',    status: 'Submitted',    startedAt: '11:00:10 AM', remainingMinutes: 0,  remainingSeconds: 0  },
  { id: '24BCE1011', name: 'Arjun Verma',    status: 'Not Started',  startedAt: '—',           remainingMinutes: 30, remainingSeconds: 0  },
  { id: '24BCE1012', name: 'Sanjana Pillai', status: 'In Progress',  startedAt: '11:00:28 AM', remainingMinutes: 12, remainingSeconds: 5 },
  { id: '24BCE1234', name: 'Harsh Pathak',   status: 'In Progress',  startedAt: '11:00:58 AM', remainingMinutes: 11, remainingSeconds: 34 },
  { id: '24BCE1235', name: 'Meera Krishnan', status: 'Submitted',    startedAt: '11:00:02 AM', remainingMinutes: 0,  remainingSeconds: 0  },
  { id: '24BCE1236', name: 'Nikhil Agarwal', status: 'Disconnected', startedAt: '11:00:47 AM', remainingMinutes: 10, remainingSeconds: 12 },
]

// Status visual configurations
const STATUS_CONFIG = {
  'In Progress':  { label: 'In Progress',  variant: 'primary', dotColor: 'bg-amber-400',   icon: Activity },
  'Submitted':    { label: 'Submitted',    variant: 'success', dotColor: 'bg-emerald-400', icon: CheckCircle2 },
  'Not Started':  { label: 'Not Started',  variant: 'default', dotColor: 'bg-zinc-400',    icon: Clock },
  'Disconnected': { label: 'Disconnected', variant: 'danger',  dotColor: 'bg-red-500',      icon: WifiOff },
}

const STATUS_FILTERS = ['All', 'In Progress', 'Submitted', 'Disconnected', 'Not Started']

export default function AdminMonitoringPage() {
  const { toast } = useToast()

  const [students, setStudents] = useState(INITIAL_STUDENTS)
  const [summary] = useState(INITIAL_SUMMARY)
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [elapsedSeconds, setElapsedSeconds] = useState(ACTIVE_EXAM.initialElapsedMinutes * 60 + 24)
  const [lastRefreshedTime, setLastRefreshedTime] = useState('Just now')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Real-time ticking simulation (1s interval)
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Elapsed & remaining minutes calculated from real-time ticking
  const elapsedMinutes = Math.floor(elapsedSeconds / 60)
  const totalSeconds = ACTIVE_EXAM.durationMinutes * 60
  const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds)
  const remainingMinutes = Math.floor(remainingSeconds / 60)
  const remainingSecsFormatted = String(remainingSeconds % 60).padStart(2, '0')

  const timeProgressPct = Math.min(
    100,
    Math.round((elapsedSeconds / totalSeconds) * 100)
  )

  const submittedPct = Math.round((summary.submitted / summary.registered) * 100)
  const takingPct = Math.round((summary.inProgress / summary.registered) * 100)
  const disconnectedPct = Math.round((summary.disconnected / summary.registered) * 100)
  const notStartedPct = Math.max(0, 100 - submittedPct - takingPct - disconnectedPct)

  // Manual refresh trigger
  function handleManualRefresh() {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      const now = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
      setLastRefreshedTime(now)
      toast.info('Dashboard Refreshed', 'Telemetry and student heartbeat states are current.')
    }, 400)
  }

  // Proctor action: reconnect disconnected student
  function handleReconnect(student) {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === student.id
          ? { ...s, status: 'In Progress' }
          : s
      )
    )
    toast.success('Session Restored', `Sent reconnection packet to ${student.name} (${student.id}).`)
  }

  // Filtered student list
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.id.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'All' || s.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [students, search, statusFilter])

  // Count by status
  const countsByStatus = useMemo(() => {
    const map = { All: students.length }
    STATUS_FILTERS.slice(1).forEach((st) => {
      map[st] = students.filter((s) => s.status === st).length
    })
    return map
  }, [students])

  return (
    <div className="space-y-8">
      {/* ── Page Header with Live Indicator ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
              Live Exam Monitoring
            </h1>

            {/* "Live" Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/80">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold tracking-wide text-emerald-400 uppercase">
                Live
              </span>
            </div>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            Real-time candidate telemetry, heartbeat tracking, and proctoring surveillance.
          </p>
        </div>

        {/* Sync telemetry info */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="text-xs text-zinc-500 hidden md:inline">
            Updated: {lastRefreshedTime}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleManualRefresh}
            loading={isRefreshing}
            leftIcon={<RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />}
          >
            Refresh Telemetry
          </Button>
        </div>
      </div>

      {/* ── Active Exam Information Card ── */}
      <Card className="border-amber-600/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Exam Details */}
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Radio size={22} className="" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Active Exam
                </span>
                <span className="text-xs text-zinc-500 tabular-nums">
                  {ACTIVE_EXAM.code} • {ACTIVE_EXAM.id}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-100 tracking-tight mt-0.5">
                {ACTIVE_EXAM.title}
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Subject: <strong className="text-zinc-300 font-medium">{ACTIVE_EXAM.subject}</strong> &nbsp;•&nbsp;
                Session: <span className="tabular-nums text-zinc-300">{ACTIVE_EXAM.startTime} – {ACTIVE_EXAM.endTime}</span> ({ACTIVE_EXAM.durationMinutes} min allotted)
              </p>
            </div>
          </div>

          {/* Time Countdown Timer */}
          <div className="flex items-center gap-3 self-start lg:self-auto bg-zinc-950/70 border border-zinc-800 rounded-xl px-4 py-2.5">
            <Clock size={18} className="text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-xs uppercase font-semibold text-zinc-500 tracking-wider">
                Time Remaining
              </p>
              <p className="text-base sm:text-lg tabular-nums font-bold text-zinc-100">
                {remainingMinutes}:{remainingSecsFormatted}
              </p>
            </div>
          </div>
        </div>

        {/* Visual Exam Elapsed Progress Indicator */}
        <div className="mt-4 pt-3.5 border-t border-zinc-800/80">
          <div className="flex justify-between items-center text-xs text-zinc-400 mb-1.5 font-medium">
            <span>Elapsed: {elapsedMinutes} min</span>
            <span className="text-amber-400">{timeProgressPct}% Session Completed</span>
            <span>Allotted: {ACTIVE_EXAM.durationMinutes} min</span>
          </div>
          <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-500"
              style={{ width: `${timeProgressPct}%` }}
            />
          </div>
        </div>
      </Card>

      {/* ── Live Status Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Registered Students */}
        <Card className="bg-zinc-900 border-zinc-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase font-semibold tracking-wider text-zinc-400">
                Registered Students
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-zinc-100 mt-1">
                {summary.registered}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                Total eligible candidates
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-800/80 text-zinc-300">
              <Users size={18} />
            </div>
          </div>
        </Card>

        {/* Card 2: Students Started */}
        <Card className="bg-zinc-900 border-zinc-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase font-semibold tracking-wider text-zinc-400">
                Students Started
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-zinc-100 mt-1">
                {summary.started}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                {Math.round((summary.started / summary.registered) * 100)}% attendance rate
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-800 text-zinc-300">
              <PlayCircle size={18} />
            </div>
          </div>
        </Card>

        {/* Card 3: Currently Taking */}
        <Card className="bg-zinc-900 border-amber-600/40">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase font-semibold tracking-wider text-amber-400">
                Currently Taking
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-amber-400 mt-1">
                {summary.inProgress}
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">
                Actively answering paper
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Activity size={18} className="" />
            </div>
          </div>
        </Card>

        {/* Card 4: Submitted */}
        <Card className="bg-zinc-900 border-zinc-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase font-semibold tracking-wider text-zinc-400">
                Submitted
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">
                {summary.submitted}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                {submittedPct}% turn-in completed
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
              <CheckCircle2 size={18} />
            </div>
          </div>
        </Card>
      </div>

      {/* ── Visual Cohort Progress Indicator ── */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Cohort Session Progress Distribution
            </p>
            <p className="text-xs text-zinc-500">
              Breakdown of {summary.registered} examinees across submission lifecycle stages
            </p>
          </div>
          <span className="text-xs tabular-nums font-semibold text-zinc-300">
            {summary.submitted} of {summary.registered} Finished ({submittedPct}%)
          </span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="h-3.5 rounded-full bg-zinc-800/80 overflow-hidden flex p-0.5 gap-0.5">
          {/* Submitted */}
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${submittedPct}%` }}
            title={`Submitted: ${summary.submitted} (${submittedPct}%)`}
          />
          {/* Currently Taking */}
          <div
            className="h-full rounded-full bg-amber-500 transition-all duration-500"
            style={{ width: `${takingPct}%` }}
            title={`Currently Taking: ${summary.inProgress} (${takingPct}%)`}
          />
          {/* Disconnected */}
          <div
            className="h-full rounded-full bg-red-500 transition-all duration-500"
            style={{ width: `${disconnectedPct}%` }}
            title={`Disconnected: ${summary.disconnected} (${disconnectedPct}%)`}
          />
          {/* Not Started */}
          <div
            className="h-full rounded-full bg-zinc-700 transition-all duration-500"
            style={{ width: `${notStartedPct}%` }}
            title={`Not Started: ${summary.registered - summary.started} (${notStartedPct}%)`}
          />
        </div>

        {/* Progress Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>Submitted ({summary.submitted})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span>Currently Taking ({summary.inProgress})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span>Disconnected ({summary.disconnected})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span>Not Started ({summary.registered - summary.started})</span>
          </div>
        </div>
      </Card>

      {/* ── Student Session Table ── */}
      <Card padding="p-0">
        {/* Table Top Controls & Filter Tabs */}
        <div className="px-6 py-4 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {STATUS_FILTERS.map((st) => {
              const isActive = statusFilter === st
              const count = countsByStatus[st] ?? 0
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={[
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap',
                    isActive
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-semibold'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700',
                  ].join(' ')}
                >
                  <span>{st}</span>
                  <span
                    className={[
                      'px-1.5 py-0.2 rounded-full text-xs tabular-nums',
                      isActive ? 'bg-amber-500/30 text-amber-200' : 'bg-zinc-800 text-zinc-400',
                    ].join(' ')}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Search Input */}
          <div className="w-full md:w-72">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate by name or ID..."
            />
          </div>
        </div>

        {/* Table Header */}
        <div className="hidden lg:grid grid-cols-12 px-6 py-4 border-b border-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-400 bg-zinc-900/50">
          <div className="col-span-3">Student ID</div>
          <div className="col-span-3">Name</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Started At</div>
          <div className="col-span-2 text-right">Time Remaining</div>
        </div>

        {/* Table Content */}
        {filteredStudents.length === 0 ? (
          <div className="p-10 text-center text-sm text-zinc-400">
            No candidates found matching the selected filter criteria.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {filteredStudents.map((s) => {
              const cfg = STATUS_CONFIG[s.status] ?? STATUS_CONFIG['Not Started']
              const isDisconnected = s.status === 'Disconnected'
              const StatusIcon = cfg.icon

              return (
                <div
                  key={s.id}
                  className={[
                    'px-6 py-4 lg:grid lg:grid-cols-12 lg:items-center gap-3 transition-colors',
                    isDisconnected
                      ? 'bg-red-950/20 hover:bg-red-950/30 border-l-2 border-red-500'
                      : 'hover:bg-zinc-900/40',
                  ].join(' ')}
                >
                  {/* 1. Student ID */}
                  <div className="lg:col-span-3 tabular-nums text-xs font-semibold text-zinc-300 flex items-center gap-2">
                    <span className="p-1 rounded bg-zinc-800 text-zinc-400">
                      ID
                    </span>
                    <span>{s.id}</span>
                  </div>

                  {/* 2. Name */}
                  <div className="lg:col-span-3 mt-1 lg:mt-0 font-medium text-sm text-zinc-100 flex items-center gap-2">
                    <span>{s.name}</span>
                    {isDisconnected && (
                      <span className="text-xs font-semibold text-red-400 bg-red-950/80 px-1.5 py-0.5 rounded border border-red-800/60">
                        Signal Lost
                      </span>
                    )}
                  </div>

                  {/* 3. Status Badge */}
                  <div className="lg:col-span-2 mt-2 lg:mt-0">
                    <span
                      className={[
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
                        s.status === 'In Progress'
                          ? 'bg-amber-950/40 border-amber-800/50 text-amber-300'
                          : s.status === 'Submitted'
                          ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
                          : s.status === 'Disconnected'
                          ? 'bg-red-950/50 border-red-800/60 text-red-300'
                          : 'bg-zinc-800/60 border-zinc-700/50 text-zinc-400',
                      ].join(' ')}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotColor} ${s.status === 'In Progress' ? '' : ''}`} />
                      <span>{s.status}</span>
                    </span>
                  </div>

                  {/* 4. Started At */}
                  <div className="lg:col-span-2 mt-1 lg:mt-0 text-xs tabular-nums text-zinc-400">
                    <span className="lg:hidden text-zinc-500 font-sans mr-1">Started:</span>
                    {s.startedAt}
                  </div>

                  {/* 5. Time Remaining / Action */}
                  <div className="lg:col-span-2 mt-2 lg:mt-0 lg:text-right flex items-center lg:justify-end gap-2 text-xs tabular-nums font-bold">
                    <span className="lg:hidden text-zinc-500 font-sans mr-1 font-normal">Remaining:</span>
                    {s.status === 'Submitted' ? (
                      <span className="text-emerald-400 inline-flex items-center gap-1">
                        <CheckCircle2 size={13} /> Completed
                      </span>
                    ) : s.status === 'Not Started' ? (
                      <span className="text-zinc-500 font-normal">Pending Launch</span>
                    ) : isDisconnected ? (
                      <div className="flex items-center gap-2">
                        <span className="text-red-400">{s.remainingMinutes}m {s.remainingSeconds}s</span>
                        <Button
                          variant="danger"
                          size="xs"
                          onClick={() => handleReconnect(s)}
                          leftIcon={<Wifi size={11} />}
                        >
                          Reconnect
                        </Button>
                      </div>
                    ) : (
                      <span className="text-amber-400 inline-flex items-center gap-1">
                        <Clock size={12} /> {s.remainingMinutes}m {s.remainingSeconds}s
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer info */}
        <div className="px-6 py-4 border-t border-zinc-800 text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Displaying {filteredStudents.length} of {students.length} candidate sessions.
          </span>
          <span className="flex items-center gap-1.5 text-zinc-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Mock Telemetry Feed Active (No WebSockets)
          </span>
        </div>
      </Card>
    </div>
  )
}

