import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DoctorItem from '../items/doctor';
import { Doctor } from '@/types';
import { WPDoctor } from '@/services/wp-types';
import { doctorsAtom } from '@/services/post';
import './doctor-selector.css';

// Helper function to convert WPDoctor to Doctor
const convertToDoctor = (wpDoctor: WPDoctor): Doctor => ({
  id: wpDoctor.id,
  name: wpDoctor.title?.rendered || '',
  title: wpDoctor.bacsi_chucdanh || '',
  languages: wpDoctor.bacsi_ngonngu || '',
  specialties: wpDoctor.bacsi_chuyenmon || '',
  image: wpDoctor._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
  isAvailable: wpDoctor.bacsi_trangthai !== 'unavailable',
  unit: wpDoctor.bacsi_donvi || '',
});

// Helper function to get title rank for sorting (higher number = higher rank)
const getTitleRank = (title: string): number => {
  if (!title) return -1;

  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('thạc sĩ') && lowerTitle.includes('ckii')) return 7;
  if (lowerTitle.includes('thạc sĩ') && lowerTitle.includes('bác sĩ')) return 6;
  if (lowerTitle.includes('thạc sĩ')) return 5;
  if (lowerTitle.includes('bác sĩ') && (lowerTitle.includes('chuyên khoa ii') || lowerTitle.includes('ckii'))) return 4;
  if (lowerTitle.includes('bác sĩ') && (lowerTitle.includes('chuyên khoa i') || lowerTitle.includes('cki'))) return 3;
  if (lowerTitle.includes('bác sĩ')) return 2;

  return 0;
};

export interface DoctorSelectorProps {
  value?: Doctor;
  onChange: (doctor: Doctor) => void;
  onLoadDoctors?: (doctors: Doctor[]) => void;
  loading?: boolean;
  itemsPerPage?: number;
}

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

// Extracted Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
      }
    },
    [totalPages, onPageChange]
  );

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={`flex items-center px-2 py-1 rounded-md text-sm ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Trước
      </button>

      <div className="hidden md:flex space-x-1">
        {totalPages <= 7 ? (
          // Show all pages if 7 or fewer
          [...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToPage(idx + 1)}
              aria-label={`Page ${idx + 1}`}
              aria-current={currentPage === idx + 1 ? 'page' : undefined}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
                currentPage === idx + 1 ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {idx + 1}
            </button>
          ))
        ) : (
          // Show limited pages with ellipses for many pages
          <>
            <button
              onClick={() => goToPage(1)}
              aria-label="Page 1"
              aria-current={currentPage === 1 ? 'page' : undefined}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
                currentPage === 1 ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              1
            </button>

            {currentPage > 3 && <span className="flex items-center justify-center w-8 h-8">...</span>}

            {/* Pages around current page */}
            {Array.from({ length: 3 }, (_, i) => {
              const pageNum = Math.min(Math.max(currentPage - 1 + i, 2), totalPages - 1);

              // Skip if out of reasonable range
              if (pageNum <= 1 || pageNum >= totalPages) return null;

              // Skip if we're trying to show too many pages near the start
              if (currentPage <= 3 && pageNum > 4) return null;

              // Skip if we're trying to show too many pages near the end
              if (currentPage >= totalPages - 2 && pageNum < totalPages - 3) return null;

              return (
                <button
                  key={`page-${pageNum}-${i}`}
                  onClick={() => goToPage(pageNum)}
                  aria-label={`Page ${pageNum}`}
                  aria-current={currentPage === pageNum ? 'page' : undefined}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
                    currentPage === pageNum
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {currentPage < totalPages - 2 && <span className="flex items-center justify-center w-8 h-8">...</span>}

            <button
              onClick={() => goToPage(totalPages)}
              aria-label={`Page ${totalPages}`}
              aria-current={currentPage === totalPages ? 'page' : undefined}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
                currentPage === totalPages ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Mobile pagination indicator */}
      <div className="md:hidden flex items-center">
        <span className="text-sm font-medium">
          {currentPage} / {totalPages}
        </span>
      </div>

      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={`flex items-center px-2 py-1 rounded-md text-sm ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Sau
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

// Skeleton loading component
const LoadingSkeleton = () => (
  <div className="flex flex-col gap-3 bg-white mt-3 p-3 rounded-lg shadow animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
        <div className="h-12 w-12 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/3 bg-gray-200 rounded" />
          <div className="h-2 w-1/4 bg-gray-100 rounded" />
        </div>
        <div className="h-6 w-12 bg-gray-200 rounded-full" />
      </div>
    ))}
  </div>
);

// Empty state component
const EmptyState = () => (
  <div className="py-6 text-center text-gray-500">
    <div className="text-5xl mb-3">👨‍⚕️</div>
    <p>No doctors available at the moment</p>
  </div>
);

function DoctorSelector({ value, onChange, onLoadDoctors, loading, itemsPerPage = 5 }: DoctorSelectorProps) {
  const wpDoctors = useAtomValue(doctorsAtom);
  const [currentPage, setCurrentPage] = useState(1);

  // Memoize the doctors conversion
  const doctors = useMemo(() => {
    if (!wpDoctors) return [];

    // Convert WPDoctors to Doctors
    const convertedDoctors = wpDoctors.map(convertToDoctor);

    // Sort doctors by title rank (highest to lowest)
    return convertedDoctors.sort((a, b) => {
      const rankA = getTitleRank(a.title);
      const rankB = getTitleRank(b.title);

      // Sort by rank first (descending)
      if (rankA !== rankB) return rankB - rankA;

      // If ranks are equal, sort alphabetically by name
      return a.name.localeCompare(b.name);
    });
  }, [wpDoctors]);

  // Memoize pagination calculations
  const { totalPages, paginatedDoctors } = useMemo(() => {
    const total = Math.ceil(doctors.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    return {
      totalPages: total,
      paginatedDoctors: doctors.slice(startIndex, startIndex + itemsPerPage),
    };
  }, [doctors, currentPage, itemsPerPage]);

  const isLoading = loading || !wpDoctors;

  useEffect(() => {
    if (doctors.length > 0) {
      onLoadDoctors?.(doctors);
    }
  }, [doctors, onLoadDoctors]);

  useEffect(() => {
    // Reset to first page when doctors list changes
    setCurrentPage(1);
  }, [doctors.length]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-col gap-3 bg-white mt-3 p-3 rounded-lg shadow">
      {doctors.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {paginatedDoctors.map((doctor, index) => {
            const selected = value && value.id === doctor.id;
            const disabled = !doctor.isAvailable;

            return (
              <div
                key={doctor.id || index}
                onClick={() => !disabled && onChange(doctor)}
                className={`relative transition rounded-xl overflow-hidden
                  ${selected ? 'ring-2 ring-primary-500' : 'border border-gray-100'} 
                  ${disabled ? 'opacity-60 bg-gray-50' : 'hover:shadow-md bg-white cursor-pointer'}`}
              >
                <DoctorItem
                  withLanguages
                  doctor={doctor}
                  className="w-full"
                  suffix={
                    selected && (
                      <span className="absolute top-2 right-2 bg-primary-500 text-white p-1 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )
                  }
                  description={
                    <>
                      {doctor.unit && <div className="text-sm text-gray-600 font-medium">{doctor.unit}</div>}
                      {disabled && <span className="text-red-500 text-xs">Not available</span>}
                    </>
                  }
                />
              </div>
            );
          })}

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}
    </div>
  );
}

export default DoctorSelector;
