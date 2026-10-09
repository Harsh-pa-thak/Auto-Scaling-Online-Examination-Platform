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
  const [email, setEmail] = useState('harsh.pathak@vit.ac.in')
  const [password, setPassword] = useState('password123')
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
    if (newRole === 'admin') {
      setEmail('ramesh.kumar@vit.ac.in')
      setPassword('adminPass123')
    } else {
      setEmail('harsh.pathak@vit.ac.in')
      setPassword('password123')
    }
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
      role === value ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-400 hover:text-zinc-100'
    }`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl font-semibold text-zinc-50">Sign in</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Access your exams, evaluations, and academic records.
        </p>
      </div>

      {/* Role Selector */}
      <div
        role="tablist"
        aria-label="Portal"
        className="grid grid-cols-2 gap-1 rounded-lg border border-zinc-800 bg-zinc-950 p-1"
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
              className="rounded p-1 text-zinc-500 transition-colors hover:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
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
              className="h-4 w-4 cursor-pointer rounded border-zinc-700 bg-zinc-950 accent-amber-500"
            />
            <span className="text-sm text-zinc-300">Remember me</span>
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

      <p className="text-center text-xs text-zinc-500">
        Demo mode: credentials are prefilled. Any email with a 6+ character password works.
      </p>

      <p className="border-t border-zinc-800 pt-6 text-center text-sm text-zinc-400">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-link">
          Register
        </Link>
      </p>
    </div>
  )
}
