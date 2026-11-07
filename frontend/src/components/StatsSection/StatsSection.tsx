import React from 'react';
import { PackageSearch, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import { StatsResponse } from '../../types/item';

interface StatsSectionProps {
  stats: StatsResponse | null;
  loading: boolean;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats, loading }) => {
  const statCards = [
    {
      title: 'Total Reports',
      value: stats ? stats.total_reports : 0,
      description: 'Logged campus cases',
      icon: PackageSearch,
      color: 'text-navy-900',
      bgColor: 'bg-navy-50 border-navy-100',
      iconColor: 'text-navy-700 bg-navy-100/80',
    },
    {
      title: 'Lost Items',
      value: stats ? stats.lost_items : 0,
      description: 'Currently missing',
      icon: AlertTriangle,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50/60 border-amber-200/70',
      iconColor: 'text-amber-700 bg-amber-100',
    },
    {
      title: 'Found Items',
      value: stats ? stats.found_items : 0,
      description: 'Awaiting rightful owner',
      icon: Sparkles,
      color: 'text-sky-700',
      bgColor: 'bg-sky-50/60 border-sky-200/70',
      iconColor: 'text-sky-700 bg-sky-100',
    },
    {
      title: 'Returned Items',
      value: stats ? stats.returned_items : 0,
      description: 'Successfully reunited',
      icon: CheckCircle,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50/60 border-emerald-200/70',
      iconColor: 'text-emerald-700 bg-emerald-100',
    },
  ];

  return (
    <section className="py-8" aria-label="Platform Statistics">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`p-5 sm:p-6 rounded-2xl border ${card.bgColor} bg-white shadow-xs transition-all duration-200 hover:shadow-md flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs sm:text-sm font-semibold text-slate-600">
                  {card.title}
                </span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div>
                {loading ? (
                  <div className="h-9 w-16 bg-slate-200 animate-pulse rounded-lg my-1" />
                ) : (
                  <div className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${card.color}`}>
                    {card.value.toLocaleString()}
                  </div>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
