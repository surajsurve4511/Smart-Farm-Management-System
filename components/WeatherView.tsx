
import React from 'react';
import { GoogleGenAI } from "@google/genai";
import { Farmer } from '../types';
import { useWeather } from '../hooks/useWeather';
import SearchBar from './SearchBar';
import CurrentWeatherCard from './CurrentWeatherCard';
import ForecastCard from './ForecastCard';
import Loader from './Loader';
import ErrorAlert from './ErrorAlert';
import WeatherAIAdvisor from './WeatherAIAdvisor';

interface WeatherViewProps {
  initialLocation: string;
  farmer: Farmer;
  aiInstance: GoogleGenAI | null;
}

const WeatherView: React.FC<WeatherViewProps> = ({ initialLocation, farmer, aiInstance }) => {
  const { weather, forecast, location, loading, error, fetchWeatherForCity } = useWeather(initialLocation);

  return (
    <div className="space-y-6">
      <SearchBar onSearch={fetchWeatherForCity} disabled={loading} />
      
      {loading && <Loader />}
      
      {error && <ErrorAlert message={error} />}
      
      {weather && forecast && location && !loading && !error && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <CurrentWeatherCard weather={weather} location={location}/>
            </div>
            <div className="lg:col-span-2">
              <ForecastCard forecast={forecast} />
            </div>
          </div>
          <WeatherAIAdvisor 
            farmer={farmer}
            currentWeather={weather}
            forecast={forecast}
            aiInstance={aiInstance}
          />
        </>
      )}
    </div>
  );
};

export default WeatherView;
