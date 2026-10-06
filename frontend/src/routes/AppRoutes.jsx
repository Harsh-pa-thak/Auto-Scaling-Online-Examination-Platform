import { Routes, Route, Navigate } from 'react-router-dom'
import StudentLayout from '../layouts/StudentLayout'
import AdminLayout from '../layouts/AdminLayout'
import AuthLayout from '../layouts/AuthLayout'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import StudentDashboard from '../pages/student/StudentDashboard'
import StudentExamsPage from '../pages/student/StudentExamsPage'
import ExamDetailsPage from '../pages/student/ExamDetailsPage'
import RoutePlaceholder from './RoutePlaceholder'
import { Card, Button } from '../components/common'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

// 404 Not Found Page
function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card padding="p-8" className="max-w-md w-full text-center">
        <div className="h-14 w-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-100">
          <AlertCircle size={28} />
        </div>
        <h1 className="text-xl font-bold text-slate-900">404 — Page Not Found</h1>
        <p className="mt-2 text-sm text-slate-500">
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

      {/* ── Student Routes ── */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="exams" element={<StudentExamsPage />} />
        <Route path="exams/:id" element={<ExamDetailsPage />} />
        <Route
          path="exam/:id"
          element={
            <RoutePlaceholder
              title="Live Examination Interface"
              description="Secure proctored test screen, question palette, autosave, timer, and submission."
              role="student"
            />
          }
        />
        <Route
          path="results"
          element={
            <RoutePlaceholder
              title="Exam Results & Performance"
              description="Published scorecard, grade breakdown, and question-level analytics."
              role="student"
            />
          }
        />
        <Route
          path="history"
          element={
            <RoutePlaceholder
              title="Attempt History"
              description="Past examination records, timestamps, and certificates."
              role="student"
            />
          }
        />
        <Route
          path="notifications"
          element={
            <RoutePlaceholder
              title="Notifications"
              description="Exam schedules, score release announcements, and system alerts."
              role="student"
            />
          }
        />
        <Route
          path="profile"
          element={
            <RoutePlaceholder
              title="Student Profile"
              description="Academic registration details, department, batch, and credentials."
              role="student"
            />
          }
        />
      </Route>

      {/* ── Admin Routes ── */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <RoutePlaceholder
              title="Administration Dashboard"
              description="High-level overview of active exams, active examinees, cluster nodes, and pass rates."
              role="admin"
            />
          }
        />
        <Route
          path="students"
          element={
            <RoutePlaceholder
              title="Student Management"
              description="Directory of enrolled students, registration numbers, batch filters, and statuses."
              role="admin"
            />
          }
        />
        <Route
          path="exams"
          element={
            <RoutePlaceholder
              title="Examination Management"
              description="Manage scheduled, ongoing, and completed exams, configure timings and sections."
              role="admin"
            />
          }
        />
        <Route
          path="exams/create"
          element={
            <RoutePlaceholder
              title="Create New Examination"
              description="Multi-step wizard to configure paper code, timings, question bank linkage, and rules."
              role="admin"
            />
          }
        />
        <Route
          path="exams/:id"
          element={
            <RoutePlaceholder
              title="Exam Configuration & Details"
              description="Specific exam settings, participant lists, question allocations, and status toggles."
              role="admin"
            />
          }
        />
        <Route
          path="question-bank"
          element={
            <RoutePlaceholder
              title="Question Bank Repository"
              description="Manage subject question banks, difficulty levels, topics, and question creation."
              role="admin"
            />
          }
        />
        <Route
          path="monitoring"
          element={
            <RoutePlaceholder
              title="Live Examination Monitoring"
              description="Real-time dashboard of concurrent student sessions, heartbeat tracking, and autoscaling metrics."
              role="admin"
            />
          }
        />
        <Route
          path="results"
          element={
            <RoutePlaceholder
              title="Results & Grade Evaluation"
              description="Evaluate submissions, compute score distributions, and publish grades."
              role="admin"
            />
          }
        />
        <Route
          path="analytics"
          element={
            <RoutePlaceholder
              title="System & Academic Analytics"
              description="Subject pass trends, score distribution histograms, and platform load charts."
              role="admin"
            />
          }
        />
        <Route
          path="profile"
          element={
            <RoutePlaceholder
              title="Administrator Profile"
              description="Departmental privileges, faculty identity, and security preferences."
              role="admin"
            />
          }
        />
      </Route>

      {/* ── 404 Catch-All ── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
