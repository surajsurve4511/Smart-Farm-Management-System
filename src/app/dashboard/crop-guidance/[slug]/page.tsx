'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Clock, Sprout, Droplets, FlaskConical, Shield, Scissors,
  ChevronRight, Bug, AlertTriangle, Bot, Send, Loader2, BookOpen,
  ThermometerSun, MapPin, IndianRupee, Layers, Leaf, Calendar,
  Beaker, Target, ExternalLink, CheckCircle2, XCircle, Sparkles
} from 'lucide-react'
import { getCropBySlug } from '@/lib/cropData'
import { askCropSpecialist } from '../actions'
import type { CropEntry, CropChatMessage, LifecycleStage, PestEntry, DiseaseEntry } from '@/lib/cropTypes'

// ============================================
// Tab definitions
// ============================================
const TABS = [
  { id: 'overview', label: 'Overview', icon: Layers },
  { id: 'growing-guide', label: 'Growing Guide', icon: Sprout },
  { id: 'pest-atlas', label: 'Pest & Disease', icon: Bug },
  { id: 'specialist', label: 'AI Specialist', icon: Bot },
  { id: 'research', label: 'Research', icon: BookOpen },
] as const

type TabId = (typeof TABS)[number]['id']

// ============================================
// Lifecycle stage icon mapping
// ============================================
const STAGE_ICONS: Record<string, typeof Sprout> = {
  preparation: Layers,
  sowing: Sprout,
  germination: Leaf,
  irrigation: Droplets,
  nutrition: FlaskConical,
  vegetative: Leaf,
  flowering: Sparkles,
  protection: Shield,
  harvesting: Scissors,
  'post-harvest': Target,
}

// ============================================
// Severity color mapping
// ============================================
const SEVERITY_COLORS = {
  low: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', label: 'Low Risk' },
  medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', label: 'Medium Risk' },
  high: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', label: 'High Risk' },
}

// ============================================
// Season badge styles
// ============================================
const SEASON_STYLES: Record<string, string> = {
  kharif: 'badge-amber',
  rabi: 'badge-cyan',
  zaid: 'badge-emerald',
  perennial: 'badge-purple',
}

// ============================================
// Main Component
// ============================================
export default function CropDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const crop = getCropBySlug(slug)
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  if (!crop) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Sprout className="w-16 h-16 text-slate-600" />
        <h2 className="text-2xl font-bold text-white">Crop Not Found</h2>
        <p className="text-slate-400">The crop you&apos;re looking for doesn&apos;t exist in our database.</p>
        <Link href="/dashboard/crop-guidance" className="btn-primary mt-4">
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Breadcrumb + Header */}
      <div>
        <Link
          href="/dashboard/crop-guidance"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-400 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Crop Catalog
        </Link>

        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          {/* Crop emoji + name */}
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl ${crop.colorScheme.iconBg} flex items-center justify-center text-3xl shadow-lg`}>
              {crop.emoji}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
                {crop.name}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">{crop.hindiName}</p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 md:ml-auto">
            <span className={`badge ${SEASON_STYLES[crop.season] || 'badge-emerald'}`}>
              {crop.seasonLabel}
            </span>
            <span className="badge bg-white/[0.05] text-slate-400 border border-white/[0.08]">
              {crop.category.charAt(0).toUpperCase() + crop.category.slice(1)}
            </span>
            {crop.msp2024 && (
              <span className="badge badge-emerald">
                <IndianRupee className="w-3 h-3" />
                MSP ₹{crop.msp2024.toLocaleString()}/qtl
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white/[0.08] text-white border border-white/[0.1] shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                  : 'text-slate-500 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : ''}`} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'overview' && <OverviewTab crop={crop} />}
        {activeTab === 'growing-guide' && <GrowingGuideTab crop={crop} />}
        {activeTab === 'pest-atlas' && <PestAtlasTab crop={crop} />}
        {activeTab === 'specialist' && <SpecialistTab crop={crop} />}
        {activeTab === 'research' && <ResearchTab crop={crop} />}
      </div>
    </div>
  )
}

// ============================================
// TAB 1: Overview
// ============================================
function OverviewTab({ crop }: { crop: CropEntry }) {
  const stats = [
    { label: 'Duration', value: `${crop.durationDays[0]}–${crop.durationDays[1]} days`, icon: Clock, color: 'amber' },
    { label: 'Expected Yield', value: `${crop.expectedYield.min}–${crop.expectedYield.max} ${crop.expectedYield.unit}`, icon: Target, color: 'emerald' },
    { label: 'Temperature', value: crop.temperatureRange, icon: ThermometerSun, color: 'red' },
    { label: 'Water Needed', value: crop.waterRequirement, icon: Droplets, color: 'blue' },
    { label: 'Seed Rate', value: crop.seedRatePerAcre, icon: Sprout, color: 'green' },
    { label: 'Spacing', value: crop.spacing, icon: Layers, color: 'purple' },
  ]

  const colorMap: Record<string, { iconBg: string; iconColor: string; glow: string }> = {
    amber: { iconBg: 'bg-amber-500/10', iconColor: 'text-amber-400', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.1)]' },
    emerald: { iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.1)]' },
    red: { iconBg: 'bg-red-500/10', iconColor: 'text-red-400', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.1)]' },
    blue: { iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.1)]' },
    green: { iconBg: 'bg-green-500/10', iconColor: 'text-green-400', glow: 'shadow-[0_0_15px_rgba(34,197,94,0.1)]' },
    purple: { iconBg: 'bg-purple-500/10', iconColor: 'text-purple-400', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.1)]' },
  }

  return (
    <div className="space-y-6 stagger-children">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          const colors = colorMap[stat.color]
          return (
            <div
              key={stat.label}
              className={`bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 ${colors.glow} hover:border-white/[0.15] transition-all`}
            >
              <div className={`w-8 h-8 rounded-lg ${colors.iconBg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${colors.iconColor}`} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
              <p className="text-sm font-bold text-white">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Suitable States & Soils */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            Best Growing States
          </h3>
          <div className="flex flex-wrap gap-2">
            {crop.suitableStates.map((state) => (
              <span key={state} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-500/20">
                {state}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            Suitable Soil Types
          </h3>
          <div className="flex flex-wrap gap-2">
            {crop.suitableSoils.map((soil) => (
              <span key={soil} className="px-3 py-1.5 bg-amber-500/10 text-amber-400 text-xs font-semibold rounded-lg border border-amber-500/20">
                {soil}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Varieties */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <Sprout className="w-4 h-4 text-cyan-400" />
          Recommended Varieties
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {crop.varieties.map((variety) => (
            <div
              key={variety.name}
              className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl hover:border-white/[0.12] transition-all"
            >
              <p className="font-bold text-white text-sm">{variety.name}</p>
              <p className="text-xs text-cyan-400 font-semibold mt-0.5">{variety.type}</p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{variety.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lifecycle Timeline (horizontal scroll preview) */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-400" />
          Crop Lifecycle
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {crop.lifecycle.map((stage, i) => {
            const StageIcon = STAGE_ICONS[stage.stage] || Leaf
            return (
              <div key={stage.stage} className="flex items-center gap-3 shrink-0">
                <div className="flex flex-col items-center gap-2 min-w-[120px]">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <StageIcon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-xs font-bold text-white text-center">{stage.title}</p>
                  <p className="text-[10px] text-slate-500">{stage.durationDays}</p>
                </div>
                {i < crop.lifecycle.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ============================================
// TAB 2: Growing Guide
// ============================================
function GrowingGuideTab({ crop }: { crop: CropEntry }) {
  const [expandedStage, setExpandedStage] = useState<string | null>(crop.lifecycle[0]?.stage || null)

  return (
    <div className="space-y-6">
      {/* Lifecycle Accordion */}
      <div className="space-y-3">
        {crop.lifecycle.map((stage: LifecycleStage, index: number) => {
          const StageIcon = STAGE_ICONS[stage.stage] || Leaf
          const isExpanded = expandedStage === stage.stage
          return (
            <div
              key={stage.stage}
              className={`bg-white/[0.03] backdrop-blur-xl border rounded-2xl overflow-hidden transition-all ${
                isExpanded ? 'border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-white/[0.08]'
              }`}
            >
              <button
                onClick={() => setExpandedStage(isExpanded ? null : stage.stage)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-600 w-6">{String(index + 1).padStart(2, '0')}</span>
                  <div className={`w-10 h-10 rounded-xl ${isExpanded ? 'bg-emerald-500/20' : 'bg-white/[0.05]'} flex items-center justify-center transition-colors`}>
                    <StageIcon className={`w-5 h-5 ${isExpanded ? 'text-emerald-400' : 'text-slate-400'}`} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold ${isExpanded ? 'text-white' : 'text-slate-300'}`}>{stage.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{stage.durationDays}</p>
                </div>
                <ChevronRight className={`w-5 h-5 text-slate-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 space-y-4 border-t border-white/[0.06] pt-4 animate-fade-in">
                  <p className="text-sm text-slate-300 leading-relaxed">{stage.description}</p>

                  {/* Key Actions */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-500/70 mb-2">Key Actions</p>
                    <div className="space-y-2">
                      {stage.keyActions.map((action, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                          <p className="text-sm text-slate-300">{action}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pro Tips */}
                  {stage.proTips.length > 0 && (
                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">💡 Pro Tips</p>
                      <div className="space-y-1.5">
                        {stage.proTips.map((tip, i) => (
                          <p key={i} className="text-sm text-emerald-300/80">{tip}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Fertilizer Schedule */}
      {crop.fertilizerSchedule.length > 0 && (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Beaker className="w-4 h-4 text-blue-400" />
            Fertilizer Schedule
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Stage</th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Timing</th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Fertilizer</th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Dose / Acre</th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Method</th>
                </tr>
              </thead>
              <tbody>
                {crop.fertilizerSchedule.map((item, i) => (
                  <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 text-white font-medium">{item.stage}</td>
                    <td className="py-3 px-4 text-slate-400">{item.timing}</td>
                    <td className="py-3 px-4 text-cyan-400 font-medium">{item.fertilizer}</td>
                    <td className="py-3 px-4 text-slate-300">{item.dosePerAcre}</td>
                    <td className="py-3 px-4 text-slate-400">{item.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Irrigation Schedule */}
      {crop.irrigationSchedule.length > 0 && (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-400" />
            Irrigation Schedule
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {crop.irrigationSchedule.map((item, i) => (
              <div key={i} className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-white text-sm">{item.stage}</p>
                  <span className="text-xs text-blue-400 font-mono">{item.frequency}</span>
                </div>
                <p className="text-xs text-slate-400 mb-1">Water: {item.waterPerAcre}</p>
                <p className="text-xs text-amber-400 font-medium">⚠️ {item.criticalNote}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// TAB 3: Pest & Disease Atlas
// ============================================
function PestAtlasTab({ crop }: { crop: CropEntry }) {
  return (
    <div className="space-y-8">
      {/* Pests Section */}
      <div>
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <Bug className="w-5 h-5 text-amber-400" />
          Common Pests
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {crop.pests.map((pest: PestEntry) => {
            const severity = SEVERITY_COLORS[pest.severity]
            return (
              <div
                key={pest.name}
                className={`bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 hover:border-white/[0.15] transition-all`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-white">{pest.name}</h4>
                  <span className={`badge ${severity.bg} ${severity.text} ${severity.border}`}>
                    {severity.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3">Affects: {pest.affectedStage}</p>

                {/* Symptoms */}
                <div className="mb-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Symptoms</p>
                  <div className="space-y-1">
                    {pest.symptoms.map((s, i) => (
                      <p key={i} className="text-xs text-slate-400 flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5">•</span> {s}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-red-400/70 mb-1.5">Chemical</p>
                    {pest.chemicalControl.map((c, i) => (
                      <p key={i} className="text-xs text-slate-400">{c}</p>
                    ))}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/70 mb-1.5">Organic</p>
                    {pest.organicControl.map((c, i) => (
                      <p key={i} className="text-xs text-slate-400">{c}</p>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Diseases Section */}
      <div>
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          Common Diseases
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {crop.diseases.map((disease: DiseaseEntry) => {
            const severity = SEVERITY_COLORS[disease.severity]
            return (
              <div
                key={disease.name}
                className={`bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 hover:border-white/[0.15] transition-all`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white">{disease.name}</h4>
                  <span className={`badge ${severity.bg} ${severity.text} ${severity.border}`}>
                    {severity.label}
                  </span>
                </div>
                <p className="text-xs text-purple-400 font-medium mb-3">Caused by: {disease.causalAgent}</p>
                <p className="text-xs text-slate-500 mb-3">Affects: {disease.affectedStage}</p>

                {/* Symptoms */}
                <div className="mb-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Symptoms</p>
                  <div className="space-y-1">
                    {disease.symptoms.map((s, i) => (
                      <p key={i} className="text-xs text-slate-400 flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">•</span> {s}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-red-400/70 mb-1.5">Chemical</p>
                    {disease.chemicalControl.map((c, i) => (
                      <p key={i} className="text-xs text-slate-400">{c}</p>
                    ))}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/70 mb-1.5">Organic</p>
                    {disease.organicControl.map((c, i) => (
                      <p key={i} className="text-xs text-slate-400">{c}</p>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ============================================
// TAB 4: AI Specialist Consultant
// ============================================
function SpecialistTab({ crop }: { crop: CropEntry }) {
  const [messages, setMessages] = useState<CropChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const starterQuestions = [
    `What's the best ${crop.name.toLowerCase()} variety for my soil type?`,
    `What are the current pest threats for ${crop.name.toLowerCase()}?`,
    `When should I irrigate my ${crop.name.toLowerCase()} crop?`,
    `How can I increase my ${crop.name.toLowerCase()} yield this season?`,
  ]

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (question: string) => {
    if (!question.trim() || loading) return

    const userMsg: CropChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: question.trim(),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const result = await askCropSpecialist(question.trim(), crop.slug)
      const aiMsg: CropChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.text,
        timestamp: new Date(),
        ragSourceCount: result.ragSourceCount,
      }
      setMessages(prev => [...prev, aiMsg])
    } catch {
      const errMsg: CropChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setLoading(false)
    }
  }

  const specialist = crop.specialistPersona

  return (
    <div className="space-y-6">
      {/* Specialist Card */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.08)]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/20 shrink-0">
            {specialist.avatarInitials}
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{specialist.name}</h3>
            <p className="text-sm text-emerald-400 font-medium">{specialist.title}</p>
            <p className="text-xs text-slate-500 mt-0.5">{specialist.institution} · {specialist.region}</p>
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-4 leading-relaxed">{specialist.expertise}</p>
        <div className="flex items-center gap-2 mt-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <p className="text-xs text-emerald-500 font-semibold">Powered by ICAR Research + Your Farm Logs · Gemini 2.5 Flash</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl overflow-hidden">
        {/* Messages */}
        <div className="h-[400px] overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <Bot className="w-12 h-12 text-slate-600" />
              <div>
                <p className="text-slate-400 font-medium">Ask {specialist.name.split(' ')[0]} anything about {crop.name}</p>
                <p className="text-xs text-slate-600 mt-1">Personalized advice powered by ICAR research data</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-lg mt-2">
                {starterQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="text-left p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/[0.06] hover:border-emerald-500/30 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                  msg.role === 'user'
                    ? 'bg-emerald-500/15 border border-emerald-500/20 text-white'
                    : 'bg-white/[0.04] border border-white/[0.08] text-slate-300'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-md bg-emerald-500/20 flex items-center justify-center">
                      <Bot className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/70">{specialist.name.split(',')[0]}</span>
                    {msg.ragSourceCount && msg.ragSourceCount > 0 && (
                      <span className="text-[10px] text-slate-600">· {msg.ragSourceCount} research sources</span>
                    )}
                  </div>
                )}
                <div className={`text-sm leading-relaxed ${msg.role === 'assistant' ? 'markdown-content' : ''}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl px-5 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span className="text-xs text-slate-500">Consulting research data...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-white/[0.06] p-4">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(input) }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask about ${crop.name.toLowerCase()} cultivation...`}
              className="input-farm flex-1"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="btn-primary px-4"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ============================================
// TAB 5: Research Sources
// ============================================
function ResearchTab({ crop }: { crop: CropEntry }) {
  return (
    <div className="space-y-6">
      {/* Research Context Summary */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          Research Knowledge Base
        </h3>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-3">
          Synthesized from ICAR publications & State Agricultural University field trials
        </p>
        <div className="bg-black/30 border border-white/[0.05] rounded-2xl p-5">
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {crop.researchContext}
          </p>
        </div>
      </div>

      {/* ICAR Reference */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-amber-400" />
          Primary Reference
        </h3>
        <p className="text-sm text-slate-300">{crop.icarRef}</p>
      </div>

      {/* Source URLs */}
      {crop.sources.length > 0 && (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-purple-400" />
            Official Sources & Citations
          </h3>
          <div className="space-y-2">
            {crop.sources.map((source, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl"
              >
                <ExternalLink className="w-4 h-4 text-slate-500 shrink-0" />
                <p className="text-sm text-slate-400 truncate">{source}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specialist Persona */}
      <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-6">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <Bot className="w-4 h-4 text-emerald-400" />
          AI Specialist Persona
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Name</p>
            <p className="text-white font-medium">{crop.specialistPersona.name}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Title</p>
            <p className="text-white font-medium">{crop.specialistPersona.title}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Institution</p>
            <p className="text-white font-medium">{crop.specialistPersona.institution}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Region</p>
            <p className="text-white font-medium">{crop.specialistPersona.region}</p>
          </div>
        </div>
        <p className="text-xs text-emerald-400/70 mt-4 leading-relaxed">{crop.specialistPersona.expertise}</p>
      </div>
    </div>
  )
}
