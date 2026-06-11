import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, Plus, ArrowRight, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { accountAPI } from '../../services/api'
import { formatCurrency, formatDateTime } from '../../utils/helpers'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    accountAPI.getDashboard()
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardSkeleton />

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm font-body">Good day,</p>
          <h1 className="font-display font-bold text-slate-800 text-2xl lg:text-3xl mt-0.5">
            {data?.name || 'Customer'} 👋
          </h1>
        </div>
        <button
          onClick={() => navigate('/accounts/create')}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 
                     text-white text-sm font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 
                     active:scale-95 transition-all shadow-lg shadow-amber-500/30 font-display"
        >
          <Plus size={15} />
          New Account
        </button>
      </div>

      {/* Hero balance card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b1225] via-[#101935] to-[#152149] p-7 text-white">
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full bg-emerald-500/10 blur-2xl" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-widest font-body mb-1">Total Portfolio</p>
              <h2 className="font-display font-bold text-4xl text-white">
                {formatCurrency(data?.totalBalance || 0)}
              </h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Wallet size={24} className="text-amber-400" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <CreditCard size={14} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] uppercase tracking-wider">Accounts</p>
                <p className="text-white font-semibold text-sm font-display">{data?.totalAccounts || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                <TrendingUp size={14} className="text-amber-400" />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] uppercase tracking-wider">Status</p>
                <p className="text-emerald-400 font-semibold text-sm font-display">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Accounts', icon: CreditCard, to: '/accounts', color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'Transfer', icon: ArrowUpRight, to: '/transfer', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { label: 'Statements', icon: ArrowDownLeft, to: '/statements', color: 'text-purple-600 bg-purple-50 border-purple-100' },
          { label: 'New Account', icon: Plus, to: '/accounts/create', color: 'text-amber-600 bg-amber-50 border-amber-100' },
        ].map(({ label, icon: Icon, to, color }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className="card flex flex-col items-center gap-3 hover:shadow-md active:scale-95 
                       transition-all duration-200 cursor-pointer text-center"
          >
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${color}`}>
              <Icon size={18} />
            </div>
            <span className="text-sm font-semibold text-slate-700 font-display">{label}</span>
          </button>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-slate-800 text-lg">Recent Transactions</h3>
          <button
            onClick={() => navigate('/accounts')}
            className="text-amber-600 hover:text-amber-700 text-sm font-semibold flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </button>
        </div>

        {data?.recentTransactions?.length === 0 ? (
          <EmptyState message="No transactions yet. Make your first transfer!" />
        ) : (
          <div className="space-y-4">
            <div className="hidden md:grid grid-cols-5 gap-4 px-6 text-[11px] uppercase tracking-widest text-slate-400 font-semibold">
              <span>Type</span>
              <span>Transaction No</span>
              <span>Amount</span>
              <span>From / To</span>
              <span>Time</span>
            </div>
            {data?.recentTransactions?.map((txn) => (
              <TransactionRow key={txn.transactionReference} txn={txn} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TransactionRow({ txn }) {
  const isCredit = isIncomingTransaction(txn)
  return (
    <div className={`table-row w-full max-w-full overflow-hidden rounded-2xl border-l-4 ${isCredit ? 'border-l-emerald-500 bg-emerald-50/35' : 'border-l-red-500 bg-red-50/35'} border border-slate-100 px-6 py-5 md:px-8 md:py-6 shadow-sm`}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-5 md:gap-4 md:items-center">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isCredit ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
            {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
          </div>
          <div className="min-w-0">
            <p className="text-xs md:text-sm font-semibold text-slate-700 font-display break-words leading-snug">{txn.transactionType}</p>
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-xs md:text-sm font-mono text-slate-600 break-all leading-snug">{txn.transactionReference}</p>
        </div>

        <div className="min-w-0">
          <p className={`text-sm font-bold font-display ${isCredit ? 'text-emerald-600' : 'text-red-500'}`}>
            {isCredit ? '+' : '-'}{formatCurrency(txn.amount)}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-xs md:text-sm font-semibold text-slate-700 font-mono break-all leading-snug">{isCredit ? `From: ${txn.sourceAccountNumber ?? '—'}` : `To: ${txn.destinationAccountNumber ?? '—'}`}</p>
        </div>

        <div className="min-w-0">
          <p className="text-sm text-slate-600">{formatDateTime(txn.transactionTime)}</p>
        </div>
      </div>
    </div>
  )
}

function isIncomingTransaction(txn) {
  const type = (txn.transactionType || '').toUpperCase()
  const amount = Number(txn.amount)

  if (['CREDIT', 'DEPOSIT', 'INCOMING', 'RECEIVED'].some((word) => type.includes(word))) {
    return true
  }

  if (['DEBIT', 'WITHDRAW', 'OUTGOING', 'SENT', 'PAYMENT'].some((word) => type.includes(word))) {
    return false
  }

  if (Number.isFinite(amount) && amount !== 0) {
    return amount > 0
  }

  return (
    type.includes('TRANSFER IN') ||
    type.includes('TRANSFER CREDIT')
  )
}

function EmptyState({ message }) {
  return (
    <div className="py-12 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <Wallet size={24} className="text-slate-400" />
      </div>
      <p className="text-slate-500 text-sm font-body">{message}</p>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="p-6 lg:p-8 space-y-8 animate-pulse">
      <div className="h-10 w-48 bg-slate-200 rounded-xl" />
      <div className="h-44 bg-slate-200 rounded-2xl" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-slate-200 rounded-2xl" />)}
      </div>
      <div className="h-64 bg-slate-200 rounded-2xl" />
    </div>
  )
}
