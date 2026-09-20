'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { IndianRupee, MapPinned, Leaf, AlertTriangle, Bot, CalendarPlus, TrendingUp, Sprout, Landmark, ChevronRight, Activity, Heart, Package, Loader2 } from 'lucide-react'
import { getDashboardData } from './actions'

const QUICK_ACTIONS = [
  { href: '/dashboard/daily-log', label: "Log Today's Activity", icon: CalendarPlus, color: 'emerald' },
  { href: '/dashboard/ai-chat', label: 'Ask AI Agronomist', icon: Bot, color: 'cyan' },
  { href: '/dashboard/crop-guidance', label: 'Crop Knowledge Base', icon: Sprout, color: 'green' },
  { href: '/dashboard/market', label: 'Check Market Prices', icon: TrendingUp, color: 'amber' },
  { href: '/dashboard/schemes', label: 'Browse Schemes', icon: Landmark, color: 'purple' },
]

const COLOR_ICON: Record<string, string> = {
  emerald: 'bg-emerald-500/10 text-emerald-400',
  cyan: 'bg-cyan-500/10 text-cyan-400',
  green: 'bg-green-500/10 text-green-400',
  amber: 'bg-amber-500/10 text-amber-400',
  purple: 'bg-purple-500/10 text-purple-400',
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const result = await getDashboardData()
        setData(result)
      } catch { /* empty */ }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    )
  }

  const k = data?.kpis || {}
  const profile = data?.profile
  const logs = data?.recentLogs || []

  const KPI_CARDS = [
    {
      label: 'Livestock Value',
      value: k.livestockValue > 0 ? `₹${(k.livestockValue / 100000).toFixed(1)}L` : '₹0',
      icon: IndianRupee,
      orb: 'bg-emerald-500/20', iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400',
      border: 'hover:border-emerald-500/30', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    },
    {
      label: 'Active Plots',
      value: String(k.plotCount || 0).padStart(2, '0'),
      icon: MapPinned,
      orb: 'bg-blue-500/20', iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400',
      border: 'hover:border-blue-500/30', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]',
    },
    {
      label: 'Active Crops',
      value: String(k.activeCrops || 0).padStart(2, '0'),
      icon: Leaf,
      orb: 'bg-cyan-500/20', iconBg: 'bg-cyan-500/10', iconColor: 'text-cyan-400',
      border: 'hover:border-cyan-500/30', glow: 'shadow-[0_0_20px_rgba(6,182,212,0.15)]',
    },
    {
      label: 'Active Alerts',
      value: String(k.alertCount || 0).padStart(2, '0'),
      icon: AlertTriangle,
      orb: 'bg-red-500/20', iconBg: 'bg-red-500/10', iconColor: 'text-red-400',
      border: 'hover:border-red-500/30', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]',
    },
  ]

  return (
    <div className="space-y-8 stagger-children">
      {/* Header */}
      <header className="flex items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white">Command Center</h1>
          {profile && (
            <p className="text-slate-500 text-sm mt-1">Welcome back, {profile.full_name} • {profile.district || ''}, {profile.state || ''}</p>
          )}
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full ml-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold text-emerald-400">Live</span>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {KPI_CARDS.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className={`relative overflow-hidden backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 ${card.border} transition-all ${card.glow}`}
              style={{ backgroundColor: 'var(--color-bg-elevated)' }}
            >
              <div className={`absolute -top-8 -right-8 w-24 h-24 ${card.orb} rounded-full blur-2xl pointer-events-none`} />
              <div className="relative z-10">
                <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">{card.label}</p>
                <p className="text-3xl font-bold text-white font-mono">{card.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Farm Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 text-center">
          <p className="text-2xl font-bold text-white font-mono">{k.farmCount || 0}</p>
          <p className="text-xs text-slate-500 mt-1">Farms</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 text-center">
          <p className="text-2xl font-bold text-emerald-400 font-mono">{k.totalArea?.toFixed(1) || 0}</p>
          <p className="text-xs text-slate-500 mt-1">Total Acres</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 text-center">
          <p className="text-2xl font-bold text-cyan-400 font-mono">{k.totalAnimals || 0}</p>
          <p className="text-xs text-slate-500 mt-1">Animals</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 text-center">
          <p className="text-2xl font-bold text-amber-400 font-mono">{k.inventoryItems || 0}</p>
          <p className="text-xs text-slate-500 mt-1">Inventory Items</p>
        </div>
      </div>

      {/* AI Brief + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Daily Brief */}
        <div className="lg:col-span-2 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Farm Status Summary</h3>
              <p className="text-xs text-emerald-500 uppercase tracking-widest font-semibold">Real-time Data</p>
            </div>
          </div>
          <div className="bg-black/30 border border-white/[0.05] rounded-2xl p-6 mb-6 space-y-3">
            <p className="text-slate-300 leading-relaxed">
              You have <strong className="text-white">{k.farmCount} farm{k.farmCount !== 1 ? 's' : ''}</strong> with <strong className="text-white">{k.plotCount} active plot{k.plotCount !== 1 ? 's' : ''}</strong> covering <strong className="text-emerald-400">{k.totalArea?.toFixed(1) || 0} acres</strong>.
              {k.activeCrops > 0 && <> Currently growing <strong className="text-white">{k.activeCrops} crop type{k.activeCrops !== 1 ? 's' : ''}</strong>.</>}
            </p>
            {k.totalAnimals > 0 && (
              <p className="text-slate-300 leading-relaxed">
                Livestock portfolio: <strong className="text-white">{k.totalAnimals} animals</strong> valued at <strong className="text-emerald-400">₹{k.livestockValue.toLocaleString('en-IN')}</strong>.
                {k.dailyMilk > 0 && <> Daily milk yield: <strong className="text-cyan-400">{k.dailyMilk.toFixed(1)}L</strong>.</>}
                {k.sickAnimals > 0 && <> ⚠️ <strong className="text-red-400">{k.sickAnimals} animal{k.sickAnimals !== 1 ? 's' : ''}</strong> need attention.</>}
              </p>
            )}
            {k.alertCount > 0 && (
              <p className="text-red-400 text-sm">
                ⚠️ {k.alertCount} pest/disease alert{k.alertCount !== 1 ? 's' : ''} in recent logs — check your daily log history.
              </p>
            )}
            {k.expiringItems > 0 && (
              <p className="text-amber-400 text-sm">
                📦 {k.expiringItems} inventory item{k.expiringItems !== 1 ? 's' : ''} expiring within 30 days.
              </p>
            )}
            {k.logCount === 0 && k.farmCount === 0 && (
              <p className="text-slate-500">
                Get started by adding your first farm and logging daily activities. The AI engine will build your personal knowledge base.
              </p>
            )}
          </div>
          <Link href="/dashboard/ai-chat" className="btn-primary">
            <Bot className="w-4 h-4" />
            Open AI Chat
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 shadow-2xl">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-400" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05] transition-all group"
                >
                  <div className={`w-10 h-10 rounded-xl ${COLOR_ICON[action.color]} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors flex-1">{action.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Swarm Fleet Telemetry */}
      <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.15),transparent_50%)] pointer-events-none" />
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h3 className="font-bold text-white text-xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
              Swarm Fleet Telemetry
            </h3>
            <p className="text-sm text-slate-400 mt-1">Real-time status of autonomous micro-robot fleets</p>
          </div>
          <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl">
            <p className="text-xs font-bold text-purple-400 uppercase tracking-widest">Active Units: 65/200</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div className="bg-black/40 border border-white/5 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Laser Weeding</p>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-white font-mono mb-1">50 <span className="text-sm text-slate-500 font-sans font-normal">units</span></p>
            <p className="text-xs text-emerald-400">Sector Alpha • 45m remaining</p>
            <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-emerald-500 h-full w-[60%]" />
            </div>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nano-Dosing</p>
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
            </div>
            <p className="text-2xl font-bold text-white font-mono mb-1">15 <span className="text-sm text-slate-500 font-sans font-normal">aerial drones</span></p>
            <p className="text-xs text-cyan-400">Sector Delta • 12m remaining</p>
            <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-cyan-500 h-full w-[85%]" />
            </div>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-2xl p-5 border-dashed">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Charging Hub</p>
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            </div>
            <p className="text-2xl font-bold text-slate-400 font-mono mb-1">135 <span className="text-sm text-slate-600 font-sans font-normal">standby</span></p>
            <p className="text-xs text-amber-500/70">Hubs A, B, C • 100% capacity</p>
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl">
        <h3 className="font-bold text-white mb-6">Recent Activity</h3>
        {logs.length === 0 ? (
          <p className="text-slate-500 text-sm">No recent activity. Start logging daily field observations to see activity here.</p>
        ) : (
          <div className="space-y-4">
            {logs.map((log: any, i: number) => (
              <div key={log.id || i} className="flex items-start gap-4">
                <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${log.pest_observed || log.disease_observed ? 'bg-red-400' : 'bg-emerald-400'}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-300">
                    Daily log: {log.weather_condition || 'N/A'}, {log.temperature_celsius ? `${log.temperature_celsius}°C` : ''}
                    {log.pest_observed && ' — ⚠️ Pest detected'}
                    {log.disease_observed && ' — ⚠️ Disease detected'}
                    {log.notes && ` — ${log.notes.substring(0, 80)}${log.notes.length > 80 ? '...' : ''}`}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">{new Date(log.created_at).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
