import { useState } from 'react'
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  LayoutDashboard,
  FileText,
  Award,
  History,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Avatar from '../components/common/Avatar'
import Dropdown, { DropdownItem, DropdownDivider } from '../components/common/Dropdown'
import { mockNotifications } from '../data/mockData'

const navLinks = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/exams',     label: 'Exams',     icon: FileText },
  { to: '/student/results',   label: 'Results',   icon: Award },
  { to: '/student/history',   label: 'History',   icon: History },
]

export default function StudentLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const unreadCount = mockNotifications.filter((n) => !n.read).length

  // Fallback student info if auth state isn't initialized yet
  const student = user || {
    name: 'Harsh Pathak',
    id: '24BCE1234',
    branch: 'B.Tech CSE',
    role: 'student',
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3">
              <Link to="/student/dashboard" className="flex items-center gap-2.5 group">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm transition-transform duration-150 group-hover:scale-105">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-primary-600 transition-colors">
                    ExamPortal
                  </span>
                  <span className="hidden sm:inline-block ml-2 text-[11px] font-semibold uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-200/60">
                    Student
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'nav-link-active' : ''}`
                  }
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Right Actions: Notifications & Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notifications */}
              <Link
                to="/student/notifications"
                aria-label="View notifications"
                className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </Link>

              {/* User Profile Dropdown */}
              <Dropdown
                align="right"
                width="w-60"
                trigger={
                  <button
                    type="button"
                    className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 transition-colors text-left"
                  >
                    <Avatar name={student.name} size="sm" status="online" />
                    <div className="hidden lg:block text-left">
                      <p className="text-xs font-semibold text-slate-800 leading-tight">
                        {student.name}
                      </p>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        {student.id}
                      </p>
                    </div>
                    <ChevronDown size={14} className="hidden sm:block text-slate-400" />
                  </button>
                }
              >
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-semibold text-slate-900">{student.name}</p>
                  <p className="text-[11px] text-slate-500">{student.id} • {student.branch || 'CSE'}</p>
                </div>

                <DropdownItem
                  icon={<User size={14} />}
                  onClick={() => navigate('/student/profile')}
                >
                  My Profile
                </DropdownItem>

                <DropdownItem
                  icon={<ShieldCheck size={14} />}
                  onClick={() => navigate('/admin/dashboard')}
                >
                  Switch to Admin View
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

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Navigation Drawer ── */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
            <div className="pt-2 border-t border-slate-100">
              <NavLink
                to="/student/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <User size={18} />
                <span>My Profile</span>
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Main Content Area ── */}
      <main className="flex-1 page-container">
        <Outlet />
      </main>

      {/* ── Academic Footer ── */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Auto-Scaling Online Examination Platform • University Assessment Portal</span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            System Status: Healthy
          </span>
        </div>
      </footer>
    </div>
  )
}
