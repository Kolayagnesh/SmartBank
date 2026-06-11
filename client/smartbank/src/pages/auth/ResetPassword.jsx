import { useState, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthLayout from '../../components/common/AuthLayout'
import { authAPI } from '../../services/api'

export default function ResetPassword() {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || ''
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRefs = useRef([])

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) { toast.error('Enter the complete OTP'); return }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await authAPI.resetPassword({ email, otp: code, newPassword })
      toast.success('Password reset successfully!')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Reset password" subtitle="Enter the OTP from your email and set a new password">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label-text">6-digit OTP</label>
          <div className="grid grid-cols-6 gap-2 mt-1 max-w-sm mx-auto">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-full h-11 text-center text-lg font-bold font-display
                           border-2 border-slate-200 rounded-xl bg-white text-slate-800
                           focus:outline-none focus:border-amber-400 transition-all"
              />
            ))}
          </div>
        </div>

        <div>
          <label className="label-text">New password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPw ? 'text' : 'password'}
              className="input-field pl-12 pr-12"
              placeholder="Min. 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button type="submit" className="btn-primary flex items-center justify-center gap-2" disabled={loading}>
          {loading
            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <>Reset Password <ArrowRight size={16} /></>
          }
        </button>

        <p className="text-center text-sm text-slate-500">
          <Link to="/login" className="text-amber-600 hover:text-amber-700 font-semibold">Back to Sign In</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
