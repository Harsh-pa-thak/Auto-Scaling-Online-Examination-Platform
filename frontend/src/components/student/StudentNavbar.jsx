import { Link, useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  Bell,
  User,
  LogOut,
  Menu,
  ShieldCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../common/Avatar'
import Dropdown, { DropdownItem, DropdownDivider } from '../common/Dropdown'
import { mockNotifications } from '../../data/mockData'

/**
 * StudentNavbar — Top application bar for student portal
 *
 * @param {Function} onToggleMobileMenu - Trigger mobile drawer open
 */
export default function StudentNavbar({ onToggleMobileMenu }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Fallback to mock student if not signed in
  const student = user || {
    name: 'Harsh Pathak',
    id: '24BCE1234',
    branch: 'B.Tech CSE',
    role: 'student',
  }

  const unreadCount = mockNotifications.filter((n) => !n.read).length

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-zinc-900 border-b border-zinc-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
      {/* ── Left: Hamburger (mobile) + Brand Logo ── */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 -ml-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Brand logo & name */}
        <Link to="/student/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-zinc-950 shadow-sm transition-transform duration-150 group-hover:scale-105">
            <GraduationCap size={20} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-zinc-100 group-hover:text-amber-400 transition-colors">
              ExamPortal
            </span>
            <span className="hidden sm:inline-flex items-center text-[10px] font-semibold uppercase tracking-wider text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-800/40">
              Student
            </span>
          </div>
        </Link>
      </div>

      {/* ── Center: Session status pill (desktop) ── */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/60 border border-zinc-700/60 text-xs text-zinc-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-medium text-zinc-200">Spring Semester 2025</span>
        <span className="text-zinc-600">•</span>
        <span className="text-zinc-400">{student.branch || 'B.Tech CSE'}</span>
      </div>

      {/* ── Right: Notifications & User Profile Menu ── */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications Icon with Badge */}
        <Link
          to="/student/notifications"
          aria-label="View notifications"
          className="relative p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        >
          <Bell size={19} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-zinc-900">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* User Profile Dropdown */}
        <Dropdown
          align="right"
          width="w-64"
          trigger={
            <button
              type="button"
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-zinc-800 transition-colors text-left group"
            >
              <Avatar name={student.name} size="sm" status="online" />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-zinc-200 leading-tight group-hover:text-amber-400 transition-colors">
                  {student.name}
                </p>
                <p className="text-[11px] font-mono text-zinc-400 leading-tight">
                  {student.id}
                </p>
              </div>
              <ChevronDown size={14} className="hidden sm:block text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            </button>
          }
        >
          {/* Header inside dropdown */}
          <div className="px-3.5 py-2.5 border-b border-zinc-800 bg-zinc-800/50 rounded-t-lg">
            <p className="text-xs font-bold text-zinc-100">{student.name}</p>
            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{student.id}</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">{student.email || 'harsh.pathak@vit.ac.in'}</p>
          </div>

          <div className="py-1">
            <DropdownItem
              icon={<User size={15} />}
              onClick={() => navigate('/student/profile')}
            >
              My Profile & Credentials
            </DropdownItem>

            <DropdownItem
              icon={<ShieldCheck size={15} />}
              onClick={() => navigate('/admin/dashboard')}
            >
              Switch to Admin View
            </DropdownItem>
          </div>

          <DropdownDivider />

          <div className="py-1">
            <DropdownItem
              icon={<LogOut size={15} />}
              danger
              onClick={handleLogout}
            >
              Sign Out
            </DropdownItem>
          </div>
        </Dropdown>
      </div>
    </header>
  )
}
