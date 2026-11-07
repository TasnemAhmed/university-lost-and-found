import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PlusCircle, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { itemsService } from '../services/itemsService';
import { Item, ItemType, PaginatedItemsResponse } from '../types/item';
import { ItemCard } from '../components/ItemCard/ItemCard';
import { ItemDetailsModal } from '../components/ItemDetailsModal/ItemDetailsModal';
import { SearchBar } from '../components/SearchBar/SearchBar';
import { FilterBar } from '../components/FilterBar/FilterBar';
import { LoadingState } from '../components/LoadingState/LoadingState';
import { EmptyState } from '../components/EmptyState/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage/ErrorMessage';

export const LostFoundPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL Query Sync
  const initialType = (searchParams.get('type') as ItemType) || '';
  const initialCategory = searchParams.get('category') || 'All';
  const initialLocation = searchParams.get('location') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [selectedType, setSelectedType] = useState<ItemType | ''>(initialType);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState<string>(initialLocation);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  // Data & State
  const [data, setData] = useState<PaginatedItemsResponse>({
    items: [],
    total: 0,
    page: 1,
    limit: 12,
    total_pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Synchronize state with URL search params
  const updateUrlParams = useCallback(
    (params: {
      type?: ItemType | '';
      category?: string;
      location?: string;
      search?: string;
      page?: number;
    }) => {
      const nextParams = new URLSearchParams();

      const type = params.type !== undefined ? params.type : selectedType;
      const category = params.category !== undefined ? params.category : selectedCategory;
      const location = params.location !== undefined ? params.location : selectedLocation;
      const search = params.search !== undefined ? params.search : searchTerm;
      const page = params.page !== undefined ? params.page : currentPage;

      if (type) nextParams.set('type', type);
      if (category && category !== 'All') nextParams.set('category', category);
      if (location && location !== 'All') nextParams.set('location', location);
      if (search && search.trim()) nextParams.set('search', search.trim());
      if (page > 1) nextParams.set('page', page.toString());

      setSearchParams(nextParams, { replace: true });
    },
    [selectedType, selectedCategory, selectedLocation, searchTerm, currentPage, setSearchParams]
  );

  // Fetch Items from Backend
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await itemsService.getItems({
        type: selectedType,
        category: selectedCategory,
        location: selectedLocation,
        search: searchTerm,
        page: currentPage,
        limit: 12,
      });
      setData(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to retrieve items from the server.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [selectedType, selectedCategory, selectedLocation, searchTerm, currentPage]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Handlers
  const handleTypeChange = (type: ItemType | '') => {
    setSelectedType(type);
    setCurrentPage(1);
    updateUrlParams({ type, page: 1 });
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    updateUrlParams({ category: cat, page: 1 });
  };

  const handleLocationChange = (loc: string) => {
    setSelectedLocation(loc);
    setCurrentPage(1);
    updateUrlParams({ location: loc, page: 1 });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    updateUrlParams({ search: term, page: 1 });
  };

  const handleResetFilters = () => {
    setSelectedType('');
    setSelectedCategory('All');
    setSelectedLocation('All');
    setSearchTerm('');
    setCurrentPage(1);
    setSearchParams({}, { replace: true });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= data.total_pages) {
      setCurrentPage(newPage);
      updateUrlParams({ page: newPage });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenDetails = (item: Item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const isFiltered =
    Boolean(selectedType) ||
    selectedCategory !== 'All' ||
    selectedLocation !== 'All' ||
    Boolean(searchTerm.trim());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-navy-600 tracking-wider uppercase flex items-center gap-1.5 mb-1">
            <Layers className="w-3.5 h-3.5" />
            Campus Registry
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
            Lost & Found Items
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Browse reported items and help reconnect belongings with their owners.
          </p>
        </div>

        <div>
          <Link
            to="/report"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-navy-950 bg-gold-400 hover:bg-gold-500 shadow-sm hover:shadow transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report an Item</span>
          </Link>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="space-y-4">
        <SearchBar
          value={searchTerm}
          onChange={(val) => setSearchTerm(val)}
          onSearch={handleSearch}
          placeholder="Search items by name, keywords, or campus area..."
        />

        <FilterBar
          selectedType={selectedType}
          onTypeChange={handleTypeChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          selectedLocation={selectedLocation}
          onLocationChange={handleLocationChange}
          onResetFilters={handleResetFilters}
          isFiltered={isFiltered}
        />
      </div>

      {/* RESULTS COUNT & META */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 pt-1">
        <div>
          {!loading && (
            <span>
              Showing <strong className="text-slate-800">{data.items.length}</strong> of{' '}
              <strong className="text-slate-800">{data.total}</strong> reports
              {isFiltered && ' (filtered)'}
            </span>
          )}
        </div>

        {data.total_pages > 1 && (
          <span>
            Page <strong className="text-slate-800">{data.page}</strong> of{' '}
            <strong className="text-slate-800">{data.total_pages}</strong>
          </span>
        )}
      </div>

      {/* CONTENT AREA */}
      <div>
        {error ? (
          <ErrorMessage message={error} onRetry={fetchItems} />
        ) : loading ? (
          <LoadingState count={8} />
        ) : data.items.length === 0 ? (
          <EmptyState
            title="No items found"
            message="No items match your active search and filter criteria. Try adjusting keywords or clearing filters."
            onResetFilters={isFiltered ? handleResetFilters : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onViewDetails={handleOpenDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* PAGINATION CONTROLS */}
      {!loading && data.total_pages > 1 && (
        <div className="pt-8 border-t border-slate-200 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1 px-2">
            {Array.from({ length: data.total_pages }).map((_, i) => {
              const p = i + 1;
              const isActive = p === currentPage;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePageChange(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-navy-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= data.total_pages}
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* DETAILS MODAL */}
      <ItemDetailsModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
