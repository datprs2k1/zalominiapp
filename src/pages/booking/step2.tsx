import FabForm from '@/components/form/fab-form';
import SymptomInquiry from '@/components/form/symptom-inquiry';
import { bookingFormState } from '@/state';
import { useAtom } from 'jotai';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import FormItem from '@/components/form/item';
import { Input } from 'zmp-ui';
import { getUserInfo, getAccessToken, getPhoneNumber } from 'zmp-sdk';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL, SECRET_KEY } from '@/config';

export default function Step2() {
  const [formData, setFormData] = useAtom(bookingFormState);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSpecialist = formData.examType === 'specialist';

  const getPhone = async () => {
    try {
      const phone = await getPhoneNumber();
      const token = phone.token;
      const res = await axios.get('https://graph.zalo.me/v2.0/me/info', {
        headers: {
          access_token: localStorage.getItem('zaloAccessToken') || '',
          code: token,
          secret_key: SECRET_KEY,
        },
      });
      return res.data.data.number;
    } catch (error) {
      console.error('Error getting phone number:', error);
      toast.error('Không thể lấy số điện thoại');
      return '';
    }
  };

  useEffect(() => {
    async function fetchAccessToken() {
      try {
        const accessToken = await getAccessToken();
        localStorage.setItem('zaloAccessToken', accessToken);
      } catch (e) {
        console.error('Không thể lấy accessToken:', e);
      }
    }
    fetchAccessToken();
  }, []);

  // Format date for submission
  function formatDateVN(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  const isFormValid =
    formData.name.trim().length > 0 && formData.phone.trim().length > 0 && formData.description.trim().length > 0;

  const handleSubmit = async () => {
    if (!isFormValid) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    setIsSubmitting(true);

    try {
      let { description, slot, name, phone, department, service, examType } = formData;
      if (!slot) {
        toast.error('Vui lòng chọn ngày khám!');
        return;
      }
      const date = new Date(slot.date);
      const formattedDate = formatDateVN(date);

      const data = new FormData();
      data.append('your-message', description);
      data.append('your-date', formattedDate);
      data.append('your-name', name);
      data.append('your-phone', phone);
      data.append('exam-type', examType || 'specialist');

      if (isSpecialist && department) {
        data.append('department-id', department.id.toString());
        data.append(
          'department-name',
          typeof department.title === 'string' ? department.title : (department.title as any)?.rendered || ''
        );
      } else if (!isSpecialist && service) {
        data.append('service-id', service.id.toString());
        data.append('service-name', service.name);
      }

      // Uncomment when API is ready
      // const res = await axios.post(`${API_URL}/wp-json/contact-form-7/v1/contact-forms/feedback`, data);
      // if (res.status === 200) {

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Đặt lịch khám thành công!');
      navigate('/booking/3', {
        viewTransition: true,
      });
      // }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại sau!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetUserInfo = async () => {
    try {
      const userInfo = await getUserInfo();
      const phone = await getPhone();
      setFormData((prev) => ({
        ...prev,
        phone: phone || '',
        name: userInfo.userInfo.name || prev.name,
      }));
      toast.success('Đã lấy thông tin từ Zalo');
    } catch (e) {
      toast.error('Không thể lấy thông tin từ Zalo!');
    }
  };

  // Get the summary of the booking details from step 1
  const getBookingSummary = () => {
    const details: Array<{ label: string; value: string }> = [];

    if (isSpecialist && formData.department) {
      const department = formData.department;
      details.push({
        label: 'Khoa',
        value: typeof department.title === 'string' ? department.title : (department.title as any)?.rendered || '',
      });
    } else if (!isSpecialist && formData.service) {
      details.push({
        label: 'Dịch vụ',
        value: formData.service.name,
      });
    }

    if (formData.slot?.date) {
      details.push({
        label: 'Ngày khám',
        value: new Date(formData.slot.date).toLocaleDateString('vi-VN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      });
    }

    return details;
  };

  return (
    <FabForm
      fab={{
        children: 'Đặt lịch khám',
        disabled: !isFormValid || isSubmitting,
        onDisabledClick() {
          toast.error('Vui lòng điền đầy đủ thông tin!');
        },
      }}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col">
        {/* Booking Summary */}
        <div className="bg-gray-50 p-5 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Thông tin đặt khám</h3>
          <div className="bg-white rounded-lg shadow-sm p-4">
            {getBookingSummary().map((item, index) => (
              <div
                key={index}
                className={`flex justify-between ${index > 0 ? 'mt-3 pt-3 border-t border-gray-100' : ''}`}
              >
                <span className="text-gray-500 text-sm">{item.label}:</span>
                <span className="text-gray-900 font-medium text-sm">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-medium">Thông tin cá nhân</h2>
            <button
              type="button"
              className="flex items-center gap-2 text-sm text-primary font-medium px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/15 transition-colors"
              onClick={handleGetUserInfo}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
              Lấy từ Zalo
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                placeholder="Nhập họ và tên"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.currentTarget.value }))}
              />
              {formData.name.trim().length === 0 && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  Vui lòng nhập họ và tên
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                placeholder="Nhập số điện thoại"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.currentTarget.value }))}
              />
              {formData.phone.trim().length === 0 && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  Vui lòng nhập số điện thoại
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Symptoms Section */}
        <div className="p-5 bg-gray-50 border-t border-gray-200">
          <h2 className="text-xl font-medium mb-4">Mô tả triệu chứng</h2>

          <div className="bg-blue-50 rounded-lg p-4 mb-5 flex items-start">
            <div className="flex-shrink-0 text-blue-500 mt-0.5">
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
            <div className="ml-3">
              <p className="text-sm text-blue-700 font-medium">Giúp bác sĩ chuẩn bị tốt hơn</p>
              <p className="text-sm text-blue-600 mt-1">
                Vui lòng mô tả chi tiết các triệu chứng, vấn đề sức khỏe bạn đang gặp phải để bác sĩ có thể chuẩn bị tốt
                hơn cho buổi khám.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <SymptomInquiry value={formData} onChange={setFormData} />
          </div>
        </div>

        {isSubmitting && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
              <p className="text-gray-700 font-medium">Đang xử lý đặt lịch...</p>
              <p className="text-sm text-gray-500 mt-1">Vui lòng đợi trong giây lát</p>
            </div>
          </div>
        )}
      </div>
    </FabForm>
  );
}
