'use client'

import { useState, useEffect, useTransition } from 'react'
import { MapPinned, Plus, Sprout, ChevronRight, Droplets, Ruler, Loader2, Trash2, Pencil, X, Leaf } from 'lucide-react'
import { SOIL_TYPES, WATER_SOURCES, CROP_TYPES, CROP_STAGES } from '@/lib/constants'
import { getFarms, createFarm, deleteFarm, createPlot, deletePlot } from './actions'

const STAGE_COLORS: Record<string, string> = {
  sowing: 'amber', germination: 'lime', vegetative: 'green',
  flowering: 'pink', fruiting: 'orange', harvesting: 'yellow', fallow: 'slate',
}

export default function FarmsPage() {
  const [farms, setFarms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddFarm, setShowAddFarm] = useState(false)
  const [showAddPlot, setShowAddPlot] = useState<string | null>(null) // farm_id
  const [isPending, startTransition] = useTransition()

  const [farmForm, setFarmForm] = useState({ name: '', total_area_acres: '', soil_type: '', water_source: '' })
  const [plotForm, setPlotForm] = useState({ name: '', area_acres: '', current_crop: '', crop_stage: '', sowing_date: '' })

  useEffect(() => { loadFarms() }, [])

  async function loadFarms() {
    setLoading(true)
    try {
      const data = await getFarms()
      setFarms(data)
    } catch { /* empty */ } finally { setLoading(false) }
  }

  async function handleCreateFarm() {
    startTransition(async () => {
      await createFarm({
        name: farmForm.name,
        total_area_acres: farmForm.total_area_acres ? parseFloat(farmForm.total_area_acres) : null,
        soil_type: farmForm.soil_type || null,
        water_source: farmForm.water_source || null,
      })
      setShowAddFarm(false)
      setFarmForm({ name: '', total_area_acres: '', soil_type: '', water_source: '' })
      await loadFarms()
    })
  }

  async function handleDeleteFarm(id: string) {
    if (!confirm('Delete this farm and all its plots? This cannot be undone.')) return
    startTransition(async () => {
      await deleteFarm(id)
      await loadFarms()
    })
  }

  async function handleCreatePlot(farmId: string) {
    startTransition(async () => {
      await createPlot({
        farm_id: farmId,
        name: plotForm.name,
        area_acres: plotForm.area_acres ? parseFloat(plotForm.area_acres) : null,
        current_crop: plotForm.current_crop || null,
        crop_stage: plotForm.crop_stage || null,
        sowing_date: plotForm.sowing_date || null,
      })
      setShowAddPlot(null)
      setPlotForm({ name: '', area_acres: '', current_crop: '', crop_stage: '', sowing_date: '' })
      await loadFarms()
    })
  }

  async function handleDeletePlot(id: string) {
    if (!confirm('Delete this plot?')) return
    startTransition(async () => {
      await deletePlot(id)
      await loadFarms()
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-4">
            <MapPinned className="w-10 h-10 text-emerald-400" />
            My Farms
          </h1>
          <p className="text-slate-400 mt-2 text-lg font-light">
            Manage your farms and plots — all data synced to Supabase.
          </p>
        </div>
        <button onClick={() => setShowAddFarm(true)} className="btn-primary">
          <Plus className="w-5 h-5" />
          Add Farm
        </button>
      </header>

      {/* Empty State */}
      {farms.length === 0 && (
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-16 text-center shadow-2xl">
          <MapPinned className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No farms registered</h2>
          <p className="text-slate-400 mb-6">Add your first farm to start logging activities and tracking crops.</p>
          <button onClick={() => setShowAddFarm(true)} className="btn-primary">
            <Plus className="w-5 h-5" />
            Add Your First Farm
          </button>
        </div>
      )}

      {/* Farm Cards */}
      <div className="space-y-8">
        {farms.map((farm: any) => (
          <div key={farm.id} className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl">
            {/* Farm Header */}
            <div className="p-8 border-b border-white/[0.08]">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">{farm.name}</h2>
                  <p className="text-slate-400 mt-1">
                    {farm.total_area_acres || '—'} acres • {farm.soil_type || 'N/A'} soil • {farm.water_source || 'N/A'}
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-semibold flex items-center gap-2">
                    <Ruler className="w-4 h-4" />
                    {farm.total_area_acres || '—'} Acres
                  </div>
                  <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 text-sm font-semibold flex items-center gap-2">
                    <Droplets className="w-4 h-4" />
                    {farm.water_source || 'N/A'}
                  </div>
                  <button onClick={() => handleDeleteFarm(farm.id)} className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="h-48 bg-gradient-to-br from-emerald-950/30 to-cyan-950/20 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
              <div className="text-center relative z-10">
                <MapPinned className="w-12 h-12 text-emerald-500/40 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Google Maps Integration Ready</p>
                {farm.location_lat && (
                  <p className="text-slate-600 text-sm mt-1">{farm.location_lat?.toFixed(4)}°N, {farm.location_lng?.toFixed(4)}°E</p>
                )}
              </div>
            </div>

            {/* Plots Grid */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-emerald-500/70 uppercase tracking-[0.2em]">
                  Active Plots ({farm.plots?.length || 0})
                </h3>
                <button onClick={() => { setShowAddPlot(farm.id); setPlotForm({ name: '', area_acres: '', current_crop: '', crop_stage: '', sowing_date: '' }) }} className="btn-ghost text-xs">
                  <Plus className="w-4 h-4" />
                  Add Plot
                </button>
              </div>

              {farm.plots?.length === 0 && (
                <p className="text-slate-500 text-sm py-4">No plots yet. Add your first plot to start tracking crops.</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {farm.plots?.map((plot: any) => {
                  const stageColor = STAGE_COLORS[plot.crop_stage] || 'slate'
                  return (
                    <div key={plot.id} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:border-emerald-500/20 transition-all group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                          <Sprout className="w-5 h-5 text-emerald-400" />
                        </div>
                        <button onClick={() => handleDeletePlot(plot.id)} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <h4 className="font-semibold text-white mb-1">{plot.name}</h4>
                      <p className="text-slate-400 text-sm mb-3">{plot.area_acres || '—'} acres</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-300">{plot.current_crop || 'No crop'}</span>
                        {plot.crop_stage && (
                          <span className={`badge badge-${stageColor === 'green' ? 'emerald' : stageColor === 'pink' ? 'red' : stageColor === 'orange' ? 'amber' : 'emerald'}`}>
                            {plot.crop_stage}
                          </span>
                        )}
                      </div>
                      {plot.sowing_date && (
                        <p className="text-xs text-slate-600 mt-2">Sown: {new Date(plot.sowing_date).toLocaleDateString('en-IN')}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Farm Modal */}
      {showAddFarm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="border border-white/[0.1] rounded-3xl p-8 w-full max-w-lg shadow-2xl" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Add New Farm</h2>
              <button onClick={() => setShowAddFarm(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Farm Name *</label>
                <input type="text" className="input-farm" placeholder="e.g. Patil Family Farm" value={farmForm.name} onChange={e => setFarmForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Total Area (acres)</label>
                  <input type="number" className="input-farm" placeholder="25" value={farmForm.total_area_acres} onChange={e => setFarmForm(f => ({ ...f, total_area_acres: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Soil Type</label>
                  <select className="input-farm select-farm" value={farmForm.soil_type} onChange={e => setFarmForm(f => ({ ...f, soil_type: e.target.value }))}>
                    <option value="">Select soil</option>
                    {SOIL_TYPES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Water Source</label>
                <select className="input-farm select-farm" value={farmForm.water_source} onChange={e => setFarmForm(f => ({ ...f, water_source: e.target.value }))}>
                  <option value="">Select source</option>
                  {WATER_SOURCES.map(w => <option key={w}>{w}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowAddFarm(false)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={handleCreateFarm} disabled={!farmForm.name || isPending} className="btn-primary flex-1 disabled:opacity-50">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Create Farm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Plot Modal */}
      {showAddPlot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="border border-white/[0.1] rounded-3xl p-8 w-full max-w-lg shadow-2xl" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Add New Plot</h2>
              <button onClick={() => setShowAddPlot(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Plot Name *</label>
                <input type="text" className="input-farm" placeholder="e.g. North Field (Sector A)" value={plotForm.name} onChange={e => setPlotForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Area (acres)</label>
                  <input type="number" className="input-farm" placeholder="12" value={plotForm.area_acres} onChange={e => setPlotForm(f => ({ ...f, area_acres: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Current Crop</label>
                  <select className="input-farm select-farm" value={plotForm.current_crop} onChange={e => setPlotForm(f => ({ ...f, current_crop: e.target.value }))}>
                    <option value="">Select crop</option>
                    {CROP_TYPES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Crop Stage</label>
                  <select className="input-farm select-farm" value={plotForm.crop_stage} onChange={e => setPlotForm(f => ({ ...f, crop_stage: e.target.value }))}>
                    <option value="">Select stage</option>
                    {CROP_STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Sowing Date</label>
                  <input type="date" className="input-farm" value={plotForm.sowing_date} onChange={e => setPlotForm(f => ({ ...f, sowing_date: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowAddPlot(null)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={() => handleCreatePlot(showAddPlot)} disabled={!plotForm.name || isPending} className="btn-primary flex-1 disabled:opacity-50">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Leaf className="w-4 h-4" />}
                Create Plot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
