import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  Building2,
  Briefcase,
  Phone,
  KeyRound,
  LogOut,
  ShieldCheck,
  Bell,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  Lock,
  Settings,
  Calendar,
  IdCard,
} from 'lucide-react'
import { Card, Button, Input, Badge, Avatar, ConfirmDialog } from '../../components/common'
import { mockUsers } from '../../data/mockData'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'

const admin = mockUsers.admin

// ── Reusable Section wrapper ───────────────────────────────────
function Section({ title, subtitle, icon, children }) {
  return (
    <Card padding="p-5">
      <div className="flex items-start gap-3 mb-5 pb-4 border-b border-zinc-800">
        {icon && (
          <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-sm font-semibold text-zinc-200">{title}</h2>
          {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </Card>
  )
}

// ── Info row ──────────────────────────────────────────────────
function InfoRow({ icon, label, value, mono = false }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-zinc-800/60 last:border-0">
      <div className="shrink-0 w-8 h-8 rounded-lg bg-zinc-800/60 flex items-center justify-center text-zinc-500">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">{label}</p>
        <p className={`text-sm font-medium text-zinc-200 mt-0.5 truncate ${mono ? 'font-mono' : ''}`}>
          {value}
        </p>
      </div>
    </div>
  )
}

// ── Password input with show/hide toggle ──────────────────────
function PasswordField({ id, label, value, onChange, error, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <Input
      id={id}
      label={label}
      type={show ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      error={error}
      placeholder={placeholder}
      rightSlot={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      }
    />
  )
}

// ── Toggle switch ─────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={[
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
        'transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500/50',
        checked ? 'bg-amber-500' : 'bg-zinc-700',
      ].join(' ')}
    >
      <span
        className={[
          'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow',
          'transition duration-200 ease-in-out',
          checked ? 'translate-x-4' : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  )
}

export default function AdminProfilePage() {
  const { logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  // Change password form state
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [pwErrors, setPwErrors] = useState({})
  const [pwLoading, setPwLoading] = useState(false)

  // Logout confirm dialog
  const [logoutOpen, setLogoutOpen] = useState(false)

  // Account / notification settings
  const [settings, setSettings] = useState({
    examEvents: true,
    studentSubmissions: true,
    systemAlerts: false,
    twoFactor: false,
    activityLog: true,
  })

  function handlePwField(field, value) {
    setPwForm((p) => ({ ...p, [field]: value }))
    if (pwErrors[field]) setPwErrors((p) => ({ ...p, [field]: undefined }))
  }

  async function handlePwSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!pwForm.current) errs.current = 'Current password is required.'
    if (!pwForm.next || pwForm.next.length < 8) errs.next = 'New password must be at least 8 characters.'
    if (pwForm.next !== pwForm.confirm) errs.confirm = 'Passwords do not match.'
    if (Object.keys(errs).length > 0) { setPwErrors(errs); return }

    setPwLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setPwLoading(false)
    setPwForm({ current: '', next: '', confirm: '' })
    setPwErrors({})
    toast.success('Password updated', 'Your portal credentials have been changed successfully.')
  }

  // ── Logout handler ──
  function handleLogout() {
    logout()
    toast.info('Signed out', 'You have been securely signed out.')
    navigate('/login')
  }

  // ── Setting toggle ──
  function toggleSetting(key) {
    setSettings((p) => {
      const next = { ...p, [key]: !p[key] }
      toast.success('Setting saved', `${key.replace(/([A-Z])/g, ' $1')} preference updated.`)
      return next
    })
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <User className="text-amber-500" size={22} />
          Administrator Profile
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage your identity, portal credentials, and account preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── LEFT: Identity card ── */}
        <div className="lg:col-span-1 space-y-4">
          {/* Avatar card */}
          <Card padding="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar name={admin.name} size="xl" className="mb-4" />
              <h2 className="text-base font-bold text-zinc-100">{admin.name}</h2>
              <p className="text-xs text-zinc-400 mt-0.5 font-mono">{admin.email}</p>

              <div className="mt-3 flex flex-wrap gap-2 justify-center">
                <Badge variant="warning" size="sm">Administrator</Badge>
                <Badge variant="default" size="sm">
                  {admin.department?.split(' ')[0] ?? 'CSE'}
                </Badge>
              </div>

              <div className="mt-5 w-full space-y-3 pt-4 border-t border-zinc-800 text-left text-xs">
                <div>
                  <p className="text-zinc-500 uppercase tracking-wider font-medium">Staff ID</p>
                  <p className="mt-0.5 font-mono font-semibold text-zinc-300">{admin.id}</p>
                </div>
                <div>
                  <p className="text-zinc-500 uppercase tracking-wider font-medium">Role</p>
                  <p className="mt-0.5 font-medium text-zinc-300">System Administrator</p>
                </div>
                <div>
                  <p className="text-zinc-500 uppercase tracking-wider font-medium">Member Since</p>
                  <p className="mt-0.5 text-zinc-300">
                    {new Date(admin.joinedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Session / Logout card */}
          <Card padding="p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={14} className="text-zinc-500" />
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Active Session</span>
            </div>
            <div className="text-xs text-zinc-500 space-y-1 mb-4">
              <p>Logged in as <span className="text-zinc-300 font-medium">Administrator</span></p>
              <p>Portal access level: <span className="text-amber-400 font-semibold">Full Access</span></p>
            </div>
            <Button
              variant="danger"
              fullWidth
              leftIcon={<LogOut size={15} />}
              onClick={() => setLogoutOpen(true)}
            >
              Sign Out
            </Button>
          </Card>
        </div>

        {/* ── RIGHT: Info + Settings ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Profile Information */}
          <Section
            title="Profile Information"
            subtitle="Identity and contact details registered in the system."
            icon={<User size={15} />}
          >
            <div>
              <InfoRow icon={<User size={15} />} label="Full Name" value={admin.name} />
              <InfoRow icon={<Mail size={15} />} label="Email Address" value={admin.email} />
              <InfoRow icon={<IdCard size={15} />} label="Role" value="System Administrator" />
              <InfoRow icon={<Building2 size={15} />} label="Department" value={admin.department} />
              <InfoRow icon={<Briefcase size={15} />} label="Designation" value={admin.designation} />
              <InfoRow icon={<Phone size={15} />} label="Phone" value={admin.phone} />
              <InfoRow
                icon={<Calendar size={15} />}
                label="Joined"
                value={new Date(admin.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              />
            </div>
            <p className="mt-4 text-xs text-zinc-600">
              Profile details are managed by IT administration. Contact the helpdesk to request updates.
            </p>
          </Section>

          {/* Change Password */}
          <Section
            title="Change Password"
            subtitle="Update your portal login credentials securely."
            icon={<KeyRound size={15} />}
          >
            <form onSubmit={handlePwSubmit} noValidate className="space-y-4">
              <PasswordField
                id="current-password"
                label="Current Password"
                placeholder="Enter current password"
                value={pwForm.current}
                onChange={(e) => handlePwField('current', e.target.value)}
                error={pwErrors.current}
              />
              <PasswordField
                id="new-password"
                label="New Password"
                placeholder="Minimum 8 characters"
                value={pwForm.next}
                onChange={(e) => handlePwField('next', e.target.value)}
                error={pwErrors.next}
              />
              <PasswordField
                id="confirm-password"
                label="Confirm New Password"
                placeholder="Repeat new password"
                value={pwForm.confirm}
                onChange={(e) => handlePwField('confirm', e.target.value)}
                error={pwErrors.confirm}
              />

              {/* Password strength hint */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-zinc-500">
                <span className={`flex items-center gap-1 ${pwForm.next.length >= 8 ? 'text-emerald-400' : ''}`}>
                  <CheckCircle2 size={11} /> Min 8 characters
                </span>
                <span className={`flex items-center gap-1 ${/[A-Z]/.test(pwForm.next) ? 'text-emerald-400' : ''}`}>
                  <CheckCircle2 size={11} /> Uppercase letter
                </span>
                <span className={`flex items-center gap-1 ${/[0-9]/.test(pwForm.next) ? 'text-emerald-400' : ''}`}>
                  <CheckCircle2 size={11} /> Contains number
                </span>
              </div>

              <div className="flex justify-end pt-1">
                <Button type="submit" leftIcon={<Save size={14} />} loading={pwLoading}>
                  Update Password
                </Button>
              </div>
            </form>
          </Section>

          {/* Account Settings */}
          <Section
            title="Account Settings"
            subtitle="Notification preferences and security options."
            icon={<Settings size={15} />}
          >
            <div className="space-y-0">
              {[
                {
                  key: 'examEvents',
                  label: 'Exam lifecycle events',
                  sub: 'Notifications for scheduled, started, completed, and cancelled exams.',
                },
                {
                  key: 'studentSubmissions',
                  label: 'Student submissions',
                  sub: 'Alert when students submit or timeout during an exam session.',
                },
                {
                  key: 'systemAlerts',
                  label: 'System & maintenance alerts',
                  sub: 'Platform downtime, infrastructure updates, and security notices.',
                },
                {
                  key: 'twoFactor',
                  label: 'Two-factor authentication',
                  sub: 'Require OTP verification on every portal login for enhanced security.',
                },
                {
                  key: 'activityLog',
                  label: 'Activity audit log',
                  sub: 'Record all administrative actions including question edits and exam publishing.',
                },
              ].map(({ key, label, sub }) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-4 py-3.5 border-b border-zinc-800/60 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-200">{label}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{sub}</p>
                  </div>
                  <Toggle checked={settings[key]} onChange={() => toggleSetting(key)} />
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>

      {/* ── Logout Confirm Dialog ── */}
      <ConfirmDialog
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
        title="Sign out of Admin Portal?"
        description="You will be securely signed out and redirected to the login page. Any unsaved changes will be lost."
        confirmLabel="Sign Out"
        cancelLabel="Stay Signed In"
        confirmVariant="danger"
      />
    </div>
  )
}
