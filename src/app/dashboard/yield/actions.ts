'use server'

import { createClient } from '@/lib/supabase/server'
import { generateYieldPrediction } from '@/lib/gemini'

export async function getYieldPredictions() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get farmer's plots
  const { data: plots } = await supabase
    .from('plots')
    .select('id, name, area_acres, current_crop, crop_stage, sowing_date')
    .eq('farmer_id', user.id)

  if (!plots || plots.length === 0) return []

  // Get recent daily logs for context
  const { data: logs } = await supabase
    .from('daily_logs')
    .select('plot_id, notes, ai_analysis, weather_condition, temperature_celsius, soil_moisture_percentage, pest_observed, disease_observed, created_at')
    .eq('farmer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(30)

  // Generate predictions for each plot with a crop
  const predictions = []
  for (const plot of plots) {
    if (!plot.current_crop) continue

    const plotLogs = (logs || []).filter(l => l.plot_id === plot.id)
    const logSummary = plotLogs.slice(0, 5).map(l =>
      `Date: ${new Date(l.created_at).toLocaleDateString()}. Weather: ${l.weather_condition}. Moisture: ${l.soil_moisture_percentage}%. Temp: ${l.temperature_celsius}°C. Pest: ${l.pest_observed ? 'Yes' : 'No'}. Notes: ${l.notes || 'N/A'}. AI: ${l.ai_analysis || 'N/A'}`
    ).join('\n')

    try {
      const rawPrediction = await generateYieldPrediction({
        plotName: plot.name,
        crop: plot.current_crop,
        area: plot.area_acres || 1,
        cropStage: plot.crop_stage || 'vegetative',
        historicalLogs: logSummary || 'No historical logs available yet.',
      })

      // Parse the JSON response from Gemini
      let parsed: any = {}
      try {
        const jsonMatch = rawPrediction.match(/\{[\s\S]*\}/)
        if (jsonMatch) parsed = JSON.parse(jsonMatch[0])
      } catch { /* use defaults */ }

      predictions.push({
        plot_name: plot.name,
        crop: plot.current_crop,
        area: plot.area_acres,
        crop_stage: plot.crop_stage,
        sowing_date: plot.sowing_date,
        predicted_yield_per_acre: parsed.predicted_yield_per_acre || 'N/A',
        total_yield: parsed.total_yield || 'N/A',
        confidence: parsed.confidence || 'medium',
        factors: parsed.factors || [],
        revenue_range: parsed.revenue_range || 'N/A',
        comparison: parsed.comparison || 'N/A',
        log_count: plotLogs.length,
      })
    } catch {
      predictions.push({
        plot_name: plot.name,
        crop: plot.current_crop,
        area: plot.area_acres,
        crop_stage: plot.crop_stage,
        sowing_date: plot.sowing_date,
        predicted_yield_per_acre: 'N/A',
        total_yield: 'N/A',
        confidence: 'low',
        factors: ['Insufficient data for prediction'],
        revenue_range: 'N/A',
        comparison: 'N/A',
        log_count: 0,
      })
    }
  }

  return predictions
}
