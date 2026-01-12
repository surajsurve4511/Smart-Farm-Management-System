
import { useState, useEffect, useCallback } from 'react';
import { WEATHER_API_KEY, WEATHER_BASE_URL } from '../constants';
import { WeatherApiResponse } from '../types';

export const useWeather = (initialCity: string) => {
  const [weather, setWeather] = useState<WeatherApiResponse['current'] | null>(null);
  const [forecast, setForecast] = useState<WeatherApiResponse['forecast']['forecastday'] | null>(null);
  const [location, setLocation] = useState<WeatherApiResponse['location'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchWeather = useCallback(async (city: string) => {
    if (!city) {
        setError("Please provide a location.");
        setLoading(false);
        return;
    }
    setLoading(true);
    setError(null);
    setWeather(null);
    setForecast(null);
    setLocation(null);

    try {
      const response = await fetch(`${WEATHER_BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${city}&days=5&aqi=no&alerts=no`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || `HTTP error! status: ${response.status}`);
      }
      const data: WeatherApiResponse = await response.json();
      setWeather(data.current);
      setForecast(data.forecast.forecastday);
      setLocation(data.location);
    } catch (e) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError('An unknown error occurred.');
        }
      console.error('Failed to fetch weather data:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialCity) {
      fetchWeather(initialCity);
    } else {
        setLoading(false);
    }
  }, [initialCity, fetchWeather]);

  const fetchWeatherForCity = (city: string) => {
    fetchWeather(city);
  };
  
  return { weather, forecast, location, loading, error, fetchWeatherForCity };
};
