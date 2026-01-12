


import React, { useState, useMemo, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Farmer, Farm, Plot, CurrentWeatherDetail, ForecastDayDetail } from '../types';
import { BrainCircuitIcon, AIServiceIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface WeatherAIAdvisorProps {
    farmer: Farmer;
    currentWeather: CurrentWeatherDetail;
    forecast: ForecastDayDetail[];
    aiInstance: GoogleGenAI | null;
}

const WeatherAIAdvisor: React.FC<WeatherAIAdvisorProps> = ({ farmer, currentWeather, forecast, aiInstance }) => {
    const { t } = useLanguage();
    const [selectedFarmId, setSelectedFarmId] = useState<string>('');
    const [selectedPlotId, setSelectedPlotId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [advice, setAdvice] = useState<string>('');
    const [error, setError] = useState<string>('');

    const availablePlots = useMemo(() => {
        if (!selectedFarmId) return [];
        const selectedFarm = farmer.farms.find(f => f.id === selectedFarmId);
        return selectedFarm?.plots || [];
    }, [selectedFarmId, farmer.farms]);

    const handleFarmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFarmId(e.target.value);
        setSelectedPlotId(''); // Reset plot selection
        setAdvice('');
        setError('');
    };

    const handlePlotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPlotId(e.target.value);
        setAdvice('');
        setError('');
    };
    
    const generateAdvicePrompt = (farm: Farm, plot: Plot, weather: CurrentWeatherDetail, weatherForecast: ForecastDayDetail[]): string => {
        const serializedLogs = (plot.dailyLogs || [])
            .slice(-3) // Get last 3 logs
            .map(log => `
- Date: ${new Date(log.date).toLocaleDateString()}
  - Farmer Notes: ${log.farmerNotes || 'N/A'}
  - AI Analysis Summary: ${log.aiAnalysis?.summary || 'N/A'}`)
            .join('');

        const serializedForecast = weatherForecast.map(day => `
- ${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })}: ${day.day.condition.text}, High ${Math.round(day.day.maxtemp_c)}°C, Low ${Math.round(day.day.mintemp_c)}°C`).join('');

        return `
You are an expert agronomist AI providing hyper-personalized advice. A farmer needs weather-related guidance for a specific plot. Your response should be a markdown-formatted string.

**CONTEXT:**
- **Location:** ${farmer.location}
- **Farm:** ${farm.name}
- **Plot:** ${plot.name}
- **Crop:** ${plot.crop} (${plot.cropInfo?.variety || 'N/A'})
- **Soil Type:** ${plot.soilType || 'N/A'}
- **Planting Date:** ${plot.cropInfo?.plantingDate ? new Date(plot.cropInfo.plantingDate).toLocaleDateString() : 'N/A'}
- **Current Health Status:** ${plot.cropInfo?.healthStatus || 'N/A'}

**CURRENT WEATHER:**
- Condition: ${weather.condition.text}
- Temperature: ${weather.temp_c}°C
- Wind: ${weather.wind_kph} km/h
- Humidity: ${weather.humidity}%

**5-DAY FORECAST:**${serializedForecast}

**RECENT PLOT HISTORY (LAST 3 LOGS):**${serializedLogs || `
- No recent logs available.`}

**TASK:**
Based on ALL the provided context, generate a concise, actionable, and personalized advisory for the farmer in markdown format. Focus on specific actions they should take in response to the current and upcoming weather. 
For example:
- If heavy rain is coming, advise on checking drainage or delaying fertilization.
- If it's going to be hot and dry, advise on irrigation timing and checking for heat stress.
- If pests were recently noted in the logs and the weather is favorable for them, mention the increased risk.
The advice must be easy to understand and directly relevant to the provided plot, its history, and the weather data. Start with a direct headline like "### Weather Advisory for [Plot Name]".
        `;
    };

    const handleGetAdvice = useCallback(async () => {
        if (!aiInstance || !selectedFarmId || !selectedPlotId) return;

        const farm = farmer.farms.find(f => f.id === selectedFarmId);
        const plot = farm?.plots.find(p => p.id === selectedPlotId);

        if (!farm || !plot) {
            setError("Selected farm or plot not found.");
            return;
        }

        setIsLoading(true);
        setAdvice('');
        setError('');

        try {
            const prompt = generateAdvicePrompt(farm, plot, currentWeather, forecast);
            const response: GenerateContentResponse = await aiInstance.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setAdvice(response.text);
        } catch (err) {
            console.error("AI Weather Advice error:", err);
            let errorMessage: string;
            if (err instanceof Error && err.message) {
                 try {
                    const errorJson = JSON.parse(err.message);
                    if (errorJson?.error?.status === 'RESOURCE_EXHAUSTED') {
                        errorMessage = t('notifications.aiQuotaError');
                    } else {
                        errorMessage = errorJson?.error?.message || "Failed to get AI advice.";
                    }
                } catch (parseError) {
                     errorMessage = err.message;
                }
            } else {
                 errorMessage = "An unknown error occurred while getting AI advice.";
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [aiInstance, selectedFarmId, selectedPlotId, farmer, currentWeather, forecast, t]);


    return (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-neutral-200">
            <h3 className="text-xl font-bold text-neutral-800 mb-4 flex items-center">
                <BrainCircuitIcon className="w-6 h-6 mr-3 text-brand-purple" />
                Personalized AI Weather Advisory
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
                Select a farm and plot to receive AI-powered advice based on its specific conditions and the latest weather forecast.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-1">
                    <label htmlFor="farm-select" className="block text-sm font-medium text-neutral-700">Farm</label>
                    <select id="farm-select" value={selectedFarmId} onChange={handleFarmChange} className="mt-1 block w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-purple focus:border-brand-purple">
                        <option value="">Select a Farm</option>
                        {farmer.farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                </div>
                <div className="md:col-span-1">
                    <label htmlFor="plot-select" className="block text-sm font-medium text-neutral-700">Plot</label>
                    <select id="plot-select" value={selectedPlotId} onChange={handlePlotChange} disabled={!selectedFarmId} className="mt-1 block w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-purple focus:border-brand-purple disabled:bg-neutral-100">
                        <option value="">Select a Plot</option>
                        {availablePlots.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                <div className="md:col-span-1">
                    <button onClick={handleGetAdvice} disabled={!selectedPlotId || isLoading} className="w-full px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-purple/90 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 transition flex items-center justify-center disabled:opacity-50">
                        {isLoading ? (
                            <>
                                <AIServiceIcon className="w-5 h-5 mr-2 animate-spin" />
                                Analyzing...
                            </>
                        ) : "Get AI Advice"}
                    </button>
                </div>
            </div>

            {error && <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">{error}</div>}
            
            {advice && (
                <div className="mt-6 pt-4 border-t border-neutral-200">
                    <div className="text-sm text-neutral-700 bg-neutral-50 p-4 rounded-md border whitespace-pre-wrap">
                        {advice}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeatherAIAdvisor;