import { useState, useCallback } from 'react';
import { getPlantHealthAnalysis } from '../services/geminiService';
import { Analysis } from '../types';

export const useGemini = () => {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateAnalysis = useCallback(async (base64Image: string, mimeType: string, context?: { cropType?: string }): Promise<Analysis | null> => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await getPlantHealthAnalysis(base64Image, mimeType, context);
      setAnalysis(result);
      return result;
    } catch (err) {
      let errorMessage = 'An unknown error occurred.';
      if (err instanceof Error && err.message) {
          try {
              const errorJson = JSON.parse(err.message);
              if (errorJson?.error?.status === 'RESOURCE_EXHAUSTED') {
                  errorMessage = 'The AI service quota has been exceeded. Please try again later.';
              } else {
                  errorMessage = err.message;
              }
          } catch (parseError) {
              errorMessage = err.message;
          }
      }
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { analysis, isLoading, error, generateAnalysis };
};