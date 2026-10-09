import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  FileText,
  Database,
  HelpCircle,
  Activity,
  Award,
  BarChart3,
  User,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
  GraduationCap,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../common/Avatar'

const navigationItems = [
  { to: '/admin/dashboard',     label: 'Dashboard',       icon: LayoutDashboard },
  { to: '/admin/students',      label: 'Students',        icon: Users },
  { to: '/admin/exams',         label: 'Exams',           icon: FileText },
  { to: '/admin/questions',     label: 'Questions',       icon: HelpCircle },
  { to: '/admin/question-bank', label: 'Question Bank',   icon: Database },
  { to: '/admin/monitoring',    label: 'Live Monitoring', icon: Activity },
  { to: '/admin/results',       label: 'Results',         icon: Award },
  { to: '/admin/analytics',     label: 'Analytics',       icon: BarChart3 },
  { to: '/admin/profile',       label: 'Profile',         icon: User },
]

/**
 * AdminSidebar — Desktop fixed/collapsible navigation & mobile drawer
 *
 * @param {boolean}  collapsed        - Desktop collapsed state
 * @param {Function} onToggleCollapse - Toggle desktop collapse
 * @param {boolean}  mobileOpen       - Mobile drawer open state
 * @param {Function} onCloseMobile    - Close mobile drawer
 */
export default function AdminSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) {
  const { user } = useAuth()

  const admin = user || {
    name: 'Dr. Ramesh Kumar',
    id: 'ADMIN001',
    designation: 'Associate Professor',
    department: 'CSE',
    role: 'admin',
  }

  const expanded = !collapsed || mobileOpen

  return (
    <>
      {/* ── Mobile Drawer Backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar Container ── */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-zinc-800 bg-zinc-950',
          'transition-all duration-200 ease-in-out md:static md:z-auto',
          collapsed ? 'md:w-20' : 'md:w-64',
          mobileOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        {/* ── Brand ── */}
        <div className="flex h-16 items-center justify-between border-b border-zinc-800 px-4">
          <Link
            to="/admin/dashboard"
            onClick={onCloseMobile}
            className={`flex items-center gap-2 overflow-hidden ${expanded ? '' : 'md:mx-auto'}`}
          >
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500 text-zinc-950">
              <ShieldCheck size={18} />
            </span>
            {expanded && (
              <span className="truncate text-base font-semibold text-zinc-100">
                ExamPortal <span className="font-normal text-zinc-500">/ Admin</span>
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close sidebar drawer"
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 md:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Identity (expanded only) ── */}
        {expanded && (
          <div className="flex items-center gap-3 border-b border-zinc-800 p-4">
            <Avatar name={admin.name} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-100">{admin.name}</p>
              <p className="truncate text-xs text-zinc-400">
                {admin.department || 'Computer Science'} · {admin.id}
              </p>
            </div>
          </div>
        )}

        {/* ── Navigation ── */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigationItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onCloseMobile}
              title={!expanded ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-zinc-800 text-amber-400'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                } ${!expanded ? 'justify-center px-0' : ''}`
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              {expanded && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* ── Footer: Student view link & collapse toggle ── */}
        <div className="space-y-1 border-t border-zinc-800 p-4">
          <Link
            to="/student/dashboard"
            onClick={onCloseMobile}
            title={!expanded ? 'Student Portal' : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100 ${
              !expanded ? 'justify-center px-0' : ''
            }`}
          >
            <GraduationCap size={18} className="flex-shrink-0" />
            {expanded && <span className="truncate">Student Portal</span>}
          </Link>

          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`hidden w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100 md:flex ${
              collapsed ? 'justify-center px-0' : ''
            }`}
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <>
                <ChevronLeft size={18} />
                <span>Collapse sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
