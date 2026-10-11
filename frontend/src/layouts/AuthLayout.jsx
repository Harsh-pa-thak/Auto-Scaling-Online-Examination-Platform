import { Outlet, Link } from 'react-router-dom'
import { GraduationCap, Activity, BarChart3, ShieldCheck } from 'lucide-react'

const highlights = [
  { icon: Activity, title: 'Live exam monitoring', copy: 'Track in-progress attempts and auto-submission in real time.' },
  { icon: BarChart3, title: 'Scoring & analytics', copy: 'Objective scoring, pass/fail breakdowns, and performance reports.' },
  { icon: ShieldCheck, title: 'Role-based access', copy: 'Separate, protected portals for students and administrators.' },
]

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-canvas font-sans text-ink">
      {/* ── Brand panel (desktop) ── */}
      <aside className="relative hidden w-[46%] max-w-2xl flex-col justify-between overflow-hidden border-r border-line bg-sunken p-12 lg:flex">
        {/* Subtle warm glow — decoration only */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-accent/5 blur-3xl"
        />

        <Link to="/" className="relative inline-flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-ink">
            <GraduationCap size={20} />
          </span>
          <span className="text-lg font-semibold tracking-tight text-ink">ExamPortal</span>
        </Link>

        <div className="relative max-w-md">
          <h2 className="text-3xl font-semibold tracking-tight text-ink">
            Assessments without the paperwork.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-2">
            A focused workspace for scheduling, proctoring, and grading online examinations.
          </p>

          <ul className="mt-10 space-y-6">
            {highlights.map(({ icon: Icon, title, copy }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-line bg-surface text-accent-strong">
                  <Icon size={16} />
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">{title}</p>
                  <p className="mt-0.5 text-sm text-ink-3">{copy}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-ink-4">
          Auto-Scaling Online Examination Platform
        </p>
      </aside>

      {/* ── Form panel ── */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-8">
        {/* Brand mark for small screens */}
        <Link to="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-ink">
            <GraduationCap size={20} />
          </span>
          <span className="text-lg font-semibold tracking-tight text-ink">ExamPortal</span>
        </Link>

        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
