// components/FavoriteLocations.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, X, Plus, Star } from 'lucide-react';

interface FavoriteCity {
  id: string;
  name: string;
  country: string;
}

interface FavoriteLocationsProps {
  favorites: FavoriteCity[];
  currentCity: string;
  onCitySelect: (cityName: string) => void;
  onAddFavorite: (cityName: string) => void;
  onRemoveFavorite: (id: string) => void;
  onToggleFavorite?: (cityName: string) => void;
  isCurrentCityFavorite?: boolean;
}

export const FavoriteLocations: React.FC<FavoriteLocationsProps> = ({
  favorites,
  currentCity,
  onCitySelect,
  onAddFavorite,
  onRemoveFavorite,
  onToggleFavorite,
  isCurrentCityFavorite = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/20 backdrop-blur-md rounded-3xl p-6 text-white w-full max-w-sm mx-auto lg:mx-0"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Favorite Locations</h2>
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(currentCity)}
            className={`p-2 rounded-full transition-all ${
              isCurrentCityFavorite 
                ? 'bg-yellow-400/80 text-yellow-900 hover:bg-yellow-400' 
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
            title={isCurrentCityFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-5 h-5 ${isCurrentCityFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {favorites.length > 0 ? (
          favorites.map((city) => (
            <motion.div
              key={city.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors cursor-pointer group"
              onClick={() => onCitySelect(city.name)}
            >
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-blue-300 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="font-medium block truncate">{city.name}</span>
                  <span className="text-white/60 text-sm">{city.country}</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFavorite(city.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/20 rounded-full transition-all flex-shrink-0"
                title="Remove from favorites"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-white/60">
            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No favorite cities yet</p>
            <p className="text-xs mt-1 opacity-70">Click the star to add current city</p>
          </div>
        )}

        {!isCurrentCityFavorite && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAddFavorite(currentCity)}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors border-2 border-dashed border-white/30"
          >
            <Plus className="w-4 h-4 text-white/70" />
            <span className="text-white/70 text-sm">Add {currentCity}</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};