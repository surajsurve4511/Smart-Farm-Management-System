'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, Send, Loader2, MessageSquare, Plus, ChevronDown, Database, Trash2, Zap, CheckCircle2 } from 'lucide-react'
import { askAgronomist, getChatSessions, getChatMessages, createChatSession, deleteChatSession } from './actions'

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: { plot_name: string; log_date: string; similarity: number }[]
}

const WELCOME_MSG: Message = {
  role: 'assistant',
  content: 'Namaste! 🙏 I am your Autonomous Farm CEO powered by Gemini 2.5 Flash.\n\nI manage your cyber-physical ecosystem, from Digital Twins to Swarm Robotics. If I detect an issue, I can dispatch physical nano-bots and drones to resolve it automatically.\n\nReport any farm issues, and I will take action.',
  sources: [],
}

export default function AIChatPage() {
  const [sessions, setSessions] = useState<any[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionsLoading, setSessionsLoading] = useState(true)
  const [showSources, setShowSources] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadSessions()
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  async function loadSessions() {
    setSessionsLoading(true)
    try {
      const data = await getChatSessions()
      setSessions(data)
    } catch { /* empty */ }
    setSessionsLoading(false)
  }

  async function loadSession(sessionId: string) {
    setActiveSessionId(sessionId)
    try {
      const msgs = await getChatMessages(sessionId)
      const formatted: Message[] = msgs.map((m: any) => ({
        role: m.role,
        content: m.content,
        sources: m.metadata?.sources || [],
      }))
      setMessages(formatted.length > 0 ? formatted : [WELCOME_MSG])
    } catch {
      setMessages([WELCOME_MSG])
    }
  }

  async function handleNewChat() {
    setActiveSessionId(null)
    setMessages([WELCOME_MSG])
  }

  async function handleDeleteSession(id: string) {
    await deleteChatSession(id)
    if (activeSessionId === id) {
      setActiveSessionId(null)
      setMessages([WELCOME_MSG])
    }
    await loadSessions()
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const question = input.trim()
    setInput('')
    setMessages(msgs => [...msgs, { role: 'user', content: question }])
    setLoading(true)

    try {
      const result = await askAgronomist(question, activeSessionId || undefined)
      setMessages(msgs => [...msgs, { role: 'assistant', content: result.text, sources: result.sources }])
      // Track the session
      if (!activeSessionId && result.sessionId) {
        setActiveSessionId(result.sessionId)
      }
      await loadSessions() // Refresh sidebar
    } catch {
      setMessages(msgs => [...msgs, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6 animate-fade-in-up">
      {/* Sessions Sidebar */}
      <div className="hidden lg:flex flex-col w-72 bg-white/[0.02] border border-white/[0.06] rounded-3xl p-4 shrink-0">
        <button onClick={handleNewChat} className="btn-primary w-full mb-4 text-sm">
          <Plus className="w-4 h-4" /> New Chat
        </button>
        <div className="space-y-1 flex-1 overflow-y-auto">
          {sessionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 text-slate-500 animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-xs text-slate-600 text-center py-4">No chat history yet</p>
          ) : (
            sessions.map((s: any) => (
              <div
                key={s.id}
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors group flex items-center gap-3 cursor-pointer ${
                  activeSessionId === s.id ? 'bg-emerald-500/10 border border-emerald-500/20' : 'hover:bg-white/[0.04]'
                }`}
                onClick={() => loadSession(s.id)}
              >
                <MessageSquare className="w-4 h-4 text-slate-500 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-300 group-hover:text-white truncate">{s.title || 'Untitled'}</p>
                  <p className="text-xs text-slate-600">{timeAgo(s.created_at)}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteSession(s.id) }}
                  className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white/[0.02] border border-white/[0.06] rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="font-bold text-white">AI Agronomist</h2>
            <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-semibold">Gemini 2.5 Flash</p>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
            <Database className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">pgvector Linked</span>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center mr-3 shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-emerald-400" />
                </div>
              )}
              <div className={`max-w-[70%]`}>
                <div className={`rounded-2xl px-5 py-4 ${
                  msg.role === 'user'
                    ? 'bg-emerald-500 text-black rounded-br-md'
                    : 'bg-white/[0.04] border border-white/[0.06] text-slate-300'
                }`}>
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {msg.content.replace(/\[ACTION:.*?\]$/, '')}
                  </pre>
                  {msg.role === 'assistant' && msg.content.match(/\[ACTION:(.*?)\]$/) && (
                    <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                      <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Recommended CEO Action
                      </p>
                      <pre className="text-xs text-slate-300 bg-black/40 p-2 rounded-lg overflow-x-auto">
                        {JSON.stringify(JSON.parse(msg.content.match(/\[ACTION:(.*?)\]$/)?.[1] || '{}'), null, 2)}
                      </pre>
                      <button className="mt-3 w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg text-sm shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Authorize & Dispatch
                      </button>
                    </div>
                  )}
                </div>

                {/* RAG Sources */}
                {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2">
                    <button
                      onClick={() => setShowSources(showSources === i ? null : i)}
                      className="flex items-center gap-1.5 text-[11px] text-cyan-400/70 hover:text-cyan-400 font-medium transition-colors"
                    >
                      <Database className="w-3 h-3" />
                      {msg.sources.length} RAG Sources
                      <ChevronDown className={`w-3 h-3 transition-transform ${showSources === i ? 'rotate-180' : ''}`} />
                    </button>
                    {showSources === i && (
                      <div className="mt-2 space-y-1">
                        {msg.sources.map((src, j) => (
                          <div key={j} className="flex items-center gap-2 text-[11px] text-slate-500 bg-black/20 px-3 py-1.5 rounded-lg">
                            <span className="text-slate-400">{src.plot_name}</span>
                            <span>•</span>
                            <span>{src.log_date}</span>
                            <span className="ml-auto text-emerald-500/70">{(src.similarity * 100).toFixed(0)}% match</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl px-5 py-4 flex items-center gap-3">
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                <span className="text-sm text-slate-400">Mining pgvector context...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask about your crops, soil, market timing..."
              className="input-farm flex-1"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="btn-primary px-6 disabled:opacity-30"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
