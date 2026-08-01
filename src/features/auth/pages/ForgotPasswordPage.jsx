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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/25">
          <Mail size={24} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-surface-900 tracking-tight">
          Reset your password
        </h1>
        <p className="text-surface-500 mt-2">
          We'll email you a secure reset link.
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

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />

          <Button type="submit" loading={loading} className="w-full" size="lg">
            {loading ? 'Sending...' : 'Send reset link'}
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
