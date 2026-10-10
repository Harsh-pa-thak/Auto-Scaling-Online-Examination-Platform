import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import StudentLayout from '../layouts/StudentLayout'
import AdminLayout from '../layouts/AdminLayout'
import AuthLayout from '../layouts/AuthLayout'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import StudentDashboard from '../pages/student/StudentDashboard'
import StudentExamsPage from '../pages/student/StudentExamsPage'
import ExamDetailsPage from '../pages/student/ExamDetailsPage'
import LiveExamPage from '../pages/student/LiveExamPage'
import StudentResultsPage from '../pages/student/StudentResultsPage'
import StudentHistoryPage from '../pages/student/StudentHistoryPage'
import StudentNotificationsPage from '../pages/student/StudentNotificationsPage'
import StudentProfilePage from '../pages/student/StudentProfilePage'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminStudentsPage from '../pages/admin/AdminStudentsPage'
import AdminExamCreatePage from '../pages/admin/AdminExamCreatePage'
import RoutePlaceholder from './RoutePlaceholder'
import { Card, Button, LoadingSpinner } from '../components/common'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

// ── Admin pages — lazy loaded for code splitting ───────────────
const AdminExamsPage        = lazy(() => import('../pages/admin/AdminExamsPage'))
const AdminQuestionsPage    = lazy(() => import('../pages/admin/AdminQuestionsPage'))
const AdminQuestionBankPage = lazy(() => import('../pages/admin/AdminQuestionBankPage'))
const AdminMonitoringPage   = lazy(() => import('../pages/admin/AdminMonitoringPage'))
const AdminResultsPage      = lazy(() => import('../pages/admin/AdminResultsPage'))
const AdminAnalyticsPage    = lazy(() => import('../pages/admin/AdminAnalyticsPage'))
const AdminProfilePage      = lazy(() => import('../pages/admin/AdminProfilePage'))

function AdminFallback() {
  return (
    <div className="flex items-center justify-center min-h-64 w-full">
      <LoadingSpinner size="lg" />
    </div>
  )
}

function RequireAuth({ children, role }) {
  const { user, isLoading } = useAuth()
  if (isLoading) return <AdminFallback />
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />
  return children
}

// ── 404 Not Found Page ─────────────────────────────────────────
function NotFoundPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <Card padding="p-8" className="max-w-md w-full text-center">
        <div className="h-14 w-14 rounded-2xl bg-red-950/50 text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-800/60">
          <AlertCircle size={28} />
        </div>
        <h1 className="text-xl font-bold text-zinc-100">404 — Page Not Found</h1>
        <p className="mt-2 text-sm text-zinc-400">
          The requested page route does not exist in this examination portal.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/student/dashboard">
            <Button variant="secondary" size="sm" leftIcon={<ArrowLeft size={14} />}>
              Student Portal
            </Button>
          </Link>
          <Link to="/admin/dashboard">
            <Button size="sm">Admin Portal</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Root redirect ── */}
      <Route path="/" element={<Navigate to="/student/dashboard" replace />} />

      {/* ── Public Auth Routes ── */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* ── Standalone Live Examination Screen (Distraction-Free) ── */}
      <Route path="/student/exam/:id" element={<RequireAuth role="student"><LiveExamPage /></RequireAuth>} />

      {/* ── Student Portal Routes ── */}
      <Route path="/student" element={<RequireAuth role="student"><StudentLayout /></RequireAuth>}>
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="exams" element={<StudentExamsPage />} />
        <Route path="exams/:id" element={<ExamDetailsPage />} />
        <Route path="results" element={<StudentResultsPage />} />
        <Route path="history" element={<StudentHistoryPage />} />
        <Route path="notifications" element={<StudentNotificationsPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
      </Route>

      {/* ── Admin Routes ── */}
      <Route path="/admin" element={<RequireAuth role="admin"><AdminLayout /></RequireAuth>}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudentsPage />} />

        <Route path="exams" element={
          <Suspense fallback={<AdminFallback />}>
            <AdminExamsPage />
          </Suspense>
        } />
        <Route path="exams/create" element={
          <AdminExamCreatePage />
        } />
        <Route path="exams/:id" element={
          <RoutePlaceholder
            title="Exam Configuration & Details"
            description="Specific exam settings, participant lists, question allocations, and status toggles."
            role="admin"
          />
        } />

        <Route path="questions" element={
          <Suspense fallback={<AdminFallback />}>
            <AdminQuestionsPage />
          </Suspense>
        } />
        <Route path="question-bank" element={
          <Suspense fallback={<AdminFallback />}>
            <AdminQuestionBankPage />
          </Suspense>
        } />
        <Route path="monitoring" element={
          <Suspense fallback={<AdminFallback />}>
            <AdminMonitoringPage />
          </Suspense>
        } />
        <Route path="results" element={
          <Suspense fallback={<AdminFallback />}>
            <AdminResultsPage />
          </Suspense>
        } />
        <Route path="analytics" element={
          <Suspense fallback={<AdminFallback />}>
            <AdminAnalyticsPage />
          </Suspense>
        } />
        <Route path="profile" element={
          <Suspense fallback={<AdminFallback />}>
            <AdminProfilePage />
          </Suspense>
        } />
      </Route>

      {/* ── 404 Catch-All ── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
