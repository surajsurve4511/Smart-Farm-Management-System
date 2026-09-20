'use server'

import { createClient } from '@/lib/supabase/server'

export async function getDashboardData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Parallel queries for performance
  const [farmsRes, plotsRes, livestockRes, inventoryRes, logsRes, chatRes, profileRes] = await Promise.all([
    supabase.from('farms').select('id', { count: 'exact' }).eq('farmer_id', user.id),
    supabase.from('plots').select('id, current_crop, crop_stage, area_acres').eq('farmer_id', user.id),
    supabase.from('livestock').select('count, current_market_rate, milk_yield_liters_per_day, health_status').eq('farmer_id', user.id),
    supabase.from('inventory').select('id, item_type, purchase_price, quantity, expiry_date').eq('farmer_id', user.id),
    supabase.from('daily_logs')
      .select('id, notes, weather_condition, temperature_celsius, pest_observed, disease_observed, ai_analysis, created_at')
      .eq('farmer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase.from('chat_sessions').select('id', { count: 'exact' }).eq('farmer_id', user.id),
    supabase.from('farmer_profiles').select('full_name, state, district, farming_type').eq('id', user.id).single(),
  ])

  const plots = plotsRes.data || []
  const livestock = livestockRes.data || []
  const inventory = inventoryRes.data || []
  const recentLogs = logsRes.data || []
  const profile = profileRes.data

  // Compute KPIs
  const farmCount = farmsRes.count || 0
  const plotCount = plots.length
  const totalArea = plots.reduce((s, p) => s + (p.area_acres || 0), 0)
  const totalAnimals = livestock.reduce((s, l) => s + (l.count || 0), 0)
  const livestockValue = livestock.reduce((s, l) => s + (l.count || 0) * (l.current_market_rate || 0), 0)
  const dailyMilk = livestock.reduce((s, l) => s + (l.count || 0) * (l.milk_yield_liters_per_day || 0), 0)
  const inventoryItems = inventory.length
  const inventoryValue = inventory.reduce((s, i) => s + ((i.quantity || 0) * (i.purchase_price || 0)), 0)
  const alertCount = recentLogs.filter(l => l.pest_observed || l.disease_observed).length
  const activeCrops = [...new Set(plots.filter(p => p.current_crop).map(p => p.current_crop))].length
  const chatCount = chatRes.count || 0
  const logCount = recentLogs.length

  // Health warnings
  const sickAnimals = livestock.filter(l => l.health_status === 'sick' || l.health_status === 'under_treatment').length
  const expiringItems = inventory.filter(i => {
    if (!i.expiry_date) return false
    return (new Date(i.expiry_date).getTime() - Date.now()) < 30 * 24 * 60 * 60 * 1000
  }).length

  return {
    profile,
    kpis: {
      farmCount, plotCount, totalArea, totalAnimals, livestockValue,
      dailyMilk, inventoryItems, inventoryValue, alertCount, activeCrops,
      chatCount, logCount, sickAnimals, expiringItems,
    },
    recentLogs,
  }
}
