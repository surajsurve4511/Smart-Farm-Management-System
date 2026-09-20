import React from 'react';
import { AIServiceIcon } from './icons';

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-8 space-y-4">
    <AIServiceIcon className="w-16 h-16 text-brand-purple animate-spin" />
    <p className="text-neutral-600">Analyzing image with AI...</p>
    <p className="text-sm text-neutral-500">This may take a moment.</p>
  </div>
);

export default LoadingSpinner;
