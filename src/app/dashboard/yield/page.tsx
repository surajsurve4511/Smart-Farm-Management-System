'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Loader2, Sprout, BarChart3, Sparkles, RefreshCw, MapPinned } from 'lucide-react'
import { getYieldPredictions } from './actions'
import Link from 'next/link'

export default function YieldPage() {
  const [predictions, setPredictions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await getYieldPredictions()
      setPredictions(data)
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  const confidenceColor = (c: string) => {
    if (c === 'high') return 'emerald'
    if (c === 'medium') return 'amber'
    return 'red'
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
        <p className="text-white font-semibold">Generating AI yield predictions...</p>
        <p className="text-slate-500 text-sm">Analyzing your logs with Gemini 2.5 Flash</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-4">
            <TrendingUp className="w-10 h-10 text-emerald-400" />
            Yield Prediction Engine
          </h1>
          <p className="text-slate-400 mt-2 text-lg font-light">AI-powered yield forecasts from your daily log history + ICAR benchmarks.</p>
        </div>
        <button onClick={load} className="btn-ghost"><RefreshCw className="w-4 h-4" />Regenerate</button>
      </header>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      {predictions.length === 0 ? (
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-16 text-center shadow-2xl">
          <MapPinned className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No crops to predict</h2>
          <p className="text-slate-400 mb-4">Add farms with active crops to generate yield predictions.</p>
          <Link href="/dashboard/farms" className="btn-primary"><Sprout className="w-4 h-4" />Go to My Farms</Link>
        </div>
      ) : (
        <div className="space-y-6 stagger-children">
          {predictions.map((p: any, i: number) => (
            <div key={i} className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl hover:border-emerald-500/20 transition-all">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <Sprout className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{p.plot_name}</h3>
                      <p className="text-slate-400 text-sm">{p.crop} • {p.area || '—'} acres • {p.crop_stage || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge badge-${confidenceColor(p.confidence)}`}>
                    {p.confidence} confidence
                  </span>
                  <span className="text-xs text-slate-500">{p.log_count} logs analyzed</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/[0.06]">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Yield / Acre</p>
                  <p className="text-2xl font-bold text-white font-mono">{typeof p.predicted_yield_per_acre === 'number' ? `${p.predicted_yield_per_acre} qtl` : p.predicted_yield_per_acre}</p>
                </div>
                <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/[0.06]">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Yield</p>
                  <p className="text-2xl font-bold text-emerald-400 font-mono">{typeof p.total_yield === 'number' ? `${p.total_yield} qtl` : p.total_yield}</p>
                </div>
                <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/[0.06]">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Revenue Estimate</p>
                  <p className="text-2xl font-bold text-cyan-400 font-mono">{typeof p.revenue_range === 'string' && p.revenue_range.includes('₹') ? p.revenue_range : p.revenue_range}</p>
                </div>
              </div>

              {p.factors && p.factors.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Key Factors</p>
                  <div className="flex flex-wrap gap-2">
                    {p.factors.map((f: string, j: number) => (
                      <span key={j} className="text-xs px-3 py-1 rounded-lg bg-white/[0.05] text-slate-300 border border-white/[0.06]">{f}</span>
                    ))}
                  </div>
                </div>
              )}

              {p.comparison && p.comparison !== 'N/A' && (
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3">
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" />
                    <span className="font-semibold">vs Indian Average:</span> {p.comparison}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* How it works */}
      <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          How RAG Yield Prediction Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          {[
            { step: '1', title: 'Daily Logs', desc: 'Your field observations are embedded as 768-dim vectors' },
            { step: '2', title: 'Vector Retrieval', desc: 'pgvector retrieves your most relevant historical data' },
            { step: '3', title: 'Gemini Analysis', desc: 'AI correlates soil, weather, pest data with ICAR benchmarks' },
            { step: '4', title: 'Prediction', desc: 'Yield forecast with confidence level and revenue estimate' },
          ].map(s => (
            <div key={s.step} className="text-center p-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center mx-auto mb-2">{s.step}</div>
              <p className="font-semibold text-white">{s.title}</p>
              <p className="text-slate-500 text-xs mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
