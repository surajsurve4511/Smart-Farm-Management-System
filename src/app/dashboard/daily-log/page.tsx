'use client'

import { useState, useRef, useEffect } from 'react'
import { CalendarPlus, Camera, Loader2, CheckCircle, Sprout, ChevronLeft, ChevronRight, X, Upload, Sparkles, Clock, MapPinned } from 'lucide-react'
import { FARM_ACTIVITIES } from '@/lib/constants'
import { submitDailyLog, getPlots, getDailyLogs } from './actions'
import Link from 'next/link'

type ViewMode = 'new' | 'history'

const STEPS = ['Select Plot', 'Environment Data', 'Upload Photos', 'AI Analysis']

export default function DailyLogPage() {
  const [view, setView] = useState<ViewMode>('new')
  const [plots, setPlots] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [plotsLoading, setPlotsLoading] = useState(true)

  const [step, setStep] = useState(0)
  const [selectedPlot, setSelectedPlot] = useState<any>(null)
  const [form, setForm] = useState({
    moisture: '', weather: 'Sunny', temperature: '', humidity: '',
    rainfall: '', pestObserved: false, diseaseObserved: false,
    activities: [] as string[], notes: ''
  })
  const [images, setImages] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState('')
  const [done, setDone] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function load() {
      setPlotsLoading(true)
      try {
        const [p, l] = await Promise.all([getPlots(), getDailyLogs()])
        setPlots(p)
        setLogs(l)
      } catch { /* empty */ }
      setPlotsLoading(false)
    }
    load()
  }, [])

  const toggleActivity = (a: string) => {
    setForm(f => ({
      ...f,
      activities: f.activities.includes(a) ? f.activities.filter(x => x !== a) : [...f.activities, a]
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const result = await submitDailyLog({
        plotId: selectedPlot?.id || null,
        plotName: selectedPlot?.name || 'Unknown Plot',
        crop: selectedPlot?.current_crop || null,
        cropStage: selectedPlot?.crop_stage || null,
        moisture: form.moisture ? parseFloat(form.moisture) : null,
        weather: form.weather,
        temperature: form.temperature ? parseFloat(form.temperature) : null,
        humidity: form.humidity ? parseFloat(form.humidity) : null,
        rainfall: form.rainfall ? parseFloat(form.rainfall) : null,
        pestObserved: form.pestObserved,
        diseaseObserved: form.diseaseObserved,
        activities: form.activities,
        notes: form.notes,
      })
      setAnalysis(result.analysis)
      setDone(true)
      // Refresh logs
      const freshLogs = await getDailyLogs()
      setLogs(freshLogs)
    } catch (err: any) {
      setAnalysis('Error: ' + (err.message || 'Failed to submit'))
    } finally {
      setLoading(false)
    }
  }

  const canNext = () => {
    if (step === 0) return !!selectedPlot
    return true
  }

  const resetForm = () => {
    setStep(0); setDone(false); setAnalysis(''); setSelectedPlot(null)
    setForm({ moisture: '', weather: 'Sunny', temperature: '', humidity: '', rainfall: '', pestObserved: false, diseaseObserved: false, activities: [], notes: '' })
    setImages([])
  }

  if (plotsLoading) {
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
            <CalendarPlus className="w-10 h-10 text-emerald-400" />
            Daily Log
          </h1>
          <p className="text-slate-400 mt-2 text-lg font-light">Record field observations — AI analyzes and embeds into vector database.</p>
        </div>
        <div className="flex gap-2 bg-white/[0.03] p-1 rounded-xl border border-white/[0.08]">
          <button onClick={() => setView('new')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'new' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'}`}>
            <Sparkles className="w-4 h-4 inline mr-1" />New Log
          </button>
          <button onClick={() => setView('history')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'history' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'}`}>
            <Clock className="w-4 h-4 inline mr-1" />History ({logs.length})
          </button>
        </div>
      </header>

      {view === 'history' ? (
        /* Log History */
        <div className="space-y-4">
          {logs.length === 0 ? (
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-16 text-center shadow-2xl">
              <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">No logs yet</h2>
              <p className="text-slate-400 mb-4">Start logging daily activities to build your AI knowledge base.</p>
              <button onClick={() => setView('new')} className="btn-primary">
                <Sparkles className="w-4 h-4" />
                Create First Log
              </button>
            </div>
          ) : (
            logs.map((log: any) => (
              <div key={log.id} className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-6 shadow-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold">{new Date(log.created_at).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <div className="flex gap-2 mt-1">
                      {log.weather_condition && <span className="badge badge-emerald">{log.weather_condition}</span>}
                      {log.temperature_celsius && <span className="text-xs text-slate-500">{log.temperature_celsius}°C</span>}
                      {log.humidity_percentage && <span className="text-xs text-slate-500">{log.humidity_percentage}% humidity</span>}
                      {log.pest_observed && <span className="badge badge-red">Pest</span>}
                      {log.disease_observed && <span className="badge badge-red">Disease</span>}
                    </div>
                  </div>
                </div>
                {log.activities_performed?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {log.activities_performed.map((a: string) => (
                      <span key={a} className="text-xs px-2 py-0.5 rounded-md bg-white/[0.05] text-slate-400">{a}</span>
                    ))}
                  </div>
                )}
                {log.notes && <p className="text-sm text-slate-300 mb-3">{log.notes}</p>}
                {log.ai_analysis && (
                  <details className="group">
                    <summary className="text-xs font-semibold text-emerald-500 cursor-pointer hover:text-emerald-400">
                      <Sparkles className="w-3 h-3 inline mr-1" />AI Analysis
                    </summary>
                    <pre className="mt-2 text-xs text-slate-400 whitespace-pre-wrap font-sans bg-black/20 rounded-xl p-4">{log.ai_analysis}</pre>
                  </details>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        /* New Log Form */
        <>
          {plots.length === 0 ? (
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-16 text-center shadow-2xl">
              <MapPinned className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">No plots found</h2>
              <p className="text-slate-400 mb-4">Add a farm and plots first to start logging activities.</p>
              <Link href="/dashboard/farms" className="btn-primary">
                <MapPinned className="w-4 h-4" />
                Go to My Farms
              </Link>
            </div>
          ) : (
            <>
              {/* Step Indicators */}
              <div className="flex items-center justify-center gap-2">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      i < step ? 'bg-emerald-500 text-black' :
                      i === step ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500' :
                      'bg-white/[0.05] text-slate-600 border border-white/[0.1]'
                    }`}>
                      {i < step ? '✓' : i + 1}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-emerald-400' : 'text-slate-500'}`}>{s}</span>
                    {i < STEPS.length - 1 && <div className={`w-12 h-[2px] ${i < step ? 'bg-emerald-500' : 'bg-white/[0.08]'}`} />}
                  </div>
                ))}
              </div>

              <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl min-h-[400px]">
                {step === 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-white mb-6">Select Plot for Today&apos;s Log</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {plots.map((p: any) => (
                        <button
                          key={p.id}
                          onClick={() => setSelectedPlot(p)}
                          className={`p-6 rounded-2xl border text-left transition-all ${
                            selectedPlot?.id === p.id
                              ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                              : 'bg-white/[0.03] border-white/[0.06] hover:border-white/[0.15]'
                          }`}
                        >
                          <Sprout className={`w-8 h-8 mb-3 ${selectedPlot?.id === p.id ? 'text-emerald-400' : 'text-slate-500'}`} />
                          <h3 className="font-semibold text-white">{p.name}</h3>
                          <p className="text-sm text-slate-400">{p.area_acres || '—'} acres • {p.current_crop || 'No crop'}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h2 className="text-xl font-bold text-white mb-6">Environment & Activity Data</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Soil Moisture %</label>
                        <input type="number" value={form.moisture} onChange={e => setForm(f => ({...f, moisture: e.target.value}))} className="input-farm" placeholder="65" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Weather</label>
                        <select value={form.weather} onChange={e => setForm(f => ({...f, weather: e.target.value}))} className="input-farm select-farm">
                          {['Sunny', 'Cloudy', 'Rainy', 'Stormy', 'Windy', 'Foggy'].map(w => <option key={w}>{w}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Temperature °C</label>
                        <input type="number" value={form.temperature} onChange={e => setForm(f => ({...f, temperature: e.target.value}))} className="input-farm" placeholder="32" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Humidity %</label>
                        <input type="number" value={form.humidity} onChange={e => setForm(f => ({...f, humidity: e.target.value}))} className="input-farm" placeholder="75" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Rainfall mm</label>
                        <input type="number" value={form.rainfall} onChange={e => setForm(f => ({...f, rainfall: e.target.value}))} className="input-farm" placeholder="0" />
                      </div>
                    </div>

                    <div className="flex gap-6 mb-6">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div className={`w-12 h-6 rounded-full transition-colors relative ${form.pestObserved ? 'bg-red-500' : 'bg-white/[0.1]'}`} onClick={() => setForm(f => ({...f, pestObserved: !f.pestObserved}))}>
                          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.pestObserved ? 'translate-x-6' : 'translate-x-0.5'}`} />
                        </div>
                        <span className="text-sm text-slate-300">Pest Observed</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div className={`w-12 h-6 rounded-full transition-colors relative ${form.diseaseObserved ? 'bg-red-500' : 'bg-white/[0.1]'}`} onClick={() => setForm(f => ({...f, diseaseObserved: !f.diseaseObserved}))}>
                          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.diseaseObserved ? 'translate-x-6' : 'translate-x-0.5'}`} />
                        </div>
                        <span className="text-sm text-slate-300">Disease Observed</span>
                      </label>
                    </div>

                    <div className="mb-6">
                      <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-3 block">Activities Performed</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {FARM_ACTIVITIES.map(a => (
                          <button key={a} onClick={() => toggleActivity(a)} className={`px-3 py-2 rounded-xl text-sm font-medium text-left transition-all ${
                            form.activities.includes(a)
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:bg-white/[0.06]'
                          }`}>
                            {a}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Notes</label>
                      <textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} className="input-farm min-h-[100px] resize-none" placeholder="Any additional observations..." />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="text-xl font-bold text-white mb-6">Upload Crop Photos</h2>
                    <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-white/[0.1] hover:border-emerald-500/30 rounded-2xl p-12 text-center cursor-pointer transition-all">
                      <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-300 font-medium">Drop crop images here or click to browse</p>
                      <p className="text-xs text-slate-500 mt-2">Max 5 images • JPG, PNG, WebP</p>
                      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => { const files = Array.from(e.target.files || []).slice(0, 5); setImages(files) }} />
                    </div>
                    {images.length > 0 && (
                      <div className="grid grid-cols-5 gap-3 mt-4">
                        {images.map((img, i) => (
                          <div key={i} className="relative group rounded-xl overflow-hidden aspect-square bg-black/30">
                            <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                            <button onClick={() => setImages(imgs => imgs.filter((_, j) => j !== i))} className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-slate-500 mt-4 flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      Images will be analyzed by Gemini Vision AI for pest & disease detection
                    </p>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-16 gap-4">
                        <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
                        <p className="text-white font-semibold text-lg">Analyzing with Gemini AI...</p>
                        <p className="text-slate-500 text-sm">Generating embeddings → Storing in pgvector</p>
                      </div>
                    ) : done ? (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <CheckCircle className="w-8 h-8 text-emerald-400" />
                          <h2 className="text-xl font-bold text-white">Analysis Complete</h2>
                          <Sparkles className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div className="bg-black/30 border border-emerald-500/20 rounded-2xl p-6 mb-6">
                          <pre className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed font-sans">{analysis}</pre>
                        </div>
                        <div className="flex gap-3">
                          <Link href="/dashboard" className="btn-primary">Return to Dashboard</Link>
                          <button onClick={resetForm} className="btn-ghost">Log Another</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 gap-4">
                        <Sparkles className="w-12 h-12 text-emerald-400" />
                        <p className="text-white font-semibold text-lg">Ready to Analyze</p>
                        <p className="text-slate-500 text-sm text-center">Click submit to send your log to Gemini AI for analysis and embed into the vector database.</p>
                        <button onClick={handleSubmit} className="btn-primary mt-4">Submit & Analyze</button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {!done && (
                <div className="flex justify-between">
                  <button onClick={() => setStep(s => s - 1)} disabled={step === 0} className="btn-ghost disabled:opacity-30">
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  {step < 3 && (
                    <button onClick={() => setStep(s => s + 1)} disabled={!canNext()} className="btn-primary disabled:opacity-30">
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
