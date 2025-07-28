import { useAtomValue } from 'jotai';
import { useSearchParams } from 'react-router-dom';
import SearchBar from './search-bar';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { searchAtom } from '@/services/search';
import SuggestionList from './SuggestionList';
import { motion, useReducedMotion } from 'framer-motion';
import { getColorToken } from '@/styles/unified-color-system';
import './mobile.css';
import { useAnimation } from '@/contexts/animation-context';

function SearchResultPage() {
  const [params, setParams] = useSearchParams();
  const keyword = params.get('keyword') || '';
  const [activeFilter, setActiveFilter] = useState('all');
  const result = useAtomValue(searchAtom(keyword));
  const [isLoading, setIsLoading] = useState(false);
  const { getAnimationClass } = useAnimation();
  const [initialized, setInitialized] = useState(false);
  const prefersReducedMotionHook = useReducedMotion();

  // Initialize animations
  useEffect(() => {
    setInitialized(true);
  }, []);

  // Handle search loading state
  useEffect(() => {
    if (keyword) {
      setIsLoading(true);
      // Simulate network delay for loading state
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      // If no keyword, immediately set loading to false
      setIsLoading(false);
    }
  }, [keyword]);

  // Handle search submission
  const handleSearch = useCallback(
    (query: string) => {
      if (query.trim() === '') {
        // If query is empty, clear the keyword parameter
        setParams({});
      } else {
        setIsLoading(true);
        setParams({ keyword: query });
      }
    },
    [setParams]
  );

  // Handle filter selection
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    // Here you would typically filter the results based on the selected filter
  };

  // Transform API response to match Suggestion[] type
  const suggestions = useMemo(() => {
    if (!result || !Array.isArray(result)) return [];

    // If there's an active filter besides 'all', filter the results
    let filteredResults = result;
    if (activeFilter !== 'all') {
      filteredResults = result.filter((item: any) => (item.subtype || '').toLowerCase() === activeFilter.toLowerCase());
    }

    return filteredResults.map((item: any) => ({
      id: item.id,
      title: item.title || item.name || '',
      value: item.title?.rendered || item.title || item.name || '',
      url: item.url || '',
      sub_type: item.subtype || '',
      image: item.image || item.avatar || undefined,
    }));
  }, [result, activeFilter]);

  return (
    <motion.div
      className="flex flex-col h-full search-page-container w-full bg-gradient-to-br from-blue-50/30 via-white to-green-50/30"
      initial={prefersReducedMotionHook ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced Medical Header */}
      <motion.div
        className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white"
        initial={prefersReducedMotionHook ? {} : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">Tìm kiếm y tế</h1>
            <p className="text-blue-100 text-sm">Tìm bác sĩ, khoa, dịch vụ và thông tin y tế</p>
          </div>
        </div>

        {/* Search Results Summary */}
        {keyword && (
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">Kết quả tìm kiếm cho:</p>
                <p className="font-semibold text-white">"{keyword}"</p>
              </div>
              {suggestions.length > 0 && (
                <div className="text-right">
                  <p className="text-sm text-blue-100">Tìm thấy</p>
                  <p className="font-bold text-white">{suggestions.length} kết quả</p>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Enhanced search bar */}
      <motion.div
        className="px-4 py-6 bg-white shadow-sm border-b border-gray-100"
        initial={prefersReducedMotionHook ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SearchBar
          defaultValue={keyword}
          loading={isLoading}
          onSearch={handleSearch}
          variant="large"
          autoFocus={!keyword}
          placeholder="Tìm kiếm bác sĩ, dịch vụ, khoa..."
          className="animate-fade-in"
        />
      </motion.div>

      <motion.div
        className="flex-1 overflow-y-auto p-4"
        initial={prefersReducedMotionHook ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Main search results */}
        <div className="bg-gray-50 rounded-xl animate-fade-in" style={{ animationDelay: '200ms' }}>
          {isLoading ? (
            // Loading skeleton with improved design
            <div className="py-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 animate-pulse">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 mr-4"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-3/4 mb-2"></div>
                      <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-1/2"></div>
                    </div>
                    <div className="w-5 h-5 rounded bg-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <SuggestionList suggestions={suggestions} />
          )}

          {suggestions.length === 0 && keyword && !isLoading && (
            <div className="py-10 text-center bg-white rounded-xl shadow-sm border border-gray-100 animate-fade-in">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-400"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              </div>
              <div className="text-gray-700 font-medium text-lg">Không tìm thấy kết quả</div>
              <div className="text-sm text-gray-500 mt-2">Hãy thử tìm kiếm với từ khóa khác</div>

              <div className="mt-6 px-6">
                <button
                  onClick={() => setParams({})}
                  className="w-full py-2.5 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors"
                >
                  Xóa tìm kiếm
                </button>
              </div>
            </div>
          )}

          {!keyword && !isLoading && (
            <div className="py-10 text-center bg-white rounded-xl shadow-sm border border-gray-100 animate-fade-in">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <div className="text-gray-800 font-medium text-lg">Tìm kiếm thông tin y tế</div>
              <div className="text-sm text-gray-500 mt-2 px-6">
                Tìm kiếm bác sĩ, khoa, dịch vụ và nhiều thông tin y tế hữu ích khác
              </div>

              <div className="mt-6 flex flex-wrap gap-2 justify-center px-6">
                {['Bác sĩ tim mạch', 'Khoa nhi', 'Khám tổng quát', 'Xét nghiệm máu'].map((term, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearch(term)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default SearchResultPage;
