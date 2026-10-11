import { Link, useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  Bell,
  User,
  LogOut,
  Menu,
  ChevronDown,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../common/Avatar'
import Dropdown, { DropdownItem, DropdownDivider } from '../common/Dropdown'

/**
 * StudentNavbar — Top application bar for student portal
 *
 * @param {Function} onToggleMobileMenu - Trigger mobile drawer open
 */
export default function StudentNavbar({ onToggleMobileMenu }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Fallback to mock student if not signed in
  const student = user || { name: '', studentId: '', branch: '', email: '' }

  const unreadCount = 0

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-canvas/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8">
      {/* ── Left: Hamburger (mobile) + Brand ── */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          aria-label="Open navigation menu"
          className="-ml-2 rounded-lg p-2 text-ink-3 transition-colors hover:bg-sunken hover:text-ink lg:hidden"
        >
          <Menu size={20} />
        </button>

        <Link to="/student/dashboard" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-ink">
            <GraduationCap size={18} />
          </span>
          <span className="text-base font-semibold text-ink">ExamPortal</span>
          <span className="hidden text-sm text-ink-3 sm:inline">/ Student</span>
        </Link>
      </div>

      {/* ── Right: Term, Notifications & Profile Menu ── */}
      <div className="flex items-center gap-2 sm:gap-4">
        {student.branch && (
          <span className="hidden text-sm text-ink-3 md:inline">{student.branch}</span>
        )}

        <Link
          to="/student/notifications"
          aria-label="View notifications"
          className="relative rounded-lg p-2 text-ink-3 transition-colors hover:bg-sunken hover:text-ink"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-accent-ink">
              {unreadCount}
            </span>
          )}
        </Link>

        <Dropdown
          align="right"
          width="w-64"
          trigger={
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg p-1 text-left transition-colors hover:bg-sunken"
            >
              <Avatar name={student.name} size="sm" />
              <span className="hidden text-sm font-medium text-ink-2 sm:block">
                {student.name}
              </span>
              <ChevronDown size={14} className="hidden text-ink-3 sm:block" />
            </button>
          }
        >
          <div className="border-b border-line px-3 py-2">
            <p className="text-sm font-semibold text-ink">{student.name}</p>
            {student.studentId && (
              <p className="text-xs tabular-nums text-ink-3">{student.studentId}</p>
            )}
            {student.email && <p className="truncate text-xs text-ink-3">{student.email}</p>}
          </div>

          <div className="py-1">
            <DropdownItem
              icon={<User size={15} />}
              onClick={() => navigate('/student/profile')}
            >
              My Profile & Credentials
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
