import { useEffect, useState } from 'react'
import { Download, FileText, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import { accountAPI, statementAPI } from '../../services/api'
import { downloadBlob } from '../../utils/helpers'

export default function Statements() {
  const [accounts, setAccounts] = useState([])
  const [form, setForm] = useState({ accountId: '', from: '', to: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    accountAPI.getMyAccounts().then(r => {
      setAccounts(r.data)
      if (r.data.length > 0) setForm(f => ({ ...f, accountId: r.data[0].accountNumber }))
    })
  }, [])

  const handleDownload = async (e) => {
    e.preventDefault()
    if (!form.accountId || !form.from || !form.to) {
      toast.error('Fill all fields')
      return
    }
    if (form.from > form.to) {
      toast.error('Start date must be before end date')
      return
    }
    setLoading(true)
    try {
      const { data } = await statementAPI.download(form.accountId, form.from, form.to)
      downloadBlob(data, `statement-${form.accountId}-${form.from}-to-${form.to}.pdf`)
      toast.success('Statement downloaded!')
    } catch {
      toast.error('Failed to download statement')
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display font-bold text-slate-800 text-2xl">Account Statements</h1>
        <p className="text-slate-500 text-sm mt-0.5">Download your transaction history as a PDF</p>
      </div>

      {/* Illustration card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b1225] to-[#152149] p-7 mb-6">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-amber-500/10 blur-2xl" />
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
            <FileText size={28} className="text-amber-400" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-lg">PDF Statement</h3>
            <p className="text-slate-400 text-sm mt-0.5">Download a detailed PDF with all transactions for your selected date range.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleDownload} className="card space-y-5">
        <div>
          <label className="label-text">Account</label>
          <select
            className="input-field"
            value={form.accountId}
            onChange={(e) => setForm({ ...form, accountId: e.target.value })}
            required
          >
            <option value="">Select account</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.accountNumber}>
                {acc.accountNumber} — {acc.accountType}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-text">From Date</label>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-amber-400 focus-within:border-transparent transition-all duration-200">
              <Calendar size={15} className="text-slate-400 shrink-0" />
              <input
                type="date"
                className="w-full bg-transparent border-0 p-0 text-slate-800 focus:outline-none focus:ring-0 font-body text-sm"
                value={form.from}
                max={today}
                onChange={(e) => setForm({ ...form, from: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label className="label-text">To Date</label>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-amber-400 focus-within:border-transparent transition-all duration-200">
              <Calendar size={15} className="text-slate-400 shrink-0" />
              <input
                type="date"
                className="w-full bg-transparent border-0 p-0 text-slate-800 focus:outline-none focus:ring-0 font-body text-sm"
                value={form.to}
                max={today}
                onChange={(e) => setForm({ ...form, to: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary flex items-center justify-center gap-2" disabled={loading}>
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <><Download size={16} /> Download PDF Statement</>
          )}
        </button>
      </form>

      {/* Tips */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { icon: '📊', title: 'All Transactions', desc: 'Full credit & debit history' },
          { icon: '🔒', title: 'Secure PDF', desc: 'Digitally verified document' },
          { icon: '⚡', title: 'Instant Download', desc: 'Ready in seconds' },
        ].map((tip) => (
          <div key={tip.title} className="card text-center py-4 px-3">
            <div className="text-2xl mb-2">{tip.icon}</div>
            <p className="text-slate-700 text-xs font-semibold font-display">{tip.title}</p>
            <p className="text-slate-400 text-[11px] mt-0.5">{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
