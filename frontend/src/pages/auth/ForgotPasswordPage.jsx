import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input, Button, Badge } from '../../components/common'
import { useToast } from '../../hooks/useToast'
import {
  Mail,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
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
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 mb-3 border border-primary-100 shadow-sm">
              <KeyRound size={22} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Reset Your Password
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
              Enter your registered institutional email to receive a verification reset code.
            </p>
          </div>

          <form onSubmit={handleSendCode} className="space-y-4" noValidate>
            <Input
              id="forgot-email"
              label="Institutional Email"
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
              Send Verification Code
            </Button>
          </form>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      )}

      {/* ── STEP 2: OTP Verification ── */}
      {step === 'otp' && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-3 border border-amber-100 shadow-sm">
              <Mail size={22} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Check Your Inbox
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Enter the 6-digit code sent to <strong className="text-slate-700">{email}</strong>
            </p>
          </div>

          {/* Demo helper pill */}
          <div className="rounded-xl bg-amber-50 border border-amber-200/60 p-3 text-xs text-amber-900 flex items-center justify-between">
            <span>Demo Test PIN:</span>
            <button
              type="button"
              onClick={() => setOtp('123456')}
              className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-800 hover:bg-amber-100 transition-colors"
            >
              Click to prefill: 123456
            </button>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-4" noValidate>
            <Input
              id="otp-code"
              label="6-Digit Verification Code"
              required
              placeholder="123456"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                if (errors.otp) setErrors({})
              }}
              error={errors.otp}
              className="text-center tracking-widest text-lg font-mono"
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isSubmitting}
            >
              Verify Code
            </Button>
          </form>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep('email')}
              className="text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1"
            >
              <ArrowLeft size={13} />
              Change email
            </button>
            <button
              type="button"
              onClick={() => toast.info('Code Resent', 'A new verification code was dispatched.')}
              className="text-primary-600 hover:underline font-semibold"
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
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 mb-3 border border-primary-100 shadow-sm">
              <Lock size={22} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Create New Password
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Choose a strong password for your university credentials
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
            {/* New Password */}
            <Input
              id="reset-newpassword"
              label="New Password"
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
                  className="p-1 rounded text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {/* Confirm New Password */}
            <Input
              id="reset-confirmpassword"
              label="Confirm New Password"
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
                  className="p-1 rounded text-slate-400 hover:text-slate-600 focus:outline-none"
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
              Update Password
            </Button>
          </form>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Cancel and return to sign in</span>
            </Link>
          </div>
        </div>
      )}

      {/* ── STEP 4: Success Confirmation ── */}
      {step === 'success' && (
        <div className="space-y-6 text-center py-2 animate-in zoom-in-95 duration-200">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
            <CheckCircle2 size={30} />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Password Reset Complete!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed max-w-sm mx-auto">
              Your institutional password has been securely updated. You can now use your new credentials to access the examination platform.
            </p>
          </div>

          <div className="pt-2">
            <Button
              fullWidth
              size="lg"
              onClick={() => navigate('/login')}
            >
              Proceed to Sign In
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
