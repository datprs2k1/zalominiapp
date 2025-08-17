import { DashedDivider } from '@/components/dashed-divider';
import FabForm from '@/components/form/fab-form';
import SuccessIcon from '@/components/icons/success';
import PolarizedList from '@/components/polarized-list';
import { bookingFormState, userState } from '@/state';
import { formatShortDate } from '@/utils/format';
import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { Department } from '@/types';
import { useEffect, useState } from 'react';
import { decodeHTML } from '@/utils/decodeHTML';

export default function Step3() {
  const navigate = useNavigate();
  const { userInfo } = useAtomValue(userState);
  const formData = useAtomValue(bookingFormState);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add a small delay for animation to start after component mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Get department name safely
  const getDepartmentName = () => {
    const department = formData.department as Department | undefined;
    if (department) {
      return decodeHTML(
        typeof department.title === 'string' ? department.title : (department.title as any)?.rendered || ''
      );
    }
    return '';
  };

  // Format the appointment date nicely
  const getFormattedDate = () => {
    if (!formData.slot) return '';

    return new Date(formData.slot.date).toLocaleString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <FabForm
      fab={{
        children: 'Về trang chủ',
        onClick: () => {
          navigate('/', {
            viewTransition: true,
          });
        },
      }}
    >
      <div className="p-4 sm:p-6 min-h-[70vh] flex flex-col items-center justify-center safe-area-padding">
        <div
          className={`flex w-full max-w-md flex-col items-center gap-4 sm:gap-6 rounded-medical bg-white px-4 sm:px-6 py-6 sm:py-10 shadow-card-medical transition-all duration-500 mobile-animation-optimized ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
        >
          {/* Success animation */}
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-success-100 flex items-center justify-center transition-transform duration-500 delay-300 ${isVisible ? 'scale-100' : 'scale-0'}`}
          >
            <SuccessIcon />
          </div>

          {/* Success message */}
          <div
            className={`text-center transition-all duration-500 delay-500 px-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          >
            <h2 className="text-lg sm:text-xl font-semibold text-medical-800 mb-2">Đặt lịch thành công!</h2>
            <p className="text-sm sm:text-base text-medical-600 leading-relaxed">
              Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Thông tin lịch hẹn đã được ghi nhận.
            </p>
          </div>

          <DashedDivider />

          {/* Appointment details */}
          <div
            className={`w-full transition-opacity duration-500 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            <h3 className="text-xs sm:text-sm font-medium text-medical-600 mb-3 sm:mb-4 uppercase tracking-wide text-center">
              Thông tin lịch hẹn
            </h3>

            <div className="bg-medical-50 rounded-medical p-3 sm:p-4 mb-4 border border-medical-100">
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-medical-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-medical-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-medical-600 mb-0.5">Bệnh nhân</p>
                    <p className="font-medium text-medical-800 truncate">{userInfo.name}</p>
                  </div>
                </div>

                {formData.department && (
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-medical-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-medical-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-medical-600 mb-0.5">Khoa khám</p>
                      <p className="font-medium text-medical-800 truncate">{getDepartmentName()}</p>
                    </div>
                  </div>
                )}

                {formData.slot && (
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-success-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-success-600 mb-0.5">Ngày khám</p>
                      <p className="font-medium text-success-800 text-sm leading-tight">{getFormattedDate()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {formData.description && formData.description.trim().length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-medical-700">Mô tả triệu chứng</h4>
                <div className="bg-gray-50 p-3 rounded-medical border border-gray-200">
                  <p className="text-sm text-gray-700 leading-relaxed break-words">{formData.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Next steps */}
          <div
            className={`w-full mt-4 bg-medical-50 rounded-medical p-3 sm:p-4 border border-medical-200 transition-all duration-500 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          >
            <h4 className="text-sm font-semibold text-medical-800 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-medical-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Bước tiếp theo
            </h4>
            <ul className="text-sm text-medical-700 space-y-3">
              <li className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-medical-500 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="leading-relaxed">Bạn sẽ nhận được xác nhận qua SMS và email</span>
              </li>
              <li className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-medical-500 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="leading-relaxed">Vui lòng đến đúng ngày khám</span>
              </li>
              <li className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-medical-500 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="leading-relaxed">Mang theo giấy tờ tùy thân và thẻ BHYT (nếu có)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </FabForm>
  );
}
