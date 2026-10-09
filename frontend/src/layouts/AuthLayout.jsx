import { Outlet, Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-zinc-950 px-4 py-16 font-sans sm:px-6">
      <div className="mx-auto w-full max-w-md">
        {/* Brand */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-zinc-950">
              <GraduationCap size={20} />
            </span>
            <span className="text-xl font-semibold text-zinc-100">ExamPortal</span>
          </Link>
          <p className="mt-2 text-sm text-zinc-400">
            Auto-Scaling Online Examination Platform
          </p>
        </div>

        {/* Form surface */}
        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8">
          <Outlet />
        </div>

        {/* Demo shortcuts */}
        <p className="mt-6 text-center text-sm text-zinc-500">
          Preview without signing in:{' '}
          <Link to="/student/dashboard" className="font-medium text-amber-400 hover:text-amber-300">
            Student
          </Link>
          {' · '}
          <Link to="/admin/dashboard" className="font-medium text-amber-400 hover:text-amber-300">
            Admin
          </Link>
        </p>
      </div>
    </div>
  )
}
