import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer } from 'lucide-react';
import type { TemperatureUnit } from '../types/weather';

interface SettingsProps {
  unit: TemperatureUnit;
  onUnitChange: (unit: TemperatureUnit) => void;
}

export const Settings: React.FC<SettingsProps> = ({ unit, onUnitChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2"
    >
      <Thermometer className="w-4 h-4 text-white" />
      <select
        value={unit}
        onChange={(e) => onUnitChange(e.target.value as TemperatureUnit)}
        className="bg-blue-400 backdrop-blur-md text-white rounded-lg px-3 py-2 text-sm outline-none cursor-pointer"
      >
        <option value="celsius" className=''>Celsius</option>
        <option value="fahrenheit">Fahrenheit</option>
      </select>
    </motion.div>
  );
};