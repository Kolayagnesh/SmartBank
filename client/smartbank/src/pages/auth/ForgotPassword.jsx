import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthLayout from '../../components/common/AuthLayout'
import { authAPI } from '../../services/api'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authAPI.forgotPassword({ email })
      toast.success('Reset OTP sent to your email')
      navigate('/reset-password', { state: { email } })
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Forgot password?" subtitle="Enter your email to receive a reset code">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label-text">Email address</label>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-amber-400 focus-within:border-transparent transition-all duration-200">
            <Mail size={16} className="text-slate-400 shrink-0" />
            <input
              type="email"
              className="w-full bg-transparent border-0 p-0 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 font-body text-sm"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-primary flex items-center justify-center gap-2" disabled={loading}>
          {loading
            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <>Send Reset Code <ArrowRight size={16} /></>
          }
        </button>

        <p className="text-center text-sm text-slate-500">
          Remember your password?{' '}
          <Link to="/login" className="text-amber-600 hover:text-amber-700 font-semibold">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
