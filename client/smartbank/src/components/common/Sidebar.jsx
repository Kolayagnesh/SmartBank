import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, CreditCard, ArrowLeftRight, FileText,
  User, LogOut, Menu, X, ChevronRight, Landmark, Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'

const navLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/accounts', icon: CreditCard, label: 'Accounts' },
  { to: '/transfer', icon: ArrowLeftRight, label: 'Transfer' },
  { to: '/statements', icon: FileText, label: 'Statements' },
  { to: '/ai-analysis', icon: Sparkles, label: 'AI Analysis' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function Sidebar({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Signed out successfully')
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-30 flex flex-col
          bg-gradient-to-b from-[#070c18] via-[#0b1225] to-[#101935]
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Landmark size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-white text-lg tracking-tight leading-none">SmartBank</h1>
            <p className="text-slate-500 text-[10px] font-medium tracking-widest uppercase mt-0.5">Banking Platform</p>
          </div>
          <button
            className="ml-auto lg:hidden text-slate-400 hover:text-white"
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* User pill */}
        <div className="mx-4 mt-5 mb-2 p-3 rounded-xl bg-white/5 border border-white/8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm font-display shrink-0">
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-xs font-semibold font-display truncate">{user?.email}</p>
            <p className="text-emerald-400 text-[10px] font-medium tracking-wide">{user?.role}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest px-3 py-2">Navigation</p>
          {navLinks.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `nav-item group ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={16} className="shrink-0" />
              <span className="flex-1">{label}</span>
              <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar mobile */}
        <header className="lg:hidden flex items-center gap-4 px-4 py-4 bg-white border-b border-slate-100">
          <button
            onClick={() => setOpen(true)}
            className="text-slate-500 hover:text-slate-700"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Landmark size={14} className="text-white" />
            </div>
            <span className="font-display font-bold text-slate-800">SmartBank</span>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
