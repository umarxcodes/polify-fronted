import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Mail, CheckCircle } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Card } from '../../../components/ui/Card'
import { authService } from '../services/authService'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.target)
    const email = formData.get('email')?.toString().trim() || ''

    try {
      await authService.forgotPassword({ email })
      setSent(true)
      toast.success('Reset link sent!', {
        description: 'Please check your email for instructions.',
      })
    } catch (err) {
      setError(err.message || 'Failed to send reset link. Please try again.')
      toast.error('Request failed', { description: err.message })
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
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
          Check your email
        </h1>
        <p className="text-surface-500 mb-6">
          If an account exists for that email, we've sent reset instructions.
        </p>
        <Link to="/login">
          <Button variant="primary">Back to sign in</Button>
        </Link>
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
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Forgot password?</h1>
          <p className="text-surface-500 mt-1">Enter your email and we'll send you a reset link.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-danger-50 border border-danger-200 text-danger-700 text-sm" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Input
            label="Email address"
            type="email"
            name="email"
            icon={Mail}
            placeholder="you@example.com"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
          >
            {loading ? 'Sending...' : 'Send reset link'}
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
