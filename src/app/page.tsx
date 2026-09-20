import Link from 'next/link'
import { Sprout, ArrowRight, IndianRupee, TrendingUp, Camera, CloudSun, Bot, Package, Leaf, Microchip, Database, Shield } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen selection:bg-emerald-500/30" style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-body)' }}>
      {/* Navigation */}
      <nav className="fixed w-full z-50 border-b border-white/5 backdrop-blur-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg-primary) 50%, transparent)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="w-6 h-6 text-emerald-400" />
            <span className="font-semibold tracking-tight text-lg">Smart Farm OS</span>
          </div>
          <Link href="/login" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-neutral-200 transition-colors">
            Access Platform
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Gemini AI + pgvector RAG Engine Live
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter max-w-4xl mb-6 bg-gradient-to-br from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            The Ultimate Intelligence for Modern Agriculture
          </h1>

          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mb-10 font-light">
            Eliminate guesswork, outsmart middlemen, and maximize yields. AI-powered farm management built to solve every challenge Indian farmers face.
          </p>

          <Link href="/login" className="group relative inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-medium px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)]">
            Deploy on your Farm
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Problems We Solve */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-400 text-sm font-bold uppercase tracking-[0.2em] mb-4">Problems → Solutions</p>
            <h2 className="text-4xl font-bold tracking-tight text-white">Solving Every Indian Farming Crisis</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: IndianRupee, color: 'emerald', title: 'Farmer Debt Trap', solution: 'AI Scheme Discovery', desc: 'Auto-discovers PM-KISAN, PMFBY, KCC and 100+ schemes. Matches your profile to eligible benefits instantly.' },
              { icon: TrendingUp, color: 'cyan', title: 'Middlemen Exploitation', solution: 'Live Mandi Prices', desc: 'Real-time prices from 7,000+ APMCs via government API. Know exactly when and where to sell for maximum profit.' },
              { icon: Camera, color: 'purple', title: 'Crop Disease & Loss', solution: 'AI Vision Diagnosis', desc: 'Upload a photo or start a video call — Gemini Vision identifies diseases, pests, and nutrient deficiencies instantly.' },
              { icon: CloudSun, color: 'blue', title: 'Climate Volatility', solution: 'Weather Intelligence', desc: 'Hyper-local forecasts correlated with your crop history. AI warns you before weather damages your harvest.' },
              { icon: Bot, color: 'amber', title: 'No Expert Access', solution: 'RAG-Powered AI Chatbot', desc: 'Your personal agronomist that knows YOUR farm from vector database history. Ask anything, get personalized advice.' },
              { icon: Package, color: 'red', title: 'Post-Harvest Waste', solution: 'Smart Storage + Market Timing', desc: 'Track inventory, monitor storage conditions. AI recommends optimal sell timing based on price trend analysis.' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="p-8 rounded-3xl bg-white/[0.03] border border-white/[0.06] hover:border-emerald-500/20 transition-all group">
                  <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 text-${item.color}-400`} />
                  </div>
                  <p className="text-xs font-bold text-red-400/80 uppercase tracking-widest mb-2">🔴 {item.title}</p>
                  <h3 className="text-xl font-semibold mb-2 text-white">🟢 {item.solution}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-colors group" style={{ backgroundColor: 'var(--color-bg-card)' }}>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Microchip className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Multimodal AI Agronomist</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Upload photos, start video calls, or chat — Gemini 2.5 Flash analyzes your crops using vision, text, and your complete farm history.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-white/5 hover:border-cyan-500/30 transition-colors group" style={{ backgroundColor: 'var(--color-bg-card)' }}>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">768-dim Vector Engine</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Every daily log is embedded into pgvector. Your AI has perfect memory of every soil reading, weather event, and crop observation — ever.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-white/5 hover:border-amber-500/30 transition-colors group" style={{ backgroundColor: 'var(--color-bg-card)' }}>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Government Scheme Shield</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Live-sourced schemes from PM-KISAN, PMFBY, KCC, NABARD and more. Auto-matched to your profile. Never miss a benefit again.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-white font-mono">7,000+</p>
            <p className="text-sm text-neutral-500 mt-1">Mandis Connected</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-400 font-mono">100+</p>
            <p className="text-sm text-neutral-500 mt-1">Govt Schemes Indexed</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-cyan-400 font-mono">768-dim</p>
            <p className="text-sm text-neutral-500 mt-1">Vector Engine</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-500">
            <Sprout className="w-4 h-4" />
            <span className="text-sm">Smart Farm OS — Built for Indian Farmers</span>
          </div>
          <p className="text-xs text-neutral-600">Powered by Gemini AI + Supabase pgvector</p>
        </div>
      </footer>
    </div>
  )
}
