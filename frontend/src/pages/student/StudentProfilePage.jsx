import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  ShieldCheck,
  KeyRound,
  GraduationCap,
  Calendar,
  Phone,
  BookOpen,
  Award,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Hash,
  Copy,
  Check,
} from 'lucide-react'
import {
  Card,
  Badge,
  Button,
  Avatar,
} from '../../components/common'
import { useAuth } from '../../hooks/useAuth'
import { mockUsers } from '../../data/mockData'

export default function StudentProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Fallback to mock student data
  const student = user || mockUsers.student

  // Change password form state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordStatus, setPasswordStatus] = useState(null) // null | 'success' | 'error'
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copiedId, setCopiedId] = useState(false)

  const handleCopyId = () => {
    navigator.clipboard?.writeText(student.id)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    setPasswordStatus(null)
    setPasswordErrorMsg('')

    if (!currentPassword) {
      setPasswordStatus('error')
      setPasswordErrorMsg('Please enter your current password.')
      return
    }

    if (newPassword.length < 8) {
      setPasswordStatus('error')
      setPasswordErrorMsg('New password must be at least 8 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus('error')
      setPasswordErrorMsg('New password and confirm password do not match.')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setPasswordStatus('success')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }, 600)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* ── Page Header ── */}
      <div className="pb-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
            Student Profile
          </h1>
          <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
            Personal identity credentials, university enrollment details, and account security.
          </p>
        </div>

        <Button
          variant="danger"
          size="sm"
          onClick={handleLogout}
          leftIcon={<LogOut size={15} />}
        >
          Sign Out
        </Button>
      </div>

      {/* ── Student Identity Card ── */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              <Avatar name={student.name} size="xl" status="online" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
                  {student.name}
                </h2>
                <Badge variant="primary" size="sm">
                  Candidate
                </Badge>
                <Badge variant="success" size="sm" dot>
                  Active
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5 font-mono">
                  <Hash size={13} className="text-zinc-500" />
                  <span className="text-zinc-300 font-semibold">{student.id}</span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    title="Copy Student ID"
                    className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {copiedId ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                </div>
                <span className="text-zinc-600">•</span>
                <div className="flex items-center gap-1.5">
                  <Mail size={13} className="text-zinc-500" />
                  <span className="text-zinc-300">{student.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-zinc-800">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
              Department & Degree
            </span>
            <span className="text-xs font-semibold text-zinc-200">
              {student.branch || 'B.Tech Computer Science'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Two Column Layout: Account Information & Change Password ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Information (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card padding="p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800">
              <GraduationCap size={18} className="text-amber-400" />
              <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
                Academic & Account Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-850/60 border border-zinc-800 space-y-1">
                <span className="text-zinc-400 font-medium">Full Legal Name</span>
                <p className="text-zinc-100 font-semibold text-sm">{student.name}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-850/60 border border-zinc-800 space-y-1">
                <span className="text-zinc-400 font-medium">University Registration ID</span>
                <p className="text-zinc-100 font-mono font-semibold text-sm">{student.id}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-850/60 border border-zinc-800 space-y-1">
                <span className="text-zinc-400 font-medium">Institutional Email</span>
                <p className="text-zinc-100 font-medium text-sm break-all">{student.email}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-850/60 border border-zinc-800 space-y-1">
                <span className="text-zinc-400 font-medium">Registered Mobile</span>
                <p className="text-zinc-100 font-medium text-sm">{student.phone || '+91 98765 43210'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-850/60 border border-zinc-800 space-y-1">
                <span className="text-zinc-400 font-medium">Academic Batch</span>
                <p className="text-zinc-100 font-semibold text-sm">{student.batch || '2024–2028'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-850/60 border border-zinc-800 space-y-1">
                <span className="text-zinc-400 font-medium">Current Semester & Section</span>
                <p className="text-zinc-100 font-semibold text-sm">
                  Semester {student.semester || 4} • Section {student.section || 'A'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-850/60 border border-zinc-800 space-y-1">
                <span className="text-zinc-400 font-medium">Cumulative GPA (CGPA)</span>
                <p className="text-amber-400 font-bold text-sm">
                  {student.cgpa || 8.7} <span className="text-zinc-500 font-normal text-xs">/ 10.0</span>
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-850/60 border border-zinc-800 space-y-1">
                <span className="text-zinc-400 font-medium">Enrollment Date</span>
                <p className="text-zinc-100 font-medium text-sm">
                  {student.joinedAt || '2024-08-01'}
                </p>
              </div>
            </div>

            {/* Verification Status Banner */}
            <div className="mt-5 p-3.5 rounded-xl bg-zinc-850/80 border border-zinc-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-zinc-200">Identity & Proctoring Verification</p>
                  <p className="text-zinc-400 text-[11px]">Government ID and facial biometric tokens are active.</p>
                </div>
              </div>
              <Badge variant="success" size="sm">Verified</Badge>
            </div>
          </Card>
        </div>

        {/* Change Password UI (1 Col) */}
        <div className="space-y-6">
          <Card padding="p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800">
              <KeyRound size={18} className="text-amber-400" />
              <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
                Change Password
              </h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
              {passwordStatus === 'success' && (
                <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="leading-tight">Your password has been changed successfully.</p>
                </div>
              )}

              {passwordStatus === 'error' && (
                <div className="p-3 rounded-lg bg-red-950/50 border border-red-800/60 text-red-300 flex items-start gap-2">
                  <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="leading-tight">{passwordErrorMsg}</p>
                </div>
              )}

              <div>
                <label htmlFor="current-password" className="block text-zinc-300 font-medium mb-1.5">
                  Current Password
                </label>
                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="input-base w-full"
                  required
                />
              </div>

              <div>
                <label htmlFor="new-password" className="block text-zinc-300 font-medium mb-1.5">
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="input-base w-full"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-zinc-300 font-medium mb-1.5">
                  Confirm New Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="input-base w-full"
                  required
                />
              </div>

              <div className="p-3 rounded-lg bg-zinc-850/50 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
                <p className="font-semibold text-zinc-300">Password requirements:</p>
                <p>• Minimum 8 characters long</p>
                <p>• Must not match previous 3 passwords</p>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={isSubmitting}
                className="mt-2"
              >
                Update Password
              </Button>
            </form>
          </Card>

          {/* Session Logout Action */}
          <Card padding="p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Session Management
            </h3>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Sign out from all active proctoring and student portal sessions on this browser.
            </p>
            <Button
              variant="secondary"
              fullWidth
              size="sm"
              onClick={handleLogout}
              leftIcon={<LogOut size={14} className="text-red-400" />}
            >
              Log Out of Student Account
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
