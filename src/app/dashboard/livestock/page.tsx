'use client'

import { useState, useEffect, useTransition } from 'react'
import { Heart, Plus, Loader2, Trash2, X, IndianRupee, Droplets } from 'lucide-react'
import { ANIMAL_TYPES, ANIMAL_BREEDS } from '@/lib/constants'
import { getLivestock, addLivestock, deleteLivestock } from './actions'

export default function LivestockPage() {
  const [animals, setAnimals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [form, setForm] = useState({
    animal_type: 'cow', breed: '', count: '1', age_months: '',
    health_status: 'healthy' as 'healthy' | 'sick' | 'under_treatment',
    purchase_price: '', current_market_rate: '', milk_yield_liters_per_day: '', notes: ''
  })

  useEffect(() => { load() }, [])
  async function load() {
    setLoading(true)
    try { setAnimals(await getLivestock()) } catch { /* empty */ }
    setLoading(false)
  }

  async function handleAdd() {
    startTransition(async () => {
      await addLivestock({
        animal_type: form.animal_type,
        breed: form.breed || null,
        count: parseInt(form.count) || 1,
        age_months: form.age_months ? parseInt(form.age_months) : null,
        health_status: form.health_status,
        purchase_price: form.purchase_price ? parseFloat(form.purchase_price) : null,
        current_market_rate: form.current_market_rate ? parseFloat(form.current_market_rate) : null,
        milk_yield_liters_per_day: form.milk_yield_liters_per_day ? parseFloat(form.milk_yield_liters_per_day) : null,
        notes: form.notes || null,
      })
      setShowAdd(false)
      setForm({ animal_type: 'cow', breed: '', count: '1', age_months: '', health_status: 'healthy', purchase_price: '', current_market_rate: '', milk_yield_liters_per_day: '', notes: '' })
      await load()
    })
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this animal record?')) return
    startTransition(async () => { await deleteLivestock(id); await load() })
  }

  const totalAnimals = animals.reduce((s, a) => s + (a.count || 0), 0)
  const totalValue = animals.reduce((s, a) => s + (a.count || 0) * (a.current_market_rate || 0), 0)
  const totalMilk = animals.reduce((s, a) => s + (a.count || 0) * (a.milk_yield_liters_per_day || 0), 0)
  const getEmoji = (type: string) => ANIMAL_TYPES.find(t => t.value === type)?.emoji || '🐾'

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 text-emerald-400 animate-spin" /></div>

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-4">
            <Heart className="w-10 h-10 text-emerald-400" />
            Livestock Portfolio
          </h1>
          <p className="text-slate-400 mt-2 text-lg font-light">Track animals, health, milk yields, and market valuations.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary"><Plus className="w-5 h-5" />Add Animal</button>
      </header>

      {/* Portfolio Summary */}
      {animals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Total Animals</p>
            <p className="text-3xl font-bold text-white font-mono">{totalAnimals}</p>
          </div>
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Portfolio Value</p>
            <p className="text-3xl font-bold text-emerald-400 font-mono">₹{totalValue.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Daily Milk Yield</p>
            <p className="text-3xl font-bold text-cyan-400 font-mono">{totalMilk.toFixed(1)} L</p>
          </div>
        </div>
      )}

      {/* Animal Cards */}
      {animals.length === 0 ? (
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-16 text-center shadow-2xl">
          <p className="text-4xl mb-4">🐄</p>
          <h2 className="text-xl font-bold text-white mb-2">No animals registered</h2>
          <p className="text-slate-400 mb-4">Add your livestock to track health, yields, and valuations.</p>
          <button onClick={() => setShowAdd(true)} className="btn-primary"><Plus className="w-4 h-4" />Add First Animal</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
          {animals.map((a: any) => (
            <div key={a.id} className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-6 shadow-lg hover:border-emerald-500/20 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{getEmoji(a.animal_type)}</span>
                <div className="flex gap-2 items-center">
                  <span className={`badge ${a.health_status === 'healthy' ? 'badge-emerald' : a.health_status === 'sick' ? 'badge-red' : 'badge-amber'}`}>
                    {a.health_status}
                  </span>
                  <button onClick={() => handleDelete(a.id)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white capitalize">{a.breed || a.animal_type}</h3>
              <p className="text-slate-400 text-sm">{a.count} head{a.age_months ? ` • ${Math.floor(a.age_months / 12)}y ${a.age_months % 12}m` : ''}</p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {a.current_market_rate && (
                  <div className="bg-white/[0.03] rounded-lg p-2.5">
                    <p className="text-[10px] text-slate-500 uppercase">Market Rate</p>
                    <p className="text-sm font-semibold text-emerald-400">₹{a.current_market_rate?.toLocaleString('en-IN')}</p>
                  </div>
                )}
                {a.milk_yield_liters_per_day > 0 && (
                  <div className="bg-white/[0.03] rounded-lg p-2.5">
                    <p className="text-[10px] text-slate-500 uppercase">Daily Milk</p>
                    <p className="text-sm font-semibold text-cyan-400">{a.milk_yield_liters_per_day} L</p>
                  </div>
                )}
              </div>
              {a.notes && <p className="text-xs text-slate-500 mt-3">{a.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="border border-white/[0.1] rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Add Animal</h2>
              <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Animal Type *</label>
                  <select className="input-farm select-farm" value={form.animal_type} onChange={e => setForm(f => ({ ...f, animal_type: e.target.value, breed: '' }))}>
                    {ANIMAL_TYPES.map(t => <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Breed</label>
                  <select className="input-farm select-farm" value={form.breed} onChange={e => setForm(f => ({ ...f, breed: e.target.value }))}>
                    <option value="">Select breed</option>
                    {(ANIMAL_BREEDS[form.animal_type] || []).map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Count *</label>
                  <input type="number" className="input-farm" value={form.count} onChange={e => setForm(f => ({ ...f, count: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Age (months)</label>
                  <input type="number" className="input-farm" value={form.age_months} onChange={e => setForm(f => ({ ...f, age_months: e.target.value }))} placeholder="36" />
                </div>
                <div>
                  <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Health</label>
                  <select className="input-farm select-farm" value={form.health_status} onChange={e => setForm(f => ({ ...f, health_status: e.target.value as any }))}>
                    <option value="healthy">Healthy</option>
                    <option value="sick">Sick</option>
                    <option value="under_treatment">Under Treatment</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Purchase ₹</label>
                  <input type="number" className="input-farm" value={form.purchase_price} onChange={e => setForm(f => ({ ...f, purchase_price: e.target.value }))} placeholder="45000" />
                </div>
                <div>
                  <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Market ₹</label>
                  <input type="number" className="input-farm" value={form.current_market_rate} onChange={e => setForm(f => ({ ...f, current_market_rate: e.target.value }))} placeholder="60000" />
                </div>
                <div>
                  <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Milk L/day</label>
                  <input type="number" step="0.1" className="input-farm" value={form.milk_yield_liters_per_day} onChange={e => setForm(f => ({ ...f, milk_yield_liters_per_day: e.target.value }))} placeholder="8" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Notes</label>
                <textarea className="input-farm min-h-[60px] resize-none" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any notes..." />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowAdd(false)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={handleAdd} disabled={isPending} className="btn-primary flex-1 disabled:opacity-50">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add Animal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
