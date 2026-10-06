import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminHeader from '../components/admin/AdminHeader'

/**
 * AdminLayout — Main application shell for all admin portal routes (/admin/*)
 *
 * Provides:
 * - Desktop: Fixed/collapsible left sidebar, sticky top header, main content area
 * - Mobile: Responsive hamburger drawer navigation
 * - Admin profile menu with credentials and sign out
 * - Dark neutral academic design system
 */
export default function AdminLayout() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [desktopCollapsed, setDesktopCollapsed] = useState(false)

  const toggleDesktopCollapse = () => {
    setDesktopCollapsed((prev) => !prev)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex font-sans">
      {/* ── Left Sidebar (Desktop fixed/collapsible + Mobile Drawer) ── */}
      <AdminSidebar
        collapsed={desktopCollapsed}
        onToggleCollapse={toggleDesktopCollapse}
        mobileOpen={mobileDrawerOpen}
        onCloseMobile={() => setMobileDrawerOpen(false)}
      />

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Top Header */}
        <AdminHeader
          onToggleMobile={() => setMobileDrawerOpen(true)}
          collapsed={desktopCollapsed}
          onToggleCollapse={toggleDesktopCollapse}
        />

        {/* Main Content Area with nested route Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>

          {/* Academic Footer */}
          <footer className="mt-12 pt-6 border-t border-zinc-800 text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2 w-full">
            <span>
              Auto-Scaling Online Examination Platform • University Administration Portal
            </span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Administrative Session: Active
            </span>
          </footer>
        </main>
      </div>
    </div>
  )
}
