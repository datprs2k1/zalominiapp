import React, { useState } from 'react';
import SearchBarComponent from './search-bar-component';

// Example usage of the optimized SearchBarComponent
export default function SearchBarExample() {
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Enhanced search handler with async support
  const handleSearch = async (query: string) => {
    setIsSearching(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock search results
      const mockResults = [
        `Kết quả cho "${query}" - Bác sĩ tim mạch`,
        `Kết quả cho "${query}" - Khám tổng quát`,
        `Kết quả cho "${query}" - Xét nghiệm máu`,
      ];
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Search failed:', error);
      throw error; // Re-throw to let the component handle it
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchError = (error: Error) => {
    console.error('Search error:', error);
    // Could show a toast notification here
  };

  const handleQueryChange = (query: string) => {
    console.log('Query changed:', query);
    // Could implement real-time search suggestions here
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Tìm kiếm dịch vụ y tế
        </h1>
        <p className="text-slate-600">
          Tìm bác sĩ, chuyên khoa, dịch vụ khám và xét nghiệm
        </p>
      </div>

      {/* Default Search Bar */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-700">Tìm kiếm cơ bản</h2>
        <SearchBarComponent
          onSearch={handleSearch}
          onSearchError={handleSearchError}
          onQueryChange={handleQueryChange}
          loading={isSearching}
          placeholder="Tìm kiếm dịch vụ y tế..."
          showQuickCategories={true}
          medicalContext="general"
        />
      </div>

      {/* Emergency Search Bar */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-red-600">Tìm kiếm khẩn cấp</h2>
        <SearchBarComponent
          onSearch={handleSearch}
          onSearchError={handleSearchError}
          loading={isSearching}
          medicalContext="emergency"
          priority="critical"
          showQuickCategories={false}
          className="border-2 border-red-200"
        />
      </div>

      {/* Doctor Search Bar */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-green-600">Tìm bác sĩ</h2>
        <SearchBarComponent
          onSearch={handleSearch}
          onSearchError={handleSearchError}
          loading={isSearching}
          medicalContext="doctor"
          placeholder="Tìm bác sĩ theo chuyên khoa..."
          showQuickCategories={true}
          maxLength={50}
          debounceMs={500}
        />
      </div>

      {/* Appointment Search Bar */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-blue-600">Đặt lịch hẹn</h2>
        <SearchBarComponent
          onSearch={handleSearch}
          onSearchError={handleSearchError}
          loading={isSearching}
          medicalContext="appointment"
          showQuickCategories={true}
          autoFocus={false}
        />
      </div>

      {/* Compact Search Bar */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-700">Giao diện compact</h2>
        <SearchBarComponent
          onSearch={handleSearch}
          onSearchError={handleSearchError}
          loading={isSearching}
          variant="compact"
          showQuickCategories={false}
          className="max-w-md"
        />
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-700">Kết quả tìm kiếm</h2>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <ul className="space-y-2">
              {searchResults.map((result, index) => (
                <li key={index} className="text-slate-700 py-2 border-b border-slate-100 last:border-b-0">
                  {result}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Accessibility Information */}
      <div className="bg-blue-50 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-blue-800">Tính năng trợ năng</h3>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>• WCAG 2.1 AA compliant với focus states rõ ràng</li>
          <li>• Hỗ trợ điều hướng bằng bàn phím (Tab, Enter, Arrow keys, Escape)</li>
          <li>• Screen reader friendly với ARIA labels và live regions</li>
          <li>• Hỗ trợ prefers-reduced-motion cho người dùng nhạy cảm với chuyển động</li>
          <li>• Touch targets tối thiểu 44px cho thiết bị di động</li>
          <li>• High contrast mode support</li>
        </ul>
      </div>
    </div>
  );
}
