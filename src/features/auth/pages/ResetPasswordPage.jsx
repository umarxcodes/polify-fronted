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
      setError('This reset link is invalid or has expired. Please request a new one.')
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
          Password updated
        </h1>
        <p className="text-surface-500 mb-6">
          Redirecting you to sign in...
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <Card className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Reset password</h1>
          <p className="text-surface-500 mt-1">Choose a strong new password for your account.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-danger-50 border border-danger-200 text-danger-700 text-sm" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Input
            label="New password"
            type={showPassword ? "text" : "password"}
            name="password"
            icon={Lock}
            placeholder="Min. 8 characters"
            required
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          <Input
            label="Confirm password"
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            icon={Lock}
            placeholder="Repeat your password"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
          >
            {loading ? 'Updating...' : 'Update password'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-surface-600">
          <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
            Back to sign in
          </Link>
        </p>
      </Card>
    </motion.div>
  )
}
