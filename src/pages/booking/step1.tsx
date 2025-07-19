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
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        <div className="p-5">
          <h2 className="text-lg font-medium mb-4">Chọn khoa và ngày khám</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Khoa khám</label>
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
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-800">
                    Đã chọn: <span className="font-semibold">{getDepartmentName()}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Chọn ngày khám</label>
            <DateTimePicker value={selectedSlot} onChange={setSelectedSlot} slots={timeSlots} />

            {formData?.slot && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
                <p className="text-sm text-green-800">
                  Đã chọn ngày:{' '}
                  <span className="font-semibold">
                    {new Date(formData.slot.date).toLocaleString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary rounded-full p-1">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="ml-3 text-xs text-gray-500">
              Vui lòng chọn đúng khoa và ngày khám phù hợp để có trải nghiệm tốt nhất
            </p>
          </div>
        </div>
      </div>
    </FabForm>
  );
}
