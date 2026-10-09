import { Link, useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  Bell,
  User,
  LogOut,
  Menu,
  ShieldCheck,
  ChevronDown,
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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 sm:px-6 lg:px-8">
      {/* ── Left: Hamburger (mobile) + Brand ── */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          aria-label="Open navigation menu"
          className="-ml-2 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <Link to="/student/dashboard" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-zinc-950">
            <GraduationCap size={18} />
          </span>
          <span className="text-base font-semibold text-zinc-100">ExamPortal</span>
          <span className="hidden text-sm text-zinc-500 sm:inline">/ Student</span>
        </Link>
      </div>

      {/* ── Right: Term, Notifications & Profile Menu ── */}
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="hidden text-sm text-zinc-500 md:inline">
          Spring Semester 2025 · {student.branch || 'B.Tech CSE'}
        </span>

        <Link
          to="/student/notifications"
          aria-label="View notifications"
          className="relative rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-500 px-1 text-xs font-semibold text-zinc-950">
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
              className="flex items-center gap-2 rounded-lg p-1 text-left transition-colors hover:bg-zinc-800"
            >
              <Avatar name={student.name} size="sm" />
              <span className="hidden text-sm font-medium text-zinc-200 sm:block">
                {student.name}
              </span>
              <ChevronDown size={14} className="hidden text-zinc-500 sm:block" />
            </button>
          }
        >
          <div className="border-b border-zinc-800 px-3 py-2">
            <p className="text-sm font-semibold text-zinc-100">{student.name}</p>
            <p className="text-xs tabular-nums text-zinc-400">{student.id}</p>
            <p className="text-xs text-zinc-400">{student.email || 'harsh.pathak@vit.ac.in'}</p>
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
