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
      <div className="p-4 min-h-[70vh] flex flex-col items-center justify-center">
        <div
          className={`flex w-full max-w-md flex-col items-center gap-6 rounded-2xl bg-white px-6 py-10 shadow-sm transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
        >
          {/* Success animation */}
          <div
            className={`w-20 h-20 rounded-full bg-green-100 flex items-center justify-center transition-transform duration-500 delay-300 ${isVisible ? 'scale-100' : 'scale-0'}`}
          >
            <SuccessIcon />
          </div>

          {/* Success message */}
          <div
            className={`text-center transition-all duration-500 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Đặt lịch thành công!</h2>
            <p className="text-gray-500">
              Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Thông tin lịch hẹn đã được ghi nhận.
            </p>
          </div>

          <DashedDivider />

          {/* Appointment details */}
          <div
            className={`w-full transition-opacity duration-500 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wide">Thông tin lịch hẹn</h3>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-600"
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
                <div>
                  <p className="text-xs text-gray-500">Bệnh nhân</p>
                  <p className="font-medium">{userInfo.name}</p>
                </div>
              </div>

              {formData.department && (
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-indigo-600"
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
                  <div>
                    <p className="text-xs text-gray-500">Khoa</p>
                    <p className="font-medium">{getDepartmentName()}</p>
                  </div>
                </div>
              )}

              {formData.slot && (
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-green-600"
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
                  <div>
                    <p className="text-xs text-gray-500">Ngày khám</p>
                    <p className="font-medium">{getFormattedDate()}</p>
                  </div>
                </div>
              )}
            </div>

            {formData.description && formData.description.trim().length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Mô tả triệu chứng</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {formData.description}
                </p>
              </div>
            )}
          </div>

          {/* Next steps */}
          <div
            className={`w-full mt-4 bg-blue-50 rounded-lg p-4 border border-blue-100 transition-all duration-500 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          >
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Bước tiếp theo</h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Bạn sẽ nhận được xác nhận qua SMS và email</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Vui lòng đến đúng ngày khám</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Mang theo giấy tờ tùy thân và thẻ BHYT (nếu có)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </FabForm>
  );
}
