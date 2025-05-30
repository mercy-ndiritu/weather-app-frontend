import  { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MapPin, X } from 'lucide-react';
import { SearchBar } from './components/Searchbar';
import { WeatherCard } from './components/WeatherCard';
import { Forecast } from './components/Forecast';
import  type { WeatherData, ForecastData, TemperatureUnit } from './types/weather';
import { Settings } from './components/Settings';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');
  const [lastSearchedCity, setLastSearchedCity] = useState<string>('');

  const getUnitParam = (selectedUnit: TemperatureUnit) => selectedUnit === 'celsius' ? 'metric' : 'imperial';

  const fetchWeatherData = async (lat: number, lon: number, selectedUnit: TemperatureUnit) => {
    try {
      setIsLoading(true);
      setError('');
      const unitParam = getUnitParam(selectedUnit);
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`${BASE_URL}/weather/current/coordinates`, {
          params: { lat, lon, units: unitParam }
        }),
        axios.get(`${BASE_URL}/weather/forecast/coordinates`, {
          params: { lat, lon, units: unitParam }
        })
      ]);
      
      setWeather(weatherRes.data);
      setForecast(forecastRes.data);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      setWeather(null);
      setForecast(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeatherByCity = async (city: string, selectedUnit: TemperatureUnit) => {
    try {
      setIsLoading(true);
      setError('');
      setLastSearchedCity(city);
      const unitParam = getUnitParam(selectedUnit);
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`${BASE_URL}/weather/current/${encodeURIComponent(city)}`, {
          params: { units: unitParam }
        }),
        axios.get(`${BASE_URL}/weather/forecast/${encodeURIComponent(city)}`, {
          params: { units: unitParam }
        })
      ]);
      
      setWeather(weatherRes.data);
      console.log(weatherRes.data)
      setForecast(forecastRes.data);
    } catch (err) {
      setError('City not found. Please try again.');
      setWeather(null);
      setForecast(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationRequest = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    setLastSearchedCity('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherData(position.coords.latitude, position.coords.longitude, unit);
      },
      () => {
        setError('Failed to get your location. Please allow location access or search by city.');
        setIsLoading(false);
      }
    );
  };

  const handleUnitChange = (newUnit: TemperatureUnit) => {
    if (weather) {
      if (lastSearchedCity) {
        fetchWeatherByCity(lastSearchedCity, newUnit);
      } else if (weather.coord) {
        fetchWeatherData(weather.coord.lat, weather.coord.lon, newUnit);
      }
    }
    setUnit(newUnit);
  };

  const handleSearch = (city: string) => {
    fetchWeatherByCity(city, unit);
  };

  const [favorites, setFavorites] = useState<string[]>(() => {
  const stored = localStorage.getItem('favoriteCities');
  return stored ? JSON.parse(stored) : [];
  });

  const toggleFavorite = (city: string) => {
  let updatedFavorites;
  if (favorites.includes(city)) {
    updatedFavorites = favorites.filter(c => c !== city);
  } else {
    updatedFavorites = [city, ...favorites.filter(c => c !== city)];
  }

  setFavorites(updatedFavorites);
  localStorage.setItem('favoriteCities', JSON.stringify(updatedFavorites));
};

  


  useEffect(() => {
    handleLocationRequest();
  }, []);

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 lg:px-12 py-8 md:p-8 flex flex-col items-center bg-gradient-to-br from-blue-500 via-blue-400 to-blue-300">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 flex-wrap w-full mb-8">
          <SearchBar 
            onSearch={handleSearch} 
            onLocationRequest={handleLocationRequest}
            isLoading={isLoading}
          />
          <Settings unit={unit} onUnitChange={handleUnitChange} />
        </div>
        
        {isLoading && (
          <div className="mt-20 text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4">Loading weather data...</p>
          </div>
        )}
        
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white mt-4 text-center bg-red-500/20 backdrop-blur-md px-4 py-2 rounded-full max-w-md mx-auto"
          >
            {error}
          </motion.p>
        )}

        {weather?.alerts && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {weather.alerts.map((alert, index) => (
              <div 
                key={index}
                className="bg-red-500/20 backdrop-blur-md rounded-lg p-4 mb-4 text-white"
              >
                <h3 className="font-bold text-lg">{alert.event}</h3>
                <p className="mt-2 text-sm opacity-90">{alert.description}</p>
                <div className="mt-2 text-xs opacity-70">
                  <span>From: {new Date(alert.start * 1000).toLocaleString()}</span>
                  <span className="ml-4">To: {new Date(alert.end * 1000).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
        
        {favorites.length > 0 && (
            <div className="mt-4 flex flex-col gap-2 mb-6 items-center justify-center sm:justify-start">
              <div className="flex flex-wrap gap-2 mt-4">
                {favorites.map(city => (
                  <div 
                    key={city}
                    className="relative flex items-center bg-white/30 hover:bg-white/50 text-white px-4 py-2 rounded-lg transition"
                  >
                    <button 
                      onClick={() => handleSearch(city)}
                      className="flex items-center focus:outline-none"
                    >
                      <MapPin className="w-4 h-4 mr-2" /> {city}
                    </button>

                    {/* Close icon */}
                    <button 
                      onClick={() => toggleFavorite(city)}
                      className="ml-2 p-1 hover:bg-white/30 rounded-full focus:outline-none"
                      title="Remove favorite"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        <div className="mt-8 flex flex-col md:flex-row flex-wrap gap-8 items-center">
          {weather && (
          <WeatherCard 
          data={weather} 
          unit={unit} 
          onFavorite={toggleFavorite}
          isFavorite={favorites.includes(weather.name)}
          />
      )}

          {forecast && <Forecast data={forecast} unit={unit} />}
        </div>
        
        {!weather && !error && !isLoading && (
          <div className="mt-20 text-white text-center">
            <p className="text-2xl">Welcome to Weather App</p>
            <p className="mt-2 opacity-70">Allow location access or search for a city to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;