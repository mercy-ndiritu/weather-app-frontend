import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, 
  Droplets, Wind, Sunrise, Sunset,
} from 'lucide-react';
import type { WeatherData, TemperatureUnit } from '../types/weather';

interface WeatherProps {
  data: WeatherData;
  unit: TemperatureUnit;
  onFavorite: (city: string) => void;
  isFavorite: boolean;
}

export const WeatherCard: React.FC<WeatherProps> = ({ data, unit, onFavorite, isFavorite }) => {
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="w-8 h-8 text-yellow-400" />;
      case 'rain':
        return <CloudRain className="w-8 h-8 text-blue-400" />;
      case 'snow':
        return <CloudSnow className="w-8 h-8 text-blue-200" />;
      case 'thunderstorm':
        return <CloudLightning className="w-8 h-8 text-yellow-400" />;
      case 'drizzle':
        return <CloudDrizzle className="w-8 h-8 text-blue-300" />;
      default:
        return <Cloud className="w-8 h-8 text-gray-400" />;
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  /*const getWindDirection = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };*/

  const getUnitSymbol = () => unit === 'celsius' ? '°C' : '°F';
  const getSpeedUnit = () => unit === 'celsius' ? 'm/s' : 'mph';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/20 backdrop-blur-md rounded-xl shadow-lg p-6 text-white w-full max-w-4xl mx-auto"
    >
      {/* Header with city name and favorite icon */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-white">{data.name}</h2>
          <p className="text-white/80">{data.sys.country}</p>
        </div>
        <button 
            onClick={() => onFavorite(data.name)} 
            className={`p-2 rounded-full transition-colors ${isFavorite ? 'bg-white/20' : 'hover:bg-white/10'}`}
         >
            <svg 
            className={`w-5 h-5 ${isFavorite ? 'text-red-500' : 'text-white/70'}`} 
            fill={isFavorite ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
        </button>

      </div>

      {/* Main weather info */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {getWeatherIcon(data.weather[0].main)}
          <div>
            <span className="text-5xl font-light text-white">
              {Math.round(data.main.temp)}{getUnitSymbol()}
            </span>
            <p className="text-lg text-white/80 capitalize mt-1">
              {data.weather[0].description}
            </p>
          </div>
        </div>
        
        <div className="text-right text-white/80">
          <p className="text-sm">Feels like: <span className="font-medium text-white">{Math.round(data.main.feels_like)}{getUnitSymbol()}</span></p>
          <p className="text-sm">Min: <span className="font-medium text-white">{Math.round(data.main.temp_min)}{getUnitSymbol()}</span> / Max: <span className="font-medium text-white">{Math.round(data.main.temp_max)}{getUnitSymbol()}</span></p>
        </div>
      </div>

      {/* Weather details grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-4 h-4 text-blue-300" />
            <span className="text-sm text-white/80">Humidity</span>
          </div>
          <p className="text-xl font-semibold text-white">{data.main.humidity}%</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="w-4 h-4 text-white/70" />
            <span className="text-sm text-white/80">Wind</span>
          </div>
          <p className="text-xl font-semibold text-white">
            {data.wind.speed.toFixed(2)} {getSpeedUnit()}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sunrise className="w-4 h-4 text-yellow-300" />
            <span className="text-sm text-white/80">Sunrise</span>
          </div>
          <p className="text-xl font-semibold text-white">
            {formatTime(data.sys.sunrise)}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sunset className="w-4 h-4 text-orange-300" />
            <span className="text-sm text-white/80">Sunset</span>
          </div>
          <p className="text-xl font-semibold text-white">
            {formatTime(data.sys.sunset)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};