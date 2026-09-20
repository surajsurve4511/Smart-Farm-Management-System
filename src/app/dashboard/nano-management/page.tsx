'use client'

import { useState } from 'react'
import { Microscope, Target, Activity, Zap, Dna, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react'

const NANO_DEPLOYMENTS = [
  {
    id: 'ND-7731',
    type: 'Carbon Nanotube (CNT) NPK Matrix',
    target: 'Root System',
    plot: 'Sector Alpha',
    status: 'active',
    absorptionRate: 94.2,
    cellularIntegrity: 98,
    timeActive: '12h 45m',
  },
  {
    id: 'ND-7732',
    type: 'mRNA Pest Resistance Payload',
    target: 'Leaf Cuticles',
    plot: 'Sector Beta',
    status: 'monitoring',
    absorptionRate: 88.5,
    cellularIntegrity: 100,
    timeActive: '4d 02h',
  },
  {
    id: 'ND-7733',
    type: 'Silica Nanoparticle Drought Shield',
    target: 'Stomata',
    plot: 'Sector Gamma',
    status: 'completed',
    absorptionRate: 99.1,
    cellularIntegrity: 97,
    timeActive: '14d 00h',
  },
]

export default function NanoManagementPage() {
  const [selectedPayload, setSelectedPayload] = useState(NANO_DEPLOYMENTS[0])

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header>
        <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-4">
          <Microscope className="w-10 h-10 text-fuchsia-400" />
          Nano-Management
        </h1>
        <p className="text-slate-400 mt-2 text-lg font-light">
          Monitor cellular-level payload delivery and smart nanocarrier absorption rates via hyperspectral drone integration.
        </p>
      </header>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-fuchsia-500/20 transition-all" />
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Global Absorption Rate</h3>
          <p className="text-4xl font-black text-fuchsia-400 font-mono">93.9%</p>
          <p className="text-xs text-slate-400 mt-2">+2.4% vs traditional methods</p>
        </div>
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Active Nanocarriers</h3>
          <p className="text-4xl font-black text-cyan-400 font-mono">2.4<span className="text-xl">B</span></p>
          <p className="text-xs text-slate-400 mt-2">Currently deployed across 3 plots</p>
        </div>
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Cellular Toxicity Alert</h3>
          <p className="text-4xl font-black text-emerald-400 font-mono">0.0%</p>
          <p className="text-xs text-slate-400 mt-2">Zero crop damage detected</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Payload List */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-fuchsia-400" />
            Active Deployments
          </h3>
          {NANO_DEPLOYMENTS.map(deploy => (
            <button
              key={deploy.id}
              onClick={() => setSelectedPayload(deploy)}
              className={`w-full text-left p-5 rounded-2xl border transition-all ${
                selectedPayload.id === deploy.id 
                  ? 'bg-fuchsia-500/10 border-fuchsia-500/50 shadow-[0_0_20px_rgba(217,70,239,0.15)]' 
                  : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05]'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono font-bold text-slate-400">{deploy.id}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                  deploy.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                  deploy.status === 'monitoring' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-slate-500/20 text-slate-400'
                }`}>
                  {deploy.status}
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">{deploy.type}</h4>
              <p className="text-xs text-slate-500 mt-1">Plot: {deploy.plot}</p>
            </button>
          ))}
        </div>

        {/* Payload Detail & Hyperspectral View */}
        <div className="lg:col-span-8">
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl h-full flex flex-col">
            
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-black text-white">{selectedPayload.type}</h2>
                <p className="text-slate-400 mt-1 flex items-center gap-2">
                  <span className="font-mono text-fuchsia-400">{selectedPayload.id}</span>
                  <span>•</span>
                  <span>Target: {selectedPayload.target}</span>
                </p>
              </div>
              <button className="btn-primary bg-fuchsia-600 hover:bg-fuchsia-500 text-white border-none shadow-[0_0_15px_rgba(217,70,239,0.3)]">
                Modify Payload
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-black/40 border border-white/5 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cellular Absorption</h4>
                </div>
                <p className="text-3xl font-bold text-white font-mono">{selectedPayload.absorptionRate}%</p>
                <div className="w-full bg-white/5 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all" style={{ width: `${selectedPayload.absorptionRate}%` }} />
                </div>
              </div>

              <div className="bg-black/40 border border-white/5 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Dna className="w-5 h-5 text-blue-400" />
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Plant Integrity</h4>
                </div>
                <p className="text-3xl font-bold text-white font-mono">{selectedPayload.cellularIntegrity}%</p>
                <div className="w-full bg-white/5 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full transition-all" style={{ width: `${selectedPayload.cellularIntegrity}%` }} />
                </div>
              </div>
            </div>

            {/* Simulated Hyperspectral Visualization */}
            <div className="flex-1 min-h-[250px] bg-black/60 border border-white/10 rounded-2xl relative overflow-hidden flex flex-col">
              <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Hyperspectral Drone Feed</span>
              </div>
              
              {/* Fake visualizer background */}
              <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(217,70,239,0.1)_25%,transparent_25%,transparent_50%,rgba(217,70,239,0.1)_50%,rgba(217,70,239,0.1)_75%,transparent_75%,transparent)] bg-[size:20px_20px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-fuchsia-500/20 blur-3xl rounded-full" />
              </div>

              <div className="flex-1 flex items-center justify-center relative z-10">
                <div className="text-center">
                  <Activity className="w-16 h-16 text-fuchsia-400/50 mx-auto mb-4 animate-pulse" />
                  <p className="text-sm font-mono text-fuchsia-300/70">SCANNING CELLULAR MATRIX...</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
