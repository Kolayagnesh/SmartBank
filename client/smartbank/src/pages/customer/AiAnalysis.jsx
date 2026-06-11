import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ArrowRight, BadgeCheck, Brain, Lightbulb, RefreshCcw, ShieldAlert, Sparkles, Target, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { aiAPI } from '../../services/api'

export default function AiAnalysis() {
	const [analysis, setAnalysis] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	const loadAnalysis = async () => {
		setLoading(true)
		setError('')
		try {
			const { data } = await aiAPI.getAccountAnalysis()
			setAnalysis(data)
		} catch {
			setError('Failed to load AI analysis. Please try again.')
			toast.error('Failed to load AI analysis')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadAnalysis()
	}, [])

	const score = analysis?.financialHealthScore ?? 0
	const riskTone = useMemo(() => {
		const level = (analysis?.riskLevel || '').toLowerCase()
		if (level.includes('low')) return 'from-emerald-500 to-emerald-400'
		if (level.includes('medium')) return 'from-amber-500 to-orange-400'
		return 'from-rose-500 to-red-500'
	}, [analysis?.riskLevel])

	return (
		<div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
			<div>
				<h1 className="font-display font-bold text-slate-800 text-2xl lg:text-3xl">AI Financial Analysis</h1>
				<p className="text-slate-500 text-sm mt-0.5">Personalized insights generated from your account activity</p>
			</div>

			{loading ? (
				<AnalysisSkeleton />
			) : error ? (
				<div className="card py-14 text-center">
					<div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
						<AlertTriangle size={28} className="text-red-500" />
					</div>
					<h3 className="font-display font-bold text-slate-800 text-lg">Could not load analysis</h3>
					<p className="text-slate-500 text-sm mt-1 mb-6">{error}</p>
					<button onClick={loadAnalysis} className="btn-primary inline-flex items-center gap-2 w-auto px-5 mx-auto">
						<RefreshCcw size={15} />
						Retry
					</button>
				</div>
			) : (
				<>
					<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b1225] via-[#101935] to-[#152149] p-7 text-white">
						<div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-amber-500/10 blur-3xl" />
						<div className="absolute bottom-0 left-1/3 w-44 h-44 rounded-full bg-emerald-500/10 blur-3xl" />
						<div className="relative z-10 grid gap-6 lg:grid-cols-[280px_1fr] items-center">
							<div className="flex items-center justify-center">
								<div className="relative w-56 h-56 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
									<div className="absolute inset-4 rounded-full bg-gradient-to-br from-amber-500/20 via-transparent to-emerald-500/20 border border-white/10" />
									<div className="relative z-10 text-center">
										<div className={`mx-auto w-24 h-24 rounded-full bg-gradient-to-br ${riskTone} flex items-center justify-center shadow-2xl shadow-black/20`}>
											<span className="text-3xl font-display font-bold text-white">{score}</span>
										</div>
										<p className="text-slate-300 text-xs uppercase tracking-[0.3em] mt-4">Financial health score</p>
										<p className="text-white font-semibold font-display text-lg mt-1">{analysis?.riskLevel || 'Unknown'} risk</p>
									</div>
								</div>
							</div>

							<div className="space-y-4">
								<div className="flex flex-wrap items-center gap-3">
									<span className="badge bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">{analysis?.riskLevel || 'Risk unknown'}</span>
									<span className="badge bg-white/10 text-slate-200 border border-white/10">AI generated</span>
									<span className="badge bg-amber-500/15 text-amber-300 border border-amber-500/30">Actionable insights</span>
								</div>
								<h2 className="font-display font-bold text-2xl lg:text-3xl leading-tight">
									{analysis?.summary || 'Your analysis will appear here once the AI response is loaded.'}
								</h2>
								<p className="text-slate-300 text-sm leading-6 max-w-3xl">
									This overview translates your balances, cash flow, and account activity into practical next steps, with emphasis on risk, resilience, and growth.
								</p>
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
									<MetricCard icon={Brain} label="Interpretation" value="AI-assisted" />
									<MetricCard icon={Target} label="Priority" value={analysis?.riskLevel || 'Review'} />
									<MetricCard icon={TrendingUp} label="Score band" value={getScoreBand(score)} />
								</div>
							</div>
						</div>
					</div>

					<div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
						<div className="space-y-6">
							<InfoPanel
								icon={BadgeCheck}
								title="Strengths"
								subtitle="What the model sees as positive indicators"
								accent="from-emerald-500 to-emerald-400"
								items={analysis?.strengths}
							/>

							<InfoPanel
								icon={ShieldAlert}
								title="Weaknesses"
								subtitle="Risks and gaps that need attention"
								accent="from-rose-500 to-red-500"
								items={analysis?.weaknesses}
							/>
						</div>

						<div className="space-y-6">
							<div className="card bg-gradient-to-br from-white to-amber-50/60 border-amber-100">
								<div className="flex items-start gap-3 mb-4">
									<div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
										<Sparkles size={18} className="text-amber-600" />
									</div>
									<div>
										<h3 className="font-display font-bold text-slate-800 text-lg">Recommendations</h3>
										<p className="text-slate-500 text-sm">Suggested next steps to improve stability</p>
									</div>
								</div>
								<div className="space-y-3">
									{analysis?.recommendations?.map((item, index) => (
										<InsightRow key={item} index={index + 1} text={item} tone="amber" />
									))}
								</div>
							</div>

							<div className="card bg-slate-900 text-white border-slate-800">
								<div className="flex items-start gap-3 mb-4">
									<div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
										<Lightbulb size={18} className="text-amber-300" />
									</div>
									<div>
										<h3 className="font-display font-bold text-white text-lg">Investment Ideas</h3>
										<p className="text-slate-400 text-sm">Ideas tailored to your current profile</p>
									</div>
								</div>
								<div className="space-y-3">
									{analysis?.investmentIdeas?.map((item, index) => (
										<InsightRow key={item} index={index + 1} text={item} tone="dark" />
									))}
								</div>
							</div>
						</div>
					</div>

					<div className="card">
						<div className="flex items-center justify-between gap-4 mb-4">
							<div>
								<h3 className="font-display font-bold text-slate-800 text-lg">AI Summary</h3>
								<p className="text-slate-500 text-sm">A concise explanation of your current financial position</p>
							</div>
							<ArrowRight size={16} className="text-amber-500 shrink-0" />
						</div>
						<p className="text-slate-600 leading-7 text-sm lg:text-base">{analysis?.summary}</p>
					</div>
				</>
			)}
		</div>
	)
}

function MetricCard({ icon: Icon, label, value }) {
	return (
		<div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-4">
			<div className="flex items-center gap-3">
				<div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
					<Icon size={16} className="text-amber-300" />
				</div>
				<div>
					<p className="text-slate-400 text-[11px] uppercase tracking-[0.25em]">{label}</p>
					<p className="text-white font-semibold font-display text-sm mt-0.5">{value}</p>
				</div>
			</div>
		</div>
	)
}

function InfoPanel({ icon: Icon, title, subtitle, accent, items }) {
	return (
		<div className="card">
			<div className="flex items-start gap-3 mb-4">
				<div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center shrink-0 shadow-lg shadow-slate-200/50`}>
					<Icon size={18} className="text-white" />
				</div>
				<div>
					<h3 className="font-display font-bold text-slate-800 text-lg">{title}</h3>
					<p className="text-slate-500 text-sm">{subtitle}</p>
				</div>
			</div>
			<div className="space-y-3">
				{items?.map((item, index) => (
					<InsightRow key={item} index={index + 1} text={item} tone="slate" />
				))}
			</div>
		</div>
	)
}

function InsightRow({ index, text, tone }) {
	const styles = {
		amber: 'bg-amber-500/10 border-amber-500/15 text-amber-50',
		dark: 'bg-white/5 border-white/10 text-slate-100',
		slate: 'bg-slate-50 border-slate-100 text-slate-700',
	}

	return (
		<div className={`flex gap-3 p-3.5 rounded-xl border ${styles[tone]}`}>
			<div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-display font-bold text-xs ${tone === 'dark' ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-50 text-amber-600'}`}>
				{index}
			</div>
			<p className={`text-sm leading-6 ${tone === 'dark' ? 'text-slate-200' : 'text-slate-600'}`}>{text}</p>
		</div>
	)
}

function AnalysisSkeleton() {
	return (
		<div className="space-y-6 animate-pulse">
			<div className="h-80 rounded-2xl bg-slate-200" />
			<div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
				<div className="space-y-6">
					<div className="h-64 rounded-2xl bg-slate-200" />
					<div className="h-64 rounded-2xl bg-slate-200" />
				</div>
				<div className="space-y-6">
					<div className="h-72 rounded-2xl bg-slate-200" />
					<div className="h-56 rounded-2xl bg-slate-200" />
				</div>
			</div>
			<div className="h-40 rounded-2xl bg-slate-200" />
		</div>
	)
}

function getScoreBand(score) {
	if (score >= 80) return 'Excellent'
	if (score >= 60) return 'Healthy'
	if (score >= 40) return 'Watchlist'
	return 'Critical'
}
