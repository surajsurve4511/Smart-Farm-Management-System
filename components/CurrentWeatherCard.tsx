
import React from 'react';
import { CurrentWeatherDetail, WeatherLocation } from '../types';
import { WindIcon, DropletIcon } from './icons';

interface CurrentWeatherCardProps {
  weather: CurrentWeatherDetail;
  location: WeatherLocation;
}

const WeatherIcon: React.FC<{ iconUrl: string; text: string }> = ({ iconUrl, text }) => (
  <img src={iconUrl} alt={text} className="w-24 h-24" />
);

const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ weather, location }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-neutral-200">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-neutral-800">{location.name}</h2>
        <p className="text-sm text-neutral-500">{location.country}</p>
      </div>
      <div className="flex flex-col items-center">
        <WeatherIcon iconUrl={`https:${weather.condition.icon}`} text={weather.condition.text} />
        <p className="text-6xl font-light tracking-tighter text-neutral-900">{Math.round(weather.temp_c)}°C</p>
        <p className="capitalize mt-2 text-lg text-neutral-700">{weather.condition.text}</p>
        <p className="text-sm text-neutral-500">Feels like {Math.round(weather.feelslike_c)}°C</p>
      </div>
      <div className="mt-6 pt-4 border-t border-neutral-200 grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center">
          <WindIcon className="w-5 h-5 mr-2 text-neutral-400" />
          <div>
            <p className="font-semibold text-neutral-800">{weather.wind_kph} km/h</p>
            <p className="text-xs text-neutral-500">Wind</p>
          </div>
        </div>
        <div className="flex items-center">
          <DropletIcon className="w-5 h-5 mr-2 text-neutral-400" />
          <div>
            <p className="font-semibold text-neutral-800">{weather.humidity}%</p>
            <p className="text-xs text-neutral-500">Humidity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeatherCard;
