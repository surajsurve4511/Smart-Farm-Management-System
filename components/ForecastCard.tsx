
import React from 'react';
import { ForecastDayDetail } from '../types';

interface ForecastCardProps {
  forecast: ForecastDayDetail[];
}

const ForecastDayItem: React.FC<{ day: ForecastDayDetail }> = ({ day }) => {
    const date = new Date(day.date);
    // Add timezone 'UTC' to prevent off-by-one day errors
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });

    return (
        <li className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <p className="font-semibold text-neutral-700 w-12">{dayOfWeek}</p>
            <img src={`https:${day.day.condition.icon}`} alt={day.day.condition.text} className="w-10 h-10" />
            <p className="text-sm text-neutral-600 truncate flex-1 ml-4">{day.day.condition.text}</p>
            <p className="text-sm font-medium text-neutral-800 w-20 text-right">
                {Math.round(day.day.maxtemp_c)}° / {Math.round(day.day.mintemp_c)}°
            </p>
        </li>
    )
};


const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-neutral-200 h-full">
      <h3 className="text-xl font-bold text-neutral-800 mb-4">5-Day Forecast</h3>
      <ul className="space-y-2">
        {forecast.map(day => <ForecastDayItem key={day.date} day={day} />)}
      </ul>
    </div>
  );
};

export default ForecastCard;
