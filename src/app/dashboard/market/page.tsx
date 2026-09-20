import { TrendingUp, AlertTriangle, IndianRupee } from 'lucide-react'
import { fetchMandiPrices } from './actions'

export default async function MarketPage() {
  const result = await fetchMandiPrices()

  const formatPrice = (p: string) => {
    const n = parseInt(p)
    return isNaN(n) ? p : `₹${n.toLocaleString('en-IN')}`
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex items-center gap-4">
        <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-4">
          <TrendingUp className="w-10 h-10 text-cyan-400" />
          Market Intelligence
        </h1>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          <span className="text-xs font-semibold text-cyan-400">Live from data.gov.in</span>
        </div>
      </header>

      <p className="text-slate-400 font-light text-lg">Real-time commodity prices from 7,000+ Agricultural Produce Market Committees (APMCs) across India.</p>

      {result.error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-semibold">API Connection Error</p>
            <p className="text-red-400/70 text-sm mt-1">{result.error}</p>
            <p className="text-slate-500 text-xs mt-3">Set MARKET_PRICE_API_KEY in .env.local to connect to the Government of India data.gov.in API.</p>
          </div>
        </div>
      ) : result.records.length === 0 ? (
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-cyan-400" />
          </div>
          <p className="text-white font-semibold text-lg">No market data available</p>
          <p className="text-slate-500 text-sm mt-2">Check API key and try again</p>
        </div>
      ) : (
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Commodity', 'Variety', 'Market', 'District', 'State', 'Min Price', 'Max Price', 'Modal Price'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-[10px] font-bold text-emerald-500/70 uppercase tracking-[0.2em]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.records.map((r: any, i: number) => (
                  <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">{r.commodity}</td>
                    <td className="px-6 py-4 text-slate-400">{r.variety}</td>
                    <td className="px-6 py-4 text-slate-300">{r.market}</td>
                    <td className="px-6 py-4 text-slate-400">{r.district}</td>
                    <td className="px-6 py-4 text-slate-400">{r.state}</td>
                    <td className="px-6 py-4 text-slate-400 font-mono">{formatPrice(r.min_price)}</td>
                    <td className="px-6 py-4 text-slate-400 font-mono">{formatPrice(r.max_price)}</td>
                    <td className="px-6 py-4 font-mono">
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <IndianRupee className="w-3.5 h-3.5" />
                        {parseInt(r.modal_price).toLocaleString('en-IN')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
