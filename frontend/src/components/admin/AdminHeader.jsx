import { useLocation, useNavigate, Link } from 'react-router-dom'
import {
  Menu,
  ChevronDown,
  User,
  GraduationCap,
  LogOut,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../common/Avatar'
import Dropdown, { DropdownItem, DropdownDivider } from '../common/Dropdown'

const routeTitles = {
  '/admin/dashboard':     'Administration Dashboard',
  '/admin/students':      'Student Directory & Management',
  '/admin/exams':         'Examination Management',
  '/admin/exams/create':  'Create New Examination',
  '/admin/question-bank': 'Question Bank Repository',
  '/admin/monitoring':    'Live Examination Monitoring',
  '/admin/results':       'Results & Grade Evaluation',
  '/admin/analytics':     'Academic & System Analytics',
  '/admin/profile':       'Administrator Profile',
}

/**
 * AdminHeader — Sticky top bar for admin portal
 *
 * @param {Function} onToggleMobile   - Open mobile drawer
 * @param {boolean}  collapsed        - Desktop collapsed state
 * @param {Function} onToggleCollapse - Toggle desktop collapse
 */
export default function AdminHeader({
  onToggleMobile,
  collapsed,
  onToggleCollapse,
}) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const admin = user || {
    name: 'Dr. Ramesh Kumar',
    id: 'ADMIN001',
    designation: 'Associate Professor',
    department: 'Computer Science & Engineering',
    role: 'admin',
  }

  // Derive current page title
  const pageTitle = routeTitles[location.pathname] || 'Administration Console'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-zinc-900 border-b border-zinc-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
      {/* ── Left: Hamburger (mobile) + Desktop Collapse Toggle + Page Title ── */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onToggleMobile}
          aria-label="Open mobile navigation"
          className="md:hidden p-2 -ml-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Desktop collapse toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden md:flex p-2 -ml-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        >
          {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>

        {/* Dynamic Page Title */}
        <div>
          <h1 className="text-base sm:text-lg font-bold text-zinc-100 leading-tight">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* ── Right: Academic Term Pill & Admin Profile Menu ── */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Academic Session Badge (Desktop) */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/60 border border-zinc-700/60 text-xs text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-zinc-200">Spring Semester 2025</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400">Faculty Admin</span>
        </div>

        {/* Admin Profile Dropdown Menu */}
        <Dropdown
          align="right"
          width="w-64"
          trigger={
            <button
              type="button"
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-zinc-800 transition-colors text-left group"
            >
              <Avatar name={admin.name} size="sm" status="online" />
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-zinc-200 leading-tight group-hover:text-amber-400 transition-colors">
                  {admin.name}
                </p>
                <p className="text-[11px] text-zinc-400 leading-tight">
                  {admin.designation || 'Administrator'}
                </p>
              </div>
              <ChevronDown
                size={14}
                className="hidden sm:block text-zinc-500 group-hover:text-zinc-300 transition-colors"
              />
            </button>
          }
        >
          {/* Identity Header */}
          <div className="px-3.5 py-2.5 border-b border-zinc-800 bg-zinc-800/50 rounded-t-lg">
            <p className="text-xs font-bold text-zinc-100">{admin.name}</p>
            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
              ID: {admin.id}
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
              {admin.department || 'Computer Science & Engineering'}
            </p>
          </div>

          <div className="py-1">
            <DropdownItem
              icon={<User size={15} />}
              onClick={() => navigate('/admin/profile')}
            >
              Admin Profile
            </DropdownItem>

            <DropdownItem
              icon={<GraduationCap size={15} />}
              onClick={() => navigate('/student/dashboard')}
            >
              Switch to Student View
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
