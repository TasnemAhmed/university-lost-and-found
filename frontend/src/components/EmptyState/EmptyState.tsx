import React from 'react';
import { SearchX, RotateCcw, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onResetFilters?: () => void;
  showReportCta?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items found',
  message = 'Try changing your search keywords or resetting your active filters.',
  onResetFilters,
  showReportCta = true,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
        <SearchX className="w-8 h-8 stroke-[1.5]" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto leading-relaxed">
        {message}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear Filters</span>
          </button>
        )}

        {showReportCta && (
          <Link
            to="/report"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-navy-950 bg-gold-400 hover:bg-gold-500 transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report an Item</span>
          </Link>
        )}
      </div>
    </div>
  );
};
