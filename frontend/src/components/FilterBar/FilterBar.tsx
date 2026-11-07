import React from 'react';
import { Filter, RotateCcw, Tag, MapPin } from 'lucide-react';
import { ItemType, CATEGORIES, CAMPUS_LOCATIONS } from '../../types/item';

interface FilterBarProps {
  selectedType: ItemType | '';
  onTypeChange: (type: ItemType | '') => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  onResetFilters: () => void;
  isFiltered: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedType,
  onTypeChange,
  selectedCategory,
  onCategoryChange,
  selectedLocation,
  onLocationChange,
  onResetFilters,
  isFiltered,
}) => {
  const typeTabs: { label: string; value: ItemType | '' }[] = [
    { label: 'All Items', value: '' },
    { label: 'Lost Items', value: 'LOST' },
    { label: 'Found Items', value: 'FOUND' },
  ];

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
      
      {/* Top row: Type Tabs and Reset Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Type Filter Tabs */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100/90 border border-slate-200/70 w-full sm:w-auto">
          {typeTabs.map((tab) => {
            const active = selectedType === tab.value;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => onTypeChange(tab.value)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  active
                    ? 'bg-navy-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors ml-auto sm:ml-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Bottom row: Category and Location Selects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
        
        {/* Category Filter */}
        <div className="relative">
          <label htmlFor="category-select" className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-navy-600" />
            <span>Category</span>
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/70 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white transition-all"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div className="relative">
          <label htmlFor="location-select" className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-navy-600" />
            <span>Campus Location</span>
          </label>
          <select
            id="location-select"
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/70 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white transition-all"
          >
            <option value="All">All Locations</option>
            {CAMPUS_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Informational badge */}
        <div className="hidden lg:flex items-end pb-1 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/60 w-full">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter items across buildings and types</span>
          </div>
        </div>

      </div>
    </div>
  );
};
