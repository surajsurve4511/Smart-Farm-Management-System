'use client'

import { useState } from 'react'
import { Hexagon, Play, Loader2, ThermometerSun, TestTube2, BugOff, CloudRain, Activity, Layers, ArrowRight } from 'lucide-react'
import { runDigitalTwinSimulation, SimulationParams, SimulationResult } from '@/lib/simulation/physics-engine'

export default function DigitalTwinPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SimulationResult[]>([])
  
  const [params, setParams] = useState<SimulationParams>({
    farmName: 'Sector Alpha',
    plotAreaAcres: 12,
    currentCrop: 'Wheat (High-Yield Variant)',
    cropStage: 'Vegetative',
    currentSoilMoisture: 45,
    scenario: 'nano_fertilizer',
    daysToSimulate: 14,
    nanoFertilizerType: 'Carbon Nanotube NPK Matrix',
  })

  async function handleSimulate() {
    setLoading(true)
    setResults([])
    try {
      const simResults = await runDigitalTwinSimulation(params)
      setResults(simResults)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getScenarioIcon = (scenario: string) => {
    switch (scenario) {
      case 'drought': return <ThermometerSun className="w-5 h-5 text-amber-500" />
      case 'nano_fertilizer': return <TestTube2 className="w-5 h-5 text-purple-500" />
      case 'pest_infestation': return <BugOff className="w-5 h-5 text-red-500" />
      case 'optimal_weather': return <CloudRain className="w-5 h-5 text-cyan-500" />
      default: return <Activity className="w-5 h-5 text-emerald-500" />
    }
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header>
        <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-4">
          <Hexagon className="w-10 h-10 text-cyan-400" />
          Digital Twin Engine
        </h1>
        <p className="text-slate-400 mt-2 text-lg font-light">
          Run "what-if" hyper-realistic physics simulations before applying treatments in the real world.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Configuration */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 shadow-2xl">
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5 text-slate-400" />
              Simulation Parameters
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-2 block">Scenario</label>
                <select 
                  className="input-farm select-farm"
                  value={params.scenario}
                  onChange={e => setParams(p => ({ ...p, scenario: e.target.value as any }))}
                >
                  <option value="drought">Extreme Drought Simulation</option>
                  <option value="nano_fertilizer">Targeted Nano-Fertilizer Delivery</option>
                  <option value="pest_infestation">Swarm Pest Infestation</option>
                  <option value="optimal_weather">Optimal Climate Baseline</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Days</label>
                  <input type="number" className="input-farm" value={params.daysToSimulate} onChange={e => setParams(p => ({ ...p, daysToSimulate: parseInt(e.target.value) || 14 }))} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Start Moisture %</label>
                  <input type="number" className="input-farm" value={params.currentSoilMoisture} onChange={e => setParams(p => ({ ...p, currentSoilMoisture: parseInt(e.target.value) || 45 }))} />
                </div>
              </div>

              {params.scenario === 'nano_fertilizer' && (
                <div>
                  <label className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-2 block">Nano Payload Type</label>
                  <input type="text" className="input-farm border-purple-500/30 focus:border-purple-500 focus:ring-purple-500/20" value={params.nanoFertilizerType} onChange={e => setParams(p => ({ ...p, nanoFertilizerType: e.target.value }))} />
                </div>
              )}

              <button 
                onClick={handleSimulate}
                disabled={loading}
                className="w-full mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                {loading ? 'Simulating Matrix...' : 'Run Simulation'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Display */}
        <div className="lg:col-span-8">
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl h-full flex flex-col relative overflow-hidden">
            
            {/* Background cyber grid effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)] pointer-events-none" />

            {results.length === 0 && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center z-10 relative">
                <div className="w-24 h-24 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(6,182,212,0.2)]">
                  <Hexagon className="w-12 h-12 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Digital Twin Standby</h2>
                <p className="text-slate-400 max-w-md">Configure parameters and execute a simulation to predict the physical state of your farm in the future.</p>
              </div>
            )}

            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center z-10 relative">
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                <p className="text-cyan-400 font-mono tracking-widest text-sm uppercase">Calculating Physics Matrices...</p>
              </div>
            )}

            {results.length > 0 && !loading && (
              <div className="flex-1 flex flex-col z-10 relative h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                      {getScenarioIcon(params.scenario)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white uppercase tracking-wider">{params.scenario.replace('_', ' ')} Forecast</h2>
                      <p className="text-slate-400 text-sm">3D Physics Engine prediction over {params.daysToSimulate} days.</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">End State Health</p>
                    <p className={`text-3xl font-black font-mono ${results[results.length-1].healthScore < 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {results[results.length-1].healthScore}%
                    </p>
                  </div>
                </div>

                {/* Graph Visualization */}
                <div className="relative h-64 border-b border-l border-white/[0.1] mb-8 flex items-end px-2 pt-4">
                  {results.map((r, i) => (
                    <div key={r.day} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                      {/* Health Bar */}
                      <div 
                        className={`w-full max-w-[1rem] rounded-t-sm transition-all duration-500 ${r.healthScore < 50 ? 'bg-red-500/50 hover:bg-red-400' : 'bg-emerald-500/50 hover:bg-emerald-400'}`}
                        style={{ height: `${r.healthScore}%` }}
                      />
                      
                      {/* Moisture Indicator Dot */}
                      <div 
                        className="absolute w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]"
                        style={{ bottom: `${r.soilMoisture}%`, left: '50%', transform: 'translateX(-50%)' }}
                      />

                      {/* Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg p-3 text-xs w-48 z-20 pointer-events-none transition-opacity">
                        <p className="font-bold text-white mb-1">Day {r.day}</p>
                        <p className="text-emerald-400 flex justify-between">Health: <span>{r.healthScore}%</span></p>
                        <p className="text-blue-400 flex justify-between">Moisture: <span>{r.soilMoisture}%</span></p>
                        <p className="text-purple-400 flex justify-between">Biomass: <span>{r.biomassIndex}</span></p>
                      </div>

                      {/* X-Axis Label */}
                      <p className="text-[10px] text-slate-500 mt-2 font-mono">D{r.day}</p>
                    </div>
                  ))}
                  
                  {/* Y-Axis Labels */}
                  <div className="absolute top-0 -left-8 text-[10px] text-slate-500 font-mono">100</div>
                  <div className="absolute top-1/2 -translate-y-1/2 -left-8 text-[10px] text-slate-500 font-mono">50</div>
                  <div className="absolute bottom-0 -left-8 text-[10px] text-slate-500 font-mono">0</div>
                </div>

                {/* Event Log */}
                <div className="bg-black/40 border border-white/5 rounded-2xl p-6 flex-1 overflow-y-auto">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Simulation Event Log</h4>
                  <div className="space-y-3">
                    {results.flatMap(r => r.events.map((e, i) => ({ day: r.day, text: e, id: `${r.day}-${i}` }))).length === 0 ? (
                      <p className="text-slate-500 text-sm">No significant physical deviations detected during simulation timeline.</p>
                    ) : (
                      results.flatMap(r => r.events.map((e, i) => ({ day: r.day, text: e, id: `${r.day}-${i}` }))).map(event => (
                        <div key={event.id} className="flex gap-4 items-start">
                          <span className="text-cyan-500 font-mono text-xs py-0.5">DAY_{String(event.day).padStart(2, '0')}</span>
                          <span className="text-slate-300 text-sm">{event.text}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
