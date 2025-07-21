import DateTimePicker from '@/components/form/date-time-picker';
import DoctorSelector from '@/components/form/doctor-selector';
import DepartmentPicker from '@/components/form/department-picker';
import ServicePicker from '@/components/form/service-picker';
import FabForm from '@/components/form/fab-form';
import { availableTimeSlotsState, bookingFormState } from '@/state';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Department, Service, TimeSlot } from '@/types';
import toast from 'react-hot-toast';
import { authorize } from 'zmp-sdk/apis';
import { getSetting } from 'zmp-sdk/apis';

export default function Step1() {
  const timeSlots = useAtomValue(availableTimeSlotsState);
  const [formData, setFormData] = useAtom(bookingFormState);
  const [selectedSlot, setSelectedSlot] = useState<Partial<TimeSlot>>(formData.slot ?? {});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [examType, setExamType] = useState(formData.examType || 'specialist');

  useEffect(() => {
    const auth = async () => {
      setLoading(true);
      try {
        const data = await authorize({
          scopes: ['scope.userInfo', 'scope.userPhonenumber'],
        });

        if (!data['scope.userInfo'] || !data['scope.userPhonenumber']) {
          toast.error('Vui lòng cấp quyền truy cập thông tin cá nhân và số điện thoại!');
          navigate('/');
        }
      } catch (error) {
        console.error('Authorization error:', error);
        toast.error('Không thể xác thực quyền truy cập');
      } finally {
        setLoading(false);
      }
    };

    const checkPermission = async () => {
      try {
        const data = await getSetting();
        if (!data.authSetting['scope.userInfo'] && !data.authSetting['scope.userPhonenumber']) {
          auth();
        }
      } catch (error) {
        console.error('Permission check error:', error);
      }
    };

    checkPermission();
  }, []);

  useEffect(() => {
    if (selectedSlot) {
      const { date } = selectedSlot;
      if (date) {
        setFormData((prev) => ({
          ...prev,
          slot: { date: new Date(date) },
        }));
      }
    }
  }, [selectedSlot]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      examType,
      // Reset department/service when switching exam type
      department: examType === 'specialist' ? prev.department : undefined,
      service: examType === 'service' ? prev.service : undefined,
    }));
  }, [examType, setFormData]);

  const isFormValid =
    formData.slot &&
    ((examType === 'specialist' && formData.department) || (examType === 'service' && formData.service));

  // Get department/service name safely
  const getSelectionName = () => {
    if (examType === 'specialist' && formData.department) {
      const department = formData.department as Department;
      return typeof department.title === 'string'
        ? department.title
        : (department.title as any)?.rendered || 'Khoa đã chọn';
    } else if (examType === 'service' && formData.service) {
      const service = formData.service as Service;
      return service.name || 'Dịch vụ đã chọn';
    }
    return examType === 'specialist' ? 'Khoa đã chọn' : 'Dịch vụ đã chọn';
  };

  return (
    <FabForm
      fab={{
        children: 'Tiếp tục',
        disabled: !isFormValid,
        onClick: () => {
          navigate('/booking/2', {
            viewTransition: true,
          });
        },
        onDisabledClick() {
          toast.error(
            examType === 'specialist' ? 'Vui lòng chọn khoa khám và ngày khám!' : 'Vui lòng chọn dịch vụ và ngày khám!'
          );
        },
      }}
    >
      <div className="flex flex-col">
        {loading && (
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
          </div>
        )}

        {!loading && (
          <div className="p-5">
            <div className="mb-8">
              <h2 className="text-xl font-medium mb-2">Loại khám</h2>
              <p className="text-sm text-gray-500 mb-4">Vui lòng chọn loại khám phù hợp với nhu cầu của bạn</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`relative py-4 px-4 rounded-xl border flex items-center gap-3 transition-all ${
                    examType === 'specialist'
                      ? 'bg-primary/10 border-primary text-primary shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setExamType('specialist')}
                >
                  {examType === 'specialist' && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <span className="font-medium">Khám chuyên khoa</span>
                    <p className="text-xs text-gray-500 mt-1">Khám theo chuyên khoa cụ thể</p>
                  </div>
                </button>

                <button
                  type="button"
                  className={`relative py-4 px-4 rounded-xl border flex items-center gap-3 transition-all ${
                    examType === 'service'
                      ? 'bg-primary/10 border-primary text-primary shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setExamType('service')}
                >
                  {examType === 'service' && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-teal-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <span className="font-medium">Khám dịch vụ</span>
                    <p className="text-xs text-gray-500 mt-1">Khám theo gói dịch vụ</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-medium mb-2">{examType === 'specialist' ? 'Khoa khám' : 'Dịch vụ khám'}</h2>
              <p className="text-sm text-gray-500 mb-4">
                Vui lòng chọn {examType === 'specialist' ? 'khoa' : 'dịch vụ'} bạn muốn đăng ký
              </p>

              <div className="relative">
                {examType === 'specialist' ? (
                  <div className="bg-white">
                    <DepartmentPicker
                      label=""
                      placeholder="Chọn khoa khám"
                      value={formData?.department}
                      onChange={(department) =>
                        setFormData((prev) => ({
                          ...prev,
                          department,
                        }))
                      }
                    />
                  </div>
                ) : (
                  <div className="bg-white">
                    <ServicePicker
                      label=""
                      placeholder="Chọn dịch vụ khám"
                      value={formData?.service}
                      onChange={(service) =>
                        setFormData((prev) => ({
                          ...prev,
                          service,
                        }))
                      }
                    />
                  </div>
                )}

                {((examType === 'specialist' && formData?.department) ||
                  (examType === 'service' && formData?.service)) && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-center">
                    <div className="w-8 h-8 bg-blue-500 flex items-center justify-center mr-3 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Đã chọn: <span className="font-semibold">{getSelectionName()}</span>
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        {examType === 'specialist'
                          ? 'Bạn sẽ được khám với bác sĩ chuyên khoa'
                          : 'Bạn sẽ được tư vấn và thực hiện dịch vụ'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pb-4">
              <h2 className="text-xl font-medium mb-2">Chọn ngày khám</h2>
              <p className="text-sm text-gray-500 mb-4">Vui lòng chọn ngày và giờ phù hợp với lịch trình của bạn</p>

              <DateTimePicker value={selectedSlot} onChange={setSelectedSlot} slots={timeSlots} />

              {formData?.slot && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg flex items-center">
                  <div className="w-8 h-8 bg-green-500 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
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
                    <p className="text-sm font-medium text-green-800">Đã chọn ngày:</p>
                    <p className="text-sm text-green-700 font-semibold">
                      {new Date(formData.slot.date).toLocaleString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-auto p-5 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-amber-100 text-amber-600 rounded-full p-2 mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Lưu ý</p>
              <p className="text-xs text-gray-600 mt-1">
                Vui lòng chọn đúng loại khám, {examType === 'specialist' ? 'khoa' : 'dịch vụ'} và ngày khám phù hợp để
                có trải nghiệm tốt nhất
              </p>
            </div>
          </div>
        </div>
      </div>
    </FabForm>
  );
}
