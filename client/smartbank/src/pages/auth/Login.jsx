import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthLayout from '../../components/common/AuthLayout'
import { authAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await authAPI.login(form)
      login(data)
      toast.success('Welcome back!')
      navigate(data.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard')
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Check your credentials.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your SmartBank account">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label-text">Email address</label>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-amber-400 focus-within:border-transparent transition-all duration-200">
            <Mail size={16} className="text-slate-400 shrink-0" />
            <input
              type="email"
              className="w-full bg-transparent border-0 p-0 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 font-body text-sm"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label-text mb-0">Password</label>
            <Link to="/forgot-password" className="text-xs text-amber-600 hover:text-amber-700 font-medium">
              Forgot password?
            </Link>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-amber-400 focus-within:border-transparent transition-all duration-200">
            <Lock size={16} className="text-slate-400 shrink-0" />
            <input
              type={showPw ? 'text' : 'password'}
              className="w-full bg-transparent border-0 p-0 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 font-body text-sm"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="text-slate-400 hover:text-slate-600 shrink-0"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button type="submit" className="btn-primary flex items-center justify-center gap-2" disabled={loading}>
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>Sign In <ArrowRight size={16} /></>
          )}
        </button>

        <p className="text-center text-sm text-slate-500 font-body">
          Don't have an account?{' '}
          <Link to="/register" className="text-amber-600 hover:text-amber-700 font-semibold">
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
