import React, { useState } from 'react';
import { MapPin, Calendar, Tag, ArrowUpRight, CheckCircle2, Package } from 'lucide-react';
import { Item } from '../../types/item';
import { getFullImageUrl } from '../../services/api';

interface ItemCardProps {
  item: Item;
  onViewDetails: (item: Item) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onViewDetails }) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = getFullImageUrl(item.image_url);

  // Format human-readable date
  const formattedDate = new Date(item.item_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const isLost = item.type === 'LOST';
  const isReturned = item.status === 'RETURNED';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-200 flex flex-col overflow-hidden">
      
      {/* Image Thumbnail Container */}
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={item.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 p-4">
            <Package className="w-12 h-12 stroke-[1.25] text-slate-400/80 mb-1" />
            <span className="text-xs font-medium text-slate-500">No Image Provided</span>
          </div>
        )}

        {/* Type Badge (LOST vs FOUND) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm uppercase ${
              isLost
                ? 'bg-amber-500 text-navy-950 ring-1 ring-amber-600/20'
                : 'bg-emerald-600 text-white ring-1 ring-emerald-700/20'
            }`}
          >
            {item.type}
          </span>

          {isReturned && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-navy-900/90 backdrop-blur-xs text-white flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Returned
            </span>
          )}
        </div>

        {/* Category Pill */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/95 backdrop-blur-xs text-slate-700 shadow-xs border border-slate-200/60">
            <Tag className="w-3 h-3 text-navy-600" />
            {item.category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-grow flex flex-col">
        <h3
          className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-navy-900 transition-colors"
          title={item.title}
        >
          {item.title}
        </h3>

        <p className="text-sm text-slate-600 mt-1.5 line-clamp-2 leading-relaxed flex-grow">
          {item.description}
        </p>

        {/* Meta details */}
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate font-medium text-slate-700">{item.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{isLost ? 'Lost on' : 'Found on'} {formattedDate}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => onViewDetails(item)}
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-navy-900 bg-slate-100 hover:bg-navy-900 hover:text-white transition-colors duration-150"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
