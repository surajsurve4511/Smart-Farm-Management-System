import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Farmer, CurrentWeatherDetail, ForecastDayDetail, NotificationType, ChatMessage } from '../types';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { MicrophoneIcon, AIServiceIcon, UserIcon, CameraIcon, XCircleIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface FarmingAdvisorProps {
    aiInstance: GoogleGenAI | null;
    farmer: Farmer;
    weatherData: CurrentWeatherDetail | null;
    forecastData: ForecastDayDetail[] | null;
    showNotification: (message: string, type: NotificationType) => void;
}

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.role === 'user';
    return (
        <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-brand-blue' : 'bg-brand-purple'}`}>
                {isUser ? <UserIcon className="w-5 h-5 text-white" /> : <AIServiceIcon className="w-5 h-5 text-white" />}
            </div>
            <div className={`p-3 rounded-xl max-w-lg ${isUser ? 'bg-brand-blue text-white rounded-br-none' : 'bg-neutral-100 text-neutral-800 rounded-bl-none'}`}>
                 {message.imagePreview && (
                    <img src={message.imagePreview} alt="upload preview" className="mb-2 rounded-lg max-h-48 w-auto" />
                )}
                {message.status === 'thinking' && (
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse delay-150"></div>
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse delay-300"></div>
                    </div>
                )}
                {message.text && <p className="text-sm whitespace-pre-wrap">{message.text}</p>}
            </div>
        </div>
    );
};


const FarmingAdvisor: React.FC<FarmingAdvisorProps> = ({ aiInstance, farmer, weatherData, forecastData, showNotification }) => {
    const { t } = useLanguage();
    const { chatHistory, isListening, isSpeaking, isThinking, error, startListening, stopSpeaking } = useVoiceAssistant({
        aiInstance, farmer, weatherData, forecastData, showNotification
    });
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    
    useEffect(() => {
        chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }, [chatHistory]);

    // Setup and teardown camera
    useEffect(() => {
        let isMounted = true;
        async function setupCamera() {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (isMounted) {
                    setStream(mediaStream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = mediaStream;
                    }
                }
            } catch (err) {
                console.error("Camera access error:", err);
                if (isMounted) {
                    setCameraError(t('advisor.cameraError'));
                    showNotification(t('advisor.cameraError'), NotificationType.ERROR);
                }
            }
        }
        setupCamera();
        return () => {
            isMounted = false;
            stream?.getTracks().forEach(track => track.stop());
        };
    }, [showNotification, t]);


    const handleMicClick = () => {
        if (isSpeaking) {
            stopSpeaking();
            return;
        }

        if (isListening || isThinking || !stream || !videoRef.current) return;
        
        // Capture frame and start listening
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
                    startListening({
                        imageFile: file,
                        imagePreview: URL.createObjectURL(file),
                    });
                }
            }, 'image/jpeg', 0.9);
        }
    };
    
    const micButtonClass = isListening
        ? 'bg-red-500 hover:bg-red-600'
        : isSpeaking
        ? 'bg-yellow-500 hover:bg-yellow-600'
        : isThinking
        ? 'bg-neutral-400 cursor-not-allowed'
        : 'bg-brand-green hover:bg-brand-green/90';

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 h-full flex flex-col p-4 sm:p-6">
             <canvas ref={canvasRef} className="hidden" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                {/* Left side: Video and Controls */}
                <div className="flex flex-col">
                    <div className="relative w-full aspect-video bg-neutral-900 rounded-xl overflow-hidden shadow-md">
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                        {cameraError && !stream && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white p-4">
                                <XCircleIcon className="w-12 h-12 text-red-400 mb-2"/>
                                <h3 className="font-semibold">{cameraError}</h3>
                                <p className="text-xs text-center text-neutral-300">Please allow camera and microphone access in your browser settings.</p>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col items-center justify-center pt-6">
                        <div className="relative flex items-center justify-center">
                            {isListening && <div className="absolute w-28 h-28 bg-brand-green/30 rounded-full animate-ping"></div>}
                            <button
                                onClick={handleMicClick}
                                disabled={isThinking || !!cameraError}
                                className={`relative w-20 h-20 rounded-full text-white flex items-center justify-center transition-colors duration-300 shadow-lg ${micButtonClass}`}
                                aria-label={isListening ? "Stop listening" : isSpeaking ? "Stop speaking" : "Capture and Speak"}
                            >
                                <MicrophoneIcon className="w-10 h-10" />
                            </button>
                        </div>
                        <p className="mt-4 text-sm text-neutral-500 h-5">
                            {isListening ? "Listening..." : isSpeaking ? "Speaking..." : isThinking ? "Processing..." : t('advisor.captureAndSpeak')}
                        </p>
                    </div>
                </div>

                {/* Right side: Chat History */}
                <div className="flex flex-col h-full">
                    {error && (
                        <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-5 pr-2 -mr-2">
                        {chatHistory.map(msg => <ChatBubble key={msg.id} message={msg} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmingAdvisor;
