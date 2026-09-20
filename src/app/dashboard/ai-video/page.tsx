'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Camera, Bot, Loader2, Sparkles, AlertCircle } from 'lucide-react'

export default function AIVideoPage() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiTranscript, setAiTranscript] = useState<string[]>([])
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const captureAndAnalyze = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isAnalyzing) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    ctx.drawImage(video, 0, 0)

    const base64 = canvas.toDataURL('image/jpeg', 0.7).split(',')[1]
    if (!base64) return

    setIsAnalyzing(true)
    try {
      const res = await fetch('/api/analyze-frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      })
      const data = await res.json()
      if (data.analysis) {
        setAiTranscript(prev => [...prev, data.analysis])
      }
    } catch {
      // Silently fail on analysis errors
    } finally {
      setIsAnalyzing(false)
    }
  }, [isAnalyzing])

  const startCall = async () => {
    setIsConnecting(true)
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setIsCallActive(true)
      setAiTranscript([
        'Gemini Vision AI connected. Show me your crop and I will analyze it in real-time.',
        'Point your camera at any affected leaves, soil, or crops for instant diagnosis.',
        'Frame capture happens every 5 seconds for AI analysis.',
      ])

      // Start frame capture every 5 seconds
      intervalRef.current = setInterval(() => {
        captureAndAnalyze()
      }, 5000)
    } catch {
      setAiTranscript(['Camera access denied. Please allow camera permissions to use Video Diagnosis.'])
    } finally {
      setIsConnecting(false)
    }
  }

  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsCallActive(false)
  }

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => { track.enabled = !track.enabled })
      setIsVideoOn(!isVideoOn)
    }
  }

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => { track.enabled = !track.enabled })
      setIsMicOn(!isMicOn)
    }
  }

  const captureManually = () => {
    captureAndAnalyze()
  }

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop())
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [stream])

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header>
        <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-4">
          <Video className="w-10 h-10 text-purple-400" />
          AI Video Diagnosis
        </h1>
        <p className="text-slate-400 mt-2 text-lg font-light">
          Real-time crop diagnosis via Gemini Vision. Show your crops on camera for instant AI analysis.
        </p>
      </header>

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Feed */}
        <div className="lg:col-span-2">
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl relative">
            {/* Video Area */}
            <div className="aspect-video bg-black relative flex items-center justify-center">
              {isCallActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${!isVideoOn ? 'hidden' : ''}`}
                  />
                  {!isVideoOn && (
                    <div className="flex flex-col items-center gap-4">
                      <VideoOff className="w-16 h-16 text-slate-600" />
                      <p className="text-slate-500 font-medium">Camera Off</p>
                    </div>
                  )}
                  {/* AI Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-semibold text-white">LIVE</span>
                    </div>
                    <div className="flex gap-2">
                      {isAnalyzing && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 backdrop-blur-md border border-amber-500/30 rounded-full">
                          <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                          <span className="text-xs font-semibold text-amber-300">Analyzing...</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 backdrop-blur-md border border-purple-500/30 rounded-full">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-xs font-semibold text-purple-300">Gemini Vision Active</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-cyan-600 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.3)]">
                    <Camera className="w-12 h-12 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-lg">Start AI Video Diagnosis</p>
                    <p className="text-slate-500 text-sm mt-1">Point your camera at your crops for real-time analysis</p>
                  </div>
                </div>
              )}
            </div>

            {/* Controls Bar */}
            <div className="p-6 bg-black/30 border-t border-white/[0.05] flex items-center justify-center gap-4">
              {isCallActive ? (
                <>
                  <button onClick={toggleMic} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isMicOn ? 'bg-white/[0.08] hover:bg-white/[0.12] text-white' : 'bg-red-500/20 border border-red-500/30 text-red-400'}`}>
                    {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                  </button>
                  <button onClick={toggleVideo} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isVideoOn ? 'bg-white/[0.08] hover:bg-white/[0.12] text-white' : 'bg-red-500/20 border border-red-500/30 text-red-400'}`}>
                    {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                  </button>
                  <button onClick={captureManually} disabled={isAnalyzing} className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 flex items-center justify-center transition-all disabled:opacity-50">
                    <Camera className="w-6 h-6" />
                  </button>
                  <button onClick={endCall} className="w-14 h-14 rounded-2xl bg-red-500 hover:bg-red-400 text-white flex items-center justify-center transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                    <PhoneOff className="w-6 h-6" />
                  </button>
                </>
              ) : (
                <button onClick={startCall} disabled={isConnecting} className="px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white font-bold rounded-2xl transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] flex items-center gap-3 disabled:opacity-50">
                  {isConnecting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" />Connecting...</>
                  ) : (
                    <><Phone className="w-5 h-5" />Start AI Video Call</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* AI Transcript Panel */}
        <div className="bg-gradient-to-b from-purple-950/40 to-black border border-purple-900/30 rounded-3xl p-6 shadow-2xl flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <Bot className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">AI Analysis Feed</h3>
              <p className="text-xs text-purple-400 uppercase tracking-widest font-semibold">
                {isCallActive ? 'Streaming' : 'Standby'}
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px]">
            {aiTranscript.length > 0 ? (
              aiTranscript.map((msg, i) => (
                <div key={i} className="bg-black/40 border border-purple-500/10 rounded-2xl p-4 text-sm text-slate-300 leading-relaxed animate-fade-in">
                  <p className="text-[10px] text-purple-500/50 mb-1">Analysis #{i + 1}</p>
                  {msg}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <AlertCircle className="w-10 h-10 text-slate-600" />
                <p className="text-slate-500 text-sm">
                  Start a video call to receive real-time AI crop analysis
                </p>
              </div>
            )}
          </div>

          {/* How It Works */}
          <div className="mt-6 bg-black/30 border border-white/[0.05] rounded-2xl p-4">
            <p className="text-[10px] font-bold text-purple-500/70 uppercase tracking-[0.2em] mb-3">How It Works</p>
            <div className="space-y-2 text-xs text-slate-500">
              <p>📷 Camera captures frames every 5 seconds</p>
              <p>🧠 Gemini Vision API analyzes each frame</p>
              <p>🌿 AI identifies diseases, pests, nutrient deficiencies</p>
              <p>💊 Instant treatment recommendations provided</p>
              <p>📸 Manual capture button for on-demand analysis</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
