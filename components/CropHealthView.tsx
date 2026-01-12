import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import AnalysisResult from './AnalysisResult';
import LoadingSpinner from './LoadingSpinner';
import ExampleImages from './ExampleImages';
import { useGemini } from '../hooks/useGemini';
import { Analysis } from '../types';
import { WelcomeIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

const CropHealthView: React.FC = () => {
  const { t } = useLanguage();
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const { isLoading, error, generateAnalysis } = useGemini();
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);
  const [cropType, setCropType] = useState<string>('');

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setMimeType(file.type);
      setCurrentAnalysis(null); // Reset previous analysis
    };
    reader.readAsDataURL(file);
  };
  
  const handleSelectExample = async (url: string) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], "example.jpg", { type: blob.type });
        handleImageUpload(file);
    } catch(err) {
        console.error("Failed to fetch example image:", err);
    }
  };

  const handleAnalyze = async () => {
    if (image) {
      const base64Data = image.split(',')[1];
      const result = await generateAnalysis(base64Data, mimeType, { cropType });
      setCurrentAnalysis(result);
    }
  };

  const handleReset = () => {
    setImage(null);
    setMimeType('');
    setCurrentAnalysis(null);
    setCropType('');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-700">{t('cropHealth.title')}</h1>
        <p className="mt-2 text-gray-600">
          {t('cropHealth.description')}
        </p>
      </div>

      {!image && <ExampleImages onSelect={handleSelectExample} />}
      
      {image && (
        <div className="mb-4">
          <label htmlFor="crop-type" className="block text-sm font-medium text-neutral-700 text-center">{t('cropHealth.cropContext')}</label>
          <input 
            type="text" 
            id="crop-type" 
            value={cropType} 
            onChange={(e) => setCropType(e.target.value)} 
            placeholder={t('cropHealth.cropPlaceholder')}
            className="mt-1 block w-full max-w-sm mx-auto p-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
          />
        </div>
      )}

      <ImageUploader onImageUpload={handleImageUpload} imagePreview={image} onReset={handleReset} />
      
      {image && !isLoading && !currentAnalysis && (
        <div className="text-center mt-6">
          <button
            onClick={handleAnalyze}
            className="bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:bg-gray-400"
            disabled={isLoading}
          >
            {t('cropHealth.analyzeButton')}
          </button>
        </div>
      )}

      <div className="mt-8">
        {isLoading && <LoadingSpinner />}
        {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}
        
        {currentAnalysis ? (
            <AnalysisResult analysis={currentAnalysis} />
        ) : !isLoading && !image && (
            <div className="text-center p-8 bg-green-50 rounded-xl border-2 border-dashed border-green-200">
                <WelcomeIcon className="mx-auto h-24 w-24 text-green-300" />
                <h3 className="mt-4 text-xl font-semibold text-green-800">{t('cropHealth.welcomeTitle')}</h3>
                <p className="mt-2 text-gray-500">{t('cropHealth.welcomeDescription')}</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default CropHealthView;