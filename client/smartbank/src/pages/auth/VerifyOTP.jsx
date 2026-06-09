import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Mail, ArrowRight, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthLayout from '../../components/common/AuthLayout'
import { authAPI } from '../../services/api'

export default function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(300) // 5 minutes
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || ''
  const inputRefs = useRef([])

  useEffect(() => {
    if (!email) navigate('/register')
    const timer = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [email, navigate])

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

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

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = [...otp]
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    setOtp(next)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) { toast.error('Enter the complete 6-digit OTP'); return }
    setLoading(true)
    try {
      await authAPI.verifyOtp({ email, otp: code })
      toast.success('Email verified! Please sign in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await authAPI.resendOtp({ email })
      setCountdown(300)
      setOtp(['', '', '', '', '', ''])
      toast.success('New OTP sent to your email')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to resend OTP')
    } finally {
      setResending(false)
    }
  }

  return (
    <AuthLayout title="Verify your email" subtitle={`We sent a 6-digit code to ${email}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-3 py-2">
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
              onPaste={handlePaste}
              className="w-11 h-12 text-center text-xl font-bold font-display
                         border-2 border-slate-200 rounded-xl bg-white text-slate-800
                         focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20
                         transition-all duration-200"
            />
          ))}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 flex items-center gap-1.5">
            <Mail size={14} />
            Check your inbox
          </span>
          <span className={`font-mono font-semibold ${countdown < 60 ? 'text-red-500' : 'text-slate-600'}`}>
            {formatTime(countdown)}
          </span>
        </div>

        <button type="submit" className="btn-primary flex items-center justify-center gap-2" disabled={loading}>
          {loading
            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <>Verify Email <ArrowRight size={16} /></>
          }
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || countdown > 0}
            className="text-sm text-amber-600 hover:text-amber-700 font-medium disabled:text-slate-400 
                       disabled:cursor-not-allowed flex items-center gap-1.5 mx-auto"
          >
            <RefreshCw size={13} className={resending ? 'animate-spin' : ''} />
            {countdown > 0 ? `Resend in ${formatTime(countdown)}` : 'Resend OTP'}
          </button>
        </div>

        <p className="text-center text-sm text-slate-500">
          Wrong email?{' '}
          <Link to="/register" className="text-amber-600 hover:text-amber-700 font-semibold">Go back</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
