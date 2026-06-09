import { useEffect, useState } from 'react'
import { ArrowLeftRight, CheckCircle, Copy } from 'lucide-react'
import toast from 'react-hot-toast'
import { accountAPI, transactionAPI } from '../../services/api'
import { formatCurrency } from '../../utils/helpers'

export default function Transfer() {
  const [accounts, setAccounts] = useState([])
  const [form, setForm] = useState({ fromAccountNumber: '', toAccountNumber: '', amount: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    accountAPI.getMyAccounts().then(r => {
      setAccounts(r.data)
      if (r.data.length > 0) setForm(f => ({ ...f, fromAccountNumber: r.data[0].accountNumber }))
    })
  }, [])

  const selectedAccount = accounts.find(a => a.accountNumber === form.fromAccountNumber)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.fromAccountNumber || !form.toAccountNumber || !form.amount) {
      toast.error('Fill in all fields')
      return
    }
    if (form.fromAccountNumber === form.toAccountNumber) {
      toast.error('Cannot transfer to the same account')
      return
    }
    if (Number(form.amount) <= 0) {
      toast.error('Amount must be greater than 0')
      return
    }
    setLoading(true)
    try {
      const { data } = await transactionAPI.transfer({
        fromAccountNumber: form.fromAccountNumber,
        toAccountNumber: form.toAccountNumber,
        amount: Number(form.amount),
      })
      setResult(data)
      toast.success('Transfer successful!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Transfer failed')
    } finally {
      setLoading(false)
    }
  }

  const copyRef = () => {
    navigator.clipboard.writeText(result.transactionReference)
    toast.success('Reference copied!')
  }

  if (result) {
    return (
      <div className="p-6 lg:p-8 max-w-lg mx-auto animate-fade-in">
        <div className="card flex flex-col items-center text-center py-12">
          <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center mb-5 animate-slide-up">
            <CheckCircle size={32} className="text-emerald-600" />
          </div>
          <h2 className="font-display font-bold text-slate-800 text-2xl mb-1">Transfer Successful</h2>
          <p className="text-slate-500 text-sm mb-6">{result.message}</p>

          <div className="w-full bg-slate-50 rounded-xl p-5 space-y-3 mb-6 border border-slate-100 text-left">
            <DetailRow label="Amount" value={formatCurrency(result.amount)} highlight />
            <DetailRow label="From" value={result.fromAccountNumber} mono />
            <DetailRow label="To" value={result.toAccountNumber} mono />
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Reference</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-800 font-mono text-sm font-semibold">{result.transactionReference}</span>
                <button onClick={copyRef} className="text-amber-500 hover:text-amber-600">
                  <Copy size={13} />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => { setResult(null); setForm(f => ({ ...f, toAccountNumber: '', amount: '' })) }}
            className="btn-primary"
          >
            New Transfer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-lg mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display font-bold text-slate-800 text-2xl">Transfer Money</h1>
        <p className="text-slate-500 text-sm mt-0.5">Send funds between accounts instantly</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* From account */}
        <div className="card space-y-4">
          <h3 className="font-display font-semibold text-slate-700 text-sm uppercase tracking-wider">From</h3>

          <div>
            <label className="label-text">Your Account</label>
            <select
              className="input-field"
              value={form.fromAccountNumber}
              onChange={(e) => setForm({ ...form, fromAccountNumber: e.target.value })}
              required
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.accountNumber}>
                  {acc.accountNumber} — {acc.accountType} ({formatCurrency(acc.balance)})
                </option>
              ))}
            </select>
          </div>

          {selectedAccount && (
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 text-sm">Available</span>
              <span className="font-display font-bold text-slate-800">{formatCurrency(selectedAccount.balance)}</span>
            </div>
          )}
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-full bg-amber-500 border-4 border-white shadow-lg shadow-amber-500/30 flex items-center justify-center">
            <ArrowLeftRight size={16} className="text-white" />
          </div>
        </div>

        {/* To */}
        <div className="card space-y-4">
          <h3 className="font-display font-semibold text-slate-700 text-sm uppercase tracking-wider">To</h3>
          <div>
            <label className="label-text">Destination Account Number</label>
            <input
              type="text"
              className="input-field font-mono"
              placeholder="e.g. SB123456"
              value={form.toAccountNumber}
              onChange={(e) => setForm({ ...form, toAccountNumber: e.target.value.toUpperCase() })}
              required
            />
          </div>
          <div>
            <label className="label-text">Amount</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">₹</span>
              <input
                type="number"
                className="input-field pl-8"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                min="1"
                step="0.01"
                required
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary flex items-center justify-center gap-2" disabled={loading}>
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <><ArrowLeftRight size={16} /> Transfer Now</>
          )}
        </button>
      </form>
    </div>
  )
}

function DetailRow({ label, value, mono, highlight }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-500 text-sm">{label}</span>
      <span className={`text-sm font-semibold ${mono ? 'font-mono text-slate-700' : highlight ? 'font-display text-emerald-700 text-base' : 'font-display text-slate-800'}`}>
        {value}
      </span>
    </div>
  )
}
