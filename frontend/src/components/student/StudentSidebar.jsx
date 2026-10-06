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
  Sparkles,
  Calendar,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../common/Avatar'
import Badge from '../common/Badge'
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
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar Container ── */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col',
          'transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Mobile Header with Close button */}
        <div className="lg:hidden h-16 px-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-zinc-950">
              <GraduationCap size={18} />
            </div>
            <span className="text-base font-bold text-zinc-100">Student Portal</span>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation drawer"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Student Mini Profile Card */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-850/50">
          <div className="flex items-center gap-3">
            <Avatar name={student.name} size="md" status="online" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-zinc-100 truncate">
                {student.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-mono text-[11px] text-zinc-400 font-medium">
                  {student.id}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-[11px] text-zinc-400 truncate">
                  {student.branch ? student.branch.replace('B.Tech ', '') : 'CSE'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Student Menu
          </p>
          {navigationItems.map(({ to, label, icon: Icon, hasBadge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-amber-400 font-semibold shadow-xs'
                    : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className="flex-shrink-0" />
                <span>{label}</span>
              </div>

              {/* Unread badge for Notifications */}
              {hasBadge && unreadCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-red-950/80 text-red-400 border border-red-800/60">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Helper / Assessment Card */}
        <div className="p-3.5 border-t border-zinc-800 bg-zinc-850/50 space-y-2.5">
          <div className="rounded-xl bg-zinc-900 p-3 border border-zinc-800 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200 mb-1">
              <Calendar size={13} className="text-amber-400" />
              <span>Next Examination</span>
            </div>
            <p className="text-xs text-zinc-300 font-medium">
              Data Structures (Mid Sem)
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Nov 15, 2025 • 09:00 AM
            </p>
          </div>

          {/* Logout button (visible on mobile drawer) */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-950/40 transition-colors"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
