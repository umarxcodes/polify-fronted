import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, CheckCircle, Lock } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Card } from '../../../components/ui/Card'
import { authService } from '../services/authService'
import { toast } from 'sonner'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const token = new URLSearchParams(location.search).get('token')?.trim() || ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.target)
    const password = formData.get('password')?.toString() || ''
    const confirmPassword = formData.get('confirmPassword')?.toString() || ''

    if (!token) {
      setError(
        'This reset link is invalid or has expired. Please request a new one.'
      )
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    try {
      await authService.resetPassword({ token, password, confirmPassword })
      setSuccess(true)
      toast.success('Password updated!', {
        description: 'You can now sign in with your new password.',
      })
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.')
      toast.error('Reset failed', { description: err.message })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-success-50 flex items-center justify-center text-success-500 mx-auto mb-4">
          <CheckCircle size={32} />
        </div>
        <h1 className="text-2xl font-bold text-surface-900 mb-2">
          Password updated!
        </h1>
        <p className="text-surface-500">Redirecting you to sign in...</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/25">
          <Lock size={24} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-surface-900 tracking-tight">
          Choose a new password
        </h1>
        <p className="text-surface-500 mt-2">
          Create a password you don't use elsewhere.
        </p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-danger-50 border border-danger-200 text-sm text-danger-700"
            >
              {error}
            </motion.div>
          )}

          <div className="relative">
            <Input
              label="New Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a secure password"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-surface-400 hover:text-surface-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            required
            minLength={8}
          />

          <Button type="submit" loading={loading} className="w-full" size="lg">
            {loading ? 'Updating...' : 'Update password'}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-surface-100 text-center">
          <p className="text-sm text-surface-600">
            Remember your password?{' '}
            <Link
              to="/login"
              className="text-brand-600 hover:text-brand-700 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </motion.div>
  )
}
