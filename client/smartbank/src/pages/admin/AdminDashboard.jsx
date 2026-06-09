import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Users, CreditCard, TrendingUp, LogOut, Landmark } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function AdminDashboard() {
  const [welcome, setWelcome] = useState('')
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    adminAPI.getDashboard()
      .then(r => setWelcome(typeof r.data === 'string' ? r.data : 'Welcome Admin'))
      .catch(() => setWelcome('Welcome Admin'))
  }, [])

  const handleLogout = () => {
    logout()
    toast.success('Signed out')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#070c18] via-[#0b1225] to-[#101935]">
      {/* Grid pattern */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/40">
              <Landmark size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-white text-xl">SmartBank</h1>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest">Admin Console</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/30 
                       text-red-400 hover:bg-red-500/10 transition-all text-sm font-semibold"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>

        {/* Welcome */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Shield size={15} className="text-amber-400" />
            </div>
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-wider">Admin Panel</span>
          </div>
          <h2 className="font-display font-bold text-white text-4xl">
            {welcome || 'Welcome Admin'}
          </h2>
          <p className="text-slate-400 mt-2">System overview and management dashboard</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: 'Total Users', value: '—', color: 'text-blue-400 bg-blue-500/20 border-blue-500/30' },
            { icon: CreditCard, label: 'Total Accounts', value: '—', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' },
            { icon: TrendingUp, label: 'Transactions', value: '—', color: 'text-amber-400 bg-amber-500/20 border-amber-500/30' },
            { icon: Shield, label: 'System Status', value: 'Active', color: 'text-green-400 bg-green-500/20 border-green-500/30' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="glass-card rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${color}`}>
                <Icon size={18} />
              </div>
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{label}</p>
              <p className="font-display font-bold text-white text-2xl">{value}</p>
            </div>
          ))}
        </div>

        {/* Info panel */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-display font-semibold text-white text-lg mb-4">Admin Access</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            You are logged in as an administrator. This panel provides system-level access to monitor
            platform activity, manage users, and oversee account operations.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-sm font-medium">All systems operational</span>
          </div>
        </div>
      </div>
    </div>
  )
}
