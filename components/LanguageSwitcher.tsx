import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { GlobeIcon, ChevronDownIcon } from './icons';

const languages = {
  en: 'English',
  hi: 'हिन्दी',
  ml: 'മലയാളം',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  bn: 'বাংলা',
};

const LanguageSwitcher: React.FC = () => {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="p-2">
        <label htmlFor="language-select" className="sr-only">Select Language</label>
        <div className="relative">
            <GlobeIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
            <select
                id="language-select"
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="w-full pl-10 pr-10 py-2 text-sm border border-neutral-200 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white hover:bg-neutral-100 transition-colors duration-150 text-black"
            >
                {Object.entries(languages).map(([code, name]) => (
                <option key={code} value={code} className="text-black font-medium">
                    {name}
                </option>
                ))}
            </select>
            <ChevronDownIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
        </div>
    </div>
  );
};

export default LanguageSwitcher;