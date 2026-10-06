import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import StudentNavbar from '../components/student/StudentNavbar'
import StudentSidebar from '../components/student/StudentSidebar'

/**
 * StudentLayout — Main application shell for all student portal routes (/student/*)
 *
 * Provides:
 * - Desktop: Sticky top navbar, fixed left sidebar, main content area with nested Outlet
 * - Mobile: Responsive hamburger drawer menu
 * - Profile dropdown, notification badge, and university branding
 */
export default function StudentLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* ── Top Navbar ── */}
      <StudentNavbar onToggleMobileMenu={() => setMobileMenuOpen(true)} />

      {/* ── Main Layout (Sidebar + Nested Outlet Area) ── */}
      <div className="flex-1 flex min-h-[calc(100vh-4rem)]">
        {/* Left Sidebar Navigation & Mobile Drawer */}
        <StudentSidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Nested Outlet Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 flex flex-col">
          <div className="flex-1 max-w-7xl w-full mx-auto">
            <Outlet />
          </div>

          {/* Academic Footer */}
          <footer className="mt-12 pt-6 border-t border-zinc-800 text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl w-full mx-auto">
            <span>
              Auto-Scaling Online Examination Platform • University Assessment Portal
            </span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Proctoring & Autosave: Active
            </span>
          </footer>
        </main>
      </div>
    </div>
  )
}
