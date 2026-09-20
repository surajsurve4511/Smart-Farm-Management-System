'use server'

import { createClient } from '@/lib/supabase/server'
import { embedText, consultCropSpecialist } from '@/lib/gemini'
import { getCropBySlug } from '@/lib/cropData'
import type { VectorSearchResult } from '@/lib/types'

/**
 * Ask the crop specialist consultant a question
 * RAG pipeline: embed → vector search crop research + farmer logs → Gemini specialist
 */
export async function askCropSpecialist(question: string, cropSlug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { text: 'Please log in first.', ragSourceCount: 0 }

  const crop = getCropBySlug(cropSlug)
  if (!crop) return { text: 'Crop not found.', ragSourceCount: 0 }

  try {
    // 1. Embed the question
    const queryEmbedding = await embedText(question)

    // 2. Search crop research embeddings (if table exists)
    let ragContext = ''
    let ragSourceCount = 0
    try {
      const { data: researchResults } = await supabase.rpc('match_crop_research', {
        query_embedding: queryEmbedding,
        p_crop_slug: cropSlug,
        match_count: 5,
      })
      if (researchResults?.length) {
        ragContext = researchResults.map(
          (r: { chunk_text: string; source: string; similarity: number }) =>
            `[${r.source}] ${r.chunk_text}`
        ).join('\n\n')
        ragSourceCount = researchResults.length
      }
    } catch {
      // Table may not exist yet — that's OK, we have the static research context
    }

    // 3. Search farmer's own daily logs for personal context
    let farmLogContext = ''
    try {
      const { data: relevantLogs } = await supabase.rpc('match_daily_logs', {
        query_embedding: queryEmbedding,
        match_threshold: 0.60,
        match_count: 3,
        p_farmer_id: user.id,
      })
      if (relevantLogs?.length) {
        farmLogContext = relevantLogs.map(
          (log: VectorSearchResult) =>
            `[${log.log_date}] ${log.plot_name}: ${log.notes} | Analysis: ${log.ai_analysis || 'N/A'}`
        ).join('\n')
      }
    } catch {
      // No logs yet — fine
    }

    // 4. Get farmer profile for personalization
    const { data: profile } = await supabase
      .from('farmer_profiles')
      .select('state, district, farming_type')
      .eq('id', user.id)
      .single()

    // 5. Call the specialist consultant
    const response = await consultCropSpecialist({
      question,
      cropName: crop.name,
      specialistPersona: crop.specialistPersona,
      researchContext: crop.researchContext,
      farmerProfile: {
        state: profile?.state || 'Not specified',
        district: profile?.district || undefined,
        farmingType: profile?.farming_type || undefined,
      },
      ragContext,
      farmLogContext,
    })

    return { text: response, ragSourceCount }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { text: 'AI Error: ' + message, ragSourceCount: 0 }
  }
}
