import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { accountAPI, transactionAPI } from '../../services/api'
import { formatCurrency, formatDateTime, getAccountTypeColor } from '../../utils/helpers'

export default function AccountDetail() {
  const { accountNumber } = useParams()
  const navigate = useNavigate()
  const [account, setAccount] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const [accRes, txnRes] = await Promise.all([
        accountAPI.getAccount(accountNumber),
        transactionAPI.getByAccount(accountNumber),
      ])
      setAccount(accRes.data)
      setTransactions(txnRes.data)
    } catch {
      toast.error('Failed to load account details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [accountNumber])

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-6 animate-pulse max-w-4xl mx-auto">
        <div className="h-10 w-32 bg-slate-200 rounded-xl" />
        <div className="h-44 bg-slate-200 rounded-2xl" />
        <div className="h-64 bg-slate-200 rounded-2xl" />
      </div>
    )
  }

  if (!account) return null

  const colorClass = getAccountTypeColor(account.accountType)

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/accounts')}
          className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center 
                     text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="font-display font-bold text-slate-800 text-xl">Account Details</h1>
          <p className="text-slate-500 text-sm font-mono">{accountNumber}</p>
        </div>
        <button
          onClick={load}
          className="ml-auto w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center 
                     text-slate-500 hover:text-amber-600 transition-all"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Account hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b1225] via-[#101935] to-[#152149] p-7">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <span className={`badge border text-[10px] uppercase tracking-wider ${colorClass}`}>
              {account.accountType}
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <CreditCard size={18} className="text-amber-400" />
            </div>
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Available Balance</p>
          <h2 className="font-display font-bold text-white text-4xl mb-2">{formatCurrency(account.balance)}</h2>
          <p className="text-slate-500 text-sm font-mono">{account.accountNumber}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/transfer')}
          className="card flex items-center gap-3 hover:shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <ArrowUpRight size={18} className="text-emerald-600" />
          </div>
          <span className="font-semibold text-slate-700 font-display">Transfer</span>
        </button>
        <button
          onClick={() => navigate('/statements')}
          className="card flex items-center gap-3 hover:shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
            <ArrowDownLeft size={18} className="text-amber-600" />
          </div>
          <span className="font-semibold text-slate-700 font-display">Statement</span>
        </button>
      </div>

      {/* Transactions */}
      <div className="card">
        <h3 className="font-display font-bold text-slate-800 text-lg mb-5">Transaction History</h3>
        {transactions.length === 0 ? (
          <p className="text-center text-slate-400 py-10 text-sm">No transactions for this account yet.</p>
        ) : (
          <div className="space-y-4">
            <div className="hidden md:grid grid-cols-5 gap-4 px-6 text-[11px] uppercase tracking-widest text-slate-400 font-semibold">
              <span>Type</span>
              <span>Transaction No</span>
              <span>Amount</span>
              <span>From / To</span>
              <span>Time</span>
            </div>
            {transactions.map((txn) => {
              const isIncoming = txn.destinationAccountNumber === accountNumber
              return (
                <div key={txn.transactionReference} className="table-row w-full max-w-full overflow-hidden rounded-2xl border border-slate-100 bg-white px-6 py-5 md:px-8 md:py-6 shadow-sm">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-5 md:gap-4 md:items-center">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isIncoming ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                        {isIncoming ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs md:text-sm font-semibold text-slate-700 font-display break-words leading-snug">{txn.transactionType}</p>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs md:text-sm font-mono text-slate-600 break-all leading-snug">{txn.transactionReference}</p>
                    </div>

                    <div className="min-w-0">
                      <p className={`text-sm font-bold font-display ${isIncoming ? 'text-emerald-600' : 'text-red-500'}`}>
                        {isIncoming ? '+' : '-'}{formatCurrency(txn.amount)}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs md:text-sm font-semibold text-slate-700 font-mono break-all leading-snug">
                        {isIncoming ? `From: ${txn.sourceAccountNumber}` : `To: ${txn.destinationAccountNumber}`}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm text-slate-600">{formatDateTime(txn.transactionTime)}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
