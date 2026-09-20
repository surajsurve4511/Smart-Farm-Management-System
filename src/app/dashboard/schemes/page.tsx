'use client'

import { useState, useEffect } from 'react'
import { Landmark, Loader2, ExternalLink, CheckCircle, XCircle, Shield } from 'lucide-react'
import { SCHEME_CATEGORIES } from '@/lib/constants'
import { getSchemes } from './actions'

export default function SchemesPage() {
  const [schemes, setSchemes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try { setSchemes(await getSchemes()) } catch { /* empty */ }
    setLoading(false)
  }

  const filtered = filter === 'all' ? schemes : schemes.filter(s => s.category === filter)

  const TYPE_COLORS: Record<string, string> = {
    subsidy: 'emerald', loan: 'blue', insurance: 'purple',
    training: 'cyan', equipment: 'amber', market_access: 'green',
  }

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 text-emerald-400 animate-spin" /></div>

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header>
        <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-4">
          <Landmark className="w-10 h-10 text-emerald-400" />
          Government & Private Schemes
        </h1>
        <p className="text-slate-400 mt-2 text-lg font-light">AI-matched schemes based on your farmer profile. Eligibility auto-checked.</p>
      </header>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'all' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:bg-white/[0.06]'}`}>
          All ({schemes.length})
        </button>
        {SCHEME_CATEGORIES.map((c: any) => {
          const count = schemes.filter(s => s.category === c.value).length
          return (
            <button key={c.value} onClick={() => setFilter(c.value)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === c.value ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:bg-white/[0.06]'}`}>
              {c.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Scheme Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-16 text-center shadow-2xl">
          <Landmark className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No schemes found</h2>
          <p className="text-slate-400">Try a different category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger-children">
          {filtered.map((scheme: any) => (
            <div key={scheme.id} className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-6 shadow-lg hover:border-emerald-500/20 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{scheme.title}</h3>
                  <p className="text-xs text-slate-500">{scheme.provider}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`badge badge-${TYPE_COLORS[scheme.category] || 'emerald'}`}>
                    {scheme.category?.replace('_', ' ')}
                  </span>
                  {scheme.is_eligible !== undefined && (
                    <span className={`badge ${scheme.is_eligible ? 'badge-emerald' : 'badge-red'}`}>
                      {scheme.is_eligible ? (
                        <><CheckCircle className="w-3 h-3 inline mr-1" />Eligible</>
                      ) : (
                        <><XCircle className="w-3 h-3 inline mr-1" />Not Eligible</>
                      )}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed mb-4">{scheme.description}</p>

              <div className="flex items-center justify-between">
                <div className="bg-emerald-500/10 px-3 py-1.5 rounded-lg">
                  <p className="text-xs font-bold text-emerald-400">{scheme.benefit_amount}</p>
                </div>
                {scheme.application_url && (
                  <a href={scheme.application_url} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1">
                    Apply <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
