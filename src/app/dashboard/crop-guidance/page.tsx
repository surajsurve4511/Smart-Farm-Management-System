'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, ChevronRight, Sprout, Calendar, TrendingUp, MapPin, IndianRupee, FlaskConical } from 'lucide-react'
import { CROP_DATABASE, searchCrops } from '@/lib/cropData'
import type { CropSeason, CropCategory, CropEntry } from '@/lib/cropTypes'

// ============================================
// Constants
// ============================================

const SEASONS: { value: CropSeason | 'all'; label: string }[] = [
  { value: 'all', label: 'All Seasons' },
  { value: 'kharif', label: 'Kharif' },
  { value: 'rabi', label: 'Rabi' },
  { value: 'zaid', label: 'Zaid' },
  { value: 'perennial', label: 'Perennial' },
]

const CATEGORIES: { value: CropCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'cereal', label: 'Cereal' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'oilseed', label: 'Oilseed' },
  { value: 'cashcrop', label: 'Cash Crop' },
  { value: 'vegetable', label: 'Vegetable' },
  { value: 'spice', label: 'Spice' },
  { value: 'fruit', label: 'Fruit' },
]

const SEASON_BADGE_CLASS: Record<string, string> = {
  kharif: 'badge-amber',
  rabi: 'badge-cyan',
  zaid: 'badge-emerald',
  perennial: 'badge-purple',
}

const SEASON_LABEL: Record<string, string> = {
  kharif: 'Kharif',
  rabi: 'Rabi',
  zaid: 'Zaid',
  perennial: 'Perennial',
}

const ORB_COLORS: Record<string, string> = {
  amber: 'bg-amber-500/30',
  cyan: 'bg-cyan-500/30',
  emerald: 'bg-emerald-500/30',
  purple: 'bg-purple-500/30',
  pink: 'bg-pink-500/30',
  lime: 'bg-lime-500/30',
  yellow: 'bg-yellow-500/30',
  orange: 'bg-orange-500/30',
  green: 'bg-green-500/30',
  rose: 'bg-rose-500/30',
}

// ============================================
// Crop Card Component
// ============================================

function CropCard({ crop }: { crop: CropEntry }) {
  const orbColor = ORB_COLORS[crop.colorScheme.primary] || 'bg-emerald-500/30'
  const seasonBadge = SEASON_BADGE_CLASS[crop.season] || 'badge-emerald'
  const topStates = crop.suitableStates.slice(0, 3).join(', ')
  const hasMoreStates = crop.suitableStates.length > 3

  return (
    <Link
      href={`/dashboard/crop-guidance/${crop.slug}`}
      className="group relative overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300 hover:-translate-y-0.5 block"
    >
      {/* Color-coded glow orb */}
      <div
        className={`absolute -top-10 -left-10 w-28 h-28 ${orbColor} rounded-full blur-3xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <div className="relative z-10">
        {/* Top row: Emoji + Season Badge */}
        <div className="flex items-start justify-between mb-1">
          <span className="text-3xl">{crop.emoji}</span>
          <span className={`badge ${seasonBadge}`}>
            {SEASON_LABEL[crop.season]}
          </span>
        </div>

        {/* Category badge (muted) */}
        <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-slate-500 bg-white/[0.04] border border-white/[0.06] rounded-full px-2.5 py-0.5 mb-3">
          {crop.category === 'cashcrop' ? 'Cash Crop' : crop.category}
        </span>

        {/* Crop Name */}
        <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors duration-300">
          {crop.name}
        </h3>
        <p className="text-sm text-slate-500 mb-4">{crop.hindiName}</p>

        {/* Divider */}
        <div className="border-t border-white/[0.06] my-4" />

        {/* Quick Stats */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 text-sm text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>
              Duration:{' '}
              <span className="text-slate-300 font-medium">
                {crop.durationDays[0]}–{crop.durationDays[1]} days
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-sm text-slate-400">
            <TrendingUp className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>
              Yield:{' '}
              <span className="text-slate-300 font-medium">
                {crop.expectedYield.min}–{crop.expectedYield.max} {crop.expectedYield.unit}
              </span>
            </span>
          </div>

          {crop.msp2024 !== null && (
            <div className="flex items-center gap-2.5 text-sm text-slate-400">
              <IndianRupee className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>
                MSP:{' '}
                <span className="text-slate-300 font-medium">
                  ₹{crop.msp2024.toLocaleString('en-IN')}/qtl
                </span>
              </span>
            </div>
          )}

          <div className="flex items-center gap-2.5 text-sm text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">
              Top States:{' '}
              <span className="text-slate-300 font-medium">
                {topStates}{hasMoreStates && '…'}
              </span>
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.06] my-4" />

        {/* Specialist */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-7 h-7 rounded-lg ${crop.colorScheme.iconBg} flex items-center justify-center`}>
            <FlaskConical className={`w-3.5 h-3.5 ${crop.colorScheme.iconColor}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-emerald-400 font-medium truncate">
              {crop.specialistPersona.name}
            </p>
            <p className="text-[10px] text-slate-600 truncate">
              {crop.specialistPersona.institution}
            </p>
          </div>
        </div>

        {/* View Guide Link */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors">
            View Full Guide
          </span>
          <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 group-hover:text-emerald-300 transition-all duration-300" />
        </div>
      </div>
    </Link>
  )
}

// ============================================
// Main Page
// ============================================

export default function CropGuidancePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSeason, setActiveSeason] = useState<CropSeason | 'all'>('all')
  const [activeCategory, setActiveCategory] = useState<CropCategory | 'all'>('all')

  const filteredCrops = useMemo(() => {
    let crops: CropEntry[] = searchQuery ? searchCrops(searchQuery) : [...CROP_DATABASE]

    if (activeSeason !== 'all') {
      crops = crops.filter((c) => c.season === activeSeason)
    }
    if (activeCategory !== 'all') {
      crops = crops.filter((c) => c.category === activeCategory)
    }

    return crops
  }, [searchQuery, activeSeason, activeCategory])

  return (
    <div className="space-y-8">
      {/* ——— Header ——— */}
      <header className="animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            Crop Guidance
          </h1>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400">
              {CROP_DATABASE.length} Crops · ICAR Research · Regional Specialists
            </span>
          </div>
        </div>
        <p className="text-slate-400 text-sm max-w-2xl">
          Research-grade growing guides with personalized AI specialist consultants for every crop
        </p>
      </header>

      {/* ——— Filter Bar (sticky) ——— */}
      <div className="sticky top-0 z-30 -mx-1 px-1 py-4 backdrop-blur-2xl border-b border-white/[0.04]" style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg-primary) 80%, transparent)' }}>
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search crops, states, categories…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-farm pl-11"
            />
          </div>

          {/* Season Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mr-1">
              Season
            </span>
            {SEASONS.map((s) => (
              <button
                key={s.value}
                onClick={() => setActiveSeason(s.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                  activeSeason === s.value
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.06] hover:text-slate-300 hover:border-white/[0.10]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mr-1">
              Category
            </span>
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setActiveCategory(c.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                  activeCategory === c.value
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.06] hover:text-slate-300 hover:border-white/[0.10]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Result Count */}
          <p className="text-xs text-slate-500">
            Showing{' '}
            <span className="text-slate-300 font-semibold">{filteredCrops.length}</span>{' '}
            of {CROP_DATABASE.length} crops
          </p>
        </div>
      </div>

      {/* ——— Crop Grid ——— */}
      {filteredCrops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children">
          {filteredCrops.map((crop) => (
            <CropCard key={crop.slug} crop={crop} />
          ))}
        </div>
      ) : (
        /* ——— Empty State ——— */
        <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-6">
            <Sprout className="w-8 h-8 text-slate-600" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No crops found</h3>
          <p className="text-sm text-slate-500 text-center max-w-sm">
            Try adjusting your search query or filter selections to discover crops in our database.
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setActiveSeason('all')
              setActiveCategory('all')
            }}
            className="btn-ghost mt-6"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}
