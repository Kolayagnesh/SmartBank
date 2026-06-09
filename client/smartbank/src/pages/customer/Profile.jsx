import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Shield, LogOut, Key } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Signed out successfully')
    navigate('/login')
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto animate-fade-in">
      <h1 className="font-display font-bold text-slate-800 text-2xl mb-6">Profile</h1>

      {/* Avatar card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b1225] to-[#152149] p-7 mb-6 flex items-center gap-5">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-amber-500/10 blur-2xl" />
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
          <span className="font-display font-bold text-amber-400 text-2xl">
            {user?.email?.[0]?.toUpperCase()}
          </span>
        </div>
        <div className="relative z-10">
          <h2 className="font-display font-bold text-white text-xl">{user?.email}</h2>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-emerald-400 text-xs font-medium">{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="card space-y-4 mb-4">
        <h3 className="font-display font-semibold text-slate-700 text-sm">Account Information</h3>

        <div className="space-y-3">
          {[
            { icon: Mail, label: 'Email Address', value: user?.email },
            { icon: Shield, label: 'Role', value: user?.role },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                <Icon size={15} className="text-amber-600" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">{label}</p>
                <p className="text-slate-800 font-semibold text-sm font-display">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={() => navigate('/forgot-password')}
          className="w-full card flex items-center gap-3 hover:shadow-md active:scale-95 transition-all text-left"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
            <Key size={15} className="text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-700 text-sm font-display">Change Password</p>
            <p className="text-slate-400 text-xs">Update your account password</p>
          </div>
        </button>

        <button
          onClick={handleLogout}
          className="w-full card flex items-center gap-3 hover:shadow-md active:scale-95 
                     transition-all text-left border-red-100 hover:border-red-200"
        >
          <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center">
            <LogOut size={15} className="text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-red-600 text-sm font-display">Sign Out</p>
            <p className="text-slate-400 text-xs">Sign out of your account</p>
          </div>
        </button>
      </div>
    </div>
  )
}
