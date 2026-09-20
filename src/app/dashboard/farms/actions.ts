'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getFarms() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('farms')
    .select('*, plots(*)')
    .eq('farmer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw new Error('Failed to load farms: ' + error.message)
  return data || []
}

export async function createFarm(formData: {
  name: string
  total_area_acres: number | null
  soil_type: string | null
  water_source: string | null
  location_lat?: number | null
  location_lng?: number | null
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase.from('farms').insert({
    farmer_id: user.id,
    name: formData.name,
    total_area_acres: formData.total_area_acres,
    soil_type: formData.soil_type,
    water_source: formData.water_source,
    location_lat: formData.location_lat || null,
    location_lng: formData.location_lng || null,
  }).select().single()

  if (error) throw new Error('Failed to create farm: ' + error.message)
  revalidatePath('/dashboard/farms')
  revalidatePath('/dashboard')
  return data
}

export async function updateFarm(id: string, formData: {
  name?: string
  total_area_acres?: number | null
  soil_type?: string | null
  water_source?: string | null
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('farms')
    .update(formData)
    .eq('id', id)
    .eq('farmer_id', user.id)

  if (error) throw new Error('Failed to update farm: ' + error.message)
  revalidatePath('/dashboard/farms')
  return { success: true }
}

export async function deleteFarm(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Delete plots first, then farm
  await supabase.from('plots').delete().eq('farm_id', id).eq('farmer_id', user.id)
  const { error } = await supabase.from('farms').delete().eq('id', id).eq('farmer_id', user.id)

  if (error) throw new Error('Failed to delete farm: ' + error.message)
  revalidatePath('/dashboard/farms')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function createPlot(formData: {
  farm_id: string
  name: string
  area_acres: number | null
  current_crop: string | null
  crop_stage: string | null
  sowing_date: string | null
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase.from('plots').insert({
    farm_id: formData.farm_id,
    farmer_id: user.id,
    name: formData.name,
    area_acres: formData.area_acres,
    current_crop: formData.current_crop,
    crop_stage: formData.crop_stage,
    sowing_date: formData.sowing_date || null,
  }).select().single()

  if (error) throw new Error('Failed to create plot: ' + error.message)
  revalidatePath('/dashboard/farms')
  return data
}

export async function updatePlot(id: string, formData: {
  name?: string
  area_acres?: number | null
  current_crop?: string | null
  crop_stage?: string | null
  sowing_date?: string | null
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('plots')
    .update(formData)
    .eq('id', id)
    .eq('farmer_id', user.id)

  if (error) throw new Error('Failed to update plot: ' + error.message)
  revalidatePath('/dashboard/farms')
  return { success: true }
}

export async function deletePlot(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('plots').delete().eq('id', id).eq('farmer_id', user.id)

  if (error) throw new Error('Failed to delete plot: ' + error.message)
  revalidatePath('/dashboard/farms')
  return { success: true }
}
