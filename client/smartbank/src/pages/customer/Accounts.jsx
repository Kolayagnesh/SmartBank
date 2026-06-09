import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Plus, ChevronRight, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { accountAPI } from '../../services/api'
import { formatCurrency, getAccountTypeColor } from '../../utils/helpers'

export default function Accounts() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    accountAPI.getMyAccounts()
      .then(r => setAccounts(r.data))
      .catch(() => toast.error('Failed to load accounts'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-slate-800 text-2xl">My Accounts</h1>
          <p className="text-slate-500 text-sm mt-0.5">{accounts.length} account{accounts.length !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={() => navigate('/accounts/create')}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 
                     text-white text-sm font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 
                     active:scale-95 transition-all shadow-lg shadow-amber-500/30 font-display"
        >
          <Plus size={15} />
          Open Account
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <EmptyAccounts onAdd={() => navigate('/accounts/create')} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {accounts.map((acc) => (
            <AccountCard
              key={acc.id}
              account={acc}
              onClick={() => navigate(`/accounts/${acc.accountNumber}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function AccountCard({ account, onClick }) {
  const colorClass = getAccountTypeColor(account.accountType)

  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl cursor-pointer group
                 bg-gradient-to-br from-[#0b1225] to-[#152149]
                 border border-white/10 p-6 
                 hover:shadow-2xl hover:shadow-amber-500/10 
                 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Orb */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl group-hover:bg-amber-500/20 transition-all" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-5">
          <div>
            <span className={`badge border text-[10px] uppercase tracking-wider ${colorClass}`}>
              {account.accountType}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <CreditCard size={16} className="text-amber-400" />
          </div>
        </div>

        <p className="text-slate-400 text-xs font-mono tracking-wider mb-1">
          {account.accountNumber}
        </p>
        <h3 className="font-display font-bold text-white text-2xl">
          {formatCurrency(account.balance)}
        </h3>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
          <span className="text-slate-400 text-xs">Available balance</span>
          <span className="text-amber-400 text-xs font-semibold flex items-center gap-1">
            View details <ChevronRight size={12} />
          </span>
        </div>
      </div>
    </div>
  )
}

function EmptyAccounts({ onAdd }) {
  return (
    <div className="card py-16 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-4">
        <CreditCard size={28} className="text-amber-500" />
      </div>
      <h3 className="font-display font-bold text-slate-800 text-lg mb-2">No accounts yet</h3>
      <p className="text-slate-500 text-sm mb-6 max-w-xs">
        Open your first savings or current account and start managing your money smartly.
      </p>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 
                   text-white text-sm font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 
                   active:scale-95 transition-all shadow-lg shadow-amber-500/30 font-display"
      >
        <Plus size={15} />
        Open First Account
      </button>
    </div>
  )
}
