import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input, Button, Badge } from '../../components/common'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  const { toast } = useToast()

  const [role, setRole] = useState('student') // 'student' | 'admin'
  const [email, setEmail] = useState('harsh.pathak@vit.ac.in')
  const [password, setPassword] = useState('password123')
  const [errors, setErrors] = useState({})

  const handleRoleChange = (newRole) => {
    setRole(newRole)
    if (newRole === 'admin') {
      setEmail('ramesh.kumar@vit.ac.in')
    } else {
      setEmail('harsh.pathak@vit.ac.in')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!email) newErrors.email = 'Email is required'
    if (!password) newErrors.password = 'Password is required'
    if (password && password.length < 6) newErrors.password = 'Minimum 6 characters'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await login({ email, password, role })
      toast.success('Welcome back', `Logged in as ${role === 'admin' ? 'Administrator' : 'Student'}`)
      navigate(role === 'admin' ? '/admin/dashboard' : '/student/dashboard')
    } catch (err) {
      toast.error('Authentication Failed', err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sign In to Your Account</h2>
        <p className="text-xs text-slate-500 mt-1">Select your portal role to continue</p>
      </div>

      {/* Role Toggle Selector */}
      <div className="flex p-1 bg-slate-100 rounded-xl">
        <button
          type="button"
          onClick={() => handleRoleChange('student')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            role === 'student'
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Student Portal
        </button>
        <button
          type="button"
          onClick={() => handleRoleChange('admin')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            role === 'admin'
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Admin Portal
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          label="Institutional Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@vit.ac.in"
          leftIcon={<Mail size={16} />}
          error={errors.email}
        />

        <Input
          id="password"
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          leftIcon={<Lock size={16} />}
          error={errors.password}
          helperText="Mock authentication enabled"
        />

        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          rightIcon={<LogIn size={16} />}
        >
          Sign In
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
        <span>Don't have an account? </span>
        <Link to="/register" className="text-primary-600 font-semibold hover:underline">
          Register here
        </Link>
      </div>
    </div>
  )
}
