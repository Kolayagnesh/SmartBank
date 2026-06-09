import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { transactionAPI } from '../../services/api'
import { formatCurrency, formatDateTime } from '../../utils/helpers'

export default function Transactions() {
  const { accountNumber } = useParams()
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    transactionAPI.getByAccount(accountNumber)
      .then(r => setTransactions(r.data))
      .catch(() => toast.error('Failed to load transactions'))
      .finally(() => setLoading(false))
  }, [accountNumber])

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center 
                     text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="font-display font-bold text-slate-800 text-xl">Transactions</h1>
          <p className="text-slate-500 text-sm font-mono">{accountNumber}</p>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="space-y-4 py-4">
            {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-slate-200 rounded-xl animate-pulse" />)}
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-center text-slate-400 py-12 text-sm">No transactions yet.</p>
        ) : (
          <div className="space-y-1">
            {transactions.map((txn) => {
              const isIncoming = txn.destinationAccountNumber === accountNumber
              return (
                <div key={txn.transactionReference} className="table-row flex items-center gap-4 py-4 px-1">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                                  ${isIncoming ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                    {isIncoming ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 font-display">{txn.transactionType}</p>
                    <p className="text-xs text-slate-400 font-mono">
                      {isIncoming ? `From: ${txn.sourceAccountNumber}` : `To: ${txn.destinationAccountNumber}`}
                    </p>
                    <p className="text-xs text-slate-300 font-mono">{txn.transactionReference}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold font-display ${isIncoming ? 'text-emerald-600' : 'text-red-500'}`}>
                      {isIncoming ? '+' : '-'}{formatCurrency(txn.amount)}
                    </p>
                    <p className="text-xs text-slate-400">{formatDateTime(txn.transactionTime)}</p>
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
