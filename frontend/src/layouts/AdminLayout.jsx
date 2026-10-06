import { useState } from 'react'
import { NavLink, Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  ShieldAlert,
  LayoutDashboard,
  FileText,
  PlusCircle,
  Users,
  Database,
  Activity,
  Award,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  Server,
  Zap,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Avatar from '../components/common/Avatar'
import Dropdown, { DropdownItem, DropdownDivider } from '../components/common/Dropdown'

const sidebarLinks = [
  { to: '/admin/dashboard',     label: 'Dashboard',       icon: LayoutDashboard },
  { to: '/admin/exams',         label: 'Exams',           icon: FileText },
  { to: '/admin/exams/create',  label: 'Create Exam',     icon: PlusCircle },
  { to: '/admin/students',      label: 'Students',        icon: Users },
  { to: '/admin/question-bank', label: 'Question Bank',   icon: Database },
  { to: '/admin/monitoring',    label: 'Live Monitoring', icon: Activity },
  { to: '/admin/results',       label: 'Results & Grades',icon: Award },
  { to: '/admin/analytics',     label: 'Analytics',       icon: BarChart3 },
  { to: '/admin/profile',       label: 'Admin Profile',   icon: User },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Fallback admin info if auth state isn't initialized yet
  const admin = user || {
    name: 'Dr. Ramesh Kumar',
    id: 'ADMIN001',
    designation: 'Associate Professor',
    role: 'admin',
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Derive page title from current route
  const currentLink = sidebarLinks.find((l) => l.to === location.pathname)
  const pageTitle = currentLink ? currentLink.label : 'Admin Portal'

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* ── Mobile Sidebar Backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Left Sidebar ── */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
              <ShieldAlert size={20} />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white">
                ExamPortal
              </span>
              <span className="block text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                Administration
              </span>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </p>
          {sidebarLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon size={17} className="flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer: System Status & Portal Switch */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 space-y-2">
          {/* Cluster Status Widget */}
          <div className="rounded-lg bg-slate-800/80 p-2.5 text-xs border border-slate-700/50">
            <div className="flex items-center justify-between text-slate-300 font-medium mb-1">
              <span className="flex items-center gap-1.5">
                <Server size={13} className="text-emerald-400" />
                Auto-Scaler Cluster
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400">
              3 Nodes Online • 0 SQS Backlog
            </p>
          </div>

          {/* Quick link to Student View */}
          <Link
            to="/student/dashboard"
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Zap size={14} className="text-primary-400" />
              Switch to Student View
            </span>
            <ExternalLink size={12} />
          </Link>
        </div>
      </aside>

      {/* ── Main Content Area with Header ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile menu hamburger */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumb / Section Header */}
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {pageTitle}
              </h1>
            </div>
          </div>

          {/* Right Header: Status Chip & Admin Profile */}
          <div className="flex items-center gap-3">
            {/* Active Server Health Chip */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              System Healthy
            </span>

            {/* Admin Profile Dropdown */}
            <Dropdown
              align="right"
              width="w-60"
              trigger={
                <button
                  type="button"
                  className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 transition-colors text-left"
                >
                  <Avatar name={admin.name} size="sm" status="online" />
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">
                      {admin.name}
                    </p>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {admin.designation || 'Administrator'}
                    </p>
                  </div>
                  <ChevronDown size={14} className="hidden sm:block text-slate-400" />
                </button>
              }
            >
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-semibold text-slate-900">{admin.name}</p>
                <p className="text-[11px] text-slate-500">{admin.id} • {admin.department || 'CSE'}</p>
              </div>

              <DropdownItem
                icon={<User size={14} />}
                onClick={() => navigate('/admin/profile')}
              >
                Admin Profile
              </DropdownItem>

              <DropdownItem
                icon={<Zap size={14} />}
                onClick={() => navigate('/student/dashboard')}
              >
                Switch to Student Portal
              </DropdownItem>

              <DropdownDivider />

              <DropdownItem
                icon={<LogOut size={14} />}
                danger
                onClick={handleLogout}
              >
                Sign Out
              </DropdownItem>
            </Dropdown>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
