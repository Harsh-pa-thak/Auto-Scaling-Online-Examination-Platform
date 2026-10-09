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
 */
export default function StudentLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 font-sans text-zinc-100">
      <StudentNavbar onToggleMobileMenu={() => setMobileMenuOpen(true)} />

      <div className="flex min-h-[calc(100vh-4rem)] flex-1">
        <StudentSidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <main className="flex min-w-0 flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl flex-1">
            <Outlet />
          </div>

          <footer className="mx-auto mt-16 w-full max-w-7xl border-t border-zinc-800 pt-6 text-xs text-zinc-500">
            Auto-Scaling Online Examination Platform
          </footer>
        </main>
      </div>
    </div>
  )
}
