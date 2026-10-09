import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Award,
  History,
  Bell,
  User,
  X,
  GraduationCap,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../common/Avatar'
import { mockNotifications } from '../../data/mockData'

const navigationItems = [
  { to: '/student/dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
  { to: '/student/exams',         label: 'Exams',         icon: FileText },
  { to: '/student/results',       label: 'Results',       icon: Award },
  { to: '/student/history',       label: 'History',       icon: History },
  { to: '/student/notifications', label: 'Notifications', icon: Bell, hasBadge: true },
  { to: '/student/profile',       label: 'Profile',       icon: User },
]

/**
 * StudentSidebar — Left navigation sidebar & mobile drawer for student portal
 *
 * @param {boolean}  mobileOpen    - Whether mobile drawer is open
 * @param {Function} onCloseMobile - Handler to close mobile drawer
 */
export default function StudentSidebar({ mobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth()

  const student = user || {
    name: 'Harsh Pathak',
    id: '24BCE1234',
    branch: 'B.Tech CSE',
    role: 'student',
  }

  const unreadCount = mockNotifications.filter((n) => !n.read).length

  return (
    <>
      {/* ── Mobile Backdrop Overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar Container ── */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-800 bg-zinc-950',
          'transition-transform duration-200 ease-in-out lg:static lg:z-auto lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Mobile Header with Close button */}
        <div className="flex h-16 items-center justify-between border-b border-zinc-800 px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-zinc-950">
              <GraduationCap size={18} />
            </span>
            <span className="text-base font-semibold text-zinc-100">Student Portal</span>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation drawer"
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Student identity */}
        <div className="flex items-center gap-3 border-b border-zinc-800 p-4">
          <Avatar name={student.name} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-zinc-100">{student.name}</p>
            <p className="truncate text-xs text-zinc-400">
              <span className="tabular-nums">{student.id}</span>
              {' · '}
              {student.branch ? student.branch.replace('B.Tech ', '') : 'CSE'}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigationItems.map(({ to, label, icon: Icon, hasBadge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-zinc-800 text-amber-400'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                }`
              }
            >
              <span className="flex items-center gap-3">
                <Icon size={18} className="flex-shrink-0" />
                {label}
              </span>

              {hasBadge && unreadCount > 0 && (
                <span className="rounded-full bg-zinc-800 px-2 text-xs font-semibold tabular-nums text-zinc-300">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sign out (mobile drawer only) */}
        <div className="border-t border-zinc-800 p-4 lg:hidden">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-zinc-900"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
