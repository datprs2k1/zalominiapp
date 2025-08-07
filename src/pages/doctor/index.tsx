import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorList from '@/components/form/doctor-list';
import { Doctor } from '@/types';

export default function DoctorPage() {
  const navigate = useNavigate();

  const handleDoctorClick = useCallback(
    (doctor: Doctor) => {
      navigate(`/doctor/${doctor.id}`, { viewTransition: true });
    },
    [navigate]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bác sĩ Chuyên khoa</h1>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Khám phá đội ngũ bác sĩ chuyên nghiệp, giàu kinh nghiệm với trình độ cao
          </p>
        </header>

        <main className="bg-white rounded-lg shadow-sm border p-6">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Danh sách Bác sĩ</h2>
            <p className="text-sm text-gray-600">Chọn bác sĩ phù hợp với nhu cầu của bạn</p>
          </div>

          <DoctorList onChange={handleDoctorClick} itemsPerPage={8} />
        </main>
      </div>
    </div>
  );
}
