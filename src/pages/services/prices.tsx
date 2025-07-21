import React, { useState, useMemo, useRef, useCallback, useEffect, memo } from 'react';
import Section from '@/components/section';
import { listServicePricesAtom } from '@/services/post';
import { useAtomValue } from 'jotai';
import { useVirtualizer } from '@tanstack/react-virtual';

const LIST_ATOM_PARAMS = {};
const ITEMS_PER_PAGE = 10;

// Types
type ServicePriceItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName: string;
};

type Category = {
  id: number;
  name: string;
};

/**
 * Optimized parser for HTML table data
 */
const parseExaminationData = (htmlContent: string, categoryId: number, categoryName: string): ServicePriceItem[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const rows = doc.querySelectorAll('table tbody tr');
  const items: ServicePriceItem[] = [];

  // Precompile regex for better performance
  const headerPattern = /^([A-Z]\/|[0-9]+\/|[IVX]+\/|[A-Z][0-9.]+\/|[A-Z][0-9]+\/|[0-9]+\.[0-9]+\/)$/;
  let validItemCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.querySelectorAll('td');

    if (cells.length < 4) continue;

    const idText = cells[0].textContent?.trim() || '';
    if (headerPattern.test(idText)) continue;

    const id = parseInt(idText) || 0;
    const name = cells[1].textContent?.trim() || '';
    const description = cells[2].textContent?.trim() || '';
    const priceText = cells[3].textContent?.trim() || '0';
    const price = parseInt(priceText.replace(/\D/g, ''));

    items[validItemCount++] = {
      id,
      name,
      description,
      price,
      categoryId,
      categoryName,
    };
  }

  items.length = validItemCount;
  return items;
};

// Price formatter
const priceFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

const formatPrice = (price: number): string => priceFormatter.format(price);

// Pagination component
const Pagination = memo(
  ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  }) => {
    const renderPageNumbers = useCallback(() => {
      const pageNumbers: React.ReactNode[] = [];
      let startPage = 1;
      let endPage = Math.min(5, totalPages);

      if (totalPages > 5) {
        if (currentPage <= 3) {
          startPage = 1;
          endPage = 5;
        } else if (currentPage >= totalPages - 2) {
          startPage = totalPages - 4;
          endPage = totalPages;
        } else {
          startPage = currentPage - 2;
          endPage = currentPage + 2;
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
              currentPage === i
                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {i}
          </button>
        );
      }

      return pageNumbers;
    }, [currentPage, totalPages, onPageChange]);

    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    return (
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Mobile pagination */}
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={isFirstPage}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                isFirstPage ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Trước
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={isLastPage}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                isLastPage ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Sau
            </button>
          </div>

          {/* Desktop pagination */}
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> đến{' '}
                <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> của{' '}
                <span className="font-medium">{totalItems}</span> kết quả
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={isFirstPage}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                    isFirstPage
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Trước</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {renderPageNumbers()}

                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={isLastPage}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                    isLastPage
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Sau</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

// Empty state component
const EmptyState = memo(() => (
  <div className="p-6 text-center text-gray-500">
    <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <p className="mt-2">Không tìm thấy dịch vụ phù hợp</p>
  </div>
));

// Category filter component
const CategoryFilter = memo(
  ({
    categories,
    selectedCategory,
    onCategoryChange,
  }: {
    categories: Category[];
    selectedCategory: number | null;
    onCategoryChange: (categoryId: number | null) => void;
  }) => (
    <div className="mb-4">
      <h3 className="block text-sm font-medium text-gray-700 mb-2">Danh mục</h3>
      <div className="relative">
        <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
          <div className="flex space-x-2 pb-1">
            <button
              onClick={() => onCategoryChange(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-md text-sm font-medium ${
                selectedCategory === null
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-md text-sm font-medium truncate max-w-[160px] ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                title={category.name}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white pointer-events-none"></div>
      </div>
    </div>
  )
);

// Price card component for mobile view
const PriceCard = memo(({ item }: { item: ServicePriceItem }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
    <div className="mb-2">
      <span className="inline-block px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full mb-2">
        {item.categoryName}
      </span>
      <h3 className="text-gray-900 font-medium">{item.name}</h3>
    </div>
    {item.description && <p className="text-sm text-gray-600 mb-3">{item.description}</p>}
    <div className="flex justify-between items-center">
      <span className="font-bold text-blue-700">{formatPrice(item.price)}</span>
    </div>
  </div>
));

// Loading component
const Loading = () => (
  <div className="flex flex-col items-center justify-center py-10">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-3 text-gray-600">Đang tải dữ liệu...</p>
  </div>
);

// Call to action component
const CallToAction = ({ onContactClick }: { onContactClick: () => void }) => (
  <div className="mt-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
    <div className="flex flex-col sm:flex-row items-center justify-between">
      <div className="mb-4 sm:mb-0 text-center sm:text-left">
        <h3 className="text-lg font-semibold text-gray-900">Cần tư vấn thêm về dịch vụ?</h3>
        <p className="text-sm text-gray-600 mt-1">Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn</p>
      </div>
      <button
        className="w-full sm:w-auto bg-blue-600 text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-blue-700 transition shadow-sm"
        onClick={onContactClick}
      >
        Liên hệ ngay
      </button>
    </div>
  </div>
);

// CSS styles
const styles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  /* Improve tap targets on mobile */
  @media (max-width: 640px) {
    button {
      min-height: 44px;
    }
  }
`;

// Set display names for React DevTools
Pagination.displayName = 'Pagination';
EmptyState.displayName = 'EmptyState';
CategoryFilter.displayName = 'CategoryFilter';
PriceCard.displayName = 'PriceCard';

// Main component
function ServicePricesPage() {
  // State hooks
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Refs
  const priceTableRef = useRef<HTMLDivElement>(null);
  const scrollParentRef = useRef<HTMLDivElement>(null);

  // Fetch data
  const categoryData = useAtomValue(listServicePricesAtom(LIST_ATOM_PARAMS));

  // Search term debounce
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // Update loading state
  useEffect(() => {
    if (categoryData.length > 0) {
      setIsLoading(false);
    }
  }, [categoryData]);

  // Process service price data and categories
  const { prices, categories } = useMemo(() => {
    const allItems: ServicePriceItem[] = [];
    const uniqueCategories: Category[] = [];

    try {
      categoryData.forEach((item) => {
        if (!uniqueCategories.some((cat) => cat.id === item.id)) {
          uniqueCategories.push({
            id: item.id,
            name: item.title?.rendered || 'Không có tên',
          });
        }

        if (item.content?.rendered) {
          const items = parseExaminationData(item.content.rendered, item.id, item.title?.rendered || 'Không có tên');
          if (items.length) {
            allItems.push(...items);
          }
        }
      });

      uniqueCategories.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error processing category data:', error);
    }

    return {
      prices: allItems,
      categories: uniqueCategories,
    };
  }, [categoryData]);

  // Category change handler
  const handleCategoryChange = useCallback((categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  }, []);

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    if (!debouncedSearchTerm && selectedCategory === null) {
      return prices;
    }

    return prices.filter((item) => {
      if (selectedCategory !== null && item.categoryId !== selectedCategory) {
        return false;
      }

      if (debouncedSearchTerm) {
        const searchLower = debouncedSearchTerm.toLowerCase();
        return item.name.toLowerCase().includes(searchLower) || item.description.toLowerCase().includes(searchLower);
      }

      return true;
    });
  }, [prices, debouncedSearchTerm, selectedCategory]);

  // Pagination calculations
  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedCategory]);

  // Get current page items
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  // Virtualized list setup
  const rowVirtualizer = useVirtualizer({
    count: currentItems.length,
    getScrollElement: () => scrollParentRef.current,
    estimateSize: () => 72,
    overscan: 5,
  });

  // Page navigation handler
  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        priceTableRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [totalPages]
  );

  // Contact button handler
  const handleContactClick = useCallback(() => {
    console.log('Contact button clicked');
    // Implementation for contact functionality
  }, []);

  if (isLoading) {
    return (
      <Section className="pt-4 px-2 sm:pt-8 sm:px-4 md:px-8" isCard>
        <Loading />
      </Section>
    );
  }

  return (
    <Section className="pt-4 px-2 sm:pt-8 sm:px-4 md:px-8" isCard>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Bảng giá dịch vụ</h2>
        <p className="text-sm text-gray-600">Tham khảo giá các dịch vụ y tế tại phòng khám của chúng tôi</p>

        {/* Filter section */}
        <div className="mt-6 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              className="w-full py-3 px-4 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              placeholder="Tìm kiếm dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Category filters */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Results count */}
        {filteredItems.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Tìm thấy <span className="font-medium">{filteredItems.length}</span> dịch vụ
          </div>
        )}
      </div>

      {/* Desktop table view */}
      <div className="hidden sm:block">
        <div ref={priceTableRef} className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          {/* Table header */}
          <div className="bg-gray-50 p-4 border-b border-gray-200 flex">
            <div className="w-1/2 font-medium text-gray-700">Dịch vụ</div>
            <div className="w-1/4 font-medium text-gray-700">Mô tả</div>
            <div className="w-1/4 text-right font-medium text-gray-700">Giá tiền</div>
          </div>

          {/* Table body */}
          <div
            ref={scrollParentRef}
            className="divide-y divide-gray-200 max-h-[600px] overflow-auto"
            style={{ contain: 'strict' }}
          >
            {filteredItems.length === 0 ? (
              <EmptyState />
            ) : (
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const item = currentItems[virtualRow.index];
                  return (
                    <div
                      key={`${item.id}-${virtualRow.index}`}
                      className="hover:bg-gray-50 absolute top-0 left-0 w-full"
                      style={{
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <div className="flex items-center p-4 h-full">
                        <div className="w-1/2">
                          <div className="font-medium text-gray-800">{item.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{item.categoryName}</div>
                        </div>
                        <div className="w-1/4 text-gray-600 text-sm">{item.description}</div>
                        <div className="w-1/4 text-right font-medium text-gray-900">{formatPrice(item.price)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile card view */}
      <div className="block sm:hidden">
        <div ref={priceTableRef} className="mb-4">
          {filteredItems.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {currentItems.map((item, index) => (
                <PriceCard key={`item-${item.id}-${index}`} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {filteredItems.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={goToPage}
        />
      )}

      {/* Mobile filter toggle */}
      <div className="block sm:hidden fixed bottom-4 right-4 z-10">
        <button
          className="bg-blue-600 text-white rounded-full p-3 shadow-lg"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        </button>
      </div>

      {/* Call to action */}
      <CallToAction onContactClick={handleContactClick} />

      {/* Styles */}
      <style dangerouslySetInnerHTML={{ __html: styles }} />
    </Section>
  );
}

export default ServicePricesPage;
