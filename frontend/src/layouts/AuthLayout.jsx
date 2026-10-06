import { Outlet, Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand header */}
        <Link to="/" className="inline-flex items-center gap-2.5 mb-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-md transition-transform group-hover:scale-105">
            <GraduationCap size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            ExamPortal
          </span>
        </Link>
        <p className="text-xs sm:text-sm text-slate-500">
          Auto-Scaling Online Examination Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl shadow-card border border-slate-200/80">
          <Outlet />
        </div>

        {/* Demo Switcher Quick Links */}
        <div className="mt-6 text-center text-xs text-slate-400">
          <p>
            Quick Preview:{' '}
            <Link
              to="/student/dashboard"
              className="text-primary-600 hover:underline font-medium ml-1"
            >
              Student Portal
            </Link>
            {' • '}
            <Link
              to="/admin/dashboard"
              className="text-primary-600 hover:underline font-medium"
            >
              Admin Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
