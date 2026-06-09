import { Landmark } from 'lucide-react'

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex w-[45%] relative overflow-hidden flex-col justify-between p-12
                      bg-gradient-to-br from-[#070c18] via-[#0b1225] to-[#152149]">
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full bg-emerald-500/10 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-40 h-40 rounded-full bg-blue-500/8 blur-2xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 
                          flex items-center justify-center shadow-xl shadow-amber-500/40">
            <Landmark size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-white text-xl tracking-tight">SmartBank</h1>
            <p className="text-slate-500 text-[10px] tracking-widest uppercase">Digital Banking</p>
          </div>
        </div>

        {/* Central graphic */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 py-8">
          {/* Floating card graphic */}
          <div className="relative w-64 h-40 mb-8 animate-float">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400/80 to-amber-600/80 
                            backdrop-blur-sm border border-amber-400/30 shadow-2xl shadow-amber-500/20 p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-amber-200/60 text-[9px] uppercase tracking-widest font-body">Account Balance</p>
                  <p className="text-white font-display font-bold text-2xl mt-1">₹24,500.00</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Landmark size={14} className="text-white" />
                </div>
              </div>
              <div>
                <p className="text-amber-100/50 text-[8px] font-mono tracking-widest">SB •••• •••• 4521</p>
                <p className="text-amber-200/60 text-[9px] mt-1 font-body">SAVINGS ACCOUNT</p>
              </div>
            </div>
            {/* shadow card behind */}
            <div className="absolute -bottom-3 left-4 right-4 h-full rounded-2xl 
                            bg-gradient-to-br from-slate-600/40 to-slate-800/40 -z-10 blur-sm" />
          </div>

          <div className="text-center">
            <h2 className="font-display font-bold text-white text-3xl leading-tight mb-3">
              Banking made<br />
              <span className="gradient-text">brilliantly simple</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-body">
              Manage your money, track transactions, and transfer funds — all in one secure platform.
            </p>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 flex gap-6">
          {[
            { value: '₹10M+', label: 'Managed' },
            { value: '50K+', label: 'Customers' },
            { value: '99.9%', label: 'Uptime' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="font-display font-bold text-amber-400 text-lg">{stat.value}</span>
              <span className="text-slate-500 text-[10px] uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Landmark size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-slate-800 text-xl">SmartBank</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="mb-7">
              <h2 className="font-display font-bold text-slate-800 text-2xl">{title}</h2>
              {subtitle && <p className="text-slate-500 text-sm mt-1 font-body">{subtitle}</p>}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
