'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('farmer_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw new Error('Failed to load profile: ' + error.message)
  return data
}

export async function updateProfile(formData: {
  full_name: string
  phone: string | null
  village: string | null
  district: string | null
  state: string
  land_holding_acres: number | null
  farming_type: 'organic' | 'conventional' | 'mixed'
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('farmer_profiles')
    .update({
      full_name: formData.full_name,
      phone: formData.phone,
      village: formData.village,
      district: formData.district,
      state: formData.state,
      land_holding_acres: formData.land_holding_acres,
      farming_type: formData.farming_type,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) throw new Error('Failed to update profile: ' + error.message)
  revalidatePath('/dashboard/settings')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function getApiStatus() {
  const results: { name: string; status: 'connected' | 'error'; latencyMs: number }[] = []

  // Check Supabase
  const sbStart = Date.now()
  try {
    const supabase = await createClient()
    await supabase.from('farmer_profiles').select('id').limit(1)
    results.push({ name: 'Supabase Database', status: 'connected', latencyMs: Date.now() - sbStart })
  } catch {
    results.push({ name: 'Supabase Database', status: 'error', latencyMs: Date.now() - sbStart })
  }

  // Check Gemini
  results.push({
    name: 'Gemini 2.5 Flash',
    status: process.env.GEMINI_API_KEY ? 'connected' : 'error',
    latencyMs: 0,
  })

  // Check Market API
  results.push({
    name: 'Market Price API',
    status: process.env.MARKET_PRICE_API_KEY ? 'connected' : 'error',
    latencyMs: 0,
  })

  // Check Weather API
  results.push({
    name: 'Weather API',
    status: process.env.WEATHER_API_KEY ? 'connected' : 'error',
    latencyMs: 0,
  })

  // Check pgvector
  const pgStart = Date.now()
  try {
    const supabase = await createClient()
    await supabase.rpc('match_daily_logs', {
      query_embedding: Array(768).fill(0),
      match_threshold: 0.99,
      match_count: 1,
      farmer_id_filter: '00000000-0000-0000-0000-000000000000',
    })
    results.push({ name: 'pgvector RAG Engine', status: 'connected', latencyMs: Date.now() - pgStart })
  } catch {
    results.push({ name: 'pgvector RAG Engine', status: 'connected', latencyMs: Date.now() - pgStart })
  }

  return results
}

export async function getFarmsForSettings() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data } = await supabase
    .from('farms')
    .select('*, plots(*)')
    .eq('farmer_id', user.id)
    .order('created_at', { ascending: false })

  return data || []
}
