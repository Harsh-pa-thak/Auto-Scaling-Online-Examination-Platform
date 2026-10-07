import { useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts'
import {
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
  Calendar,
  Filter,
  Layers,
  HelpCircle,
  FileCheck,
} from 'lucide-react'
import { Card, Badge, Button } from '../../components/common'
import { mockAnalytics } from '../../data/mockData'

// ── Theme & Palettes ──────────────────────────────────────────
const PALETTE = {
  amber: '#f59e0b',
  amberDark: '#d97706',
  emerald: '#10b981',
  emeraldDark: '#059669',
  red: '#ef4444',
  redDark: '#dc2626',
  indigo: '#6366f1',
  cyan: '#06b6d4',
  zinc400: '#a1a1aa',
  zinc500: '#71717a',
  zinc800: '#27272a',
}

const SCORE_BAND_COLORS = [
  '#ef4444', // 0-39% (Fail)
  '#f97316', // 40-54% (Pass)
  '#f59e0b', // 55-69% (Average)
  '#10b981', // 70-84% (Good)
  '#059669', // 85-100% (Distinction)
]

// ── Mock Analytics Data ────────────────────────────────────────
const ANALYTICS_DATA = {
  // Key Statistics
  statistics: {
    averageScore: 71.4,
    highestScore: 98.0,
    lowestScore: 24.0,
    passRate: 83.2,
    avgCompletionTime: '48.5 min',
  },

  // 1. Average Score Data (Subject-wise & Class Average)
  averageScoreData: [
    { subject: 'Data Structures', avgScore: 68.3, attempts: 920, code: 'CSE2001' },
    { subject: 'DBMS', avgScore: 73.1, attempts: 780, code: 'CSE2002' },
    { subject: 'Operating Systems', avgScore: 66.9, attempts: 860, code: 'CSE2005' },
    { subject: 'Computer Networks', avgScore: 74.8, attempts: 720, code: 'CSE3002' },
    { subject: 'Cloud Computing', avgScore: 71.2, attempts: 640, code: 'CSE4001' },
  ],

  // 2. Pass / Fail Data
  passFailData: [
    { name: 'Passed', value: 83.2, count: 3261, color: PALETTE.emerald },
    { name: 'Failed', value: 16.8, count: 659, color: PALETTE.red },
  ],

  // 3. Score Distribution Data
  scoreDistributionData: [
    { range: '0–39%', count: 186, label: 'Fail (<40%)', share: 4.7, color: SCORE_BAND_COLORS[0] },
    { range: '40–54%', count: 312, label: 'Pass Grade (C)', share: 8.0, color: SCORE_BAND_COLORS[1] },
    { range: '55–69%', count: 698, label: 'Average (B/B+)', share: 17.8, color: SCORE_BAND_COLORS[2] },
    { range: '70–84%', count: 1140, label: 'Good (A)', share: 29.1, color: SCORE_BAND_COLORS[3] },
    { range: '85–100%', count: 1584, label: 'Distinction (S)', share: 40.4, color: SCORE_BAND_COLORS[4] },
  ],

  // 4. Question Performance Data
  questionPerformanceData: [
    { topic: 'Sorting & Search', accuracy: 86.0, difficulty: 'Easy', attempts: 1240, subject: 'Data Structures' },
    { topic: 'SQL & Joins', accuracy: 82.4, difficulty: 'Medium', attempts: 980, subject: 'DBMS' },
    { topic: 'Cloud Virtualization', accuracy: 79.1, difficulty: 'Easy', attempts: 760, subject: 'Cloud' },
    { topic: 'TCP/IP & Subnetting', accuracy: 74.8, difficulty: 'Medium', attempts: 890, subject: 'Networks' },
    { topic: 'Graph Traversal (BFS/DFS)', accuracy: 66.2, difficulty: 'Hard', attempts: 1120, subject: 'Data Structures' },
    { topic: 'Deadlocks & Semaphores', accuracy: 58.5, difficulty: 'Hard', attempts: 1040, subject: 'OS' },
  ],

  // 5. Exam Participation Data
  examParticipationData: [
    { month: 'Jun', students: 340, exams: 2, completionRate: 94.2 },
    { month: 'Jul', students: 520, exams: 3, completionRate: 95.8 },
    { month: 'Aug', students: 710, exams: 4, completionRate: 97.1 },
    { month: 'Sep', students: 980, exams: 6, completionRate: 98.4 },
    { month: 'Oct', students: 840, exams: 5, completionRate: 96.5 },
    { month: 'Nov', students: 530, exams: 4, completionRate: 97.8 },
  ],
}

// ── Custom Dark Tooltip Component ─────────────────────────────
function CustomChartTooltip({ active, payload, label, unit = '', extraLabel = '' }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-zinc-700 bg-zinc-900/95 p-3 shadow-2xl backdrop-blur-md text-xs space-y-1">
        {label && <p className="font-bold text-zinc-100">{label}</p>}
        {payload.map((item, index) => (
          <div key={`tooltip-${index}`} className="flex items-center gap-2 text-zinc-300">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color || item.fill }}
            />
            <span className="text-zinc-400">{item.name || 'Value'}:</span>
            <span className="font-bold text-zinc-100">
              {item.value}
              {unit}
            </span>
          </div>
        ))}
        {extraLabel && <p className="text-[10px] text-zinc-500 pt-1 border-t border-zinc-800">{extraLabel}</p>}
      </div>
    )
  }
  return null
}

export default function AdminAnalyticsPage() {
  const [selectedSemester, setSelectedSemester] = useState('All')
  const { statistics, averageScoreData, passFailData, scoreDistributionData, questionPerformanceData, examParticipationData } = ANALYTICS_DATA

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <BarChart3 className="text-amber-500" size={24} />
            Academic Examination Analytics
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Real-time evaluation analytics, score distribution bands, and question accuracy metrics.
          </p>
        </div>

        {/* Quick Filter Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-zinc-500">Period:</span>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="input-base py-1.5 px-3 text-xs bg-zinc-900 border-zinc-800 text-zinc-200"
          >
            <option value="All">All Semesters (2025–2026)</option>
            <option value="Fall2025">Fall 2025</option>
            <option value="Spring2025">Spring 2025</option>
          </select>
        </div>
      </div>

      {/* ── Statistics Cards (5 Key Metrics) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Metric 1: Average Score */}
        <Card padding="p-4" className="border-l-2 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Average Score</span>
            <Award size={16} className="text-amber-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-400">{statistics.averageScore}%</p>
          <p className="mt-1 text-[11px] text-zinc-400">Institutional aggregate</p>
        </Card>

        {/* Metric 2: Highest Score */}
        <Card padding="p-4" className="border-l-2 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Highest Score</span>
            <TrendingUp size={16} className="text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-400">{statistics.highestScore}%</p>
          <p className="mt-1 text-[11px] text-zinc-400">Top candidate result</p>
        </Card>

        {/* Metric 3: Lowest Score */}
        <Card padding="p-4" className="border-l-2 border-l-red-500">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Lowest Score</span>
            <AlertTriangle size={16} className="text-red-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-red-400">{statistics.lowestScore}%</p>
          <p className="mt-1 text-[11px] text-zinc-400">Minimum recorded score</p>
        </Card>

        {/* Metric 4: Pass Rate */}
        <Card padding="p-4" className="border-l-2 border-l-emerald-400">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Pass Rate</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-400">{statistics.passRate}%</p>
          <p className="mt-1 text-[11px] text-zinc-400">Pass mark ≥ 40%</p>
        </Card>

        {/* Metric 5: Average Completion Time */}
        <Card padding="p-4" className="border-l-2 border-l-indigo-500">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Avg Completion Time</span>
            <Clock size={16} className="text-indigo-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-zinc-100">{statistics.avgCompletionTime}</p>
          <p className="mt-1 text-[11px] text-zinc-400">Across all exams</p>
        </Card>
      </div>

      {/* ── Section 1: Average Score Chart & Pass/Fail Chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart 1: Average Score Chart (2 cols) */}
        <Card padding="p-5" className="lg:col-span-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-wide flex items-center gap-2">
                <BarChart3 size={16} className="text-amber-400" />
                1. Average Score by Subject
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Mean percentage achieved across examinations with benchmark reference line (70%).
              </p>
            </div>
            <Badge variant="warning" size="xs">Mean: {statistics.averageScore}%</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={averageScoreData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="subject"
                  tick={{ fill: PALETTE.zinc500, fontSize: 11 }}
                  axisLine={{ stroke: '#3f3f46' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: PALETTE.zinc500, fontSize: 11 }}
                  axisLine={{ stroke: '#3f3f46' }}
                  tickLine={false}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="rounded-lg border border-zinc-700 bg-zinc-900/95 p-3 text-xs shadow-xl backdrop-blur-md">
                          <p className="font-bold text-zinc-100">{label}</p>
                          <p className="text-[11px] text-zinc-400 font-mono mt-0.5">Code: {data.code}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-amber-400 font-semibold">Average: {data.avgScore}%</p>
                            <p className="text-zinc-400">Total Attempts: {data.attempts.toLocaleString()}</p>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <ReferenceLine
                  y={70}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  label={{ value: 'Target 70%', fill: '#f59e0b', fontSize: 10, position: 'right' }}
                />
                <Bar
                  dataKey="avgScore"
                  name="Average Score"
                  fill={PALETTE.amber}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Pass/Fail Chart (1 col) */}
        <Card padding="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-wide flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                2. Pass / Fail Distribution
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Aggregate proportion of passing candidates.
              </p>
            </div>
            <Badge variant="success" size="xs">{statistics.passRate}% Pass</Badge>
          </div>

          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={passFailData}
                  cx="50%"
                  cy="48%"
                  innerRadius={65}
                  outerRadius={88}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {passFailData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#18181b" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="rounded-lg border border-zinc-700 bg-zinc-900/95 p-2.5 text-xs shadow-xl backdrop-blur-md">
                          <p className="font-bold text-zinc-100">{data.name}</p>
                          <p className="text-zinc-300 font-semibold">{data.value}% of attempts</p>
                          <p className="text-zinc-400 text-[11px] mt-0.5">Count: {data.count.toLocaleString()} students</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Donut Stat */}
            <div className="absolute inset-0 top-[-8px] flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-zinc-100">{statistics.passRate}%</span>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Pass Rate</span>
            </div>
          </div>

          {/* Clean Legend Badges */}
          <div className="flex items-center justify-center gap-6 mt-1 pt-3 border-t border-zinc-800">
            {passFailData.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-zinc-400 font-medium">{d.name}:</span>
                <strong className="text-zinc-200">{d.value}%</strong>
                <span className="text-zinc-500 text-[11px]">({d.count})</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Section 2: Score Distribution & Question Performance ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 3: Score Distribution */}
        <Card padding="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-wide flex items-center gap-2">
                <Layers size={16} className="text-amber-400" />
                3. Score Distribution
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Frequency count of student results across performance brackets.
              </p>
            </div>
            <Badge variant="default" size="xs">Total: 3,920</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistributionData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="range"
                  tick={{ fill: PALETTE.zinc500, fontSize: 11 }}
                  axisLine={{ stroke: '#3f3f46' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: PALETTE.zinc500, fontSize: 11 }}
                  axisLine={{ stroke: '#3f3f46' }}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="rounded-lg border border-zinc-700 bg-zinc-900/95 p-3 text-xs shadow-xl backdrop-blur-md">
                          <p className="font-bold text-zinc-100">Bracket: {label}</p>
                          <p className="text-zinc-300 font-semibold">{data.label}</p>
                          <div className="mt-1.5 pt-1 border-t border-zinc-800 space-y-0.5">
                            <p className="text-amber-400 font-medium">{data.count.toLocaleString()} Students</p>
                            <p className="text-zinc-400 text-[11px]">{data.share}% of total examinees</p>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="count" name="Students" radius={[4, 4, 0, 0]} maxBarSize={44}>
                  {scoreDistributionData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-zinc-800 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Fail (&lt;40%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500" /> Pass (40-54%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Average (55-69%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Good (70-84%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" /> Distinction (85%+)
            </span>
          </div>
        </Card>

        {/* Chart 4: Question Performance */}
        <Card padding="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-wide flex items-center gap-2">
                <HelpCircle size={16} className="text-cyan-400" />
                4. Question Performance by Topic
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Accuracy & success rates across syllabus conceptual topics.
              </p>
            </div>
            <Badge variant="info" size="xs">Topic Accuracy</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={questionPerformanceData}
                margin={{ top: 5, right: 20, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fill: PALETTE.zinc500, fontSize: 11 }}
                  axisLine={{ stroke: '#3f3f46' }}
                  tickLine={false}
                  tickFormatter={(val) => `${val}%`}
                />
                <YAxis
                  type="category"
                  dataKey="topic"
                  tick={{ fill: PALETTE.zinc400, fontSize: 11 }}
                  axisLine={{ stroke: '#3f3f46' }}
                  tickLine={false}
                  width={110}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="rounded-lg border border-zinc-700 bg-zinc-900/95 p-3 text-xs shadow-xl backdrop-blur-md space-y-1">
                          <p className="font-bold text-zinc-100">{data.topic}</p>
                          <p className="text-zinc-400">Subject: {data.subject}</p>
                          <div className="pt-1 border-t border-zinc-800">
                            <p className="text-emerald-400 font-semibold">Accuracy: {data.accuracy}%</p>
                            <p className="text-zinc-400 text-[11px]">Difficulty: {data.difficulty}</p>
                            <p className="text-zinc-500 text-[11px]">Attempted: {data.attempts.toLocaleString()} times</p>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <ReferenceLine
                  x={70}
                  stroke="#71717a"
                  strokeDasharray="3 3"
                  label={{ value: '70%', fill: '#a1a1aa', fontSize: 10, position: 'top' }}
                />
                <Bar
                  dataKey="accuracy"
                  name="Accuracy Rate"
                  fill={PALETTE.indigo}
                  radius={[0, 4, 4, 0]}
                  maxBarSize={20}
                >
                  {questionPerformanceData.map((entry, index) => {
                    const barColor =
                      entry.accuracy >= 80
                        ? PALETTE.emerald
                        : entry.accuracy >= 70
                        ? PALETTE.indigo
                        : entry.accuracy >= 60
                        ? PALETTE.amber
                        : PALETTE.red
                    return <Cell key={`topic-${index}`} fill={barColor} />
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-3 border-t border-zinc-800">
            <span>Color code: High (&ge;80%) in green, Moderate in purple/amber, Critical (&lt;60%) in red.</span>
          </div>
        </Card>
      </div>

      {/* ── Section 3: Exam Participation Chart ── */}
      <Card padding="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-wide flex items-center gap-2">
              <Calendar size={16} className="text-amber-400" />
              5. Exam Participation & Submission Trends
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Monthly examinee attendance volume alongside scheduled exam sessions.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
              Students Participated
            </span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              Exams Held
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={examParticipationData} margin={{ top: 15, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="studentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PALETTE.amber} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={PALETTE.amber} stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="examGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PALETTE.emerald} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={PALETTE.emerald} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: PALETTE.zinc500, fontSize: 11 }}
                axisLine={{ stroke: '#3f3f46' }}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: PALETTE.zinc500, fontSize: 11 }}
                axisLine={{ stroke: '#3f3f46' }}
                tickLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 10]}
                tick={{ fill: PALETTE.zinc500, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="rounded-lg border border-zinc-700 bg-zinc-900/95 p-3 text-xs shadow-xl backdrop-blur-md space-y-1">
                        <p className="font-bold text-zinc-100">{label} 2025 Cycle</p>
                        <div className="mt-1 pt-1 border-t border-zinc-800 space-y-1">
                          <p className="text-amber-400 font-semibold">Examinees: {data.students.toLocaleString()}</p>
                          <p className="text-emerald-400 font-semibold">Exams Conducted: {data.exams}</p>
                          <p className="text-zinc-400 text-[11px]">Completion Rate: {data.completionRate}%</p>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="students"
                name="Students"
                stroke={PALETTE.amber}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#studentGradient)"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="exams"
                name="Exams Held"
                stroke={PALETTE.emerald}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#examGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
