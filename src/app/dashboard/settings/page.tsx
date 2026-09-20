'use client'

import { useState, useEffect, useTransition } from 'react'
import { Settings, User, MapPinned, Bell, Wifi, Save, Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { INDIAN_STATES } from '@/lib/constants'
import { getProfile, updateProfile, getApiStatus, getFarmsForSettings } from './actions'
import Link from 'next/link'

type Tab = 'profile' | 'farms' | 'notifications' | 'api'

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('profile')
  const [profile, setProfile] = useState<any>(null)
  const [farms, setFarms] = useState<any[]>([])
  const [apiStatus, setApiStatus] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    state: '',
    district: '',
    village: '',
    land_holding_acres: '',
    farming_type: 'conventional' as 'organic' | 'conventional' | 'mixed',
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [profileData, farmsData, statusData] = await Promise.all([
        getProfile(),
        getFarmsForSettings(),
        getApiStatus(),
      ])
      setProfile(profileData)
      setFarms(farmsData)
      setApiStatus(statusData)
      if (profileData) {
        setForm({
          full_name: profileData.full_name || '',
          phone: profileData.phone || '',
          state: profileData.state || '',
          district: profileData.district || '',
          village: profileData.village || '',
          land_holding_acres: profileData.land_holding_acres?.toString() || '',
          farming_type: profileData.farming_type || 'conventional',
        })
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      await updateProfile({
        full_name: form.full_name,
        phone: form.phone || null,
        village: form.village || null,
        district: form.district || null,
        state: form.state,
        land_holding_acres: form.land_holding_acres ? parseFloat(form.land_holding_acres) : null,
        farming_type: form.farming_type,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function refreshApiStatus() {
    startTransition(async () => {
      const data = await getApiStatus()
      setApiStatus(data)
    })
  }

  const TABS = [
    { key: 'profile' as Tab, label: 'Profile', icon: User },
    { key: 'farms' as Tab, label: 'Farm Details', icon: MapPinned },
    { key: 'notifications' as Tab, label: 'Notifications', icon: Bell },
    { key: 'api' as Tab, label: 'API Status', icon: Wifi },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header>
        <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-4">
          <Settings className="w-10 h-10 text-emerald-400" />
          Settings
        </h1>
        <p className="text-slate-400 mt-2 text-lg font-light">Manage your profile, preferences, and system configuration.</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.08] w-fit">
        {TABS.map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === t.key
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl">
        {/* Profile Tab */}
        {tab === 'profile' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Farmer Profile</h2>
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Full Name</label>
                <input type="text" className="input-farm" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Your full name" />
              </div>
              <div>
                <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Phone</label>
                <input type="tel" className="input-farm" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">State</label>
                <select className="input-farm select-farm" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">District</label>
                <input type="text" className="input-farm" value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))} placeholder="Your district" />
              </div>
              <div>
                <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Village</label>
                <input type="text" className="input-farm" value={form.village} onChange={e => setForm(f => ({ ...f, village: e.target.value }))} placeholder="Your village" />
              </div>
              <div>
                <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Land Holding (acres)</label>
                <input type="number" className="input-farm" value={form.land_holding_acres} onChange={e => setForm(f => ({ ...f, land_holding_acres: e.target.value }))} placeholder="25" />
              </div>
              <div>
                <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Farming Type</label>
                <select className="input-farm select-farm" value={form.farming_type} onChange={e => setForm(f => ({ ...f, farming_type: e.target.value as any }))}>
                  <option value="organic">Organic</option>
                  <option value="conventional">Conventional</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-8">
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              {saved && (
                <span className="text-emerald-400 text-sm flex items-center gap-1 animate-fade-in-up">
                  <CheckCircle className="w-4 h-4" />
                  Profile saved successfully
                </span>
              )}
            </div>
          </div>
        )}

        {/* Farm Details Tab */}
        {tab === 'farms' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Farm Details</h2>
            {farms.length === 0 ? (
              <div className="text-center py-12">
                <MapPinned className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">No farms registered yet.</p>
                <Link href="/dashboard/farms" className="btn-primary">
                  <MapPinned className="w-4 h-4" />
                  Go to My Farms
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {farms.map((farm: any) => (
                  <div key={farm.id} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <h3 className="font-semibold text-white">{farm.name}</h3>
                    <p className="text-slate-400 text-sm mt-1">
                      {farm.total_area_acres} acres • {farm.soil_type || 'N/A'} soil • {farm.water_source || 'N/A'}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">{farm.plots?.length || 0} active plots</p>
                  </div>
                ))}
                <Link href="/dashboard/farms" className="btn-ghost inline-flex mt-2">
                  <MapPinned className="w-4 h-4" />
                  Manage Farms
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Notifications Tab */}
        {tab === 'notifications' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
            <div className="space-y-4">
              {[
                { label: 'Daily AI Brief', desc: 'Receive morning analysis of your farm status' },
                { label: 'Market Price Alerts', desc: 'Get notified when your crop prices change significantly' },
                { label: 'Weather Warnings', desc: 'Severe weather alerts for your farm location' },
                { label: 'Scheme Deadlines', desc: 'Reminders before government scheme deadlines' },
                { label: 'Pest & Disease Alerts', desc: 'AI-detected threats in your daily logs' },
              ].map((n, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <div>
                    <p className="text-white font-medium">{n.label}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{n.desc}</p>
                  </div>
                  <div className="w-12 h-6 rounded-full bg-emerald-500 relative cursor-pointer">
                    <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full transition-transform" />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-600 mt-4">Push notification support coming soon.</p>
          </div>
        )}

        {/* API Status Tab */}
        {tab === 'api' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">System Status</h2>
              <button onClick={refreshApiStatus} disabled={isPending} className="btn-ghost text-xs">
                <RefreshCw className={`w-3 h-3 ${isPending ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
            <div className="space-y-3">
              {apiStatus.map((svc, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${svc.status === 'connected' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <span className="text-white font-medium">{svc.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {svc.latencyMs > 0 && (
                      <span className="text-xs text-slate-500">{svc.latencyMs}ms</span>
                    )}
                    <span className={`badge ${svc.status === 'connected' ? 'badge-emerald' : 'badge-red'}`}>
                      {svc.status === 'connected' ? 'Connected' : 'Error'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-600 mt-4">Auto-refresh every 30 seconds when this tab is active.</p>
          </div>
        )}
      </div>
    </div>
  )
}
