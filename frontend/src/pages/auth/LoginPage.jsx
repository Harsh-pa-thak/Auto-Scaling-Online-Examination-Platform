import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input, Button } from '../../components/common'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { Mail, Lock, Eye, EyeOff, LogIn, ShieldCheck, GraduationCap } from 'lucide-react'

// Email format regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  const { toast } = useToast()

  const [role, setRole] = useState('student') // 'student' | 'admin'
  // Seeded accounts created by backend/prisma/seed.js (passwords come from the
  // environment — never hard-code them in the client).
  const [email, setEmail] = useState('student@example.com')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Validation state
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validateField = (field, value) => {
    switch (field) {
      case 'email':
        if (!value.trim()) return 'Institutional email is required'
        if (!EMAIL_REGEX.test(value.trim())) return 'Please enter a valid email address (e.g. user@vit.ac.in)'
        return null
      case 'password':
        if (!value) return 'Password is required'
        if (value.length < 6) return 'Password must be at least 6 characters'
        return null
      default:
        return null
    }
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const value = field === 'email' ? email : password
    const err = validateField(field, value)
    setErrors((prev) => ({ ...prev, [field]: err }))
  }

  const handleEmailChange = (e) => {
    const val = e.target.value
    setEmail(val)
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateField('email', val) }))
    }
  }

  const handlePasswordChange = (e) => {
    const val = e.target.value
    setPassword(val)
    if (touched.password) {
      setErrors((prev) => ({ ...prev, password: validateField('password', val) }))
    }
  }

  const handleRoleChange = (newRole) => {
    setRole(newRole)
    setErrors({})
    setTouched({})
    setPassword('')
    setEmail(newRole === 'admin' ? 'admin@example.com' : 'student@example.com')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const emailErr = validateField('email', email)
    const passErr = validateField('password', password)

    if (emailErr || passErr) {
      setErrors({
        email: emailErr,
        password: passErr,
      })
      setTouched({ email: true, password: true })
      return
    }

    try {
      await login({ email: email.trim(), password, role })
      toast.success(
        'Authentication Successful',
        `Welcome to the ${role === 'admin' ? 'Administration' : 'Student'} Portal.`
      )
      navigate(role === 'admin' ? '/admin/dashboard' : '/student/dashboard')
    } catch (err) {
      toast.error('Authentication Failed', err.message || 'Invalid credentials provided.')
    }
  }

  const roleTab = (value) =>
    `flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      role === value ? 'bg-sunken text-ink' : 'text-ink-3 hover:text-ink'
    }`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl font-semibold text-ink">Sign in</h1>
        <p className="mt-2 text-sm text-ink-3">
          Access your exams, evaluations, and academic records.
        </p>
      </div>

      {/* Role Selector */}
      <div
        role="tablist"
        aria-label="Portal"
        className="grid grid-cols-2 gap-1 rounded-lg border border-line bg-canvas p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={role === 'student'}
          onClick={() => handleRoleChange('student')}
          className={roleTab('student')}
        >
          <GraduationCap size={16} />
          Student
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={role === 'admin'}
          onClick={() => handleRoleChange('admin')}
          className={roleTab('admin')}
        >
          <ShieldCheck size={16} />
          Admin
        </button>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          id="login-email"
          label="Institutional email"
          type="email"
          required
          value={email}
          onChange={handleEmailChange}
          onBlur={() => handleBlur('email')}
          placeholder="name@vit.ac.in"
          leftIcon={<Mail size={16} />}
          error={errors.email}
          autoComplete="email"
        />

        <Input
          id="login-password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          required
          value={password}
          onChange={handlePasswordChange}
          onBlur={() => handleBlur('password')}
          placeholder="Enter your password"
          leftIcon={<Lock size={16} />}
          error={errors.password}
          autoComplete="current-password"
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="rounded p-1 text-ink-3 transition-colors hover:text-ink-2 focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer select-none items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 cursor-pointer rounded border-line-strong bg-canvas accent-accent"
            />
            <span className="text-sm text-ink-2">Remember me</span>
          </label>

          <Link to="/forgot-password" className="text-link">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isLoading}
          rightIcon={<LogIn size={16} />}
          className="!mt-6"
        >
          Sign in as {role === 'admin' ? 'administrator' : 'student'}
        </Button>
      </form>

      <p className="text-center text-xs text-ink-4">
        Development accounts are created by the backend seed script
        (student@example.com · admin@example.com).
      </p>

      <p className="border-t border-line pt-6 text-center text-sm text-ink-3">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-link">
          Register
        </Link>
      </p>
    </div>
  )
}
