import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Doctor } from '@/types';
import { WPDoctor } from '@/services/wp-types';
import { doctorsAtom } from '@/services/post';

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

// Helper function to get title rank for sorting
const getTitleRank = (title: string): number => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('giáo sư') || titleLower.includes('gs.')) return 1;
  if (titleLower.includes('phó giáo sư') || titleLower.includes('pgs.')) return 2;
  if (titleLower.includes('tiến sĩ') || titleLower.includes('ts.')) return 3;
  if (titleLower.includes('thạc sĩ') || titleLower.includes('ths.')) return 4;
  if (titleLower.includes('bác sĩ') || titleLower.includes('bs.')) return 5;
  return 6;
};

interface DoctorCardProps {
  doctor: Doctor;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const DoctorCard = ({ doctor, isSelected, isDisabled, onClick }: DoctorCardProps) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (isDisabled) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick();
      }
    },
    [isDisabled, onClick]
  );

  const avatarUrl = useMemo(() => {
    if (imageError || !doctor.image) {
      return `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style="background: #3B82F6;">
          <circle cx="50" cy="35" r="15" fill="white"/>
          <path d="M25 85 Q25 65 50 65 Q75 65 75 85 Z" fill="white"/>
        </svg>
      `)}`;
    }
    return doctor.image;
  }, [doctor.image, imageError]);

  const cardClasses = [
    'relative flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 cursor-pointer',
    'bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500',
    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200',
    isDisabled ? 'opacity-60 cursor-not-allowed' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={cardClasses}
      onClick={!isDisabled ? onClick : undefined}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-label={`${isSelected ? 'Đã chọn' : 'Chọn'} bác sĩ ${doctor.name}${isDisabled ? ' (không có sẵn)' : ''}`}
      aria-disabled={isDisabled}
      aria-pressed={isSelected}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Doctor Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={avatarUrl}
            alt={`Ảnh đại diện của ${doctor.name}`}
            className="object-cover w-full h-full"
            onError={handleImageError}
          />
        </div>

        {/* Availability indicator */}
        <div
          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
            doctor.isAvailable ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
      </div>

      {/* Doctor Information */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{doctor.name}</h3>

        {doctor.title && <p className="text-sm text-blue-600 font-medium">{doctor.title}</p>}

        {doctor.specialties && <p className="text-sm text-gray-600 truncate">{doctor.specialties}</p>}

        {doctor.unit && <p className="text-xs text-gray-500 truncate">{doctor.unit}</p>}

        {!doctor.isAvailable && (
          <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
            Hiện không có sẵn
          </div>
        )}
      </div>
    </div>
  );
};

// Simple pagination component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Trước
      </button>

      <span className="px-3 py-2 text-sm text-gray-600">
        {currentPage} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Sau
      </button>
    </div>
  );
};

// Loading skeleton
const LoadingSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="flex items-center gap-4 p-4 rounded-lg border bg-white">
        <div className="w-16 h-20 bg-gray-200 rounded-lg animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

// Empty state
const EmptyState = () => (
  <div className="text-center py-12">
    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">Không có bác sĩ nào</h3>
    <p className="text-gray-600">Hiện tại không có bác sĩ nào trong danh sách.</p>
  </div>
);

export interface DoctorListProps {
  value?: Doctor;
  onChange: (doctor: Doctor) => void;
  onLoadDoctors?: (doctors: Doctor[]) => void;
  loading?: boolean;
  itemsPerPage?: number;
}

function DoctorList({ value, onChange, onLoadDoctors, loading, itemsPerPage = 5 }: DoctorListProps) {
  const wpDoctors = useAtomValue(doctorsAtom);
  const [currentPage, setCurrentPage] = useState(1);

  // Convert and sort doctors
  const doctors = useMemo(() => {
    if (!wpDoctors) return [];

    const convertedDoctors = wpDoctors.map(convertToDoctor);

    // Sort doctors by title rank (highest to lowest)
    return convertedDoctors.sort((a, b) => {
      const rankA = getTitleRank(a.title);
      const rankB = getTitleRank(b.title);

      if (rankA !== rankB) return rankA - rankB;
      return a.name.localeCompare(b.name);
    });
  }, [wpDoctors]);

  // Pagination calculations
  const { totalPages, paginatedDoctors } = useMemo(() => {
    const total = Math.ceil(doctors.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    return {
      totalPages: total,
      paginatedDoctors: doctors.slice(startIndex, startIndex + itemsPerPage),
    };
  }, [doctors, currentPage, itemsPerPage]);

  useEffect(() => {
    if (doctors.length > 0) {
      onLoadDoctors?.(doctors);
    }
  }, [doctors, onLoadDoctors]);

  useEffect(() => {
    setCurrentPage(1);
  }, [doctors.length]);

  const isLoading = loading || !wpDoctors;

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (doctors.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {paginatedDoctors.map((doctor) => {
        const selected = value && value.id === doctor.id;
        const disabled = !doctor.isAvailable;

        return (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            isSelected={!!selected}
            isDisabled={disabled}
            onClick={() => onChange(doctor)}
          />
        );
      })}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}

export default DoctorList;
