'use server'

import { createClient } from '@/lib/supabase/server'
import { embedText, generateDailyLogAnalysis } from '@/lib/gemini'
import { revalidatePath } from 'next/cache'

export async function getPlots() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('plots')
    .select('id, name, area_acres, current_crop, crop_stage, farm_id')
    .eq('farmer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw new Error('Failed to load plots: ' + error.message)
  return data || []
}

export async function getDailyLogs(limit = 20) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('daily_logs')
    .select('id, plot_id, log_date, weather_condition, temperature_celsius, humidity_percentage, soil_moisture_percentage, pest_observed, disease_observed, activities_performed, notes, ai_analysis, created_at')
    .eq('farmer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error('Failed to load logs: ' + error.message)
  return data || []
}

export async function submitDailyLog(data: {
  plotId: string | null
  plotName: string
  crop: string | null
  cropStage: string | null
  moisture: number | null
  weather: string
  temperature: number | null
  humidity: number | null
  rainfall: number | null
  pestObserved: boolean
  diseaseObserved: boolean
  activities: string[]
  notes: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const aiAnalysis = await generateDailyLogAnalysis({
    plotName: data.plotName,
    crop: data.crop,
    cropStage: data.cropStage,
    moisture: data.moisture,
    temperature: data.temperature,
    humidity: data.humidity,
    rainfall: data.rainfall,
    notes: data.notes,
    pestObserved: data.pestObserved,
    diseaseObserved: data.diseaseObserved,
    activities: data.activities,
  })

  const embeddingText = `Plot: ${data.plotName}. Crop: ${data.crop || 'N/A'}. Stage: ${data.cropStage || 'N/A'}. Weather: ${data.weather}. Moisture: ${data.moisture}%. Temp: ${data.temperature}°C. Activities: ${data.activities.join(', ')}. Notes: ${data.notes}. Analysis: ${aiAnalysis}`
  const embedding = await embedText(embeddingText)

  const { error } = await supabase.from('daily_logs').insert({
    farmer_id: user.id,
    plot_id: data.plotId || null,
    weather_condition: data.weather,
    temperature_celsius: data.temperature,
    humidity_percentage: data.humidity,
    soil_moisture_percentage: data.moisture,
    rainfall_mm: data.rainfall,
    pest_observed: data.pestObserved,
    disease_observed: data.diseaseObserved,
    activities_performed: data.activities,
    notes: data.notes,
    ai_analysis: aiAnalysis,
    embedding,
  })

  if (error) throw new Error('Failed to save log: ' + error.message)
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/daily-log')
  return { success: true, analysis: aiAnalysis }
}
