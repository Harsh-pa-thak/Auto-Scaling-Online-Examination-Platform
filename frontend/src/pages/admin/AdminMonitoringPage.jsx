import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Users,
  FileText,
  Activity,
  ClipboardList,
  Clock,
  Radio,
  Search,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react'
import {
  Card,
  Badge,
  Button,
  SearchBar,
  EmptyState,
  ErrorState,
  Skeleton,
} from '../../components/common'
import { api } from '../../lib/api'

// Format a millisecond delta as M:SS (never negative)
function formatRemaining(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return '0:00'
  const total = Math.floor(ms / 1000)
  const minutes = Math.floor(total / 60)
  const seconds = String(total % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}

function timeTone(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return 'danger'
  if (ms <= 60_000) return 'danger'    // under 1 min
  if (ms <= 300_000) return 'warning'  // under 5 min
  return 'accent'
}

export default function AdminMonitoringPage() {
  // ── Real data ────────────────────────────────────────────────
  // /admin/monitoring → in-progress attempts (exam + student included)
  // /admin/analytics  → platform-wide counts for context
  const [attempts, setAttempts] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  // Ticking clock so time-remaining stays accurate between fetches
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true)
    setLoadError(null)
    try {
      const [monitoring, stats] = await Promise.all([
        api('/admin/monitoring'),
        api('/admin/analytics'),
      ])
      setAttempts(Array.isArray(monitoring) ? monitoring : [])
      setAnalytics(stats)
      setLastUpdated(new Date())
    } catch (error) {
      setLoadError(error.message)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Auto-refresh every 30s so the board stays live without a socket
  useEffect(() => {
    const timer = setInterval(() => load({ silent: true }), 30_000)
    return () => clearInterval(timer)
  }, [load])

  function handleManualRefresh() {
    setIsRefreshing(true)
    load({ silent: true })
  }

  // ── Derived from real data ───────────────────────────────────
  const [search, setSearch] = useState('')
  const [examFilter, setExamFilter] = useState('all')

  // One card per exam that has candidates in session right now
  const liveExams = useMemo(() => {
    const byExam = new Map()
    for (const attempt of attempts) {
      const exam = attempt.exam
      if (!exam) continue
      if (!byExam.has(exam.id)) byExam.set(exam.id, { exam, count: 0 })
      byExam.get(exam.id).count += 1
    }
    return [...byExam.values()].sort((a, b) => b.count - a.count)
  }, [attempts])

  const filteredAttempts = useMemo(() => {
    const query = search.trim().toLowerCase()
    return attempts.filter((attempt) => {
      const matchExam = examFilter === 'all' || attempt.exam?.id === examFilter
      const haystack = [
        attempt.student?.name,
        attempt.student?.email,
        attempt.exam?.title,
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(query))
      return matchExam && haystack
    })
  }, [attempts, search, examFilter])

  const inSession = attempts.length
  const submittedAttempts = analytics?.attempts ?? null
  const totalAttempts = submittedAttempts != null ? submittedAttempts + inSession : null

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 border-b border-line pb-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="page-title">Live monitoring</h1>
            <span className="inline-flex items-center gap-2 rounded-full border border-success/40 bg-success-soft px-3 py-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
              </span>
              <span className="text-2xs font-bold uppercase tracking-wider text-success">Live</span>
            </span>
          </div>
          <p className="mt-1 text-sm text-ink-3">
            Candidates currently inside an examination session, refreshed every 30 seconds.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {lastUpdated && (
            <span className="text-xs tabular-nums text-ink-3 hidden md:inline">
              Updated {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </span>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleManualRefresh}
            loading={isRefreshing}
            leftIcon={<RefreshCw size={13} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="card p-6">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-3 h-8 w-16" />
            </div>
          ))}
        </div>
      )}

      {/* ── Error ── */}
      {!loading && loadError && (
        <ErrorState
          title="Could not load live monitoring"
          message={loadError}
          onRetry={() => load()}
        />
      )}

      {/* ── Loaded ── */}
      {!loading && !loadError && (
        <>
          {/* Summary stats — every number comes from the API */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="eyebrow pr-6">In session now</p>
                  <p className="mt-1 text-3xl font-semibold tabular-nums text-accent-strong">{inSession}</p>
                  <p className="mt-0.5 text-xs text-ink-3">Active attempt{inSession === 1 ? '' : 's'}</p>
                </div>
                <span className="flex-shrink-0 rounded-xl bg-accent-soft p-2.5 text-accent-strong">
                  <Activity size={18} />
                </span>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="eyebrow pr-6">Live exams</p>
                  <p className="mt-1 text-3xl font-semibold tabular-nums text-ink">{liveExams.length}</p>
                  <p className="mt-0.5 text-xs text-ink-3">Running right now</p>
                </div>
                <span className="flex-shrink-0 rounded-xl bg-sunken p-2.5 text-ink-2">
                  <Radio size={18} />
                </span>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="eyebrow pr-6">Submitted</p>
                  <p className="mt-1 text-3xl font-semibold tabular-nums text-success">
                    {submittedAttempts ?? '—'}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-3">All-time evaluations</p>
                </div>
                <span className="flex-shrink-0 rounded-xl bg-success-soft p-2.5 text-success">
                  <ClipboardList size={18} />
                </span>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="eyebrow pr-6">Students</p>
                  <p className="mt-1 text-3xl font-semibold tabular-nums text-ink">
                    {analytics?.students ?? '—'}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-3">Eligible candidates</p>
                </div>
                <span className="flex-shrink-0 rounded-xl bg-sunken p-2.5 text-ink-2">
                  <Users size={18} />
                </span>
              </div>
            </Card>
          </div>

          {/* Live exams — grouped from real in-progress attempts */}
          {liveExams.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {liveExams.map(({ exam, count }) => {
                // Session closes at the exam end time
                const msLeft = new Date(exam.endTime).getTime() - now
                return (
                  <Card key={exam.id} className="border-accent/30">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent-soft text-accent-strong">
                          <Radio size={20} />
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-2xs font-bold uppercase tracking-wider text-accent-strong">
                              In session
                            </span>
                            <span className="truncate text-xs tabular-nums text-ink-3">
                              {exam.code}
                            </span>
                          </div>
                          <h2 className="mt-0.5 truncate text-base font-semibold tracking-tight text-ink">
                            {exam.title}
                          </h2>
                          <p className="mt-1 text-xs text-ink-3">
                            {exam.subject} · started{' '}
                            {new Date(exam.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}{' '}
                            · {exam.duration} min allotted
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-start sm:self-auto">
                        <Badge variant="primary" dot>
                          {count} in session
                        </Badge>
                        <div className="rounded-xl border border-line bg-canvas px-4 py-2.5">
                          <p className="text-2xs font-semibold uppercase tracking-wider text-ink-3">
                            Window closes
                          </p>
                          <p className="text-sm font-semibold tabular-nums text-ink">
                            {msLeft > 0 ? formatRemaining(msLeft) : 'closed'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <EmptyState
                icon={<Radio size={28} />}
                title="No candidates in session"
                message="Live sessions appear here as soon as a student starts a published examination."
              />
            </Card>
          )}

          {/* Candidate sessions table */}
          <Card padding="p-0">
            <div className="flex flex-col gap-3 border-b border-line px-6 py-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="section-title">Candidate sessions</h2>
                <p className="mt-0.5 text-xs text-ink-3">
                  Every row is an attempt the server reports as in progress.
                </p>
              </div>
              <div className="w-full md:w-72">
                <SearchBar
                  value={search}
                  onChange={setSearch}
                  placeholder="Search candidate or exam…"
                />
              </div>
            </div>

            {/* Exam filter chips (built from real data) */}
            {liveExams.length > 1 && (
              <div className="flex flex-wrap gap-2 border-b border-line px-6 py-3">
                <button
                  type="button"
                  onClick={() => setExamFilter('all')}
                  className={[
                    'chip',
                    examFilter === 'all' ? 'border-accent/50 bg-accent-soft text-accent-strong' : '',
                  ].join(' ')}
                >
                  All exams
                  <span className="tabular-nums">{attempts.length}</span>
                </button>
                {liveExams.map(({ exam, count }) => (
                  <button
                    key={exam.id}
                    type="button"
                    onClick={() => setExamFilter(exam.id)}
                    className={[
                      'chip',
                      examFilter === exam.id ? 'border-accent/50 bg-accent-soft text-accent-strong' : '',
                    ].join(' ')}
                  >
                    {exam.title}
                    <span className="tabular-nums">{count}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Header */}
            <div className="hidden grid-cols-12 gap-3 border-b border-line bg-surface/50 px-6 py-3 text-2xs font-semibold uppercase tracking-wider text-ink-3 lg:grid">
              <div className="col-span-3">Student</div>
              <div className="col-span-3">Exam</div>
              <div className="col-span-2">Started at</div>
              <div className="col-span-2">Attempt</div>
              <div className="col-span-2 text-right">Time left</div>
            </div>

            {/* Rows */}
            {filteredAttempts.length === 0 ? (
              <div className="px-6 py-12">
                <EmptyState
                  title={attempts.length ? 'No matching sessions' : 'No live sessions'}
                  message={
                    attempts.length
                      ? 'No candidate sessions match your search or filter.'
                      : 'Candidates appear here while an attempt is in progress.'
                  }
                />
              </div>
            ) : (
              <div className="divide-y divide-line">
                {filteredAttempts.map((attempt) => {
                  const msLeft = new Date(attempt.expiresAt).getTime() - now
                  const tone = timeTone(msLeft)
                  return (
                    <div
                      key={attempt.id}
                      className="grid grid-cols-1 gap-1 px-6 py-4 transition-colors hover:bg-sunken/40 lg:grid-cols-12 lg:items-center lg:gap-3"
                    >
                      {/* Student */}
                      <div className="lg:col-span-3">
                        <p className="truncate text-sm font-medium text-ink">
                          {attempt.student?.name || 'Unknown student'}
                        </p>
                        <p className="truncate text-xs text-ink-3">{attempt.student?.email}</p>
                      </div>

                      {/* Exam */}
                      <div className="lg:col-span-3">
                        <p className="truncate text-sm text-ink-2">{attempt.exam?.title}</p>
                        <p className="truncate text-xs text-ink-3">{attempt.exam?.subject}</p>
                      </div>

                      {/* Started */}
                      <div className="text-xs tabular-nums text-ink-3 lg:col-span-2">
                        <span className="mr-1 font-normal lg:hidden">Started:</span>
                        {new Date(attempt.startedAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true,
                        })}
                      </div>

                      {/* Attempt id (small reference) */}
                      <div className="hidden truncate text-xs tabular-nums text-ink-4 lg:col-span-2 lg:block">
                        {attempt.id.slice(0, 8)}…
                      </div>

                      {/* Time left */}
                      <div className="mt-1 lg:col-span-2 lg:mt-0 lg:text-right">
                        <span
                          className={[
                            'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold tabular-nums',
                            tone === 'danger'
                              ? 'border-danger/30 bg-danger-soft text-danger'
                              : tone === 'warning'
                              ? 'border-warning/30 bg-warning-soft text-warning'
                              : 'border-line bg-surface text-accent-strong',
                          ].join(' ')}
                        >
                          <Clock size={12} />
                          {formatRemaining(msLeft)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Footer */}
            <div className="flex flex-col items-center justify-between gap-2 border-t border-line px-6 py-4 text-xs text-ink-3 sm:flex-row">
              <span>
                Displaying {filteredAttempts.length} of {attempts.length} live session
                {attempts.length === 1 ? '' : 's'}.
              </span>
              {totalAttempts != null && (
                <span className="tabular-nums">
                  {inSession} live · {submittedAttempts} submitted · {totalAttempts} attempts total
                </span>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
