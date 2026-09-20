import { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat, Part } from "@google/genai";
import { Farmer, CurrentWeatherDetail, ForecastDayDetail, ChatMessage, NotificationType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface UseVoiceAssistantProps {
    aiInstance: GoogleGenAI | null;
    farmer: Farmer;
    weatherData: CurrentWeatherDetail | null;
    forecastData: ForecastDayDetail[] | null;
    showNotification: (message: string, type: NotificationType) => void;
    onMessageSent?: () => void;
}

// Check for browser support
// FIX: Cast window to `any` to access browser-specific properties without TypeScript errors.
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const isSpeechSupported = !!SpeechRecognition;

const AGRISETU_SYSTEM_PROMPT = `🌱 AgriSetu – System Instructions for Gemini Realtime (Voice + Video Assistant)

You are AgriSetu, an AI-powered virtual farming assistant available through voice and video.
Your role is to act like a friendly farming guide who talks with farmers in a simple, clear, and supportive manner.

🎯 Core Responsibilities

Text & Voice Queries → Answer farmer questions about crops, soil, weather, pests, and markets in a conversational, farmer-friendly tone.

Image Inputs (via webcam/upload) → When a farmer shows a crop/leaf image, identify pests, diseases, or nutrient problems and explain remedies.

PDF Inputs (via share screen/upload) → Summarize and explain soil reports, government schemes, or farming guides in simple spoken language.

Weather & Market Advisory → Provide irrigation tips, fertilizer schedules, and crop market updates in real-time.

Multilingual Support → Speak in regional languages (Hindi, Marathi, etc.) if requested.

Accessibility → Use short sentences, friendly tone, and real-life examples so even low-literacy farmers can understand easily.

🗣 Voice Interaction Style

Speak clearly, warmly, and slowly, like a trusted local advisor.

Use step-by-step spoken instructions (e.g., “First, do this… then wait one day… next, apply…”).

Confirm understanding: “Would you like me to repeat this in Hindi?”

Stay calm, supportive, and motivating.

Avoid long, complex technical explanations.

⚖ Constraints

Always respect farmer data privacy.

If unsure, advise consulting a local agricultural officer, while still giving your best guidance.

Avoid overpromising results; be practical.

✅ Example Interactions

Example 1 – Crop Recommendation
👨‍🌾 Farmer: “My soil is sandy and I live in Maharashtra. Which crop should I grow this season?”
🌱 AgriSetu: “Since your soil is sandy, crops like groundnut, millets, or pulses will grow well. Because you are in Maharashtra, groundnut is a very good choice this season. Would you like me to also suggest some irrigation tips?”

Example 2 – Weather-based Advisory
👨‍🌾 Farmer: “It rained heavily yesterday. Should I water my tomato crop today?”
🌱 AgriSetu: “No, you should wait for the soil to dry slightly before watering. If the soil is still wet, watering again can damage the roots. Check tomorrow morning—if the soil feels dry one inch below the surface, then water lightly.”

Example 3 – Pest from Image
👨‍🌾 Farmer: (shows cotton leaf with white spots on webcam)
🌱 AgriSetu: “I see whitefly attack on your cotton leaf. Spray neem oil solution or an approved bio-pesticide. Also, remove and destroy the affected leaves. Do you want me to explain how to prepare neem spray?”

Example 4 – PDF Soil Report
👨‍🌾 Farmer: (uploads soil test PDF) “Can you explain this report?”
🌱 AgriSetu: “Your soil test shows nitrogen is low, phosphorus is medium, and potassium is high. This means you should add urea or compost for nitrogen. Don’t add too much potassium fertilizer. I can suggest the exact dosage if you tell me the crop.”

Example 5 – Market Advisory
👨‍🌾 Farmer: “What is the onion price trend in Pune?”
🌱 AgriSetu: “Right now, onion prices in Pune are going down slightly because of high supply. If you can store your onions for 2 weeks, you may get a better price.”`;


export const useVoiceAssistant = ({ aiInstance, farmer, weatherData, forecastData, showNotification, onMessageSent }: UseVoiceAssistantProps) => {
    const { t, language } = useLanguage();
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        { id: 'intro', role: 'model', text: t('advisor.intro'), status: 'complete' }
    ]);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // FIX: Use `any` for the ref type to handle browser-specific API and avoid type/value name collision.
    const recognitionRef = useRef<any | null>(null);
    const recognitionContextRef = useRef<{ imageFile?: File; imagePreview?: string } | null>(null);
    const chatRef = useRef<Chat | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // FIX: Moved `speak` declaration before `processMessage` to fix "used before its declaration" error.
    const speak = useCallback((text: string) => {
        if (!text || !window.speechSynthesis) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
            console.error("Speech synthesis error:", e.error, "at char", e.charIndex);
            setIsSpeaking(false);
        };
        
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);

    }, [language]);

    const processMessage = useCallback(async (text: string, imageFile?: File) => {
        if (!chatRef.current) return;
        setIsThinking(true);
        let currentResponseText = "";
        
        const thinkingMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'model',
            text: '',
            status: 'thinking'
        };
        setChatHistory(prev => [...prev, thinkingMessage]);

        try {
            const parts: Part[] = [];
             if (imageFile) {
                const base64Data = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                    reader.onerror = reject;
                    reader.readAsDataURL(imageFile);
                });
                parts.push({ inlineData: { data: base64Data, mimeType: imageFile.type } });
            }
            parts.push({ text });

            const result = await chatRef.current.sendMessageStream({ message: parts });

            for await (const chunk of result) {
                currentResponseText += chunk.text;
                setChatHistory(prev => prev.map(msg => 
                    msg.id === thinkingMessage.id ? { ...msg, text: currentResponseText } : msg
                ));
            }
            
            setChatHistory(prev => prev.map(msg => 
                msg.id === thinkingMessage.id ? { ...msg, status: 'complete' } : msg
            ));
            
            speak(currentResponseText);

        } catch (err) {
            console.error("Gemini Error:", err);
            let errorMessage = "Error:";
            if (err instanceof Error && err.message) {
                 try {
                    const errorJson = JSON.parse(err.message);
                    if (errorJson?.error?.status === 'RESOURCE_EXHAUSTED') {
                        errorMessage = t('notifications.aiQuotaError');
                    } else {
                        errorMessage += ` ${err.message}`;
                    }
                } catch (parseError) {
                     errorMessage += ` ${err.message}`;
                }
            } else {
                 errorMessage += ` An unknown error occurred.`;
            }
            
            setChatHistory(prev => prev.map(msg => 
                msg.id === thinkingMessage.id ? { ...msg, text: errorMessage, status: 'error' } : msg
            ));
        } finally {
            setIsThinking(false);
        }
    }, [chatRef, t, speak]);


    useEffect(() => {
        if (!isSpeechSupported) {
            setError(t('advisor.unsupported'));
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => {
            if (event.error === 'no-speech' || event.error === 'audio-capture') {
                console.warn(`Speech recognition event: ${event.error}`);
                return; // Ignore common, non-critical errors
            }
            console.error("Speech recognition error", event.error);
            if (event.error === 'not-allowed') {
                setError(t('advisor.permission'));
                showNotification(t('advisor.permission'), NotificationType.ERROR);
            } else {
                setError(`Speech recognition error: ${event.error}`); // Generic error for others
            }
        };

        recognition.onresult = (event: any) => {
            const transcript = Array.from(event.results)
                .map((result: any) => result[0])
                .map((result: any) => result.transcript)
                .join('');
            
            if (event.results[0].isFinal) {
                const userMessage: ChatMessage = {
                    id: Date.now().toString(),
                    role: 'user',
                    text: transcript,
                    status: 'complete',
                    imagePreview: recognitionContextRef.current?.imagePreview
                };
                setChatHistory(prev => [...prev, userMessage]);
                processMessage(transcript, recognitionContextRef.current?.imageFile);
                
                onMessageSent?.();
                recognitionContextRef.current = null;
            }
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
            window.speechSynthesis.cancel();
        };

    }, [language, processMessage, t, showNotification, onMessageSent]);
    
    useEffect(() => {
        if (aiInstance) {
            chatRef.current = aiInstance.chats.create({
                model: 'gemini-2.5-flash',
                config: { systemInstruction: AGRISETU_SYSTEM_PROMPT }
            });
        }
    }, [aiInstance]);


    const startListening = useCallback((context?: { imageFile?: File; imagePreview?: string }) => {
        if (isListening || isSpeaking || isThinking) return;
        recognitionContextRef.current = context || null;
        recognitionRef.current?.start();
    }, [isListening, isSpeaking, isThinking]);


    const stopListening = () => {
        recognitionRef.current?.stop();
    };

    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    return {
        chatHistory,
        isListening,
        isSpeaking,
        isThinking,
        error,
        startListening,
        stopListening,
        stopSpeaking,
    };
};
