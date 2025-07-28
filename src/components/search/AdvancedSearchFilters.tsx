import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { getColorToken } from '@/styles/unified-color-system';

export interface SearchFilters {
  category: string;
  specialty: string;
  availability: string;
  location: string;
  experience: string;
  rating: number;
  priceRange: [number, number];
  insurance: string;
  language: string;
  gender: string;
  consultationType: string;
}

interface AdvancedSearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onReset: () => void;
  isVisible: boolean;
  onToggle: () => void;
}

const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  isVisible,
  onToggle
}) => {
  const prefersReducedMotion = useReducedMotion();

  const updateFilter = useCallback((key: keyof SearchFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  }, [filters, onFiltersChange]);

  const specialties = [
    { value: '', label: 'Tất cả chuyên khoa' },
    { value: 'cardiology', label: 'Tim mạch' },
    { value: 'neurology', label: 'Thần kinh' },
    { value: 'orthopedics', label: 'Chỉnh hình' },
    { value: 'pediatrics', label: 'Nhi khoa' },
    { value: 'dermatology', label: 'Da liễu' },
    { value: 'ophthalmology', label: 'Mắt' },
    { value: 'ent', label: 'Tai mũi họng' },
    { value: 'gynecology', label: 'Phụ khoa' },
    { value: 'urology', label: 'Tiết niệu' },
    { value: 'psychiatry', label: 'Tâm thần' },
    { value: 'oncology', label: 'Ung bướu' }
  ];

  const availabilityOptions = [
    { value: '', label: 'Tất cả' },
    { value: 'today', label: 'Hôm nay' },
    { value: 'tomorrow', label: 'Ngày mai' },
    { value: 'this-week', label: 'Tuần này' },
    { value: 'next-week', label: 'Tuần sau' },
    { value: 'online', label: 'Tư vấn online' }
  ];

  const experienceOptions = [
    { value: '', label: 'Tất cả' },
    { value: '1-5', label: '1-5 năm' },
    { value: '5-10', label: '5-10 năm' },
    { value: '10-15', label: '10-15 năm' },
    { value: '15+', label: 'Trên 15 năm' }
  ];

  const insuranceOptions = [
    { value: '', label: 'Tất cả' },
    { value: 'bhyt', label: 'BHYT' },
    { value: 'private', label: 'Bảo hiểm tư nhân' },
    { value: 'self-pay', label: 'Tự chi trả' }
  ];

  const languageOptions = [
    { value: '', label: 'Tất cả' },
    { value: 'vietnamese', label: 'Tiếng Việt' },
    { value: 'english', label: 'Tiếng Anh' },
    { value: 'chinese', label: 'Tiếng Trung' },
    { value: 'japanese', label: 'Tiếng Nhật' },
    { value: 'korean', label: 'Tiếng Hàn' }
  ];

  const genderOptions = [
    { value: '', label: 'Tất cả' },
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' }
  ];

  const consultationTypes = [
    { value: '', label: 'Tất cả' },
    { value: 'in-person', label: 'Khám trực tiếp' },
    { value: 'online', label: 'Tư vấn online' },
    { value: 'home-visit', label: 'Khám tại nhà' }
  ];

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== '' && value !== 0 && !(Array.isArray(value) && value[0] === 0 && value[1] === 10000000)
  ).length;

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <motion.button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
        whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      >
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
        </svg>
        <span className="text-sm font-medium text-gray-700">Bộ lọc nâng cao</span>
        {activeFiltersCount > 0 && (
          <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
            {activeFiltersCount}
          </span>
        )}
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform ${isVisible ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 z-50"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Bộ lọc nâng cao</h3>
              <button
                onClick={onReset}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Đặt lại
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Specialty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chuyên khoa</label>
                <select
                  value={filters.specialty}
                  onChange={(e) => updateFilter('specialty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {specialties.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian có sẵn</label>
                <select
                  value={filters.availability}
                  onChange={(e) => updateFilter('availability', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {availabilityOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Experience Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kinh nghiệm</label>
                <select
                  value={filters.experience}
                  onChange={(e) => updateFilter('experience', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {experienceOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá tối thiểu</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => updateFilter('rating', rating)}
                      className={`p-1 rounded transition-colors ${
                        filters.rating >= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </button>
                  ))}
                  <span className="text-sm text-gray-600 ml-2">{filters.rating > 0 ? `${filters.rating}+ sao` : 'Tất cả'}</span>
                </div>
              </div>

              {/* Insurance Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bảo hiểm</label>
                <select
                  value={filters.insurance}
                  onChange={(e) => updateFilter('insurance', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {insuranceOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Language Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngôn ngữ</label>
                <select
                  value={filters.language}
                  onChange={(e) => updateFilter('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {languageOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Gender Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính bác sĩ</label>
                <select
                  value={filters.gender}
                  onChange={(e) => updateFilter('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {genderOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Consultation Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hình thức khám</label>
                <select
                  value={filters.consultationType}
                  onChange={(e) => updateFilter('consultationType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {consultationTypes.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Khoảng giá (VNĐ)</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="10000000"
                    step="100000"
                    value={filters.priceRange[1]}
                    onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0đ</span>
                    <span>{filters.priceRange[1].toLocaleString('vi-VN')}đ</span>
                    <span>10M+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Filters Button */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {activeFiltersCount > 0 ? `${activeFiltersCount} bộ lọc đang áp dụng` : 'Chưa có bộ lọc nào'}
              </div>
              <button
                onClick={onToggle}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedSearchFilters;
