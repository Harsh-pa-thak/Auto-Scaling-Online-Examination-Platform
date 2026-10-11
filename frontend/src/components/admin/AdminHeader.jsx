import { useLocation, useNavigate } from 'react-router-dom'
import {
  Menu,
  ChevronDown,
  User,
  LogOut,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../common/Avatar'
import Dropdown, { DropdownItem, DropdownDivider } from '../common/Dropdown'

const routeTitles = {
  '/admin/dashboard':     'Dashboard',
  '/admin/students':      'Students',
  '/admin/exams':         'Exams',
  '/admin/exams/create':  'Create Exam',
  '/admin/questions':     'Questions',
  '/admin/question-bank': 'Question Bank',
  '/admin/monitoring':    'Live Monitoring',
  '/admin/results':       'Results',
  '/admin/analytics':     'Analytics',
  '/admin/profile':       'Profile',
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

  const admin = user || { name: '', department: '' }

  // Breadcrumb-style location label
  const pageTitle = routeTitles[location.pathname] || 'Administration'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-canvas/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8">
      {/* ── Left: Hamburger (mobile) + Collapse Toggle + Location ── */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleMobile}
          aria-label="Open mobile navigation"
          className="-ml-2 rounded-lg p-2 text-ink-3 transition-colors hover:bg-sunken hover:text-ink md:hidden"
        >
          <Menu size={20} />
        </button>

        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="-ml-2 hidden rounded-lg p-2 text-ink-3 transition-colors hover:bg-sunken hover:text-ink md:flex"
        >
          {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>

        <p className="text-sm text-ink-3">
          Admin <span className="text-ink-2">/</span>{' '}
          <span className="font-medium text-ink-2">{pageTitle}</span>
        </p>
      </div>

      {/* ── Right: Term & Profile Menu ── */}
      <div className="flex items-center gap-4">
        <Dropdown
          align="right"
          width="w-64"
          trigger={
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg p-1 text-left transition-colors hover:bg-sunken"
            >
              <Avatar name={admin.name} size="sm" />
              <span className="hidden text-sm font-medium text-ink-2 md:block">
                {admin.name}
              </span>
              <ChevronDown size={14} className="hidden text-ink-3 sm:block" />
            </button>
          }
        >
          <div className="border-b border-line px-3 py-2">
            <p className="text-sm font-semibold text-ink">{admin.name}</p>
            {admin.department && (
              <p className="truncate text-xs text-ink-3">{admin.department}</p>
            )}
          </div>

          <div className="py-1">
            <DropdownItem
              icon={<User size={15} />}
              onClick={() => navigate('/admin/profile')}
            >
              Admin Profile
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
