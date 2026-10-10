import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle2,
  AlertCircle,
  LogOut,
  Copy,
  Check,
} from 'lucide-react'
import { Card, Button, Avatar } from '../../components/common'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'

export default function StudentProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Fallback to mock student data
  const student = user || {}

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
    api('/auth/password', { method: 'PATCH', body: { currentPassword, newPassword } }).then(() => {
      setIsSubmitting(false)
      setPasswordStatus('success')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }).catch((error) => {
      setIsSubmitting(false)
      setPasswordStatus('error')
      setPasswordErrorMsg(error.message)
    })
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const details = [
    { label: 'Full name',            value: student.name },
    { label: 'Registration ID',      value: student.id, numeric: true },
    { label: 'Institutional email',  value: student.email, breakAll: true },
    { label: 'Mobile',               value: student.phone || '+91 98765 43210', numeric: true },
    { label: 'Batch',                value: student.batch || '2024–2028', numeric: true },
    { label: 'Semester & section',   value: `Semester ${student.semester || 4} · Section ${student.section || 'A'}` },
    { label: 'CGPA',                 value: `${student.cgpa || 8.7} / 10.0`, numeric: true },
    { label: 'Enrolled on',          value: student.joinedAt || '2024-08-01', numeric: true },
  ]

  const passwordFields = [
    { id: 'current-password', label: 'Current password',     value: currentPassword, set: setCurrentPassword, placeholder: 'Enter current password' },
    { id: 'new-password',     label: 'New password',         value: newPassword,     set: setNewPassword,     placeholder: 'At least 8 characters' },
    { id: 'confirm-password', label: 'Confirm new password', value: confirmPassword, set: setConfirmPassword, placeholder: 'Re-enter new password' },
  ]

  return (
    <div className="max-w-5xl space-y-8">
      {/* ── Header / identity ── */}
      <header className="page-header">
        <div className="flex items-center gap-4">
          <Avatar name={student.name} size="xl" />
          <div>
            <h1 className="page-title">{student.name}</h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-zinc-400">
              <span className="inline-flex items-center gap-1 tabular-nums">
                {student.id}
                <button
                  type="button"
                  onClick={handleCopyId}
                  aria-label="Copy student ID"
                  className="rounded p-1 text-zinc-500 transition-colors hover:text-zinc-300"
                >
                  {copiedId ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
              </span>
              <span className="text-zinc-600">·</span>
              <span>{student.branch || 'B.Tech Computer Science'}</span>
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Account information ── */}
        <Card className="self-start lg:col-span-2">
          <h2 className="section-title">Academic & account information</h2>
          <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {details.map(({ label, value, numeric, breakAll }) => (
              <div key={label} className="border-b border-zinc-800 pb-4">
                <dt className="text-sm text-zinc-400">{label}</dt>
                <dd
                  className={`mt-1 text-sm font-medium text-zinc-100 ${numeric ? 'tabular-nums' : ''} ${
                    breakAll ? 'break-all' : ''
                  }`}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </Card>

        <div className="space-y-6">
          {/* ── Change password ── */}
          <Card>
            <h2 className="section-title">Change password</h2>

            <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
              {passwordStatus === 'success' && (
                <p className="flex items-start gap-2 text-sm text-emerald-300">
                  <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-emerald-400" />
                  Your password has been changed.
                </p>
              )}

              {passwordStatus === 'error' && (
                <p role="alert" className="flex items-start gap-2 text-sm text-red-300">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-red-400" />
                  {passwordErrorMsg}
                </p>
              )}

              {passwordFields.map(({ id, label, value, set, placeholder }) => (
                <div key={id} className="space-y-2">
                  <label htmlFor={id} className="form-label">
                    {label}
                  </label>
                  <input
                    id={id}
                    type="password"
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    placeholder={placeholder}
                    className="input-base"
                    required
                  />
                </div>
              ))}

              <p className="text-xs text-zinc-500">
                At least 8 characters. Must not match your previous 3 passwords.
              </p>

              <Button type="submit" fullWidth loading={isSubmitting}>
                Update password
              </Button>
            </form>
          </Card>

          {/* ── Session ── */}
          <Card>
            <h2 className="section-title">Session</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Sign out of the student portal on this browser.
            </p>
            <Button
              variant="secondary"
              fullWidth
              onClick={handleLogout}
              leftIcon={<LogOut size={16} />}
              className="mt-4"
            >
              Sign out
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
