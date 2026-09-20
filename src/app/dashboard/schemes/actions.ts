'use server'

import { createClient } from '@/lib/supabase/server'
import { embedText } from '@/lib/gemini'
import { revalidatePath } from 'next/cache'

export async function getSchemes(category?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  let query = supabase.from('schemes').select('*').eq('is_active', true).order('created_at', { ascending: false })
  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  if (error) throw new Error('Failed to load schemes: ' + error.message)

  // If schemes table is empty, seed it
  if (!data || data.length === 0) {
    await seedSchemes()
    const { data: seeded } = await query
    return seeded || []
  }

  // Get farmer profile for eligibility check
  const { data: profile } = await supabase
    .from('farmer_profiles')
    .select('state, land_holding_acres, farming_type')
    .eq('id', user.id)
    .single()

  // Annotate with eligibility
  return (data || []).map(scheme => {
    let eligible = true
    const criteria = scheme.eligibility_criteria as any
    if (criteria && profile) {
      if (criteria.states && criteria.states.length > 0 && !criteria.states.includes(profile.state)) eligible = false
      if (criteria.land_max_acres && profile.land_holding_acres && profile.land_holding_acres > criteria.land_max_acres) eligible = false
      if (criteria.farming_type && criteria.farming_type !== profile.farming_type) eligible = false
    }
    return { ...scheme, is_eligible: eligible }
  })
}

export async function seedSchemes() {
  const supabase = await createClient()

  const SCHEMES = [
    { title: 'PM-KISAN', description: 'Direct income support of ₹6,000/year to small & marginal farmers in 3 installments.', scheme_type: 'government', category: 'subsidy', provider: 'Ministry of Agriculture', benefit_amount: '₹6,000/year', application_url: 'https://pmkisan.gov.in', eligibility_criteria: { land_max_acres: 5 } },
    { title: 'PMFBY (Crop Insurance)', description: 'Pradhan Mantri Fasal Bima Yojana — subsidized crop insurance covering natural calamities, pests.', scheme_type: 'government', category: 'insurance', provider: 'Ministry of Agriculture', benefit_amount: 'Premium subsidy up to 98%', application_url: 'https://pmfby.gov.in', eligibility_criteria: {} },
    { title: 'KCC (Kisan Credit Card)', description: 'Short-term credit for crop production at 4% interest with timely repayment.', scheme_type: 'government', category: 'loan', provider: 'All Nationalized Banks', benefit_amount: 'Up to ₹3 lakh at 4% interest', application_url: 'https://www.pmkisan.gov.in/kcc', eligibility_criteria: {} },
    { title: 'NABARD Dairy Scheme', description: 'Subsidy for dairy farming — milking machines, milk cooling, processing infrastructure.', scheme_type: 'government', category: 'subsidy', provider: 'NABARD', benefit_amount: '25-33% capital subsidy', application_url: 'https://www.nabard.org', eligibility_criteria: {} },
    { title: 'Soil Health Card Scheme', description: 'Free soil testing and recommendations for balanced nutrient application.', scheme_type: 'government', category: 'training', provider: 'Ministry of Agriculture', benefit_amount: 'Free soil testing', application_url: 'https://soilhealth.dac.gov.in', eligibility_criteria: {} },
    { title: 'PM-KUSUM (Solar)', description: 'Solar pump installation with 60% subsidy for irrigation.', scheme_type: 'government', category: 'equipment', provider: 'MNRE', benefit_amount: '60% subsidy on solar pumps', application_url: 'https://pmkusum.mnre.gov.in', eligibility_criteria: {} },
    { title: 'e-NAM (Online Mandi)', description: 'National Agriculture Market — sell produce across state mandis digitally.', scheme_type: 'government', category: 'market_access', provider: 'Ministry of Agriculture', benefit_amount: 'Pan-India market access', application_url: 'https://enam.gov.in', eligibility_criteria: {} },
    { title: 'ATMA Training Programs', description: 'Free agricultural training, demonstrations, and exposure visits.', scheme_type: 'government', category: 'training', provider: 'State Agriculture Departments', benefit_amount: 'Free training + TA/DA', application_url: 'https://extensionreforms.dacnet.nic.in', eligibility_criteria: {} },
    { title: 'Sub-Mission on Agricultural Mechanization', description: 'Custom Hiring Centres and subsidy on farm machinery purchase.', scheme_type: 'government', category: 'equipment', provider: 'Ministry of Agriculture', benefit_amount: '40-50% subsidy on machinery', application_url: 'https://farmech.dac.gov.in', eligibility_criteria: {} },
    { title: 'Paramparagat Krishi Vikas Yojana', description: 'Cluster-based organic farming support with ₹50,000/ha over 3 years.', scheme_type: 'government', category: 'subsidy', provider: 'Ministry of Agriculture', benefit_amount: '₹50,000/hectare over 3 years', application_url: 'https://pgsindia-ncof.gov.in', eligibility_criteria: { farming_type: 'organic' } },
  ]

  for (const scheme of SCHEMES) {
    const embeddingText = `${scheme.title}: ${scheme.description}. Category: ${scheme.category}. Provider: ${scheme.provider}. Benefit: ${scheme.benefit_amount}.`
    let embedding = null
    try { embedding = await embedText(embeddingText) } catch { /* skip embedding */ }

    await supabase.from('schemes').insert({
      ...scheme,
      is_active: true,
      source_url: scheme.application_url,
      last_verified: new Date().toISOString(),
      embedding,
    })
  }

  revalidatePath('/dashboard/schemes')
}
