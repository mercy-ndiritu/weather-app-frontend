import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onLocationRequest: () => void;
  isLoading: boolean;
  
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onLocationRequest, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleLocationRequest = () => {
    setQuery(''); // Clear the search input
    onLocationRequest();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto flex gap-2"
    >
      <form onSubmit={handleSubmit} className="flex-1 relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city..."
          className="w-full h-10 sm:h-12 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white/30 text-sm sm:text-base"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          <Search className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </form>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLocationRequest} // Update the onClick event
        className="h-10 sm:h-12 aspect-square rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors disabled:opacity-50 flex items-center justify-center"
        disabled={isLoading}
      >
        <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
      </motion.button>
    </motion.div>
  );
};