'use client'

import { useState, useEffect, useTransition } from 'react'
import { Package, Plus, Loader2, Trash2, X, AlertTriangle } from 'lucide-react'
import { INVENTORY_TYPES } from '@/lib/constants'
import { getInventory, addItem, deleteItem } from './actions'

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [form, setForm] = useState({
    item_type: 'seed', item_name: '', quantity: '', unit: 'kg',
    purchase_price: '', storage_location: '', expiry_date: ''
  })

  useEffect(() => { load() }, [])
  async function load() {
    setLoading(true)
    try { setItems(await getInventory()) } catch { /* empty */ }
    setLoading(false)
  }

  async function handleAdd() {
    startTransition(async () => {
      await addItem({
        item_type: form.item_type,
        item_name: form.item_name,
        quantity: form.quantity ? parseFloat(form.quantity) : null,
        unit: form.unit || null,
        purchase_price: form.purchase_price ? parseFloat(form.purchase_price) : null,
        storage_location: form.storage_location || null,
        expiry_date: form.expiry_date || null,
      })
      setShowAdd(false)
      setForm({ item_type: 'seed', item_name: '', quantity: '', unit: 'kg', purchase_price: '', storage_location: '', expiry_date: '' })
      await load()
    })
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this item?')) return
    startTransition(async () => { await deleteItem(id); await load() })
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.item_type === filter)
  const totalValue = items.reduce((s, i) => s + ((i.quantity || 0) * (i.purchase_price || 0)), 0)

  function getExpiryStatus(date: string | null): { label: string; color: string } {
    if (!date) return { label: 'No expiry', color: 'slate' }
    const diff = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (diff < 0) return { label: 'Expired', color: 'red' }
    if (diff < 30) return { label: `${diff}d left`, color: 'amber' }
    return { label: 'Fresh', color: 'emerald' }
  }

  const typeInfo = (type: string) => INVENTORY_TYPES.find(t => t.value === type)

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 text-emerald-400 animate-spin" /></div>

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-4">
            <Package className="w-10 h-10 text-emerald-400" />
            Inventory & Storage
          </h1>
          <p className="text-slate-400 mt-2 text-lg font-light">Track seeds, fertilizers, pesticides, harvest, and equipment.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary"><Plus className="w-5 h-5" />Add Item</button>
      </header>

      {/* Summary */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Total Items</p>
            <p className="text-3xl font-bold text-white font-mono">{items.length}</p>
          </div>
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Total Value</p>
            <p className="text-3xl font-bold text-emerald-400 font-mono">₹{totalValue.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Expiring Soon</p>
            <p className="text-3xl font-bold text-amber-400 font-mono">{items.filter(i => { const s = getExpiryStatus(i.expiry_date); return s.color === 'amber' || s.color === 'red' }).length}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'all' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:bg-white/[0.06]'}`}>
          All ({items.length})
        </button>
        {INVENTORY_TYPES.map(t => {
          const count = items.filter(i => i.item_type === t.value).length
          return (
            <button key={t.value} onClick={() => setFilter(t.value)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === t.value ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:bg-white/[0.06]'}`}>
              {t.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-16 text-center shadow-2xl">
          <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Inventory empty</h2>
          <p className="text-slate-400 mb-4">Start tracking your farm supplies and harvested crops.</p>
          <button onClick={() => setShowAdd(true)} className="btn-primary"><Plus className="w-4 h-4" />Add First Item</button>
        </div>
      ) : (
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="text-left p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Item</th>
                <th className="text-left p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Type</th>
                <th className="text-left p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Qty</th>
                <th className="text-left p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Price</th>
                <th className="text-left p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Location</th>
                <th className="text-left p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Expiry</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item: any) => {
                const expiry = getExpiryStatus(item.expiry_date)
                const info = typeInfo(item.item_type)
                return (
                  <tr key={item.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 text-white font-medium">{item.item_name}</td>
                    <td className="p-4"><span className={`badge badge-${info?.color || 'emerald'}`}>{info?.label || item.item_type}</span></td>
                    <td className="p-4 text-slate-300 font-mono">{item.quantity || '—'} {item.unit || ''}</td>
                    <td className="p-4 text-emerald-400 font-mono">{item.purchase_price ? `₹${item.purchase_price.toLocaleString('en-IN')}` : '—'}</td>
                    <td className="p-4 text-slate-400 text-sm">{item.storage_location || '—'}</td>
                    <td className="p-4">
                      <span className={`badge badge-${expiry.color}`}>
                        {expiry.color === 'red' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                        {expiry.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => handleDelete(item.id)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="border border-white/[0.1] rounded-3xl p-8 w-full max-w-lg shadow-2xl" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Add Inventory Item</h2>
              <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Type *</label>
                  <select className="input-farm select-farm" value={form.item_type} onChange={e => setForm(f => ({ ...f, item_type: e.target.value }))}>
                    {INVENTORY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Item Name *</label>
                  <input type="text" className="input-farm" value={form.item_name} onChange={e => setForm(f => ({ ...f, item_name: e.target.value }))} placeholder="e.g. DAP Fertilizer" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Quantity</label>
                  <input type="number" className="input-farm" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} placeholder="50" />
                </div>
                <div>
                  <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Unit</label>
                  <select className="input-farm select-farm" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}>
                    <option value="kg">kg</option><option value="liters">liters</option><option value="bags">bags</option>
                    <option value="quintals">quintals</option><option value="pieces">pieces</option><option value="tons">tons</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Price ₹</label>
                  <input type="number" className="input-farm" value={form.purchase_price} onChange={e => setForm(f => ({ ...f, purchase_price: e.target.value }))} placeholder="1200" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Storage Location</label>
                  <input type="text" className="input-farm" value={form.storage_location} onChange={e => setForm(f => ({ ...f, storage_location: e.target.value }))} placeholder="Warehouse A" />
                </div>
                <div>
                  <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Expiry Date</label>
                  <input type="date" className="input-farm" value={form.expiry_date} onChange={e => setForm(f => ({ ...f, expiry_date: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowAdd(false)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={handleAdd} disabled={!form.item_name || isPending} className="btn-primary flex-1 disabled:opacity-50">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
