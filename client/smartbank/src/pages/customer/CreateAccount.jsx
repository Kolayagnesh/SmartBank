import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { paymentAPI } from '../../services/api'

const ACCOUNT_TYPES = ['SAVINGS', 'CURRENT', 'FIXED_DEPOSIT']

export default function CreateAccount() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ accountType: 'SAVINGS', openingBalance: 1000 })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)

  const handlePay = async () => {

    console.log(import.meta.env)
    console.log(import.meta.env.VITE_RAZORPAY_KEY)
    if (!form.accountType) { toast.error('Select an account type'); return }
    if (form.openingBalance < 1000) { toast.error('Minimum opening balance is ₹1,000'); return }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY

    if (!razorpayKey) {
      toast.error('Razorpay key is missing. Set VITE_RAZORPAY_KEY in your .env file.')
      return
    }

    if (!window.Razorpay) {
      toast.error('Razorpay checkout script is not loaded.')
      return
    }

    setLoading(true)
    try {
      // Step 1: Create Razorpay order
      const { data: order } = await paymentAPI.createOrder({ amount: form.openingBalance })

      if (!order?.id || !order?.amount) {
        throw new Error('Invalid Razorpay order response')
      }

      // Step 2: Launch Razorpay checkout
      const options = {
  key: razorpayKey,
  amount: order.amount,
  currency: order.currency || 'INR',
  name: 'SmartBank',
  description: `Open ${form.accountType} Account`,
  order_id: order.id,

  handler: async (response) => {
    try {

      console.log("PAYMENT RESPONSE:", response)

      const { data: account } =
        await paymentAPI.verifyAndCreate({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
          accountRequest: {
            accountType: form.accountType,
            openingBalance: form.openingBalance
          }
        })

      setLoading(false)
      setSuccess(account)

      toast.success(
        'Account opened successfully!'
      )

    } catch (err) {

      console.error(
        "VERIFY ERROR:",
        err.response?.data || err
      )

      setLoading(false)

      toast.error(
        err.response?.data?.error ||
        'Payment verification failed'
      )
    }
  },

  prefill: {
    email:
      localStorage.getItem('email') || ''
  },

  theme: {
    color: '#f59e0b'
  },

  modal: {
    ondismiss: () => {
      console.log("Razorpay Closed")
      setLoading(false)
    }
  }
}

console.log("========== RAZORPAY DEBUG ==========")
console.log("KEY:", razorpayKey)
console.log("ORDER:", order)
console.log("ORDER ID:", order?.id)
console.log("ORDER AMOUNT:", order?.amount)
console.log("OPTIONS:", options)
console.log("====================================")

const rzp =
  new window.Razorpay(options)

rzp.open()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to initiate payment')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="p-6 lg:p-8 max-w-lg mx-auto animate-fade-in">
        <div className="card flex flex-col items-center text-center py-12">
          <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center mb-5">
            <CheckCircle size={32} className="text-emerald-600" />
          </div>
          <h2 className="font-display font-bold text-slate-800 text-2xl mb-2">Account Opened!</h2>
          <p className="text-slate-500 text-sm mb-6">Your {success.accountType} account is ready to use.</p>

          <div className="w-full bg-slate-50 rounded-xl p-5 space-y-3 mb-6 text-left border border-slate-100">
            <Detail label="Account Number" value={success.accountNumber} mono />
            <Detail label="Account Type" value={success.accountType} />
            <Detail label="Opening Balance" value={`₹${success.balance?.toLocaleString('en-IN')}`} />
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={() => navigate('/accounts')}
              className="btn-secondary"
            >
              View Accounts
            </button>
            <button
              onClick={() => { setSuccess(null); setForm({ accountType: 'SAVINGS', openingBalance: 1000 }) }}
              className="btn-primary"
            >
              Open Another
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-lg mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/accounts')}
          className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center 
                     text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="font-display font-bold text-slate-800 text-xl">Open New Account</h1>
          <p className="text-slate-500 text-sm">Payment required to activate</p>
        </div>
      </div>

      <div className="card space-y-6">
        {/* Account type */}
        <div>
          <label className="label-text">Account Type</label>
          <div className="grid grid-cols-3 gap-3">
            {ACCOUNT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setForm({ ...form, accountType: type })}
                className={`p-3.5 rounded-xl border-2 text-sm font-semibold font-display transition-all
                  ${form.accountType === type
                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
              >
                {type.replace('_', '\n')}
              </button>
            ))}
          </div>
        </div>

        {/* Opening balance */}
        <div>
          <label className="label-text">Opening Balance</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">₹</span>
            <input
              type="number"
              className="input-field pl-8"
              placeholder="1000"
              value={form.openingBalance}
              onChange={(e) => setForm({ ...form, openingBalance: Number(e.target.value) })}
              min={1000}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1.5">Minimum opening balance: ₹1,000</p>
        </div>

        {/* Info box */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-800 text-sm font-semibold font-display mb-1">Payment Flow</p>
          <div className="space-y-1">
            {['Enter account details', 'Complete Razorpay payment', 'Account created instantly'].map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-amber-700">
                <span className="w-4 h-4 rounded-full bg-amber-400 text-white flex items-center justify-center font-bold text-[9px] shrink-0">
                  {i + 1}
                </span>
                {step}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handlePay}
          disabled={loading}
          className="btn-primary flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <CreditCard size={16} />
              Pay ₹{form.openingBalance?.toLocaleString('en-IN')} & Open Account
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function Detail({ label, value, mono }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-500 text-sm">{label}</span>
      <span className={`text-slate-800 font-semibold text-sm ${mono ? 'font-mono' : 'font-display'}`}>{value}</span>
    </div>
  )
}
