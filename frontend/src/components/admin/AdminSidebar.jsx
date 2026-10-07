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
  ExternalLink,
  LogOut,
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
  const { user, logout } = useAuth()

  const admin = user || {
    name: 'Dr. Ramesh Kumar',
    id: 'ADMIN001',
    designation: 'Associate Professor',
    department: 'CSE',
    role: 'admin',
  }

  return (
    <>
      {/* ── Mobile Drawer Backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar Container ── */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 bg-zinc-900 border-r border-zinc-800 flex flex-col',
          'transition-all duration-200 ease-in-out md:static md:z-auto',
          // Desktop width
          collapsed ? 'md:w-20' : 'md:w-64',
          // Mobile transform & width
          mobileOpen ? 'w-64 translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        {/* ── Brand Header ── */}
        <div className="h-16 px-4 border-b border-zinc-800 flex items-center justify-between">
          <Link
            to="/admin/dashboard"
            onClick={onCloseMobile}
            className="flex items-center gap-3 overflow-hidden group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-zinc-950 font-bold flex-shrink-0 shadow-sm transition-transform duration-150 group-hover:scale-105">
              <ShieldCheck size={20} />
            </div>

            {(!collapsed || mobileOpen) && (
              <div className="min-w-0 transition-opacity duration-150">
                <span className="text-base font-bold text-zinc-100 tracking-tight block truncate">
                  ExamPortal
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 block truncate">
                  Admin Console
                </span>
              </div>
            )}
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close sidebar drawer"
            className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Admin Mini Identity Card (Expanded only) ── */}
        {(!collapsed || mobileOpen) && (
          <div className="p-4 border-b border-zinc-800 bg-zinc-850/40">
            <div className="flex items-center gap-3">
              <Avatar name={admin.name} size="md" status="online" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-zinc-100 truncate">
                  {admin.name}
                </p>
                <p className="text-[11px] text-zinc-400 truncate">
                  {admin.department || 'Computer Science'} • {admin.id}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation Links ── */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {(!collapsed || mobileOpen) && (
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Admin Navigation
            </p>
          )}

          {navigationItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onCloseMobile}
              title={collapsed && !mobileOpen ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-amber-400 font-semibold border-l-2 border-amber-500 rounded-r-xl rounded-l-none shadow-xs'
                    : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                } ${collapsed && !mobileOpen ? 'justify-center px-0' : ''}`
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              {(!collapsed || mobileOpen) && (
                <span className="truncate">{label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── Sidebar Footer: Student View Switch & Collapse Toggle ── */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-850/40 space-y-2">
          {/* Switch to Student Portal */}
          <Link
            to="/student/dashboard"
            onClick={onCloseMobile}
            title={collapsed && !mobileOpen ? 'Student Portal' : undefined}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors ${
              collapsed && !mobileOpen ? 'justify-center px-0' : 'justify-between'
            }`}
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <GraduationCap size={16} className="text-amber-400 flex-shrink-0" />
              {(!collapsed || mobileOpen) && (
                <span className="truncate">Student Portal</span>
              )}
            </span>
            {(!collapsed || mobileOpen) && (
              <ExternalLink size={12} className="text-zinc-500 flex-shrink-0" />
            )}
          </Link>

          {/* Desktop Collapse / Expand Toggle Button */}
          <div className="hidden md:block pt-1">
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="w-full flex items-center justify-center gap-2 py-2 px-2.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              {collapsed ? (
                <ChevronRight size={16} />
              ) : (
                <>
                  <ChevronLeft size={16} />
                  <span>Collapse sidebar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
