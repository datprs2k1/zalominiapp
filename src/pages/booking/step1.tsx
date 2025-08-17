import DateTimePicker from '@/components/form/date-time-picker';
import DoctorSelector from '@/components/form/doctor-selector';
import DepartmentPicker from '@/components/form/department-picker';
import FabForm from '@/components/form/fab-form';
import { availableTimeSlotsState, bookingFormState } from '@/state';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Department, TimeSlot } from '@/types';
import toast from 'react-hot-toast';
import { authorize } from 'zmp-sdk/apis';
import { getSetting } from 'zmp-sdk/apis';

export default function Step1() {
  const timeSlots = useAtomValue(availableTimeSlotsState);
  const [formData, setFormData] = useAtom(bookingFormState);
  const [selectedSlot, setSelectedSlot] = useState<Partial<TimeSlot>>(formData.slot ?? {});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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

  const isFormValid = formData.slot && formData.department;

  // Get department name safely
  const getDepartmentName = () => {
    const department = formData.department as Department | undefined;
    if (department) {
      return typeof department.title === 'string'
        ? department.title
        : (department.title as any)?.rendered || 'Khoa đã chọn';
    }
    return 'Khoa đã chọn';
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
          toast.error('Vui lòng chọn khoa khám và ngày khám!');
        },
      }}
    >
      <div className="bg-white flex flex-col">
        {loading && (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        <div className="p-4 sm:p-5 space-y-6">
          <h2 className="text-lg sm:text-xl font-medium mb-2">Chọn khoa và ngày khám</h2>

          <div className="space-y-4">
            <label className="mobile-form-label">
              Khoa khám <span className="text-red-500">*</span>
            </label>
            <div className="relative">
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
              {formData?.department && (
                <div className="mt-3 p-3 bg-medical-50 rounded-medical border border-medical-200 mobile-card-enhanced">
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-medical-500 flex items-center justify-center mr-2 flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-medical-800 flex-1">
                      <span className="font-semibold">{getDepartmentName()}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 space-y-4">
            <label className="mobile-form-label">
              Chọn ngày khám <span className="text-red-500">*</span>
            </label>
            <div className="bg-gray-50 rounded-medical p-3">
              <DateTimePicker value={selectedSlot} onChange={setSelectedSlot} slots={timeSlots} />
            </div>

            {formData?.slot && (
              <div className="mt-4 p-3 bg-success-50 rounded-medical border border-success-200 mobile-card-enhanced">
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-success-500 flex items-center justify-center mr-2 flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-success-600 mb-1">Đã chọn ngày khám</p>
                    <p className="text-sm font-semibold text-success-800">
                      {new Date(formData.slot.date).toLocaleString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 p-4 bg-medical-50 border-t border-medical-100">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-medical-500 rounded-full p-1.5 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 text-white"
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
            <p className="ml-3 text-xs sm:text-sm text-medical-700 leading-relaxed">
              Vui lòng chọn đúng khoa và ngày khám phù hợp để có trải nghiệm tốt nhất
            </p>
          </div>
        </div>
      </div>
    </FabForm>
  );
}
