

import React from 'react';
import { CurrentWeatherDetail, ForecastDayDetail } from '../types';
import { WindIcon, DropletIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface WeatherCardProps {
  current: CurrentWeatherDetail | null;
  forecast: ForecastDayDetail[] | null;
  locationName: string;
  isLoading: boolean;
}

const WeatherIcon: React.FC<{ iconUrl: string, conditionText: string, className?: string }> = ({ iconUrl, conditionText, className }) => {
    return <img src={`https:${iconUrl}`} alt={conditionText} className={className || "w-8 h-8"} />;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ current, forecast, locationName, isLoading }) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow border border-neutral-200 animate-pulse">
          <div className="h-5 bg-neutral-200 rounded w-3/4 mb-4"></div>
          <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-neutral-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                  <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
              </div>
          </div>
           <div className="border-t border-neutral-200 pt-4 mt-4">
            <div className="flex justify-around">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center space-y-2">
                        <div className="h-4 bg-neutral-200 rounded w-8"></div>
                        <div className="w-8 h-8 bg-neutral-200 rounded-full"></div>
                        <div className="h-4 bg-neutral-200 rounded w-12"></div>
                    </div>
                ))}
            </div>
          </div>
      </div>
    );
  }

  if (!current || !forecast) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-neutral-200">
      <h3 className="text-lg font-semibold text-neutral-700 mb-2">{t('dashboard.weatherForecast', { location: locationName })}</h3>
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mb-4">
        <div className="flex items-center">
            <WeatherIcon iconUrl={current.condition.icon} conditionText={current.condition.text} className="w-20 h-20" />
            <div className="ml-4">
                <p className="text-5xl font-bold text-neutral-800">{Math.round(current.temp_c)}°C</p>
                <p className="text-neutral-600 capitalize">{current.condition.text}</p>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-neutral-600 mt-4 sm:mt-0 sm:border-l sm:pl-6 border-neutral-200">
             <div className="flex items-center">
                <WindIcon className="w-4 h-4 mr-1.5 text-neutral-400"/> Wind: {current.wind_kph} km/h
            </div>
            <div className="flex items-center">
                <DropletIcon className="w-4 h-4 mr-1.5 text-neutral-400"/> Humidity: {current.humidity}%
            </div>
        </div>
      </div>
      <div className="border-t border-neutral-200 pt-4">
        <div className="flex justify-around text-center">
          {forecast.slice(0, 5).map((day) => (
            <div key={day.date} className="flex flex-col items-center space-y-1">
              <p className="text-sm font-semibold text-neutral-600">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
              <WeatherIcon iconUrl={day.day.condition.icon} conditionText={day.day.condition.text} className="w-8 h-8 my-1" />
              <p className="text-sm text-neutral-800">{Math.round(day.day.maxtemp_c)}° / {Math.round(day.day.mintemp_c)}°</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
