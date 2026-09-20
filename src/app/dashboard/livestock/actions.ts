'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getLivestock() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('livestock')
    .select('*')
    .eq('farmer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw new Error('Failed to load livestock: ' + error.message)
  return data || []
}

export async function addLivestock(formData: {
  animal_type: string
  breed: string | null
  count: number
  age_months: number | null
  health_status: 'healthy' | 'sick' | 'under_treatment'
  purchase_price: number | null
  current_market_rate: number | null
  milk_yield_liters_per_day: number | null
  notes: string | null
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('livestock').insert({
    farmer_id: user.id,
    ...formData,
  })

  if (error) throw new Error('Failed to add livestock: ' + error.message)
  revalidatePath('/dashboard/livestock')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateLivestock(id: string, formData: Record<string, any>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('livestock')
    .update({ ...formData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('farmer_id', user.id)

  if (error) throw new Error('Failed to update: ' + error.message)
  revalidatePath('/dashboard/livestock')
  return { success: true }
}

export async function deleteLivestock(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('livestock').delete().eq('id', id).eq('farmer_id', user.id)
  if (error) throw new Error('Failed to delete: ' + error.message)
  revalidatePath('/dashboard/livestock')
  revalidatePath('/dashboard')
  return { success: true }
}
