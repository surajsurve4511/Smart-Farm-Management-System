import { createClient } from '@supabase/supabase-js'
import { GoogleGenAI } from '@google/genai'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const query = process.argv[2]

if (!query) {
  console.error('Usage: npx tsx query-rag.ts "<your question>"')
  process.exit(1)
}

async function run() {
  try {
    console.log(`[RAG Analyst] Querying vector database for: "${query}"...`)
    
    // We are running outside the Next.js edge context, so we need full env vars
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const geminiKey = process.env.GEMINI_API_KEY
    const testFarmerId = '00000000-0000-0000-0000-000000000000' // Mock/test ID for CLI runs

    if (!supabaseUrl || !supabaseKey || !geminiKey) {
      throw new Error('Missing environment variables (.env.local)')
    }

    const ai = new GoogleGenAI({ apiKey: geminiKey })
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1. Embed query
    const embeddingResp = await ai.models.embedContent({
      model: 'text-embedding-004',
      contents: query,
    })
    const embedding = embeddingResp.embeddings?.[0]?.values

    if (!embedding) throw new Error('Failed to generate embedding')

    // 2. Query Supabase
    const { data: relevantLogs, error } = await supabase.rpc('match_daily_logs', {
      query_embedding: embedding,
      match_threshold: 0.60,
      match_count: 5,
      p_farmer_id: testFarmerId,
    })

    if (error) throw error

    if (!relevantLogs || relevantLogs.length === 0) {
      console.log('\n[Result] No relevant historical data found in the farm database.')
      return
    }

    console.log('\n[Result] Found the following historical context:\n')
    relevantLogs.forEach((log: any, idx: number) => {
      console.log(`--- Match ${idx + 1} (${(log.similarity * 100).toFixed(1)}% match) ---`)
      console.log(`Plot: ${log.plot_name}`)
      console.log(`Date: ${log.log_date}`)
      console.log(`Notes: ${log.notes}`)
      console.log(`AI Analysis: ${log.ai_analysis || 'None'}\n`)
    })

  } catch (err: any) {
    console.error('Error:', err.message)
    process.exit(1)
  }
}

run()
