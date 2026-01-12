import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Farmer, Activity, Plot, Farm, NotificationMessage, NotificationType, DailyPlotLog, AIImageAnalysis, WeatherData, ConsultantNote, MarketData, YieldPredictionData } from './types';
import PlotCard from './components/PlotCard';
import ActivityCard from './components/ActivityCard';
import FarmerListItem from './components/FarmerListItem';
import { UserIcon, ActivityLogIcon, FarmIcon as AppFarmIcon, PlotIcon as SectionPlotIcon, DashboardIcon, SettingsIcon, PlusCircleIcon, CheckCircleIcon, XCircleIcon, InfoIcon, LogoutIcon, GlobeIcon, AIServiceIcon, ChevronDownIcon, UploadIcon, CameraIcon, PencilIcon, BrainCircuitIcon, MarketIcon, SunIcon, ShieldCheckIcon, MicrophoneIcon } from './components/icons';
import { LoggedInUser } from './App';
import Modal from './components/Modal';
import { useData } from './contexts/DataContext';
import WeatherCard from './components/WeatherCard';
import AI_Assistant from './components/AI_Assistant';
import NoteCard from './components/NoteCard';
import AddNoteForm from './components/AddNoteForm';
import { useLanguage } from './contexts/LanguageContext';
import PersonalizedSuggestions from './components/PersonalizedSuggestions';
import MarketPriceCard from './components/MarketPriceCard';
import YieldPredictionCard from './components/YieldPredictionCard';
import PlotLogHistoryModal from './components/PlotLogHistoryModal';
import AddDailyLogModal from './components/AddDailyLogModal';
import MarketPriceFinder from './components/MarketPriceFinder';
import { useWeather } from './hooks/useWeather';
import WeatherView from './components/WeatherView';
import CropHealthView from './components/CropHealthView';
import FarmingAdvisor from './components/FarmingAdvisor';
import LanguageSwitcher from './components/LanguageSwitcher';


const LOCAL_STORAGE_KEYS = {
  SELECTED_FARMER_ID: 'smartFarmData_selectedFarmerId'
};

// --- LocalStorage Utilities ---
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    const item = JSON.stringify(value);
    localStorage.setItem(key, item);
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error);
  }
};

// --- Notification Component ---
interface NotificationProps {
  notification: NotificationMessage | null;
  onDismiss: () => void;
}
const Notification: React.FC<NotificationProps> = ({ notification, onDismiss }) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, onDismiss]);

  if (!notification) return null;

  const baseClasses = "fixed top-5 right-5 p-4 rounded-md shadow-lg text-white text-sm z-[100] flex items-center transition-all duration-300 ease-in-out transform";
  const typeClasses = {
    [NotificationType.SUCCESS]: "bg-brand-green",
    [NotificationType.ERROR]: "bg-red-500",
    [NotificationType.INFO]: "bg-brand-blue",
  };
  const Icon = notification.type === NotificationType.SUCCESS ? CheckCircleIcon : notification.type === NotificationType.ERROR ? XCircleIcon : InfoIcon;

  return (
    <div className={`${baseClasses} ${typeClasses[notification.type]} ${notification ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
      <span>{notification.message}</span>
      <button onClick={onDismiss} className="ml-4 text-white hover:text-white/80" aria-label="Dismiss notification">
        &times;
      </button>
    </div>
  );
};

// --- Add Farm Form ---
interface AddFarmFormProps {
  farmerId: string;
  onClose: () => void;
  showNotification: (message: string, type: NotificationType) => void;
}
const AddFarmForm: React.FC<AddFarmFormProps> = ({ farmerId, onClose, showNotification }) => {
  const { addFarm } = useData();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [areaHectares, setAreaHectares] = useState<number | ''>('');
  const [locationAddress, setLocationAddress] = useState('');
  const [errors, setErrors] = useState<{[key:string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: {[key:string]: string} = {};
    if (!name.trim()) newErrors.name = t('forms.errors.farmNameRequired');
    if (areaHectares === '' || Number(areaHectares) <= 0) newErrors.areaHectares = t('forms.errors.areaPositive');
    if (!locationAddress.trim()) newErrors.locationAddress = t('forms.errors.locationRequired');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
        const newFarmData: Omit<Farm, 'id' | 'plots' | 'locationCoords'> = {
            farmerId,
            name,
            areaHectares: Number(areaHectares),
            locationAddress,
        };
        await addFarm(newFarmData);
        showNotification(t('notifications.farmAdded', { name }), NotificationType.SUCCESS);
        onClose();
    } catch (error) {
        showNotification(t('notifications.farmAddFailed'), NotificationType.ERROR);
        console.error(error);
    } finally {
        setIsSubmitting(false);
    }
  };
  return (
     <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="farm-name" className="block text-sm font-medium text-neutral-700">{t('forms.labels.farmName')}</label>
        <input type="text" id="farm-name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue" />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="farm-area" className="block text-sm font-medium text-neutral-700">{t('forms.labels.area')}</label>
        <input type="number" id="farm-area" value={areaHectares} onChange={e => setAreaHectares(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 block w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue" />
        {errors.areaHectares && <p className="text-red-500 text-xs mt-1">{errors.areaHectares}</p>}
      </div>
      <div>
        <label htmlFor="farm-location" className="block text-sm font-medium text-neutral-700">{t('forms.labels.location')}</label>
        <input type="text" id="farm-location" value={locationAddress} onChange={e => setLocationAddress(e.target.value)} className="mt-1 block w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue" />
        {errors.locationAddress && <p className="text-red-500 text-xs mt-1">{errors.locationAddress}</p>}
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 rounded-md hover:bg-neutral-200">{t('forms.buttons.cancel')}</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-md hover:bg-brand-blue/90 disabled:opacity-50 flex items-center">
         {isSubmitting && <AIServiceIcon className="w-4 h-4 mr-2 animate-spin" />}
         {isSubmitting ? t('forms.buttons.adding') : t('forms.buttons.addFarm')}
        </button>
      </div>
    </form>
  )
}

// --- Main Dashboard Props ---
interface DashboardProps {
  user: LoggedInUser;
  onLogout: () => void;
  analyzePlotImageWithAI: (imageDataBase64: string, mimeType: string) => Promise<AIImageAnalysis | null>;
  currentNotification: NotificationMessage | null;
  showNotification: (message: string, type: NotificationType) => void;
  dismissNotification: () => void;
  aiInstance: GoogleGenAI | null;
}

type View = 'dashboard' | 'plots' | 'feed' | 'cropHealth' | 'assistant' | 'market' | 'weather' | 'liveAdvisor';

// --- Side Navigation Component ---
interface SideNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
  onLogout: () => void;
  farmerName: string;
}
const SideNav: React.FC<SideNavProps> = ({ activeView, setActiveView, onLogout, farmerName }) => {
  const { t } = useLanguage();

  const navItems: { id: View, label: string, icon: React.FC<{className?: string}> }[] = [
    { id: 'dashboard', label: t('dashboard.nav.dashboard'), icon: DashboardIcon },
    { id: 'plots', label: t('dashboard.nav.plots'), icon: AppFarmIcon },
    { id: 'feed', label: t('dashboard.nav.feed'), icon: ActivityLogIcon },
    { id: 'cropHealth', label: t('dashboard.nav.cropHealth'), icon: ShieldCheckIcon },
    { id: 'weather', label: t('dashboard.nav.weather'), icon: SunIcon },
    { id: 'market', label: t('dashboard.nav.market'), icon: MarketIcon },
    { id: 'assistant', label: t('dashboard.nav.assistant'), icon: BrainCircuitIcon },
    { id: 'liveAdvisor', label: t('dashboard.nav.liveAdvisor'), icon: MicrophoneIcon },
  ];

  return (
    <div className="w-64 bg-white border-r border-neutral-200 flex flex-col h-screen fixed">
      <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <UserIcon className="w-10 h-10 text-brand-blue bg-brand-blue/10 p-2 rounded-full"/>
            <div>
                 <h2 className="text-md font-semibold text-neutral-800">{farmerName}</h2>
                 <p className="text-xs text-neutral-500">{t('dashboard.farmerProfile')}</p>
            </div>
          </div>
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        <ul>
            {navItems.map(item => (
                <li key={item.id}>
                <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setActiveView(item.id); }}
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors
                    ${activeView === item.id ? 'bg-brand-blue/10 text-brand-blue' : 'text-neutral-600 hover:bg-neutral-100'}`}
                >
                    <item.icon className="w-5 h-5 mr-3"/>
                    {item.label}
                </a>
                </li>
            ))}
        </ul>
      </nav>
        <div className="border-t border-neutral-200">
            <LanguageSwitcher />
        </div>
        <div className="p-2 border-t border-neutral-200">
            <a
                href="#"
                onClick={(e) => { e.preventDefault(); onLogout(); }}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-neutral-600 hover:bg-neutral-100"
            >
                <LogoutIcon className="w-5 h-5 mr-3"/>
                {t('dashboard.logout')}
            </a>
        </div>
    </div>
  );
};

// --- Main Dashboard Component ---
const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, analyzePlotImageWithAI, currentNotification, showNotification, dismissNotification, aiInstance }) => {
  const { farmers, activities, notes, addFarm, addPlot, addDailyPlotLog, addActivity } = useData();
  const { t } = useLanguage();
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(() => {
    if (user.role === 'farmer' && user.id) return user.id;
    return loadFromStorage<string | null>(LOCAL_STORAGE_KEYS.SELECTED_FARMER_ID, null);
  });
  
  const [activeView, setActiveView] = useState<View>('dashboard');

  const { weather, forecast, location, loading: weatherLoading, error: weatherError } = useWeather(farmers.find(f => f.id === selectedFarmerId)?.location || '');

  const [isAddFarmModalOpen, setIsAddFarmModalOpen] = useState(false);
  const [isLogHistoryModalOpen, setIsLogHistoryModalOpen] = useState(false);
  const [plotForHistory, setPlotForHistory] = useState<Plot | null>(null);

  const selectedFarmer = useMemo(() => farmers.find(f => f.id === selectedFarmerId), [farmers, selectedFarmerId]);

  const handleSelectFarmer = (farmerId: string) => {
    setSelectedFarmerId(farmerId);
    saveToStorage(LOCAL_STORAGE_KEYS.SELECTED_FARMER_ID, farmerId);
    setActiveView('dashboard'); // Switch to dashboard on new farmer selection
  };

  const handleViewLogHistory = (plot: Plot) => {
    setPlotForHistory(plot);
    setIsLogHistoryModalOpen(true);
  };
  
  // ----- AI-POWERED FEATURES -----
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isMarketLoading, setIsMarketLoading] = useState(true);
  
  const [yieldPrediction, setYieldPrediction] = useState<YieldPredictionData | null>(null);
  const [isYieldLoading, setIsYieldLoading] = useState(true);
  
  const getPrimaryCrop = (farmer?: Farmer): string => {
    if (!farmer) return "generic crop";
    // Get the most frequently mentioned crop or the first one in their experience
    return farmer.farmingExperience.cropsGrown[0] || "crop";
  };
  
  const fetchMarketData = useCallback(async (cropName: string) => {
    if (!aiInstance) return;
    setIsMarketLoading(true);

    const schema = {
        type: Type.OBJECT,
        properties: {
            cropName: { type: Type.STRING },
            currentPrice: { type: Type.OBJECT, properties: { price: { type: Type.NUMBER }, unit: { type: Type.STRING }}},
            forecast: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { day: { type: Type.STRING }, trend: { type: Type.STRING } }}},
            summary: { type: Type.STRING }
        }
    };
    
    try {
        const prompt = `Provide a realistic, simulated market price analysis for ${cropName} in the Indian market (provide prices in INR per quintal). The output must be in JSON format matching the schema. The forecast should cover the next 5 days.`;
        const response: GenerateContentResponse = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: schema }
        });
        const jsonStr = response.text.trim();
        setMarketData(JSON.parse(jsonStr));
    } catch (error) {
        console.error("AI Market Data Error:", error);
        let errorMessage: string = t('notifications.marketError');
        if (error instanceof Error && error.message) {
            try {
                const errorJson = JSON.parse(error.message);
                if (errorJson?.error?.status === 'RESOURCE_EXHAUSTED') {
                    errorMessage = t('notifications.aiQuotaError');
                }
            } catch (parseError) { /* Do nothing, use default msg */ }
        }
        showNotification(errorMessage, NotificationType.ERROR);
    } finally {
        setIsMarketLoading(false);
    }
  }, [aiInstance, showNotification, t]);

  const fetchYieldPrediction = useCallback(async (farmer: Farmer, cropName: string) => {
    if (!aiInstance) return;
    setIsYieldLoading(true);

     const schema = {
        type: Type.OBJECT,
        properties: {
            cropName: { type: Type.STRING },
            predictedYield: { type: Type.STRING, description: "e.g., '5-6 tons/hectare'" },
            confidence: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
            factors: { type: Type.ARRAY, items: { type: Type.STRING }}
        }
    };

    try {
         const prompt = `Based on the following farmer profile, generate a simulated yield prediction for ${cropName}. The farmer is in ${farmer.location}, has ${farmer.farmingExperience.years} years of experience, and uses ${farmer.farmingExperience.farmingType} methods. The output must be in JSON format matching the schema. List 3-4 key factors influencing this prediction.`;
        const response: GenerateContentResponse = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: schema }
        });
        const jsonStr = response.text.trim();
        setYieldPrediction(JSON.parse(jsonStr));
    } catch (error) {
        console.error("AI Yield Prediction Error:", error);
        let errorMessage: string = t('notifications.yieldError');
        if (error instanceof Error && error.message) {
             try {
                const errorJson = JSON.parse(error.message);
                if (errorJson?.error?.status === 'RESOURCE_EXHAUSTED') {
                    errorMessage = t('notifications.aiQuotaError');
                }
            } catch (parseError) { /* Do nothing, use default msg */ }
        }
        showNotification(errorMessage, NotificationType.ERROR);
    } finally {
        setIsYieldLoading(false);
    }
  }, [aiInstance, showNotification, t]);
  
  useEffect(() => {
    if (selectedFarmer) {
        const primaryCrop = getPrimaryCrop(selectedFarmer);
        fetchMarketData(primaryCrop);
        fetchYieldPrediction(selectedFarmer, primaryCrop);
    }
  }, [selectedFarmer, fetchMarketData, fetchYieldPrediction]);
  
   // FIX: Added state and handler for the Add Daily Log modal
    const [isAddLogModalOpen, setIsAddLogModalOpen] = useState(false);
    const [plotForLog, setPlotForLog] = useState<Plot | null>(null);
    
    // FIX: Added handler to open the modal
    const handleAddDailyLog = (plot: Plot) => {
        setPlotForLog(plot);
        setIsAddLogModalOpen(true);
    };

    const renderView = () => {
        if (!selectedFarmer) {
             return (
                <div className="text-center p-8">
                    <h2 className="text-2xl font-semibold text-neutral-700">{t('dashboard.selectFarmer')}</h2>
                    <p className="text-neutral-500">{t('dashboard.tagline')}</p>
                </div>
            );
        }

        const allPlots = selectedFarmer.farms.flatMap(farm => farm.plots.map(plot => ({ ...plot, farmName: farm.name })));
        const recentActivities = activities.filter(a => {
            const activityDate = new Date(a.timestamp);
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return a.farmerId === selectedFarmer.id && activityDate > sevenDaysAgo;
        });

        switch(activeView) {
            case 'dashboard':
                return (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold text-neutral-800">{t('dashboard.overviewFor', { name: selectedFarmer.name })}</h1>
                        
                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow border border-neutral-200">
                                <h3 className="text-sm font-medium text-neutral-500">{t('dashboard.statCards.totalFarms')}</h3>
                                <p className="text-3xl font-semibold text-neutral-800">{selectedFarmer.farms.length}</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow border border-neutral-200">
                                <h3 className="text-sm font-medium text-neutral-500">{t('dashboard.statCards.totalPlots')}</h3>
                                <p className="text-3xl font-semibold text-neutral-800">{allPlots.length}</p>
                            </div>
                             <div className="bg-white p-6 rounded-lg shadow border border-neutral-200">
                                <h3 className="text-sm font-medium text-neutral-500">{t('dashboard.statCards.recentActivities')}</h3>
                                <p className="text-3xl font-semibold text-neutral-800">{recentActivities.length}</p>
                            </div>
                        </div>

                        {/* Weather & AI Suggestions */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <WeatherView 
                                initialLocation={selectedFarmer.location}
                                farmer={selectedFarmer}
                                aiInstance={aiInstance}
                            />
                        </div>

                        {/* Market & Yield */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <MarketPriceCard marketData={marketData} isLoading={isMarketLoading} />
                            <YieldPredictionCard yieldPrediction={yieldPrediction} isLoading={isYieldLoading} />
                        </div>
                    </div>
                );
            case 'plots':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-neutral-800">{t('dashboard.farmsAndPlots')}</h1>
                            <button onClick={() => setIsAddFarmModalOpen(true)} className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue/90 flex items-center">
                                <PlusCircleIcon className="w-5 h-5 mr-2"/> {t('dashboard.addFarm')}
                            </button>
                        </div>
                        {selectedFarmer.farms.length === 0 ? (
                            <p className="text-neutral-500">{t('dashboard.noPlots')}</p>
                        ) : (
                            selectedFarmer.farms.map(farm => (
                                <div key={farm.id} className="mb-8">
                                    <h2 className="text-xl font-semibold text-neutral-700 mb-3 border-b pb-2">{farm.name}</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {farm.plots.map(plot => (
                                        <PlotCard key={plot.id} plot={plot} farmName={farm.name} onAddDailyLog={handleAddDailyLog} onViewLogHistory={handleViewLogHistory}/>
                                    ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                );
            case 'feed':
                 const farmerActivities = activities.filter(a => a.farmerId === selectedFarmer.id).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                 const farmerNotes = notes.filter(n => n.farmerId === selectedFarmer.id);
                 const combinedFeed = [...farmerActivities, ...farmerNotes].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

                return (
                     <div>
                        <h1 className="text-3xl font-bold text-neutral-800 mb-6">{t('dashboard.activityFeed')}</h1>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2">
                            {combinedFeed.map(item => 'type' in item ? 
                                <ActivityCard key={item.id} activity={item} showFarmName={selectedFarmer.farms.length > 1} /> :
                                <NoteCard key={item.id} note={item} />
                            )}
                            </div>
                            <div className="md:col-span-1">
                                <AddNoteForm farmerId={selectedFarmer.id} farmerName={selectedFarmer.name} onNoteAdded={() => { /* Can add refresh logic if needed */ }} />
                            </div>
                        </div>
                    </div>
                );
            case 'cropHealth':
                return <CropHealthView />;
            case 'weather':
                 return (
                    <WeatherView 
                        initialLocation={selectedFarmer.location}
                        farmer={selectedFarmer}
                        aiInstance={aiInstance}
                    />
                 );
            case 'market':
                return <MarketPriceFinder />;
            case 'assistant':
                 return (
                    <AI_Assistant
                        aiInstance={aiInstance}
                        farmer={selectedFarmer}
                        showNotification={showNotification}
                    />
                 );
            case 'liveAdvisor':
                 return (
                    <FarmingAdvisor
                        aiInstance={aiInstance}
                        farmer={selectedFarmer}
                        // FIX: Pass the `weather` and `forecast` state variables directly, as they are already the correct types.
                        weatherData={weather || null}
                        forecastData={forecast || null}
                        showNotification={showNotification}
                    />
                );
            default: return null;
        }
    }
  
  return (
    <div className="flex h-screen bg-neutral-base font-sans">
      <Notification notification={currentNotification} onDismiss={dismissNotification} />
      
      {user.role === 'consultant' && (
          <aside className="w-80 bg-white border-r border-neutral-200 h-screen flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold text-neutral-800">{t('dashboard.farmers')}</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {farmers.length > 0 ? (
                        <ul>
                            {farmers.map(farmer => (
                            <FarmerListItem 
                                key={farmer.id} 
                                farmer={farmer} 
                                isSelected={farmer.id === selectedFarmerId}
                                onSelect={handleSelectFarmer}
                            />
                            ))}
                        </ul>
                    ) : (
                        <p className="p-4 text-sm text-neutral-500">{t('dashboard.loading')}</p>
                    )}
                </div>
                <div className="border-t border-neutral-200">
                    <LanguageSwitcher />
                </div>
            </aside>
      )}

      {user.role === 'farmer' && selectedFarmer && (
          <SideNav 
            activeView={activeView}
            setActiveView={setActiveView}
            onLogout={onLogout}
            farmerName={selectedFarmer.name}
          />
      )}
      
      <main className="flex-1 overflow-y-auto pl-64">
        <div className="p-4 sm:p-6 lg:p-8">
            {renderView()}
        </div>
      </main>

      <Modal isOpen={isAddFarmModalOpen} onClose={() => setIsAddFarmModalOpen(false)} title={t('modals.addFarm.title')}>
        {selectedFarmerId && <AddFarmForm farmerId={selectedFarmerId} onClose={() => setIsAddFarmModalOpen(false)} showNotification={showNotification}/>}
      </Modal>

      <PlotLogHistoryModal plot={plotForHistory} onClose={() => { setPlotForHistory(null); setIsLogHistoryModalOpen(false); }} />

       <AddDailyLogModal
        isOpen={isAddLogModalOpen}
        plot={plotForLog}
        farmerId={selectedFarmer?.id || ''}
        onClose={() => { setPlotForLog(null); setIsAddLogModalOpen(false); }}
        analyzePlotImageWithAI={analyzePlotImageWithAI}
        showNotification={showNotification}
      />
    </div>
  );
};

export default Dashboard;