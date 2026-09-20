'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sprout, Loader2, UserPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { INDIAN_STATES } from '@/lib/constants'

export default function SignupPage() {
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    state: 'Maharashtra', district: '', village: '',
    landHolding: '', farmingType: 'mixed'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const update = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password
      })
      if (authError) {
        setError(authError.message)
        return
      }
      if (data.user) {
        await supabase.from('farmer_profiles').insert({
          id: data.user.id,
          full_name: form.fullName,
          state: form.state,
          district: form.district || null,
          village: form.village || null,
          land_holding_acres: form.landHolding ? parseFloat(form.landHolding) : null,
          farming_type: form.farmingType
        })
      }
      setSuccess(true)
    } catch {
      setError('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl text-center animate-fade-in-up">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <Sprout className="w-7 h-7 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Account Created!</h2>
        <p className="text-slate-400 text-sm mb-6">Check your email to verify your account, then sign in.</p>
        <Link href="/login" className="btn-primary inline-flex">Go to Login</Link>
      </div>
    )
  }

  return (
    <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl animate-fade-in-up">
      <div className="flex flex-col items-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          <UserPlus className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Create Your Farm Account</h1>
        <p className="text-slate-400 text-sm mt-1">Join Smart Farm OS</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" value={form.fullName} onChange={e => update('fullName', e.target.value)} className="input-farm" placeholder="Full Name" required />
        <input type="email" value={form.email} onChange={e => update('email', e.target.value)} className="input-farm" placeholder="Email address" required />
        <div className="grid grid-cols-2 gap-3">
          <input type="password" value={form.password} onChange={e => update('password', e.target.value)} className="input-farm" placeholder="Password" required />
          <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} className="input-farm" placeholder="Confirm" required />
        </div>
        <select value={form.state} onChange={e => update('state', e.target.value)} className="input-farm select-farm">
          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <input type="text" value={form.district} onChange={e => update('district', e.target.value)} className="input-farm" placeholder="District" />
          <input type="text" value={form.village} onChange={e => update('village', e.target.value)} className="input-farm" placeholder="Village" />
        </div>
        <input type="number" value={form.landHolding} onChange={e => update('landHolding', e.target.value)} className="input-farm" placeholder="Land Holding (acres)" step="0.5" />
        <div>
          <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">Farming Type</p>
          <div className="flex gap-4">
            {['organic', 'conventional', 'mixed'].map(t => (
              <label key={t} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="farmingType" value={t} checked={form.farmingType === t} onChange={() => update('farmingType', t)} className="accent-emerald-500" />
                <span className="text-sm text-slate-300 capitalize">{t}</span>
              </label>
            ))}
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-slate-500 text-sm mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">Sign in</Link>
      </p>
    </div>
  )
}
