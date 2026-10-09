import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input, Button } from '../../components/common'
import { useToast } from '../../hooks/useToast'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { toast } = useToast()

  // Steps: 'email' (1) -> 'otp' (2) -> 'new_password' (3) -> 'success' (4)
  const [step, setStep] = useState('email')

  // Form values
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // UI state
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  // Password criteria for step 3
  const passwordCriteria = {
    length: newPassword.length >= 8,
    hasUpper: /[A-Z]/.test(newPassword),
    hasLower: /[a-z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
  }

  // ── Step 1: Send reset instructions ──
  const handleSendCode = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setErrors({ email: 'Please enter your registered email' })
      return
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setErrors({ email: 'Please enter a valid email format' })
      return
    }

    setErrors({})
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setIsSubmitting(false)

    toast.info('Verification Code Sent', 'A 6-digit mock code (123456) was dispatched to your email.')
    setStep('otp')
  }

  // ── Step 2: Verify code ──
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!otp.trim()) {
      setErrors({ otp: 'Please enter the 6-digit code' })
      return
    }
    if (otp.trim().length < 6) {
      setErrors({ otp: 'Verification code must be 6 digits' })
      return
    }

    setErrors({})
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setIsSubmitting(false)

    // Accept 123456 or any 6 digits for mock testing
    toast.success('Code Verified', 'Please set your new password.')
    setStep('new_password')
  }

  // ── Step 3: Set new password ──
  const handleResetPassword = async (e) => {
    e.preventDefault()
    const errs = {}

    if (!newPassword) errs.newPassword = 'New password is required'
    else if (newPassword.length < 8) errs.newPassword = 'Password must be at least 8 characters'

    if (!confirmPassword) errs.confirmPassword = 'Please confirm your new password'
    else if (confirmPassword !== newPassword) errs.confirmPassword = 'Passwords do not match'

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setErrors({})
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 700))
    setIsSubmitting(false)

    toast.success('Password Updated', 'Your account credentials have been reset.')
    setStep('success')
  }

  return (
    <div className="space-y-6">
      {/* ── STEP 1: Email Request ── */}
      {step === 'email' && (
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-zinc-50">Reset your password</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Enter your registered institutional email to receive a verification reset code.
            </p>
          </div>

          <form onSubmit={handleSendCode} className="space-y-4" noValidate>
            <Input
              id="forgot-email"
              label="Institutional email"
              type="email"
              required
              placeholder="e.g. harsh.pathak@vit.ac.in"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors({})
              }}
              leftIcon={<Mail size={16} />}
              error={errors.email}
              helperText="We will send a 6-digit temporary verification PIN"
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isSubmitting}
            >
              Send verification code
            </Button>
          </form>

          <div className="border-t border-zinc-800 pt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
            >
              <ArrowLeft size={14} />
              <span>Back to sign in</span>
            </Link>
          </div>
        </div>
      )}

      {/* ── STEP 2: OTP Verification ── */}
      {step === 'otp' && (
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-zinc-50">Check your inbox</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Enter the 6-digit code sent to <strong className="text-zinc-200">{email}</strong>
            </p>
          </div>

          <p className="text-center text-xs text-zinc-500">
            Demo mode: the code is{' '}
            <button
              type="button"
              onClick={() => setOtp('123456')}
              className="font-medium tabular-nums text-amber-400 hover:text-amber-300"
            >
              123456
            </button>{' '}
            (click to fill).
          </p>

          <form onSubmit={handleVerifyOtp} className="space-y-4" noValidate>
            <Input
              id="otp-code"
              label="6-digit verification code"
              required
              placeholder="123456"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                if (errors.otp) setErrors({})
              }}
              error={errors.otp}
              className="text-center tracking-widest text-lg tabular-nums"
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isSubmitting}
            >
              Verify code
            </Button>
          </form>

          <div className="flex items-center justify-between border-t border-zinc-800 pt-6 text-sm">
            <button
              type="button"
              onClick={() => setStep('email')}
              className="inline-flex items-center gap-2 font-medium text-zinc-400 transition-colors hover:text-zinc-100"
            >
              <ArrowLeft size={14} />
              Change email
            </button>
            <button
              type="button"
              onClick={() => toast.info('Code Resent', 'A new verification code was dispatched.')}
              className="font-medium text-amber-400 hover:text-amber-300"
            >
              Resend code
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Set New Password ── */}
      {step === 'new_password' && (
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-zinc-50">Create a new password</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Choose a strong password for your university credentials.
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
            {/* New Password */}
            <Input
              id="reset-newpassword"
              label="New password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="At least 8 characters"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: null }))
              }}
              leftIcon={<Lock size={16} />}
              error={errors.newPassword}
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

            {/* Confirm New Password */}
            <Input
              id="reset-confirmpassword"
              label="Confirm new password"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              placeholder="Re-enter your new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }))
              }}
              leftIcon={<Lock size={16} />}
              error={errors.confirmPassword}
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
            >
              Update password
            </Button>
          </form>

          <div className="border-t border-zinc-800 pt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
            >
              <ArrowLeft size={14} />
              <span>Cancel and return to sign in</span>
            </Link>
          </div>
        </div>
      )}

      {/* ── STEP 4: Success Confirmation ── */}
      {step === 'success' && (
        <div className="space-y-6 text-center">
          <CheckCircle2 size={32} className="mx-auto text-emerald-400" />

          <div>
            <h1 className="text-xl font-semibold text-zinc-50">Password updated</h1>
            <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-400">
              Your institutional password has been securely updated. You can now use your new credentials to access the examination platform.
            </p>
          </div>

          <Button
            fullWidth
            size="lg"
            onClick={() => navigate('/login')}
          >
            Continue to sign in
          </Button>
        </div>
      )}
    </div>
  )
}
