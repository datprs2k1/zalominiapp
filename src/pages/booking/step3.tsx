import { DashedDivider } from '@/components/dashed-divider';
import FabForm from '@/components/form/fab-form';
import SuccessIcon from '@/components/icons/success';
import PolarizedList from '@/components/polarized-list';
import { bookingFormState, userState } from '@/state';
import { formatShortDate } from '@/utils/format';
import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { Department, Service } from '@/types';
import { useEffect, useState } from 'react';
import { decodeHTML } from '@/utils/decodeHTML';

export default function Step3() {
  const navigate = useNavigate();
  const { userInfo } = useAtomValue(userState);
  const formData = useAtomValue(bookingFormState);
  const [isVisible, setIsVisible] = useState(false);
  const isSpecialist = formData.examType === 'specialist';

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

  // Get service name safely
  const getServiceName = () => {
    const service = formData.service as Service | undefined;
    return service?.name || '';
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
      <div className="p-5 bg-white min-h-[70vh] flex flex-col items-center justify-center">
        <div className="max-w-lg w-full mx-auto">
          {/* Success animation */}
          <div
            className={`flex flex-col items-center transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="relative">
              {/* Ripple effect */}
              <div
                className={`absolute inset-0 rounded-full animate-ping bg-green-100 ${isVisible ? 'opacity-30' : 'opacity-0'}`}
              ></div>
              <div
                className={`absolute inset-0 scale-[1.2] rounded-full bg-green-50 ${isVisible ? 'opacity-50' : 'opacity-0'}`}
              ></div>

              {/* Success icon */}
              <div
                className={`w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-200 relative z-10 transition-transform duration-700 delay-300 ${
                  isVisible ? 'scale-100' : 'scale-0'
                }`}
              >
                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Success message */}
            <div
              className={`text-center mt-6 transition-all duration-500 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Đặt lịch thành công!</h2>
              <p className="text-gray-500">
                Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. <br />
                Thông tin lịch hẹn đã được ghi nhận.
              </p>
            </div>
          </div>

          {/* Appointment details card */}
          <div
            className={`mt-10 rounded-xl bg-white shadow-md overflow-hidden transition-all duration-700 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="bg-primary/5 px-6 py-4 border-b border-primary/10">
              <h3 className="text-primary font-medium">Thông tin lịch hẹn</h3>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Patient info */}
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
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
                    <p className="text-sm text-gray-500">Bệnh nhân</p>
                    <p className="font-medium">{formData.name || userInfo.name}</p>
                    {formData.phone && <p className="text-sm text-gray-500 mt-1">{formData.phone}</p>}
                  </div>
                </div>

                <div className="h-px bg-gray-100"></div>

                {/* Appointment type */}
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Loại khám</p>
                    <p className="font-medium">{isSpecialist ? 'Khám chuyên khoa' : 'Khám dịch vụ'}</p>
                  </div>
                </div>

                {/* Department or Service */}
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full ${isSpecialist ? 'bg-indigo-100' : 'bg-teal-100'} flex items-center justify-center mr-4 flex-shrink-0`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${isSpecialist ? 'text-indigo-600' : 'text-teal-600'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {isSpecialist ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      )}
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{isSpecialist ? 'Khoa' : 'Dịch vụ'}</p>
                    <p className="font-medium">{isSpecialist ? getDepartmentName() : getServiceName()}</p>
                  </div>
                </div>

                {/* Appointment date */}
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-600"
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
                    <p className="text-sm text-gray-500">Ngày khám</p>
                    <p className="font-medium">{getFormattedDate()}</p>
                  </div>
                </div>

                {/* Symptoms */}
                {formData.description && formData.description.trim().length > 0 && (
                  <>
                    <div className="h-px bg-gray-100"></div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Mô tả triệu chứng</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">{formData.description}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Next steps */}
          <div
            className={`mt-6 bg-blue-50 rounded-lg p-5 transition-all duration-700 delay-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h4 className="flex items-center text-blue-800 font-medium mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Bước tiếp theo
            </h4>
            <ul className="text-sm text-blue-700 space-y-3 pl-7">
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
