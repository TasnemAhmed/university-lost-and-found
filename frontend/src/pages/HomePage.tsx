import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, ArrowRight, ShieldCheck, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { itemsService } from '../services/itemsService';
import { Item, StatsResponse } from '../types/item';
import { StatsSection } from '../components/StatsSection/StatsSection';
import { ItemCard } from '../components/ItemCard/ItemCard';
import { ItemDetailsModal } from '../components/ItemDetailsModal/ItemDetailsModal';
import { LoadingState } from '../components/LoadingState/LoadingState';
import { ErrorMessage } from '../components/ErrorMessage/ErrorMessage';

export const HomePage: React.FC = () => {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [latestItems, setLatestItems] = useState<Item[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setError(null);
    setStatsLoading(true);
    setItemsLoading(true);

    try {
      const [statsData, itemsData] = await Promise.all([
        itemsService.getStats(),
        itemsService.getLatestItems(6),
      ]);
      setStats(statsData);
      setLatestItems(itemsData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch platform data.';
      setError(message);
    } finally {
      setStatsLoading(false);
      setItemsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDetails = (item: Item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-12 sm:pb-20 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white rounded-b-3xl sm:rounded-b-[2.5rem] shadow-xl">
        {/* Subtle background glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-navy-700/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-800/80 border border-slate-700 text-gold-400 text-xs font-semibold tracking-wide uppercase shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Official Campus Lost & Found Hub</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none text-white">
                Lost Something on Campus?{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500">
                  Let's Help You Find It.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                A simple way to report lost belongings, share found items, and reconnect students and faculty with what matters across the entire university campus.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/items"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-navy-700 hover:bg-navy-600 border border-slate-600 shadow-lg hover:shadow-xl transition-all duration-150"
                >
                  <Search className="w-5 h-5 text-gold-400" />
                  <span>Browse Items</span>
                </Link>

                <Link
                  to="/report"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-navy-950 bg-gold-400 hover:bg-gold-500 shadow-lg hover:shadow-xl transition-all duration-150"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Report an Item</span>
                </Link>
              </div>

              {/* Campus trust indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>No login or accounts required</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-400" />
                  <span>All buildings & campus facilities covered</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Composition */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-navy-800/50 backdrop-blur-md rounded-3xl p-6 border border-slate-700/80 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Live Campus Activity
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Synchronized with Database
                  </span>
                </div>

                {/* Mini Preview cards inside hero */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-navy-900/90 border border-slate-700/60 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                      LOST
                    </div>
                    <div className="truncate">
                      <h4 className="text-sm font-semibold text-white truncate">Student ID Card & Wallet</h4>
                      <p className="text-xs text-slate-400">Cafeteria • Recently reported</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-navy-900/90 border border-slate-700/60 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                      FOUND
                    </div>
                    <div className="truncate">
                      <h4 className="text-sm font-semibold text-white truncate">iPhone 14 with Clear Case</h4>
                      <p className="text-xs text-slate-400">Library 2nd Floor • Safe at reception</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-navy-900/90 border border-slate-700/60 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-navy-700 text-sky-400 flex items-center justify-center font-bold text-xs shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-sm font-semibold text-white truncate">Keys Reunited with Owner</h4>
                      <p className="text-xs text-slate-400">Case marked as resolved</p>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <Link
                    to="/items"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    <span>View all ongoing reports</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* REAL STATISTICS SECTION */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-2">
            <div>
              <span className="text-xs font-bold text-navy-600 tracking-wider uppercase">
                Transparency & Results
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
                Platform Statistics
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Real-time counts calculated directly from persistent database records
            </p>
          </div>

          <StatsSection stats={stats} loading={statsLoading} />
        </div>

        {/* LATEST ANNOUNCEMENTS SECTION */}
        <section aria-labelledby="latest-reports-title" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-navy-600 tracking-wider uppercase">
                Recent Campus Postings
              </span>
              <h2 id="latest-reports-title" className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
                Latest Announcements
              </h2>
            </div>

            <Link
              to="/items"
              className="inline-flex items-center gap-2 text-sm font-bold text-navy-900 hover:text-navy-700 group transition-colors"
            >
              <span>View All Items</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {error && (
            <ErrorMessage
              message={error}
              onRetry={fetchData}
            />
          )}

          {itemsLoading ? (
            <LoadingState count={6} />
          ) : latestItems.length === 0 && !error ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
              <p className="text-base text-slate-600 mb-4">
                No items have been reported yet. Be the first to submit a report!
              </p>
              <Link
                to="/report"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-navy-950 bg-gold-400 hover:bg-gold-500 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report an Item Now</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onViewDetails={handleOpenDetails}
                />
              ))}
            </div>
          )}

          {/* Bottom Callout banner */}
          <div className="mt-8 rounded-3xl bg-navy-900 text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-bold">
                Did you find something on campus?
              </h3>
              <p className="text-sm text-slate-300 max-w-lg leading-relaxed">
                Take a quick photo, enter where you found it, and help a fellow student retrieve their missing belonging today.
              </p>
            </div>

            <Link
              to="/report"
              className="px-6 py-3.5 rounded-xl font-bold text-navy-950 bg-gold-400 hover:bg-gold-500 transition-all shrink-0 shadow-md text-sm sm:text-base"
            >
              Report a Found Item
            </Link>
          </div>
        </section>

      </div>

      {/* Details Modal */}
      <ItemDetailsModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
};
