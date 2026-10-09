import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input, Button } from '../../components/common'
import { useToast } from '../../hooks/useToast'
import {
  User,
  IdCard,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  CheckCircle2,
} from 'lucide-react'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const STUDENT_ID_REGEX = /^[0-9]{2}[A-Za-z]{3}[0-9]{4}$/i // e.g. 24BCE1234

export default function RegisterPage() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validation errors & touched map
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Compute password criteria
  const passwordCriteria = {
    length: formData.password.length >= 8,
    hasUpper: /[A-Z]/.test(formData.password),
    hasLower: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecial: /[^A-Za-z0-9]/.test(formData.password),
  }

  // Calculate score (0 to 4)
  const passedCount = [
    passwordCriteria.length,
    passwordCriteria.hasUpper && passwordCriteria.hasLower,
    passwordCriteria.hasNumber,
    passwordCriteria.hasSpecial,
  ].filter(Boolean).length

  const strengthConfig = [
    { label: 'Very Weak', color: 'bg-zinc-800', text: 'text-zinc-500' },
    { label: 'Weak',      color: 'bg-red-500',   text: 'text-red-400' },
    { label: 'Fair',      color: 'bg-amber-500', text: 'text-amber-400' },
    { label: 'Good',      color: 'bg-amber-500', text: 'text-amber-400' },
    { label: 'Strong',    color: 'bg-emerald-500', text: 'text-emerald-400' },
  ]

  const currentStrength = formData.password.length === 0 ? 0 : passedCount
  const strengthInfo = strengthConfig[currentStrength] || strengthConfig[0]

  const validateField = (field, value, allValues = formData) => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Full name is required'
        if (value.trim().length < 2) return 'Name must be at least 2 characters'
        return null
      case 'studentId':
        if (!value.trim()) return 'Student ID is required (e.g. 24BCE1234)'
        if (value.trim().length < 5) return 'Invalid Student ID format'
        return null
      case 'email':
        if (!value.trim()) return 'Institutional email is required'
        if (!EMAIL_REGEX.test(value.trim())) return 'Enter a valid institutional email (e.g. name@vit.ac.in)'
        return null
      case 'password':
        if (!value) return 'Password is required'
        if (value.length < 8) return 'Password must be at least 8 characters'
        if (!passwordCriteria.hasUpper) return 'Include at least one uppercase letter'
        if (!passwordCriteria.hasLower) return 'Include at least one lowercase letter'
        if (!passwordCriteria.hasNumber && !passwordCriteria.hasSpecial) return 'Include at least one number or special character'
        return null
      case 'confirmPassword':
        if (!value) return 'Please confirm your password'
        if (value !== allValues.password) return 'Passwords do not match'
        return null
      default:
        return null
    }
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const err = validateField(field, formData[field], formData)
    setErrors((prev) => ({ ...prev, [field]: err }))
  }

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)

    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value, updated) }))
    }

    // When password changes, re-validate confirmPassword if already touched
    if (field === 'password' && touched.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateField('confirmPassword', formData.confirmPassword, updated),
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {
      name: validateField('name', formData.name, formData),
      studentId: validateField('studentId', formData.studentId, formData),
      email: validateField('email', formData.email, formData),
      password: validateField('password', formData.password, formData),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword, formData),
    }

    setErrors(newErrors)
    setTouched({
      name: true,
      studentId: true,
      email: true,
      password: true,
      confirmPassword: true,
    })

    const hasError = Object.values(newErrors).some((err) => err !== null)
    if (hasError) return

    setIsSubmitting(true)
    // Simulate API registration call delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsSubmitting(false)

    toast.success(
      'Registration Complete',
      `Student account registered for ${formData.name} (${formData.studentId}). You may now sign in.`
    )
    navigate('/login')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl font-semibold text-zinc-50">Create student account</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Enroll for official university online examinations.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Full Name */}
        <Input
          id="reg-name"
          label="Full name"
          required
          placeholder="e.g. Harsh Pathak"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          leftIcon={<User size={16} />}
          error={errors.name}
          autoComplete="name"
        />

        {/* Student ID */}
        <Input
          id="reg-studentid"
          label="Student registration ID"
          required
          placeholder="e.g. 24BCE1234"
          value={formData.studentId}
          onChange={(e) => handleChange('studentId', e.target.value.toUpperCase())}
          onBlur={() => handleBlur('studentId')}
          leftIcon={<IdCard size={16} />}
          error={errors.studentId}
          helperText="Format: 24BCE1234 (Year + Branch + Roll)"
        />

        {/* Institutional Email */}
        <Input
          id="reg-email"
          label="Institutional email"
          type="email"
          required
          placeholder="harsh.pathak@vit.ac.in"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          leftIcon={<Mail size={16} />}
          error={errors.email}
          autoComplete="email"
        />

        {/* Password */}
        <div>
          <Input
            id="reg-password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="At least 8 characters"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            leftIcon={<Lock size={16} />}
            error={errors.password}
            autoComplete="new-password"
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

          {/* Password Strength Indicator */}
          {formData.password.length > 0 && (
            <div className="mt-2 space-y-2 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-400">Strength</span>
                <span className={`font-semibold ${strengthInfo.text}`}>
                  {strengthInfo.label}
                </span>
              </div>

              {/* Strength Progress Segments */}
              <div className="grid h-1 grid-cols-4 gap-1">
                {[1, 2, 3, 4].map((seg) => (
                  <div
                    key={seg}
                    className={`rounded-full transition-colors ${
                      currentStrength >= seg ? strengthInfo.color : 'bg-zinc-800'
                    }`}
                  />
                ))}
              </div>

              {/* Requirement Checklist */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-zinc-400">
                <span className={`flex items-center gap-1 ${passwordCriteria.length ? 'text-emerald-400' : ''}`}>
                  {passwordCriteria.length ? <CheckCircle2 size={12} /> : <span className="w-3 h-3 rounded-full border border-zinc-700 inline-block" />}
                  8+ characters
                </span>
                <span className={`flex items-center gap-1 ${passwordCriteria.hasUpper && passwordCriteria.hasLower ? 'text-emerald-400' : ''}`}>
                  {passwordCriteria.hasUpper && passwordCriteria.hasLower ? <CheckCircle2 size={12} /> : <span className="w-3 h-3 rounded-full border border-zinc-700 inline-block" />}
                  Upper & lower
                </span>
                <span className={`flex items-center gap-1 ${passwordCriteria.hasNumber ? 'text-emerald-400' : ''}`}>
                  {passwordCriteria.hasNumber ? <CheckCircle2 size={12} /> : <span className="w-3 h-3 rounded-full border border-zinc-700 inline-block" />}
                  At least 1 number
                </span>
                <span className={`flex items-center gap-1 ${passwordCriteria.hasSpecial ? 'text-emerald-400' : ''}`}>
                  {passwordCriteria.hasSpecial ? <CheckCircle2 size={12} /> : <span className="w-3 h-3 rounded-full border border-zinc-700 inline-block" />}
                  Special symbol
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <Input
          id="reg-confirmpassword"
          label="Confirm password"
          type={showConfirmPassword ? 'text' : 'password'}
          required
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          onBlur={() => handleBlur('confirmPassword')}
          leftIcon={<Lock size={16} />}
          error={errors.confirmPassword}
          autoComplete="new-password"
          rightSlot={
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              className="rounded p-1 text-zinc-500 transition-colors hover:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isSubmitting}
          rightIcon={<UserPlus size={16} />}
          className="!mt-6"
        >
          Create account
        </Button>
      </form>

      {/* Back to Login Link */}
      <p className="border-t border-zinc-800 pt-6 text-center text-sm text-zinc-400">
        Already have an account?{' '}
        <Link to="/login" className="text-link">
          Sign in
        </Link>
      </p>
    </div>
  )
}
