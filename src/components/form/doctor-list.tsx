import { useAtomValue } from 'jotai';
import DoctorItem from '../items/doctor';
import { Doctor } from '@/types';
import { useEffect } from 'react';
import { doctorsAtom } from '@/services/post';

export interface DoctorListProps {
  onLoadDoctors?: (doctors: any) => void;
  loading?: boolean;
  withLanguages?: boolean;
  className?: string;
}

function DoctorList({ onLoadDoctors, loading, withLanguages = true, className }: DoctorListProps) {
  const data = useAtomValue(doctorsAtom);
  const doctors = data || [];
  const isLoading = loading || !data;

  useEffect(() => {
    onLoadDoctors?.(doctors);
  }, [doctors]);

  // Mobile-optimized Header Section Component
  const HeaderSection = () => (
    <div className="bg-gradient-to-br from-medical-50 to-medical-100 rounded-medical-lg p-4 sm:p-5 mb-3 sm:mb-4 shadow-card-medical border border-medical-200/50">
      <div className="text-center mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-medical-800 mb-1.5 sm:mb-2">Đội ngũ chuyên môn</h2>
        <p className="text-medical-600 text-xs sm:text-sm leading-relaxed">
          Đội ngũ bác sĩ và dược sĩ giàu kinh nghiệm có thâm niên trong ngành, được tu nghiệp cả trong và ngoài nước.
        </p>
      </div>

      {/* Feature highlights - Mobile-optimized layout */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-white/60 rounded-medical border border-medical-200/30">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-medical-500 rounded-medical flex items-center justify-center shadow-button-medical comfortable-touch-target flex-shrink-0">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-medical-800 text-xs sm:text-sm mb-0.5 sm:mb-1">Giàu kinh nghiệm</h3>
            <p className="text-xs text-medical-600 leading-relaxed">
              Đội ngũ bác sĩ và dược sĩ giàu kinh nghiệm có thâm niên trong ngành
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-white/60 rounded-medical border border-medical-200/30">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-medical-600 rounded-medical flex items-center justify-center shadow-button-medical comfortable-touch-target flex-shrink-0">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-medical-800 text-xs sm:text-sm mb-0.5 sm:mb-1">
              Nghiệp vụ chuyên môn cao
            </h3>
            <p className="text-xs text-medical-600 leading-relaxed">
              Các bác sĩ và dược sĩ hiện đang công tác và giảng dạy tại bệnh viện hàng đầu cả nước
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-white/60 rounded-medical border border-medical-200/30">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-medical-700 rounded-medical flex items-center justify-center shadow-button-medical comfortable-touch-target flex-shrink-0">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-medical-800 text-xs sm:text-sm mb-0.5 sm:mb-1">Tâm huyết và tận tâm</h3>
            <p className="text-xs text-medical-600 leading-relaxed">
              Luôn sẵn sàng tư vấn và hỗ trợ chăm sóc sức khỏe cho mọi người bằng sự tận tâm và nhiệt huyết
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Vertical layout skeleton loading UI
  if (isLoading) {
    return (
      <div className={`${className || ''}`}>
        <HeaderSection />
        <div className="space-y-3 sm:space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="mobile-card-hospital p-3 sm:p-4 animate-pulse">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-medical bg-medical-200 flex-shrink-0" />
                <div className="w-full space-y-1.5 sm:space-y-2">
                  <div className="space-y-0.5 sm:space-y-1">
                    <div className="h-3.5 sm:h-4 w-2/3 bg-medical-200 rounded-medical mx-auto" />
                    <div className="h-2.5 sm:h-3 w-1/2 bg-medical-100 rounded-medical mx-auto" />
                  </div>
                  <div className="space-y-0.5 sm:space-y-1">
                    <div className="h-2.5 sm:h-3 w-full bg-medical-100 rounded-medical" />
                    <div className="h-2.5 sm:h-3 w-3/4 bg-medical-100 rounded-medical mx-auto" />
                  </div>
                  <div className="flex justify-center gap-1.5 sm:gap-2">
                    <div className="h-4 sm:h-5 w-12 sm:w-16 bg-medical-100 rounded-full" />
                    <div className="h-4 sm:h-5 w-16 sm:w-20 bg-medical-100 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${className || ''}`}>
      <HeaderSection />
      <div className="space-y-4">
        {doctors.map((doctor, index) => (
          <DoctorItem withLanguages={withLanguages} key={doctor.id || index} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}

export default DoctorList;
