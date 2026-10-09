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
 */
export default function AdminLayout() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [desktopCollapsed, setDesktopCollapsed] = useState(false)

  const toggleDesktopCollapse = () => {
    setDesktopCollapsed((prev) => !prev)
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 font-sans text-zinc-100">
      <AdminSidebar
        collapsed={desktopCollapsed}
        onToggleCollapse={toggleDesktopCollapse}
        mobileOpen={mobileDrawerOpen}
        onCloseMobile={() => setMobileDrawerOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          onToggleMobile={() => setMobileDrawerOpen(true)}
          collapsed={desktopCollapsed}
          onToggleCollapse={toggleDesktopCollapse}
        />

        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex-1">
            <Outlet />
          </div>

          <footer className="mt-16 w-full border-t border-zinc-800 pt-6 text-xs text-zinc-500">
            Auto-Scaling Online Examination Platform
          </footer>
        </main>
      </div>
    </div>
  )
}
