import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input, Button, Badge } from '../../components/common'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, ShieldCheck, GraduationCap } from 'lucide-react'

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Sign In to Examination Portal
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
          Access your exams, evaluations, and academic records
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/60">
        <button
          type="button"
          onClick={() => handleRoleChange('student')}
          className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            role === 'student'
              ? 'bg-white text-primary-700 shadow-sm border border-slate-200/40'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <GraduationCap size={15} />
          <span>Student Portal</span>
        </button>
        <button
          type="button"
          onClick={() => handleRoleChange('admin')}
          className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            role === 'admin'
              ? 'bg-white text-primary-700 shadow-sm border border-slate-200/40'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <ShieldCheck size={15} />
          <span>Admin Portal</span>
        </button>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email Field */}
        <Input
          id="login-email"
          label="Institutional Email"
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

        {/* Password Field with Show/Hide toggle */}
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
              className="p-1 rounded text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-xs text-slate-600 font-medium">Remember me</span>
          </label>

          <Link
            to="/forgot-password"
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <div className="pt-1">
          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={isLoading}
            rightIcon={<LogIn size={16} />}
          >
            Sign In as {role === 'admin' ? 'Administrator' : 'Student'}
          </Button>
        </div>
      </form>

      {/* Demo helper pill */}
      <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-xs text-slate-500">
        <div className="flex items-center justify-between font-medium text-slate-700 mb-1">
          <span>Demo Account Loaded:</span>
          <Badge variant={role === 'admin' ? 'primary' : 'info'} size="sm">
            {role.toUpperCase()}
          </Badge>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
          {email} • {password}
        </p>
      </div>

      {/* Register Link */}
      <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
        <span>Don't have a registered account? </span>
        <Link
          to="/register"
          className="text-primary-600 font-semibold hover:text-primary-700 hover:underline transition-colors"
        >
          Register here
        </Link>
      </div>
    </div>
  )
}
