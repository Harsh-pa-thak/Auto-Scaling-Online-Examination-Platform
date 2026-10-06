import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input, Button, Select } from '../../components/common'
import { useToast } from '../../hooks/useToast'
import { User, Mail, Lock, UserPlus } from 'lucide-react'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    branch: 'CSE',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!formData.name) errs.name = 'Full name is required'
    if (!formData.studentId) errs.studentId = 'Student ID is required (e.g. 24BCE1234)'
    if (!formData.email) errs.email = 'Institutional email is required'
    if (!formData.password || formData.password.length < 6)
      errs.password = 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = 'Passwords do not match'

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    toast.success('Registration successful', 'Your student account has been created.')
    navigate('/login')
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Create Student Account</h2>
        <p className="text-xs text-slate-500 mt-1">Register for online university assessments</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          id="name"
          label="Full Name"
          required
          placeholder="e.g. Harsh Pathak"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          leftIcon={<User size={16} />}
          error={errors.name}
        />

        <Input
          id="studentId"
          label="Registration Number / Student ID"
          required
          placeholder="e.g. 24BCE1234"
          value={formData.studentId}
          onChange={(e) => handleChange('studentId', e.target.value)}
          error={errors.studentId}
        />

        <Input
          id="email"
          label="University Email"
          type="email"
          required
          placeholder="harsh.pathak@vit.ac.in"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          leftIcon={<Mail size={16} />}
          error={errors.email}
        />

        <Select
          id="branch"
          label="Academic Branch"
          value={formData.branch}
          onChange={(e) => handleChange('branch', e.target.value)}
          options={[
            { value: 'CSE', label: 'Computer Science & Engineering' },
            { value: 'IT', label: 'Information Technology' },
            { value: 'ECE', label: 'Electronics & Communication' },
            { value: 'EE', label: 'Electrical Engineering' },
          ]}
        />

        <Input
          id="password"
          label="Password"
          type="password"
          required
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          leftIcon={<Lock size={16} />}
          error={errors.password}
        />

        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          required
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
        />

        <div className="pt-2">
          <Button
            type="submit"
            fullWidth
            rightIcon={<UserPlus size={16} />}
          >
            Create Account
          </Button>
        </div>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
        <span>Already have an account? </span>
        <Link to="/login" className="text-primary-600 font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  )
}
