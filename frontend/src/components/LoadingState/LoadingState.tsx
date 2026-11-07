import React from 'react';

interface LoadingStateProps {
  count?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs animate-pulse"
        >
          {/* Image skeleton */}
          <div className="aspect-[16/10] bg-slate-200" />
          
          {/* Content skeleton */}
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-16 bg-slate-200 rounded-full" />
              <div className="h-5 w-24 bg-slate-100 rounded-md" />
            </div>

            <div className="h-6 w-3/4 bg-slate-200 rounded-md" />
            
            <div className="space-y-1.5 pt-1">
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="h-4 w-5/6 bg-slate-100 rounded" />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="h-4 w-28 bg-slate-100 rounded" />
              <div className="h-4 w-20 bg-slate-100 rounded" />
            </div>

            <div className="h-10 w-full bg-slate-200 rounded-xl mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
};
