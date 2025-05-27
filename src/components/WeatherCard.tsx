import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, 
  Droplets, Wind, Thermometer, Eye, Sunrise, Sunset, Compass 
} from 'lucide-react';
import type { WeatherData, TemperatureUnit } from '../types/weather';

interface WeatherCardProps {
  data: WeatherData;
  unit: TemperatureUnit;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ data, unit }) => {
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-300" />;
      case 'rain':
        return <CloudRain className="w-12 h-12 sm:w-16 sm:h-16 text-blue-300" />;
      case 'snow':
        return <CloudSnow className="w-12 h-12 sm:w-16 sm:h-16 text-blue-100" />;
      case 'thunderstorm':
        return <CloudLightning className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400" />;
      case 'drizzle':
        return <CloudDrizzle className="w-12 h-12 sm:w-16 sm:h-16 text-blue-200" />;
      default:
        return <Cloud className="w-12 h-12 sm:w-16 sm:h-16 text-gray-200" />;
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getWindDirection = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  const getUnitSymbol = () => unit === 'celsius' ? '°C' : '°F';
  const getSpeedUnit = () => unit === 'celsius' ? 'km/h' : 'mph';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/20 backdrop-blur-md rounded-3xl p-4 sm:p-6 lg:p-8 text-white w-full max-w-sm lg:max-w-md"
    >
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{data.name}</h2>
          <span className="text-lg sm:text-xl">{data.sys.country}</span>
        </div>
        
        <div className="mt-4 sm:mt-6 flex items-center justify-center w-full">
          {getWeatherIcon(data.weather[0].main)}
          <div className="ml-4">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-light">
              {Math.round(data.main.temp)}{getUnitSymbol()}
            </span>
            <p className="text-lg sm:text-xl capitalize">{data.weather[0].description}</p>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 w-full text-sm">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4" />
            <div>
              <p className="opacity-70">Feels like</p>
              <p className="font-semibold">{Math.round(data.main.feels_like)}{getUnitSymbol()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4" />
            <div>
              <p className="opacity-70">Humidity</p>
              <p className="font-semibold">{data.main.humidity}%</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4" />
            <div>
              <p className="opacity-70">Wind</p>
              <p className="font-semibold">{Math.round(data.wind.speed)} {getSpeedUnit()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4" />
            <div>
              <p className="opacity-70">Direction</p>
              <p className="font-semibold">{getWindDirection(data.wind.deg)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <div>
              <p className="opacity-70">Visibility</p>
              <p className="font-semibold">{(data.visibility / 1000).toFixed(1)} km</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4" />
            <div>
              <p className="opacity-70">Min/Max</p>
              <p className="font-semibold">
                {Math.round(data.main.temp_min)}/{Math.round(data.main.temp_max)}{getUnitSymbol()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-between w-full text-sm border-t border-white/20 pt-4">
          <div className="flex items-center gap-2">
            <Sunrise className="w-4 h-4 text-yellow-300" />
            <div>
              <p className="opacity-70">Sunrise</p>
              <p className="font-semibold">{formatTime(data.sys.sunrise)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Sunset className="w-4 h-4 text-orange-300" />
            <div>
              <p className="opacity-70">Sunset</p>
              <p className="font-semibold">{formatTime(data.sys.sunset)}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};