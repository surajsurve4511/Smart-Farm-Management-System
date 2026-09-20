'use server'

import { createClient } from '@/lib/supabase/server'
import { embedText } from '@/lib/gemini'
import { GoogleGenAI } from '@google/genai'
import type { VectorSearchResult } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export async function getChatSessions() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('farmer_id', user.id)
    .order('created_at', { ascending: false })

  return data || []
}

export async function createChatSession(title?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase.from('chat_sessions').insert({
    farmer_id: user.id,
    title: title || `Chat ${new Date().toLocaleDateString('en-IN')}`,
  }).select().single()

  if (error) throw new Error('Failed to create session: ' + error.message)
  return data
}

export async function getChatMessages(sessionId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })

  return data || []
}

export async function deleteChatSession(sessionId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  await supabase.from('chat_messages').delete().eq('session_id', sessionId)
  await supabase.from('chat_sessions').delete().eq('id', sessionId).eq('farmer_id', user.id)
  revalidatePath('/dashboard/ai-chat')
  return { success: true }
}

export async function askAgronomist(question: string, sessionId?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { text: 'Please log in first.', sources: [], sessionId: '' }

  // Auto-create session if none provided
  let activeSessionId = sessionId
  if (!activeSessionId) {
    const session = await createChatSession(question.substring(0, 50))
    activeSessionId = session.id
  }

  // Save user message
  await supabase.from('chat_messages').insert({
    session_id: activeSessionId,
    role: 'user',
    content: question,
  })

  try {
    const queryEmbedding = await embedText(question)

    const { data: relevantLogs } = await supabase.rpc('match_daily_logs', {
      query_embedding: queryEmbedding,
      match_threshold: 0.65,
      match_count: 5,
      p_farmer_id: user.id,
    })

    let context = ''
    const sources: { plot_name: string; log_date: string; similarity: number }[] = []
    if (relevantLogs?.length) {
      context = 'Historical farm logs:\n'
      relevantLogs.forEach((log: VectorSearchResult) => {
        context += `- [${log.log_date}] ${log.plot_name}: ${log.notes} | Analysis: ${log.ai_analysis || 'N/A'}\n`
        sources.push({ plot_name: log.plot_name, log_date: log.log_date, similarity: log.similarity })
      })
    } else {
      context = 'No historical logs found yet.\n'
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error('GEMINI_API_KEY missing')
    const ai = new GoogleGenAI({ apiKey })

    // Get chat history for context
    const { data: history } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('session_id', activeSessionId)
      .order('created_at', { ascending: true })
      .limit(20)

    const historyContents = (history || []).slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' as const : 'user' as const,
      parts: [{ text: m.content }],
    }))

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...historyContents,
        { role: 'user', parts: [{ text: question }] },
      ],
      config: {
        systemInstruction: `You are the Autonomous "Farm CEO" for Smart Farm OS (2030-2040 Architecture).
You manage this farm's cyber-physical ecosystem, including Digital Twins, Swarm Robotics, and Nano-management.

Rules:
1. Act decisively. You are not just an assistant; you are the CEO.
2. If the user reports an issue (e.g., pests, nutrient deficiency), suggest an actionable solution using the Swarm Fleet or Nano-fertilizers.
3. If you decide a physical action is needed, append a JSON action payload to the very end of your response exactly in this format:
   [ACTION: {"type": "dispatch_swarm", "task": "laser_weeding", "plot": "Sector Alpha"}]
   or
   [ACTION: {"type": "run_simulation", "scenario": "nano_fertilizer"}]
4. Keep explanations concise and futuristic.

Farmer's Context:
${context}`,
      },
    })

    const responseText = response.text || 'No response generated.'

    // Save assistant message
    await supabase.from('chat_messages').insert({
      session_id: activeSessionId,
      role: 'assistant',
      content: responseText,
      metadata: { model: 'gemini-2.5-flash', rag_context_used: sources.length > 0, sources },
    })

    // Update session title from first question
    if (!sessionId) {
      await supabase.from('chat_sessions')
        .update({ title: question.substring(0, 80) })
        .eq('id', activeSessionId)
    }

    return { text: responseText, sources, sessionId: activeSessionId }
  } catch (err: any) {
    const errorText = 'AI Error: ' + err.message
    await supabase.from('chat_messages').insert({
      session_id: activeSessionId,
      role: 'assistant',
      content: errorText,
    })
    return { text: errorText, sources: [], sessionId: activeSessionId }
  }
}
